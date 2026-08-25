import { Activity, Trip } from '../types';

export interface LatLng {
  lat: number;
  lng: number;
}

export const DESTINATION_DEFAULT_CENTERS: Record<string, { center: LatLng; zoom: number }> = {
  goa: { center: { lat: 15.5527, lng: 73.7650 }, zoom: 12 },
  manali: { center: { lat: 32.2432, lng: 77.1892 }, zoom: 13 },
  wayanad: { center: { lat: 11.6854, lng: 76.1320 }, zoom: 12 },
  munnar: { center: { lat: 10.0889, lng: 77.0595 }, zoom: 13 },
  coorg: { center: { lat: 12.3375, lng: 75.8069 }, zoom: 12 },
  athirappilly: { center: { lat: 10.2987, lng: 76.5694 }, zoom: 13 },
  gokarna: { center: { lat: 14.5479, lng: 74.3188 }, zoom: 13 },
  jaipur: { center: { lat: 26.9124, lng: 75.7873 }, zoom: 13 },
  bali: { center: { lat: -8.4095, lng: 115.1889 }, zoom: 11 },
  paris: { center: { lat: 48.8566, lng: 2.3522 }, zoom: 13 }
};

// Known POI coordinates for prominent destinations
export const KNOWN_LOCATION_COORDINATES: Record<string, LatLng> = {
  // Goa
  'anjuna bamboo grove': { lat: 15.5800, lng: 73.7421 },
  'casa anjuna': { lat: 15.5825, lng: 73.7460 },
  'assagao village': { lat: 15.5898, lng: 73.7744 },
  'vagator coastline': { lat: 15.6028, lng: 73.7340 },
  'chapora hilltop': { lat: 15.6059, lng: 73.7380 },
  'artisan breakfast at baba au rhum': { lat: 15.5800, lng: 73.7421 },
  'baba au rhum': { lat: 15.5800, lng: 73.7421 },
  'seafood thali & goan curries at vinayak': { lat: 15.5898, lng: 73.7744 },
  'vinayak family restaurant': { lat: 15.5898, lng: 73.7744 },
  'vagator & ozran secret beach walk': { lat: 15.6028, lng: 73.7340 },
  'golden sunset at chapora fort': { lat: 15.6059, lng: 73.7380 },
  'chapora fort': { lat: 15.6059, lng: 73.7380 },
  'panaji latin quarter': { lat: 15.4980, lng: 73.8340 },
  'fontainhas': { lat: 15.4980, lng: 73.8340 },
  'palolem beach': { lat: 15.0100, lng: 74.0232 },
  'calangute beach': { lat: 15.5439, lng: 73.7553 },
  'baga beach': { lat: 15.5553, lng: 73.7516 },
  'fort aguada': { lat: 15.4920, lng: 73.7737 },
  'dudhsagar falls': { lat: 15.3144, lng: 74.3143 },

  // Manali
  'old manali': { lat: 32.2530, lng: 77.1750 },
  'mall road manali': { lat: 32.2396, lng: 77.1887 },
  'solang valley': { lat: 32.3166, lng: 77.1585 },
  'atal tunnel': { lat: 32.4764, lng: 77.1264 },
  'jogini waterfall': { lat: 32.2704, lng: 77.1872 },
  'hadimba temple': { lat: 32.2483, lng: 77.1805 },
  'vashisht hot springs': { lat: 32.2618, lng: 77.1945 },
  'sissu': { lat: 32.4795, lng: 77.1221 },

  // Wayanad
  'chembra peak': { lat: 11.5126, lng: 76.0898 },
  'edakkal caves': { lat: 11.6288, lng: 76.2344 },
  'banasura sagar dam': { lat: 11.6698, lng: 75.9572 },
  'kanthanpara waterfalls': { lat: 11.5471, lng: 76.1601 },

  // Munnar
  'eravikulam national park': { lat: 10.2052, lng: 77.0543 },
  'mattupetty dam': { lat: 10.1065, lng: 77.1246 },
  'top station munnar': { lat: 10.1250, lng: 77.2435 },
  'tea museum munnar': { lat: 10.0889, lng: 77.0595 },

  // Coorg
  'abbey falls': { lat: 12.4542, lng: 75.7175 },
  'raja seat': { lat: 12.4187, lng: 75.7382 },
  'dubare elephant camp': { lat: 12.3686, lng: 75.9048 },
  'namdroling monastery': { lat: 12.4539, lng: 75.9669 },

  // Gokarna
  'om beach': { lat: 14.5186, lng: 74.3168 },
  'kudle beach': { lat: 14.5292, lng: 74.3162 },
  'mahabaleshwar temple gokarna': { lat: 14.5428, lng: 74.3184 },
  'half moon beach': { lat: 14.5124, lng: 74.3283 },

  // Jaipur
  'hawa mahal': { lat: 26.9239, lng: 75.8267 },
  'amer fort': { lat: 26.9855, lng: 75.8513 },
  'city palace jaipur': { lat: 26.9258, lng: 75.8237 },
  'nahargarh fort': { lat: 26.9372, lng: 75.8156 },
  'jal mahal': { lat: 26.9656, lng: 75.8460 }
};

