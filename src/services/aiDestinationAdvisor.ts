import { TravelMode } from '../types';

export interface TravelModeViability {
  mode: TravelMode;
  label: string;
  icon: string;
  isRecommended: boolean;
  durationEstimate: string;
  estimatedCostRange: string;
  suitabilityScore: number; // 0 - 100
  pros: string;
  cons: string;
  hasSwitchOrTransfer: boolean;
  transferGuide?: string;
  desc?: string;
  tag?: string;
}

export interface DestinationTravelIntelligence {
  destination: string;
  startCity: string;
  distanceKm: number;
  minimumRequiredDays: number;
  idealDays: number;
  durationReason: string;
  recommendedTravelMode: TravelMode;
  recommendedTravelModeReason: string;
  transferAndSwitchTips: string;
  modesBreakdown: TravelModeViability[];
  highlightsInMinDays: string[];
  bestSeasons: string;
  destinationVibe: string;
}

// In-memory cache for fast responsive UI
const intelligenceCache = new Map<string, DestinationTravelIntelligence>();

/**
 * Pure dynamic fallback generator when network/API is initializing (No hardcoded place names)
 */
export function getGenericDynamicIntelligence(
  destination: string,
  startCity: string = 'Origin City'
): DestinationTravelIntelligence {
  return {
    destination,
    startCity,
    distanceKm: 800,
    minimumRequiredDays: 4,
    idealDays: 6,
    durationReason: `Exploring ${destination} comfortably requires adequate time for transit and major attractions.`,
    recommendedTravelMode: 'Flight',
    recommendedTravelModeReason: `Air transit offers the fastest and most seamless journey from ${startCity} to ${destination}.`,
    transferAndSwitchTips: `Connect through primary airport/rail hubs, then use local transit or car rentals to explore ${destination}.`,
    modesBreakdown: [
      {
        mode: 'Flight',
        label: 'Flight',
        icon: '✈️',
        isRecommended: true,
        durationEstimate: 'Fast transit',
        estimatedCostRange: 'Standard fare',
        suitabilityScore: 95,
        pros: `Quickest arrival from ${startCity} to ${destination}.`,
        cons: 'Airport check-in and transfer times.',
        hasSwitchOrTransfer: false,
        desc: `Air transit from ${startCity} to ${destination}`,
        tag: 'Fast & Direct'
      },
      {
        mode: 'Train',
        label: 'Train / Railway',
        icon: '🚆',
        isRecommended: false,
        durationEstimate: 'Scenic rail',
        estimatedCostRange: 'Budget friendly',
        suitabilityScore: 85,
        pros: 'Comfortable countryside views and spacious seating.',
        cons: 'Longer travel duration.',
        hasSwitchOrTransfer: true,
        transferGuide: `Rail journey towards ${destination} with local station transfer.`,
        desc: `Railway transit connecting ${startCity} towards ${destination}`,
        tag: 'Scenic Comfort'
      },
      {
        mode: 'Car / Road Trip',
        label: 'Car / Road Trip',
        icon: '🚗',
        isRecommended: false,
        durationEstimate: 'Highway route',
        estimatedCostRange: 'Fuel & tolls',
        suitabilityScore: 82,
        pros: 'Full itinerary flexibility and scenic stops along the highway.',
        cons: 'Driving fatigue on long stretches.',
        hasSwitchOrTransfer: false,
        desc: `Highway road trip from ${startCity} to ${destination}`,
        tag: 'High Flexibility'
      },
      {
        mode: 'Self-Drive Rental',
        label: 'Fly + Destination Rental',
        icon: '🚙',
        isRecommended: false,
        durationEstimate: 'Direct on arrival',
        estimatedCostRange: 'Daily rental rate',
        suitabilityScore: 90,
        pros: `Pick up a rental vehicle at ${destination} for total freedom.`,
        cons: 'Local navigation and parking.',
        hasSwitchOrTransfer: false,
        desc: `Fly to ${destination} and pick up a self-drive rental for local exploration`,
        tag: 'Local Freedom'
      }
    ],
    highlightsInMinDays: [
      `Historic & Cultural landmarks of ${destination}`,
      `Top scenic viewpoints and signature landscapes`,
      `Local food & dining experiences`,
      `Popular markets and nature spots`
    ],
    bestSeasons: 'Spring & Autumn (Pleasant weather and clear sightseeing)',
    destinationVibe: `Memorable journeys and rich local exploration in ${destination}`
  };
}

/**
 * AI-powered destination intelligence fetching using Gemini AI.
 * Fetches all travel modes, transit feasibility, and minimum days dynamically without any predefined database.
 */
export async function fetchAiDestinationTravelIntelligence(
  destination: string,
  startCity: string = 'Origin City'
): Promise<DestinationTravelIntelligence> {
  const cacheKey = `${destination.toLowerCase().trim()}____${startCity.toLowerCase().trim()}`;
  if (intelligenceCache.has(cacheKey)) {
    return intelligenceCache.get(cacheKey)!;
  }

  const genericFallback = getGenericDynamicIntelligence(destination, startCity);

  try {
    const response = await fetch('/api/ai/destination-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, startCity }),
    });

    if (response.ok) {
      const mergedResult = await response.json();
      intelligenceCache.set(cacheKey, mergedResult);
      return mergedResult;
    }
  } catch (error) {
    console.warn('Destination Intelligence API error:', error);
  }

  intelligenceCache.set(cacheKey, genericFallback);
  return genericFallback;
}
