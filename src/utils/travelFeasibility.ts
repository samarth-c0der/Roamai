import { TravelMode, DestinationPreset } from '../types';
import { SelectedDestinationPlace } from '../components/Step1DestinationSearch';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface TravelModeOption {
  id: TravelMode;
  label: string;
  icon: string;
  desc: string;
  tag: string;
  isAvailable: boolean;
  unavailableReason?: string;
  recommendedFor?: string;
}

export interface DestinationFeasibility {
  minDurationDays: number;
  recommendedDurationDays: number;
  minDurationReason: string;
  distanceKm: number;
  isIslandOrOverseas: boolean;
  isHighAltitudeOrCircuit: boolean;
  isShortDistance: boolean;
  isInternational: boolean;
  availableTravelModes: TravelModeOption[];
  defaultRecommendedMode: TravelMode;
  transitSummary: {
    flightTime?: string;
    trainTime?: string;
    driveTime?: string;
    routeNote: string;
  };
}

/**
 * Calculates Great Circle Distance between two coordinates in Kilometers (Haversine formula)
 */
export function calculateHaversineDistanceKm(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
    Math.cos((coord2.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Resolves coordinates dynamically from place objects or numerical inputs (No predefined place lists)
 */
export function resolveCoordinates(
  cityNameOrPlace: string | SelectedDestinationPlace | null | undefined
): LocationCoordinates | null {
  if (!cityNameOrPlace) return null;

  if (typeof cityNameOrPlace === 'object') {
    if (
      typeof cityNameOrPlace.latitude === 'number' &&
      typeof cityNameOrPlace.longitude === 'number' &&
      !isNaN(cityNameOrPlace.latitude) &&
      !isNaN(cityNameOrPlace.longitude) &&
      cityNameOrPlace.latitude !== 0
    ) {
      return { lat: cityNameOrPlace.latitude, lng: cityNameOrPlace.longitude };
    }
  }

  return null;
}

/**
 * Pure dynamic evaluation of route feasibility based purely on geometry, distance, and origin/destination names.
 * All route intelligence and destination specifics are fetched dynamically by AI.
 */
export function evaluateTripFeasibility(params: {
  destination: SelectedDestinationPlace | DestinationPreset | { name: string; address?: string; latitude?: number; longitude?: number };
  originCityName?: string;
  originCoords?: LocationCoordinates | null;
}): DestinationFeasibility {
  const { destination, originCityName = 'Origin Location', originCoords } = params;

  const destName = destination.name || 'Destination';
  const destAddress =
    ('address' in destination && destination.address) ||
    ('region' in destination && `${destination.region}, ${destination.country}`) ||
    '';

  // 1. Calculate Coordinates and Distance
  const destCoords = resolveCoordinates(
    'latitude' in destination && typeof destination.latitude === 'number'
      ? {
        placeId: ('id' in destination && typeof destination.id === 'string' ? destination.id : 'dest'),
        name: destName,
        address: destAddress,
        latitude: destination.latitude,
        longitude: ('longitude' in destination && typeof destination.longitude === 'number' ? destination.longitude : 0)
      }
      : null
  );

  let distanceKm = 650;
  if (destCoords && originCoords) {
    distanceKm = calculateHaversineDistanceKm(originCoords, destCoords);
  }

  const isShortDist = distanceKm < 150;
  const isFarDistance = distanceKm > 1200;

  // 2. Pure dynamic duration baseline (refined dynamically by AI Destination Advisor)
  let minDurationDays = 3;
  let recommendedDurationDays = 5;
  let minDurationReason = `Requires at least 3 days to explore key attractions in ${destName} and account for travel transit.`;

  if (isShortDist) {
    minDurationDays = 2;
    recommendedDurationDays = 3;
    minDurationReason = `Short distance getaway (~${distanceKm} km) ideal for a 2 to 3-day itinerary.`;
  } else if (isFarDistance) {
    minDurationDays = 5;
    recommendedDurationDays = 7;
    minDurationReason = `Long-distance travel (~${distanceKm} km) requires sufficient time for transit and comprehensive sightseeing.`;
  }

  // 3. Dynamic candidate travel modes from Origin to Destination
  const allCandidateModes: TravelModeOption[] = [
    {
      id: 'Flight',
      label: 'Flight',
      icon: '✈️',
      desc: `Direct or connecting air transit from ${originCityName} to ${destName}`,
      tag: 'Fast & Direct',
      isAvailable: !isShortDist,
      unavailableReason: isShortDist ? `Short travel distance (~${distanceKm} km) is faster by road or rail transit.` : undefined,
      recommendedFor: distanceKm > 700 ? 'Fastest transit' : undefined
    },
    {
      id: 'Train',
      label: 'Train / Railway',
      icon: '🚆',
      desc: `Rail transit from ${originCityName} to ${destName} (or nearest railhead + transfer)`,
      tag: 'Scenic Comfort',
      isAvailable: true,
      recommendedFor: distanceKm >= 150 && distanceKm <= 1500 ? 'Scenic & Affordable' : undefined
    },
    {
      id: 'Car / Road Trip',
      label: 'Car / Road Trip',
      icon: '🚗',
      desc: `Highway road trip from ${originCityName} to ${destName} (~${distanceKm} km)`,
      tag: 'High Flexibility',
      isAvailable: true,
      recommendedFor: distanceKm <= 800 ? 'Flexible Road Trip' : undefined
    },
    {
      id: 'Bus',
      label: 'Bus / Sleeper Coach',
      icon: '🚌',
      desc: `Intercity bus or sleeper coach route from ${originCityName} to ${destName}`,
      tag: 'Budget Friendly',
      isAvailable: distanceKm <= 2000,
      recommendedFor: distanceKm <= 600 ? 'Direct Budget Route' : undefined
    },
    {
      id: 'Bike / Motorcycle',
      label: 'Bike / Motorcycle',
      icon: '🏍️',
      desc: `Motorcycle riding route from ${originCityName} to ${destName}`,
      tag: 'Adventure Ride',
      isAvailable: distanceKm <= 1500,
      recommendedFor: distanceKm <= 500 ? 'Riding Expedition' : undefined
    },
    {
      id: 'Self-Drive Rental',
      label: isFarDistance ? 'Fly + Destination Rental' : 'Self-Drive Rental',
      icon: '🚙',
      desc: isFarDistance
        ? `Fly from ${originCityName} to ${destName} and pick up a self-drive rental at destination`
        : `Drive rental car from ${originCityName} to ${destName} with full autonomy`,
      tag: isFarDistance ? 'Fly & Drive' : 'Local Freedom',
      isAvailable: true,
      recommendedFor: 'Complete local flexibility'
    }
  ];

  const availableTravelModes = allCandidateModes.filter((m) => m.isAvailable);

  let defaultRecommendedMode: TravelMode = 'Flight';
  if (isShortDist) {
    defaultRecommendedMode = 'Car / Road Trip';
  } else if (distanceKm > 1000) {
    defaultRecommendedMode = 'Flight';
  } else {
    defaultRecommendedMode = 'Flight';
  }

  // Estimated Transit Durations
  const flightHours = Math.max(1, Math.round(distanceKm / 550));
  const trainHours = Math.max(2, Math.round(distanceKm / 75));
  const driveHours = Math.max(2, Math.round(distanceKm / 65));

  return {
    minDurationDays,
    recommendedDurationDays,
    minDurationReason,
    distanceKm,
    isIslandOrOverseas: false,
    isHighAltitudeOrCircuit: false,
    isShortDistance: isShortDist,
    isInternational: false,
    availableTravelModes,
    defaultRecommendedMode,
    transitSummary: {
      flightTime: `~${flightHours}h flight`,
      trainTime: `~${trainHours}h rail`,
      driveTime: `~${driveHours}h road drive`,
      routeNote: `${originCityName} to ${destName} (~${distanceKm} km)`
    }
  };
}
