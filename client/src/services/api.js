/**
 * API Service for SmartHub Travel
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Search for flights between two airports
 * @param {string} from - Origin airport IATA code
 * @param {string} to - Destination airport IATA code
 * @param {string} date - Date in DD/MM/YYYY format (optional)
 * @returns {Promise<Object>} Flight search results
 */
export async function searchFlights(from, to, date = null) {
    const params = new URLSearchParams({ from, to });
    if (date) params.append('date', date);

    return apiFetch(`/search?${params.toString()}`);
}

/**
 * Search for airports/locations for autocomplete
 * @param {string} query - Search term
 * @returns {Promise<Array>} Array of matching locations
 */
export async function searchLocations(query) {
    if (!query || query.trim().length < 2) {
        return { success: true, data: [], count: 0 };
    }

    return apiFetch(`/locations?query=${encodeURIComponent(query.trim())}`);
}

/**
 * Get all airports
 * @returns {Promise<Array>} Array of all airports
 */
export async function getAirports() {
    return apiFetch('/airports');
}

/**
 * Get all hub airports
 * @returns {Promise<Array>} Array of hub airports
 */
export async function getHubs() {
    return apiFetch('/hubs');
}

/**
 * Get ranked hub airports
 * @returns {Promise<Array>} Array of hubs ranked by rating
 */
export async function getHubsRanked() {
    return apiFetch('/hubs/ranked');
}

/**
 * Get detailed information about a specific hub
 * @param {string} hubId - Hub airport IATA code
 * @returns {Promise<Object>} Hub details
 */
export async function getHubDetails(hubId) {
    return apiFetch(`/hub/${hubId}`);
}

/**
 * Compare direct vs hub prices
 * @param {string} from - Origin airport IATA code
 * @param {string} to - Destination airport IATA code
 * @returns {Promise<Object>} Price comparison data
 */
export async function comparePrices(from, to) {
    const params = new URLSearchParams({ from, to });
    return apiFetch(`/compare?${params.toString()}`);
}

/**
 * Get all available routes
 * @returns {Promise<Array>} Array of available routes
 */
export async function getAvailableRoutes() {
    return apiFetch('/routes/available');
}

export default {
    searchFlights,
    searchLocations,
    getAirports,
    getHubs,
    getHubsRanked,
    getHubDetails,
    comparePrices,
    getAvailableRoutes
};
