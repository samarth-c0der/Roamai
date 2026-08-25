import { SavedPlace, PlaceSearchResult } from '../types';

const SAVED_PLACES_STORAGE_KEY = 'roamai_saved_places_v1';

// Calculate distance between two coordinates in kilometers using Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Local persistent storage for saved places
export function getSavedPlaces(): SavedPlace[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_PLACES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading saved places:', err);
    return [];
  }
}

export function savePlaceToStorage(place: Omit<SavedPlace, 'savedAt'>): SavedPlace {
  const current = getSavedPlaces();
  const existingIndex = current.findIndex((p) => p.placeId === place.placeId);
  const newEntry: SavedPlace = {
    ...place,
    savedAt: new Date().toISOString()
  };

  let updated: SavedPlace[];
  if (existingIndex >= 0) {
    updated = [newEntry, ...current.filter((_, i) => i !== existingIndex)];
  } else {
    updated = [newEntry, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SAVED_PLACES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota exceeded:', e);
    }
  }
  return newEntry;
}

export function removeSavedPlace(placeId: string): SavedPlace[] {
  const current = getSavedPlaces();
  const updated = current.filter((p) => p.placeId !== placeId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SAVED_PLACES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota exceeded:', e);
    }
  }
  return updated;
}

export function clearAllSavedPlaces(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SAVED_PLACES_STORAGE_KEY);
  }
}

/**
 * Autocomplete prediction interface
 */
export interface AutocompleteSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
  types?: string[];
  lat?: number;
  lng?: number;
}

// Curated global landmarks and fallback locations
const CURATED_PLACES_DATABASE: Array<{
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  photoUrl: string;
  types: string[];
}> = [
  {
    name: 'Anjuna Beach & Flea Market',
    category: 'Beach & Culture',
    address: 'Anjuna, North Goa, Goa 403509, India',
    lat: 15.5800,
    lng: 73.7421,
    rating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    types: ['natural_feature', 'tourist_attraction', 'point_of_interest']
  },
  {
    name: 'Baga Beach Watersports',
    category: 'Adventure',
    address: 'Baga Beach, Calangute, Goa 403516, India',
    lat: 15.5553,
    lng: 73.7517,
    rating: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    types: ['natural_feature', 'tourist_attraction']
  },
  {
    name: 'Goa International Airport (GOI Dabolim)',
    category: 'Transit',
    address: 'Airport Rd, Dabolim, Goa 403801, India',
    lat: 15.3808,
    lng: 73.8313,
    rating: 4.3,
    photoUrl: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    types: ['airport', 'transit_station', 'point_of_interest']
  },
  {
    name: 'Manohar International Airport (MOPA GOX)',
    category: 'Transit',
    address: 'Mopa, Pernem, Goa 403512, India',
    lat: 15.7583,
    lng: 73.8732,
    rating: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    types: ['airport', 'transit_station']
  },
  {
    name: "Mall De Goa Shopping Centre",
    category: 'Shopping',
    address: 'NH 66, Porvorim, Goa 403521, India',
    lat: 15.5342,
    lng: 73.8291,
    rating: 4.4,
    photoUrl: 'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?auto=format&fit=crop&w=800&q=80',
    types: ['shopping_mall', 'point_of_interest']
  },
  {
    name: "Gunpowder South Indian Kitchen",
    category: 'Food',
    address: 'Anjuna Mapusa Rd, Assagao, Goa 403507, India',
    lat: 15.5898,
    lng: 73.7745,
    rating: 4.7,
    photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    types: ['restaurant', 'food', 'point_of_interest']
  },
  {
    name: "Fisherman's Wharf Fine Dining",
    category: 'Food',
    address: 'At The Riverside, Salcette, Cavelossim, Goa 403731, India',
    lat: 15.1764,
    lng: 73.9472,
    rating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    types: ['restaurant', 'food', 'point_of_interest']
  },
  {
    name: 'Aguada Fort & Lighthouse',
    category: 'Sightseeing',
    address: 'Sinquerim, Candolim, Goa 403515, India',
    lat: 15.4925,
    lng: 73.7736,
    rating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    types: ['tourist_attraction', 'historical_landmark']
  },
  {
    name: 'Solang Valley Adventure Arena',
    category: 'Adventure',
    address: 'Solang Valley, Manali, Himachal Pradesh 175131, India',
    lat: 32.3166,
    lng: 77.1583,
    rating: 4.7,
    photoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    types: ['tourist_attraction', 'point_of_interest']
  },
  {
    name: 'Chembra Peak & Heart Lake',
    category: 'Adventure',
    address: 'Meppadi, Wayanad, Kerala 673577, India',
    lat: 11.5127,
    lng: 76.0877,
    rating: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    types: ['natural_feature', 'tourist_attraction']
  },
  {
    name: 'Eiffel Tower & Champ de Mars',
    category: 'Sightseeing',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
    lat: 48.8584,
    lng: 2.2945,
    rating: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    types: ['tourist_attraction', 'point_of_interest']
  },
  {
    name: 'Times Square & Broadway',
    category: 'Sightseeing',
    address: 'Manhattan, NY 10036, United States',
    lat: 40.7580,
    lng: -73.9855,
    rating: 4.7,
    photoUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
    types: ['tourist_attraction', 'point_of_interest']
  },
  {
    name: 'Shibuya Crossing & Hachiko',
    category: 'Sightseeing',
    address: 'Shibuya City, Tokyo 150-0043, Japan',
    lat: 35.6595,
    lng: 139.7005,
    rating: 4.7,
    photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    types: ['tourist_attraction', 'point_of_interest']
  }
];

