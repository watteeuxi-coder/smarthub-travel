/**
 * Mapping of Hub IATA codes to their featured images
 * Images are located in public/assets/hubs/
 */
export const HUB_IMAGES = {
    'DXB': '/assets/hubs/DXB.png',
    'SIN': '/assets/hubs/SIN.png',
    'IST': '/assets/hubs/IST.png',
    'DOH': '/assets/hubs/DOH.png',
    'LHR': '/assets/hubs/LHR.png',
    'FRA': '/assets/hubs/FRA.png',
    // Fallbacks to professional photography for remaining hubs
    'JFK': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    'LAX': 'https://plus.unsplash.com/premium_photo-1679644085188-466d691bcbed?auto=format&fit=crop&w=1600&q=80',
    'HND': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
};

export const getHubImage = (hubId) => {
    return HUB_IMAGES[hubId] || '/assets/hubs/generic_plane.png';
};
