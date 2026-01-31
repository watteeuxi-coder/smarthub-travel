import axios from 'axios';
import { calculateRating } from './priceComparisonService.js';

const KIWI_API_URL = 'https://api.tequila.kiwi.com/v2/search';
const KIWI_LOCATIONS_URL = 'https://api.tequila.kiwi.com/locations/query';
const API_KEY = process.env.KIWI_API_KEY || 'YOUR_KIWI_API_KEY';

/**
 * Kiwi Service
 * Interfaces with Tequila API to get real flight data
 */

/**
 * Search for locations (airports, cities) for autocomplete
 * @param {string} query - Search term
 * @returns {Array} Array of locations
 */
export async function searchLocations(query) {
    // Check if API KEY is default or placeholder - return basic airports
    if (!API_KEY || API_KEY === 'YOUR_KIWI_API_KEY' || API_KEY === 'votre_cle_api_ici') {
        return getBasicAirports(query);
    }

    try {
        const response = await axios.get(KIWI_LOCATIONS_URL, {
            headers: {
                'apikey': API_KEY,
                'accept': 'application/json'
            },
            params: {
                term: query,
                location_types: 'airport',
                limit: 10,
                active_only: true
            }
        });

        const locations = response.data.locations || [];

        return locations.map(loc => ({
            id: loc.code || loc.id,
            name: loc.name,
            city: loc.city?.name || loc.name,
            country: loc.country?.name || '',
            isHub: false, // Can be enhanced later
            coords: [loc.location?.lon || 0, loc.location?.lat || 0]
        }));

    } catch (error) {
        console.error('Kiwi Locations API Error:', error.response?.data || error.message);
        return getBasicAirports(query);
    }
}

/**
 * Returns basic airports for fallback
 */
function getBasicAirports(query = '') {
    const basicAirports = [
        { id: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France', isHub: false, coords: [2.54, 49.00] },
        { id: 'ORY', name: 'Paris Orly', city: 'Paris', country: 'France', isHub: false, coords: [2.38, 48.72] },
        { id: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'USA', isHub: true, coords: [-73.78, 40.64] },
        { id: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', isHub: true, coords: [-0.46, 51.47] },
        { id: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', isHub: true, coords: [55.36, 25.25] },
        { id: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', isHub: true, coords: [103.99, 1.36] },
        { id: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', isHub: true, coords: [28.81, 41.26] },
        { id: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', isHub: true, coords: [51.61, 25.27] },
        { id: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', isHub: true, coords: [8.57, 50.03] },
        { id: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', isHub: true, coords: [4.76, 52.31] },
        { id: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain', isHub: false, coords: [-3.57, 40.47] },
        { id: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', isHub: false, coords: [2.08, 41.30] },
        { id: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy', isHub: false, coords: [12.25, 41.80] },
        { id: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', isHub: false, coords: [100.75, 13.68] },
        { id: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', isHub: true, coords: [139.78, 35.55] },
        { id: 'NRT', name: 'Tokyo Narita', city: 'Tokyo', country: 'Japan', isHub: false, coords: [140.39, 35.77] },
        { id: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA', isHub: true, coords: [-118.41, 33.94] },
        { id: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', isHub: false, coords: [151.18, -33.95] },
        { id: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada', isHub: false, coords: [-79.63, 43.68] },
        { id: 'MEX', name: 'Mexico City Intl', city: 'Mexico City', country: 'Mexico', isHub: false, coords: [-99.07, 19.44] }
    ];

    if (!query) return basicAirports;

    const term = query.toLowerCase();
    return basicAirports.filter(airport =>
        airport.id.toLowerCase().includes(term) ||
        airport.name.toLowerCase().includes(term) ||
        airport.city.toLowerCase().includes(term) ||
        airport.country.toLowerCase().includes(term)
    );
}

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
    getRealFlightRecommendations,
    searchLocations
};
