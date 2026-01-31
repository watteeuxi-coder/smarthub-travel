import express from 'express';
import { createRequire } from 'module';
import recommendationService from '../services/recommendationService.js';
import priceComparisonService from '../services/priceComparisonService.js';
import kiwiService from '../services/kiwiService.js';

const require = createRequire(import.meta.url);
const router = express.Router();

// Load data
const data = require('../data.json');

/**
 * GET /api/airports
 * Get all airports
 */
router.get('/airports', (req, res) => {
    res.json({
        success: true,
        data: data.airports,
        count: data.airports.length
    });
});

/**
 * GET /api/locations
 * Search for airports/locations for autocomplete
 * Query params: query (search term)
 */
router.get('/locations', async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter is required and must be at least 2 characters'
        });
    }

    try {
        const locations = await kiwiService.searchLocations(query.trim());
        res.json({
            success: true,
            data: locations,
            count: locations.length
        });
    } catch (error) {
        console.error('Locations search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search locations'
        });
    }
});


/**
 * GET /api/hubs
 * Get all hub airports
 */
router.get('/hubs', (req, res) => {
    const hubs = recommendationService.getHubs();
    res.json({
        success: true,
        data: hubs,
        count: hubs.length
    });
});

/**
 * GET /api/hubs/ranked
 * Get all hubs ranked by rating
 */
router.get('/hubs/ranked', (req, res) => {
    const rankedHubs = recommendationService.getHubsRanked();
    res.json({
        success: true,
        data: rankedHubs,
        count: rankedHubs.length
    });
});

/**
 * GET /api/hub/:id
 * Get detailed information about a specific hub
 */
router.get('/hub/:id', (req, res) => {
    const hubId = req.params.id.toUpperCase();
    const hubDetails = recommendationService.getHubDetails(hubId);

    if (!hubDetails) {
        return res.status(404).json({
            success: false,
            error: 'Hub not found'
        });
    }

    const priceStats = priceComparisonService.getHubPriceStats(hubId);

    res.json({
        success: true,
        data: {
            ...hubDetails,
            priceStats
        }
    });
});

/**
 * GET /api/routes
 * Get all routes
 */
router.get('/routes', (req, res) => {
    const routes = recommendationService.searchRoutes(req.query);
    res.json({
        success: true,
        data: routes,
        count: routes.length
    });
});

/**
 * GET /api/routes/available
 * Get all available origin-destination pairs
 */
router.get('/routes/available', (req, res) => {
    const availableRoutes = priceComparisonService.getAvailableRoutes();
    res.json({
        success: true,
        data: availableRoutes,
        count: availableRoutes.length
    });
});

/**
 * GET /api/search
 * Search for routes and get recommendations
 * Query params: from, to, date (optional)
 */
router.get('/search', async (req, res) => {
    const { from, to, date } = req.query;

    if (!from || !to) {
        return res.status(400).json({
            success: false,
            error: 'Both "from" and "to" parameters are required'
        });
    }

    try {
        // Always use Kiwi service (handles simulation mode automatically)
        // If no date provided, use today's date
        const searchDate = date || new Date().toISOString().split('T')[0].split('-').reverse().join('/');

        const realData = await kiwiService.getRealFlightRecommendations(
            from.toUpperCase(),
            to.toUpperCase(),
            searchDate
        );

        return res.json(realData);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to complete search. ' + (err.message || '')
        });
    }
});

/**
 * GET /api/compare
 * Compare direct vs hub prices
 * Query params: from, to
 */
router.get('/compare', (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({
            success: false,
            error: 'Both "from" and "to" parameters are required'
        });
    }

    const comparison = priceComparisonService.compareRoutes(
        from.toUpperCase(),
        to.toUpperCase()
    );

    res.json({
        success: true,
        data: comparison
    });
});

export default router;
