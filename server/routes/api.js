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
        // If a date is provided, attempt to use the real Flight API
        if (date) {
            const realData = await kiwiService.getRealFlightRecommendations(
                from.toUpperCase(),
                to.toUpperCase(),
                date
            );
            return res.json(realData);
        }

        // Fallback to mock data logic
        const fromAirport = data.airports.find(a =>
            a.id.toUpperCase() === from.toUpperCase()
        );
        const toAirport = data.airports.find(a =>
            a.id.toUpperCase() === to.toUpperCase()
        );

        if (!fromAirport || !toAirport) {
            return res.status(404).json({
                success: false,
                error: 'Airport not found in mock data'
            });
        }

        const recommendations = recommendationService.getRecommendations(
            fromAirport.id,
            toAirport.id
        );

        const comparison = priceComparisonService.compareRoutes(
            fromAirport.id,
            toAirport.id
        );

        res.json({
            success: true,
            data: {
                ...recommendations,
                comparison
            }
        });
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
