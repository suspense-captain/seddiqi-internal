export const getDistance = (loc1, loc2) => {
    const rad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = rad(loc2.lat - loc1.lat);
    const dLon = rad(loc2.lng - loc1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(loc1.lat)) * Math.cos(rad(loc2.lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};