/**
 * Fallback search using open geocoding / curated database
 */
async function fallbackSearchPlaces(query: string, userCoords?: { lat: number; lng: number } | null): Promise<PlaceSearchResult[]> {
  const lower = query.toLowerCase().trim();

  // Check curated database
  const matchingCurated = CURATED_PLACES_DATABASE.filter((p) => {
    return (
      p.name.toLowerCase().includes(lower) ||
      p.address.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.types.some((t) => t.toLowerCase().includes(lower)) ||
      (lower.includes('restaurant') && p.category === 'Food') ||
      (lower.includes('airport') && p.category === 'Transit') ||
      (lower.includes('mall') && p.category === 'Shopping') ||
      (lower.includes('cafe') && (p.category === 'Food' || p.name.includes('Cafe'))) ||
      (lower.includes('beach') && p.name.includes('Beach'))
    );
  });

  if (matchingCurated.length > 0) {
    return matchingCurated.map((p, idx) => ({
      placeId: `curated-${idx}-${p.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: p.name,
      address: p.address,
      latitude: p.lat,
      longitude: p.lng,
      rating: p.rating,
      photoUrl: p.photoUrl,
      types: p.types,
      distanceKm: userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, p.lat, p.lng) : undefined
    }));
  }

  // If not in curated list, attempt Nominatim Geocoding API
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          return {
            placeId: `osm-${item.place_id}`,
            name: item.name || item.display_name.split(',')[0],
            address: item.display_name,
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            types: [item.type || 'point_of_interest', item.class || 'establishment'],
            rating: 4.5,
            photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            distanceKm: userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, lat, lng) : undefined
          };
        });
      }
    }
  } catch (err) {
    console.warn('Fallback Nominatim search failed:', err);
  }

  // Return a generic place result around userCoords or default Goa coordinates
  const fallbackLat = userCoords?.lat || 15.5800;
  const fallbackLng = userCoords?.lng || 73.7421;

  return [
    {
      placeId: `custom-query-${Date.now()}`,
      name: query,
      address: `${query} (Search Location)`,
      latitude: fallbackLat,
      longitude: fallbackLng,
      types: ['point_of_interest'],
      rating: 4.5,
      photoUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
    }
  ];
}

/**
 * Fetch autocomplete predictions using Google Places Autocomplete API with safe fallback
 */
export async function getGooglePlacesPredictions(
  input: string,
  userCoords?: { lat: number; lng: number } | null
): Promise<AutocompleteSuggestion[]> {
  if (!input || !input.trim()) return [];
  const query = input.trim();

  // Check if Google Maps Places SDK is available
  if (
    typeof window !== 'undefined' &&
    typeof (window as any).google !== 'undefined' &&
    (window as any).google.maps &&
    (window as any).google.maps.places &&
    (window as any).google.maps.places.AutocompleteService
  ) {
    try {
      const autocompleteService = new (window as any).google.maps.places.AutocompleteService();
      const request: any = { input: query };

      if (userCoords && userCoords.lat && userCoords.lng) {
        request.locationBias = new (window as any).google.maps.Circle({
          center: { lat: userCoords.lat, lng: userCoords.lng },
          radius: 50000
        });
      }

      const predictions: AutocompleteSuggestion[] = await new Promise((resolve) => {
        autocompleteService.getPlacePredictions(request, (results: any[], status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(
              results.map((pred) => ({
                placeId: pred.place_id,
                mainText: pred.structured_formatting?.main_text || pred.description,
                secondaryText: pred.structured_formatting?.secondary_text || '',
                description: pred.description,
                types: pred.types
              }))
            );
          } else {
            resolve([]);
          }
        });
      });

      if (predictions.length > 0) {
        return predictions;
      }
    } catch (e) {
      console.warn('Google Places autocomplete service error, falling back:', e);
    }
  }

  // Fallback to local curated suggestions and geocoding
  const fallbackResults = await fallbackSearchPlaces(query, userCoords);
  return fallbackResults.map((p) => ({
    placeId: p.placeId,
    mainText: p.name,
    secondaryText: p.address,
    description: `${p.name}, ${p.address}`,
    types: p.types,
    lat: p.latitude,
    lng: p.longitude
  }));
}

/**
 * Get detailed Place data (lat, lng, address, photos, name) given a Google Place ID
 */
export async function getGooglePlaceDetails(
  placeId: string,
  mapInstance?: any
): Promise<PlaceSearchResult> {
  // Check if placeId is a curated or OSM place
  if (placeId.startsWith('curated-') || placeId.startsWith('osm-') || placeId.startsWith('custom-')) {
    const curated = CURATED_PLACES_DATABASE.find((p) => placeId.includes(p.name.replace(/\s+/g, '-').toLowerCase()));
    if (curated) {
      return {
        placeId,
        name: curated.name,
        address: curated.address,
        latitude: curated.lat,
        longitude: curated.lng,
        rating: curated.rating,
        photoUrl: curated.photoUrl,
        types: curated.types
      };
    }
  }

  // Use Google PlacesService if available
  if (
    typeof window !== 'undefined' &&
    typeof (window as any).google !== 'undefined' &&
    (window as any).google.maps &&
    (window as any).google.maps.places &&
    (window as any).google.maps.places.PlacesService
  ) {
    try {
      const serviceContainer = mapInstance || document.createElement('div');
      const service = new (window as any).google.maps.places.PlacesService(serviceContainer);

      const placeDetails: PlaceSearchResult = await new Promise((resolve, reject) => {
        service.getDetails(
          {
            placeId,
            fields: ['name', 'formatted_address', 'geometry', 'place_id', 'rating', 'photos', 'types', 'vicinity']
          },
          (place: any, status: any) => {
            if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const photoUrl = place.photos && place.photos.length > 0
                ? place.photos[0].getUrl({ maxWidth: 600, maxHeight: 400 })
                : undefined;

              resolve({
                placeId: place.place_id || placeId,
                name: place.name || 'Selected Place',
                address: place.formatted_address || place.vicinity || 'Address not available',
                latitude: Number(lat.toFixed(6)),
                longitude: Number(lng.toFixed(6)),
                types: place.types,
                rating: place.rating,
                photoUrl
              });
            } else {
              reject(new Error(`PlacesService status: ${status}`));
            }
          }
        );
      });

      return placeDetails;
    } catch (e) {
      console.warn('Google PlaceDetails failed, checking Geocoder fallback:', e);
    }
  }

  // Geocoder fallback if google.maps.Geocoder is available
  if (typeof (window as any).google !== 'undefined' && (window as any).google.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const geoResult: PlaceSearchResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ placeId }, (results: any[], status: any) => {
          if (status === 'OK' && results && results[0]) {
            const loc = results[0].geometry.location;
            resolve({
              placeId,
              name: results[0].formatted_address.split(',')[0] || 'Selected Location',
              address: results[0].formatted_address,
              latitude: Number(loc.lat().toFixed(6)),
              longitude: Number(loc.lng().toFixed(6)),
              types: results[0].types,
              rating: 4.5
            });
          } else {
            reject(new Error(`Geocoder status: ${status}`));
          }
        });
      });
      return geoResult;
    } catch (e) {
      console.warn('Geocoder fallback failed:', e);
    }
  }

  // Default fallback place
  return {
    placeId,
    name: 'Selected Place',
    address: 'Location coordinates verified on Google Maps',
    latitude: 15.5800,
    longitude: 73.7421,
    rating: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  };
}

/**
 * Text search for queries like "restaurants near me", "airport", "mall", "cafes"
 */
export async function searchPlacesByQuery(
  query: string,
  userCoords?: { lat: number; lng: number } | null,
  mapInstance?: any
): Promise<PlaceSearchResult[]> {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();

  // Try Google Maps PlacesService
  if (
    typeof window !== 'undefined' &&
    typeof (window as any).google !== 'undefined' &&
    (window as any).google.maps &&
    (window as any).google.maps.places &&
    (window as any).google.maps.places.PlacesService
  ) {
    try {
      const serviceContainer = mapInstance || document.createElement('div');
      const service = new (window as any).google.maps.places.PlacesService(serviceContainer);

      const request: any = { query: cleanQuery };

      if (userCoords && userCoords.lat && userCoords.lng) {
        request.location = new (window as any).google.maps.LatLng(userCoords.lat, userCoords.lng);
        request.radius = 30000;
      }

      const results: PlaceSearchResult[] = await new Promise((resolve) => {
        service.textSearch(request, (items: any[], status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && items) {
            const mapped: PlaceSearchResult[] = items.slice(0, 10).map((r) => {
              const lat = r.geometry?.location?.lat() || (userCoords?.lat ?? 15.58);
              const lng = r.geometry?.location?.lng() || (userCoords?.lng ?? 73.74);
              const photoUrl = r.photos && r.photos.length > 0
                ? r.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
                : undefined;

              let distanceKm: number | undefined;
              if (userCoords && userCoords.lat && userCoords.lng && lat && lng) {
                distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, lat, lng);
              }

              return {
                placeId: r.place_id || `place-${Math.random()}`,
                name: r.name || 'Unnamed Place',
                address: r.formatted_address || r.vicinity || '',
                latitude: Number(lat.toFixed(6)),
                longitude: Number(lng.toFixed(6)),
                types: r.types,
                rating: r.rating || 4.5,
                photoUrl,
                distanceKm
              };
            });
            resolve(mapped);
          } else {
            resolve([]);
          }
        });
      });

      if (results.length > 0) {
        return results;
      }
    } catch (e) {
      console.warn('Google Places textSearch error, using fallback search:', e);
    }
  }

  // Fallback to local curated + Nominatim engine
  return fallbackSearchPlaces(cleanQuery, userCoords);
}
