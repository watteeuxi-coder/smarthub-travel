import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load data
const data = require('../data.json');

/**
 * Price Comparison Service
 * Handles price comparisons between direct and hub routes
 */

/**
 * Compare direct vs hub prices for a route
 * @param {string} from - Origin airport ID
 * @param {string} to - Destination airport ID
 * @returns {Object} Price comparison data
 */
/**
 * Calculate star rating based on savings percentage
 * @param {number} savingsPercent - Percentage of savings
 * @returns {number} Star rating (0-5)
 */
export function calculateRating(savingsPercent) {
    if (savingsPercent >= 40) return 5;
    if (savingsPercent >= 30) return 4;
    if (savingsPercent >= 20) return 3;
    if (savingsPercent >= 10) return 2;
    if (savingsPercent > 0) return 1;
    return 0; // Negative or invalid savings
}

/**
 * Compare direct vs hub prices for a route
 * @param {string} from - Origin airport ID
 * @param {string} to - Destination airport ID
 * @returns {Object} Price comparison data
 */
export function compareRoutes(from, to) {
    const directRoute = data.routes.find(r =>
        r.from === from && r.to === to && r.type === 'direct'
    );

    const hubRoutes = data.routes.filter(r =>
        r.from === from && r.to === to && r.type === 'hub'
    );

    if (!directRoute && hubRoutes.length === 0) {
        return {
            found: false,
            message: 'No routes found for this journey'
        };
    }

    const directPrice = directRoute?.price || null;
    const cheapestHub = hubRoutes.length > 0
        ? hubRoutes.reduce((min, r) => r.price < min.price ? r : min, hubRoutes[0])
        : null;

    const comparison = hubRoutes.map(route => {
        const hubAirport = data.airports.find(a => a.id === route.via);
        // Calculate dynamic rating if not present in mock data, or override it
        const rating = calculateRating(route.savingsPercent);

        return {
            via: route.via,
            hubName: hubAirport?.name || route.via,
            hubCity: hubAirport?.city,
            hubCountry: hubAirport?.country,
            hubCoords: hubAirport?.coords,
            price: route.price,
            savings: route.savings,
            savingsPercent: route.savingsPercent,
            hubRating: rating, // Use dynamic rating
            duration: route.duration,
            directPrice: directPrice,
            isCheapest: cheapestHub && route.via === cheapestHub.via
        };
    }).sort((a, b) => a.price - b.price);

    return {
        found: true,
        origin: data.airports.find(a => a.id === from),
        destination: data.airports.find(a => a.id === to),
        direct: directRoute ? {
            price: directRoute.price,
            duration: directRoute.duration
        } : null,
        hubOptions: comparison,
        bestSavings: cheapestHub ? cheapestHub.savings : 0,
        bestSavingsPercent: cheapestHub ? cheapestHub.savingsPercent : 0,
        recommendedHub: cheapestHub ? cheapestHub.via : null
    };
}

/**
 * Calculate savings between two prices
 * @param {number} directPrice - Direct route price
 * @param {number} hubPrice - Hub route price
 * @returns {Object} Savings calculation
 */
export function calculateSavings(directPrice, hubPrice) {
    const absoluteSavings = directPrice - hubPrice;
    const percentSavings = Math.round((absoluteSavings / directPrice) * 100);
    const rating = calculateRating(percentSavings);

    return {
        absolute: absoluteSavings,
        percent: percentSavings,
        rating: rating,
        worthIt: percentSavings >= 15 // Consider worth it if saving at least 15%
    };
}

/**
 * Get price statistics for a hub
 * @param {string} hubId - Hub airport ID
 * @returns {Object} Price statistics
 */
export function getHubPriceStats(hubId) {
    const hubRoutes = data.routes.filter(r => r.via === hubId);

    if (hubRoutes.length === 0) {
        return {
            hubId,
            routeCount: 0,
            avgSavings: 0,
            avgSavingsPercent: 0,
            avgRating: 0,
            maxSavings: 0,
            minSavings: 0
        };
    }

    const savings = hubRoutes.map(r => r.savings || 0);
    const savingsPercent = hubRoutes.map(r => r.savingsPercent || 0);

    // Calculate rating for each route to get average
    const ratings = savingsPercent.map(p => calculateRating(p));
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    return {
        hubId,
        hubName: data.airports.find(a => a.id === hubId)?.name,
        routeCount: hubRoutes.length,
        avgSavings: Math.round(savings.reduce((a, b) => a + b, 0) / savings.length),
        avgSavingsPercent: Math.round(savingsPercent.reduce((a, b) => a + b, 0) / savingsPercent.length),
        avgRating: Number(avgRating.toFixed(1)), // Round to 1 decimal place
        maxSavings: Math.max(...savings),
        minSavings: Math.min(...savings),
        maxSavingsPercent: Math.max(...savingsPercent),
        routes: hubRoutes.map(r => ({
            from: r.from,
            to: r.to,
            savings: r.savings,
            savingsPercent: r.savingsPercent,
            rating: calculateRating(r.savingsPercent)
        }))
    };
}

/**
 * Get all available origin-destination pairs
 * @returns {Array} Unique route pairs
 */
export function getAvailableRoutes() {
    const routePairs = new Map();

    data.routes.forEach(route => {
        const key = `${route.from}-${route.to}`;
        if (!routePairs.has(key)) {
            routePairs.set(key, {
                from: route.from,
                to: route.to,
                fromAirport: data.airports.find(a => a.id === route.from),
                toAirport: data.airports.find(a => a.id === route.to),
                hasDirect: false,
                hasHub: false,
                hubCount: 0
            });
        }

        const pair = routePairs.get(key);
        if (route.type === 'direct') {
            pair.hasDirect = true;
        } else if (route.type === 'hub') {
            pair.hasHub = true;
            pair.hubCount++;
        }
    });

    return Array.from(routePairs.values());
}

export default {
    compareRoutes,
    calculateSavings,
    getHubPriceStats,
    getAvailableRoutes
};
