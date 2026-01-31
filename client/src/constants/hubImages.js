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
    // Professional photography for remaining hubs - each with unique, appropriate imagery
    'FRA': 'https://images.unsplash.com/photo-1590155989273-9881bfa44bf5?auto=format&fit=crop&w=1200&q=80', // Frankfurt skyline with airport
    'JFK': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', // New York cityscape
    'LAX': 'https://images.unsplash.com/photo-1581837074859-968e0c83c574?auto=format&fit=crop&w=1200&q=80', // Los Angeles palms and airport
    'HND': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', // Tokyo cityscape
};

export const getHubImage = (hubId) => {
    return HUB_IMAGES[hubId] || '/assets/hubs/generic_plane.png';
};
