import { GoogleGenAI } from '@google/genai';
import { TravelMode } from '../../src/types';

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

function parseJsonSafely(text: string): any {
  if (!text || !text.trim()) return {};
  let cleaned = text.trim();
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      cleaned = match[1].trim();
    } else {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}

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
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    intelligenceCache.set(cacheKey, genericFallback);
    return genericFallback;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const prompt = `You are a world-class travel logistics & route architect AI.
Analyze the travel route from Origin: "${startCity}" to Destination: "${destination}".

Provide an accurate, real-world travel feasibility & logistics breakdown in strictly valid JSON:
{
  "destination": "${destination}",
  "startCity": "${startCity}",
  "distanceKm": number (approximate driving or flight distance in km from ${startCity} to ${destination}),
  "minimumRequiredDays": number (the minimum realistic full days needed to properly experience this destination and account for transit),
  "idealDays": number (the ideal recommended duration for a relaxed complete trip),
  "durationReason": "Comprehensive explanation of why this minimum number of days is required (mentioning distances, key regions, altitude/customs/geographic spread)",
  "recommendedTravelMode": "Flight" | "Train" | "Car / Road Trip" | "Bus" | "Bike / Motorcycle" | "Self-Drive Rental",
  "recommendedTravelModeReason": "Specific reason why this mode is the best choice from ${startCity} to ${destination}",
  "transferAndSwitchTips": "Detailed transit transfer/switch guide (e.g. airport connections, border crossing checkpoints, railhead to road switches, mountain roads)",
  "modesBreakdown": [
    {
      "mode": "Flight" | "Train" | "Car / Road Trip" | "Bus" | "Bike / Motorcycle" | "Self-Drive Rental",
      "label": "Display name (e.g. 'Flight', 'Cross-Border Road Trip', 'Fly + Destination Rental', 'Train + Transfer')",
      "icon": "Emoji icon",
      "isRecommended": boolean (true for the single best mode),
      "durationEstimate": "e.g. '2h flight', '14h road trip', '24h rail+bus'",
      "estimatedCostRange": "e.g. 'INR 5,000 - 9,000' or local equivalent",
      "suitabilityScore": number (0 to 100 score),
      "pros": "Main benefit for this route",
      "cons": "Main drawback for this route",
      "hasSwitchOrTransfer": boolean (true if line switch, border pass, or transfer is needed),
      "transferGuide": "Specific step-by-step interchange instructions if applicable",
      "desc": "Precise description of this transit from ${startCity} to ${destination}",
      "tag": "e.g. 'Fast & Direct', 'Scenic Route', 'Budget Friendly', 'Cross-Border'"
    }
  ],
  "highlightsInMinDays": [
    "Highlight 1",
    "Highlight 2",
    "Highlight 3",
    "Highlight 4",
    "Highlight 5"
  ],
  "bestSeasons": "Optimal months/seasons to visit",
  "destinationVibe": "1-sentence summary of the vibe and landscape"
}

Important:
- Include ALL viable travel modes that make sense from ${startCity} to ${destination} (for example, if land-accessible like India to Nepal, include Flight, Car/Road Trip with border pass, Bus, Train with border switch, Motorcycle, and Fly + Rental).
- If overseas across oceans (like India to Iceland, USA, Europe, Australia), include Flight and Fly + Destination Rental.
- Return ONLY valid raw JSON with no Markdown or text outside JSON.`;

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const text = response.text || '';
        const parsed = parseJsonSafely(text);

        if (
          parsed &&
          typeof parsed.minimumRequiredDays === 'number' &&
          parsed.recommendedTravelMode
        ) {
          const mergedResult: DestinationTravelIntelligence = {
            destination: parsed.destination || destination,
            startCity: parsed.startCity || startCity,
            distanceKm: typeof parsed.distanceKm === 'number' ? parsed.distanceKm : genericFallback.distanceKm,
            minimumRequiredDays: Math.max(1, parsed.minimumRequiredDays),
            idealDays: Math.max(parsed.minimumRequiredDays || 3, parsed.idealDays || 5),
            durationReason: parsed.durationReason || genericFallback.durationReason,
            recommendedTravelMode: parsed.recommendedTravelMode as TravelMode,
            recommendedTravelModeReason: parsed.recommendedTravelModeReason || genericFallback.recommendedTravelModeReason,
            transferAndSwitchTips: parsed.transferAndSwitchTips || genericFallback.transferAndSwitchTips,
            modesBreakdown: Array.isArray(parsed.modesBreakdown) && parsed.modesBreakdown.length > 0
              ? parsed.modesBreakdown
              : genericFallback.modesBreakdown,
            highlightsInMinDays: Array.isArray(parsed.highlightsInMinDays) && parsed.highlightsInMinDays.length > 0
              ? parsed.highlightsInMinDays
              : genericFallback.highlightsInMinDays,
            bestSeasons: parsed.bestSeasons || genericFallback.bestSeasons,
            destinationVibe: parsed.destinationVibe || genericFallback.destinationVibe
          };

          intelligenceCache.set(cacheKey, mergedResult);
          return mergedResult;
        }
      } catch (err) {
        console.warn(`Destination intelligence attempt with ${modelName} failed, trying next:`, err);
      }
    }
  } catch (error) {
    console.warn('Gemini Destination Intelligence API error:', error);
  }

  intelligenceCache.set(cacheKey, genericFallback);
  return genericFallback;
}
