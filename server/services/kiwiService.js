import axios from 'axios';
import { calculateRating } from './priceComparisonService.js';

const KIWI_API_URL = 'https://api.tequila.kiwi.com/v2/search';
const API_KEY = process.env.KIWI_API_KEY || 'YOUR_KIWI_API_KEY';

/**
 * Kiwi Service
 * Interfaces with Tequila API to get real flight data
 */

/**
 * Search for flights and compare direct vs hub routes
 * @param {string} from - Origin IATA code
 * @param {string} to - Destination IATA code
 * @param {string} date - Date in DD/MM/YYYY format
 * @returns {Object} Comparison data
 */
export async function getRealFlightRecommendations(from, to, date) {
    // Check if API KEY is default or placeholder - USE SIMULATION MODE
    if (!API_KEY || API_KEY === 'YOUR_KIWI_API_KEY' || API_KEY === 'votre_cle_api_ici') {
        process.env.NODE_ENV !== 'production' && console.log('Kiwi API: Key missing. Using simulation mode.');
        return getSimulatedFlightRecommendations(from, to, date);
    }

    try {
        // 1. Search for all routes (direct and with stops)
        const response = await axios.get(KIWI_API_URL, {
            headers: {
                'apikey': API_KEY,
                'accept': 'application/json'
            },
            params: {
                fly_from: from,
                fly_to: to,
                date_from: date,
                date_to: date,
                curr: 'USD',
                limit: 20
            }
        });

        const flights = response.data.data || [];

        if (flights.length === 0) {
            return { success: false, error: 'No flights found' };
        }

        // 2. Separate direct flights and hub flights
        const directFlights = flights.filter(f => f.route.length === 1);
        const hubFlights = flights.filter(f => f.route.length > 1);

        const cheapestDirect = directFlights.length > 0
            ? directFlights.reduce((min, f) => f.price < min.price ? f : min, directFlights[0])
            : null;

        const directPrice = cheapestDirect?.price || null;

        // 3. Map hub options and calculate savings/ratings
        const hubOptions = hubFlights.map(flight => {
            const via = flight.route[0].flyTo;
            const absoluteSavings = directPrice ? directPrice - flight.price : 0;
            const savingsPercent = directPrice ? Math.round((absoluteSavings / directPrice) * 100) : 0;
            const rating = calculateRating(savingsPercent);

            const hubSegment = flight.route[0];

            return {
                via: via,
                hubName: hubSegment.cityTo,
                hubCity: hubSegment.cityTo,
                hubCountry: '',
                price: flight.price,
                savings: Math.max(0, absoluteSavings),
                savingsPercent: Math.max(0, savingsPercent),
                hubRating: rating,
                score: rating * 20 + savingsPercent, // Add score for default sorting
                duration: Math.round(flight.duration.total / 60),
                directPrice: directPrice,
                isCheapest: false,
                hubInfo: {
                    id: via,
                    name: hubSegment.cityTo,
                    city: hubSegment.cityTo
                }
            };
        });

        hubOptions.sort((a, b) => b.score - a.score);
        if (hubOptions.length > 0) hubOptions[0].isCheapest = true;

        return {
            success: true,
            data: {
                origin: { id: from, city: flights[0].cityFrom },
                destination: { id: to, city: flights[0].cityTo },
                directRoute: cheapestDirect ? {
                    price: cheapestDirect.price,
                    duration: Math.round(cheapestDirect.duration.total / 60)
                } : null,
                hubRoutes: hubOptions,
                bestRecommendation: hubOptions[0] || null,
                potentialSavings: hubOptions[0] ? hubOptions[0].savings : 0
            }
        };

    } catch (error) {
        console.error('Kiwi API Error:', error.response?.data || error.message);
        console.log('Falling back to simulation mode due to API error.');
        return getSimulatedFlightRecommendations(from, to, date);
    }
}

/**
 * Generates realistic-looking simulated data based on routes
 */
function getSimulatedFlightRecommendations(from, to, date) {
    // Deterministic price based on IATA codes
    const basePrice = (from.charCodeAt(0) + (from.charCodeAt(1) || 0) + to.charCodeAt(0)) * 5;
    const directPrice = basePrice + 350;

    // Some hubs to simulate with real coords to avoid crashes
    const hubs = [
        { id: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'UAE', coords: [55.36, 25.25], savingsFactor: 0.35 },
        { id: 'DOH', name: 'Hamad Intl', city: 'Doha', country: 'Qatar', coords: [51.60, 25.27], savingsFactor: 0.32 },
        { id: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', coords: [28.74, 41.27], savingsFactor: 0.25 },
        { id: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', coords: [103.99, 1.36], savingsFactor: 0.28 }
    ];

    const hubRoutes = hubs.map(hub => {
        const price = Math.round(directPrice * (1 - hub.savingsFactor));
        const savings = directPrice - price;
        const savingsPercent = Math.round((savings / directPrice) * 100);
        const rating = calculateRating(savingsPercent);

        return {
            via: hub.id,
            hubName: hub.name,
            hubCity: hub.city,
            price: price,
            savings: savings,
            savingsPercent: savingsPercent,
            hubRating: rating,
            score: rating * 20 + savingsPercent,
            duration: 800 + Math.floor(Math.random() * 200),
            directPrice: directPrice,
            isCheapest: false,
            hubInfo: hub
        };
    });

    hubRoutes.sort((a, b) => b.score - a.score);
    if (hubRoutes.length > 0) hubRoutes[0].isCheapest = true;

    const originInfo = getAirportInfo(from);
    const destInfo = getAirportInfo(to);

    return {
        success: true,
        isSimulated: true,
        data: {
            origin: originInfo,
            destination: destInfo,
            directRoute: { price: directPrice, duration: 660 },
            hubRoutes: hubRoutes,
            bestRecommendation: hubRoutes[0],
            potentialSavings: hubRoutes[0].savings
        }
    };
}

function getAirportInfo(iata) {
    const airports = {
        CDG: { id: 'CDG', name: 'Paris CDG', city: 'Paris', country: 'France', coords: [2.54, 49.00] },
        BKK: { id: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', coords: [100.75, 13.68] },
        JFK: { id: 'JFK', name: 'New York JFK', city: 'New York', country: 'USA', coords: [-73.77, 40.64] },
        LHR: { id: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', coords: [-0.45, 51.47] },
        SYD: { id: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', coords: [151.17, -33.94] },
        DXB: { id: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'UAE', coords: [55.36, 25.25] }
    };

    return airports[iata] || {
        id: iata,
        name: `${iata} Airport (Simulated)`,
        city: iata,
        country: 'Traveler Choice',
        coords: [(iata.charCodeAt(0) - 65) * 5, (iata.charCodeAt(1) || 65 - 65) * 5] // Fake but stable coords
    };
}

export default {
    getRealFlightRecommendations
};
