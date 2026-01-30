import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateRating } from './priceComparisonService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const data = require('../data.json');

/**
 * Recommendation Service
 * Handles hub-based route recommendations and scoring
 */

/**
 * Get all hub airports
 * @returns {Array} List of hub airports
 */
export function getHubs() {
    return data.airports.filter(airport => airport.isHub);
}

/**
 * Get hub details by ID
 * @param {string} hubId - Airport ID
 * @returns {Object|null} Hub details or null
 */
export function getHubDetails(hubId) {
    const airport = data.airports.find(a => a.id === hubId && a.isHub);
    if (!airport) return null;

    const hubInfo = data.hubDetails?.[hubId] || {};

    // Calculate average savings for this hub
    const hubRoutes = data.routes.filter(r => r.via === hubId);

    // Use dynamic calculation if routes exist, otherwise fallback to static hubInfo values
    const avgSavingsPercent = hubRoutes.length > 0
        ? Math.round(hubRoutes.reduce((sum, r) => sum + (r.savingsPercent || 0), 0) / hubRoutes.length)
        : (hubInfo.avgSavings || 0);

    // Use dynamic rating if routes exist, otherwise fallback to static hubInfo rating or calculate from fallback savings
    const dynamicRating = hubRoutes.length > 0
        ? calculateRating(avgSavingsPercent)
        : (hubInfo.rating || calculateRating(avgSavingsPercent));

    return {
        ...airport,
        ...hubInfo,
        avgSavings: avgSavingsPercent,
        rating: dynamicRating,
        routeCount: hubRoutes.length
    };
}

/**
 * Get all hubs with their details and rankings
 * @returns {Array} Sorted list of hubs by rating
 */
export function getHubsRanked() {
    const hubs = getHubs();

    return hubs.map(hub => {
        const details = getHubDetails(hub.id);
        return details;
    })
        .filter(Boolean)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Calculate hub score based on multiple factors
 * @param {Object} route - Hub route object
 * @returns {number} Score from 0-100
 */
export function calculateHubScore(route) {
    if (route.type !== 'hub') return 0;

    const savingsWeight = 0.4;
    const ratingWeight = 0.35;
    const timeWeight = 0.25;

    // Normalize savings (0-50% maps to 0-100)
    const savingsScore = Math.min((route.savingsPercent || 0) * 2, 100);

    // Normalize rating (1-5 maps to 0-100)
    const ratingScore = ((route.hubRating || 3) - 1) * 25;

    // Time penalty (less is better, rough estimate)
    const directRoute = data.routes.find(r =>
        r.from === route.from && r.to === route.to && r.type === 'direct'
    );
    const timePenalty = directRoute
        ? Math.max(0, 100 - ((route.duration - directRoute.duration) / directRoute.duration) * 100)
        : 70;

    const score = (savingsScore * savingsWeight) +
        (ratingScore * ratingWeight) +
        (timePenalty * timeWeight);

    return Math.round(score);
}

/**
 * Get recommended hub routes for a journey
 * @param {string} from - Origin airport ID
 * @param {string} to - Destination airport ID
 * @returns {Object} Recommendations with direct and hub options
 */
export function getRecommendations(from, to) {
    const directRoute = data.routes.find(r =>
        r.from === from && r.to === to && r.type === 'direct'
    );

    const hubRoutes = data.routes
        .filter(r => r.from === from && r.to === to && r.type === 'hub')
        .map(route => {
            const hubAirport = data.airports.find(a => a.id === route.via);
            const hubDetails = getHubDetails(route.via);

            return {
                ...route,
                hubInfo: hubAirport,
                hubDetails: hubDetails,
                score: calculateHubScore(route)
            };
        })
        .sort((a, b) => b.score - a.score);

    const bestHubRoute = hubRoutes[0] || null;

    return {
        origin: data.airports.find(a => a.id === from),
        destination: data.airports.find(a => a.id === to),
        directRoute: directRoute || null,
        hubRoutes,
        bestRecommendation: bestHubRoute,
        potentialSavings: bestHubRoute ? bestHubRoute.savings : 0
    };
}

/**
 * Search for routes matching criteria
 * @param {Object} filters - Search filters
 * @returns {Array} Matching routes
 */
export function searchRoutes(filters = {}) {
    let routes = [...data.routes];

    if (filters.from) {
        routes = routes.filter(r => r.from === filters.from);
    }

    if (filters.to) {
        routes = routes.filter(r => r.to === filters.to);
    }

    if (filters.type) {
        routes = routes.filter(r => r.type === filters.type);
    }

    if (filters.minSavings) {
        routes = routes.filter(r => (r.savings || 0) >= filters.minSavings);
    }

    if (filters.hub) {
        routes = routes.filter(r => r.via === filters.hub);
    }

    return routes.map(route => ({
        ...route,
        score: calculateHubScore(route),
        fromAirport: data.airports.find(a => a.id === route.from),
        toAirport: data.airports.find(a => a.id === route.to),
        hubAirport: route.via ? data.airports.find(a => a.id === route.via) : null
    }));
}

export default {
    getHubs,
    getHubDetails,
    getHubsRanked,
    getRecommendations,
    searchRoutes,
    calculateHubScore
};