/**
 * Gets exact or approximate coordinates for an activity based on destination context
 */
export function getActivityCoordinates(
  activity: Activity,
  destinationName: string,
  indexInDay: number = 0,
  totalInDay: number = 1
): LatLng {
  // If activity already has valid coordinates
  if (activity.coordinates && activity.coordinates.lat && activity.coordinates.lng) {
    return activity.coordinates;
  }

  // Check known location match
  const locKey = activity.location.toLowerCase().trim();
  const titleKey = activity.title.toLowerCase().trim();

  for (const [key, coords] of Object.entries(KNOWN_LOCATION_COORDINATES)) {
    if (locKey.includes(key) || titleKey.includes(key) || key.includes(locKey)) {
      return coords;
    }
  }

  // Find destination base center
  const destKey = destinationName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const foundPreset = Object.entries(DESTINATION_DEFAULT_CENTERS).find(([k]) =>
    destKey.includes(k) || k.includes(destKey)
  );

  const baseCenter = foundPreset
    ? foundPreset[1].center
    : { lat: 15.5527, lng: 73.7650 }; // fallback to Goa coastal coords

  // Distribute stops in an organic arc/cluster around the city center
  const angle = (indexInDay / Math.max(totalInDay, 1)) * Math.PI * 1.5 + (indexInDay * 0.4);
  const distanceKm = 1.2 + (indexInDay * 1.8) % 6; // 1.2km to 7km spread
  
  // 1 deg latitude ~= 111km, 1 deg longitude ~= 111 * cos(lat)
  const latOffset = (Math.sin(angle) * distanceKm) / 111;
  const lngOffset = (Math.cos(angle) * distanceKm) / (111 * Math.cos((baseCenter.lat * Math.PI) / 180));

  return {
    lat: Number((baseCenter.lat + latOffset).toFixed(6)),
    lng: Number((baseCenter.lng + lngOffset).toFixed(6))
  };
}

/**
 * Helper to get the best Google Maps view center for a trip or active day
 */
export function getDestinationMapCenter(trip: Trip, activities: Activity[]): { center: LatLng; zoom: number } {
  if (activities.length > 0) {
    const coords = activities.map((act, i) => getActivityCoordinates(act, trip.destination, i, activities.length));
    const avgLat = coords.reduce((acc, c) => acc + c.lat, 0) / coords.length;
    const avgLng = coords.reduce((acc, c) => acc + c.lng, 0) / coords.length;
    return {
      center: { lat: avgLat, lng: avgLng },
      zoom: activities.length > 3 ? 12 : 13
    };
  }

  const destKey = trip.destination.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const found = Object.entries(DESTINATION_DEFAULT_CENTERS).find(([k]) =>
    destKey.includes(k) || k.includes(destKey)
  );

  if (found) {
    return found[1];
  }

  return { center: { lat: 15.5527, lng: 73.7650 }, zoom: 12 };
}
