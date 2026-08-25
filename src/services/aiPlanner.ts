import { Trip, UserPreferences, Activity, DayItinerary, TravelCompanion, TravelMode, BudgetTier, GroupMember, PackingItem, RequirementDocument, BookingItem, TravelStyle } from '../types';
import { calculateTierBudget, getTravelModeTransitCost } from '../components/CreateTripWizard';
import { config } from '../config';
const POPULAR_DESTINATIONS: any[] = [{ id: 'mock', name: 'Mock' }];
const GOA_DEFAULT_TRIP_DATA: any = { days: [], packingList: [], requirements: [], bookings: [] };
const MANALI_DEFAULT_TRIP: any = {};
const WAYANAD_DEFAULT_TRIP: any = {};
const getRouteDetails = (a: any, b: any, c: any) => ({ distanceKm: 0, routeTitle: '', keyHighwayOrTrain: '', recommendedMode: 'Flight', flightDuration: '0', trainDuration: '0', driveDuration: '0', originCode: 'MOCK', destCode: 'MOCK', departureHub: 'MOCK', arrivalHub: 'MOCK' });
import { GoogleGenAI } from '@google/genai';
export interface AdaptOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  badge?: string;
}

export const ADAPT_OPTIONS: AdaptOption[] = [
  {
    id: 'rain',
    icon: '🌧️',
    label: 'Weather changed (It\'s raining)',
    description: 'Swap outdoor beaches and open viewpoints for cozy indoor cafes, art galleries & spice tours.',
    badge: 'Smart Weather AI'
  },
  {
    id: 'woke_up_late',
    icon: '😴',
    label: 'We woke up late',
    description: 'Shift schedule forward gracefully, convert morning into brunch, and preserve key highlights.',
    badge: 'Time Optimizer'
  },
  {
    id: 'spend_less',
    icon: '💰',
    label: 'We want to spend less',
    description: 'Swap pricey dining and ticketed spots for iconic budget taverns, free cliffs & secret viewpoints.',
    badge: 'Budget Rebalancer'
  },
  {
    id: 'more_adventure',
    icon: '⚡',
    label: 'We want more adventure',
    description: 'Inject adrenaline: parasailing, jet skiing, hidden lagoon kayaking & jungle trails.',
    badge: 'Thrill Injector'
  },
  {
    id: 'relaxed_day',
    icon: '😌',
    label: 'We want a relaxed day',
    description: 'Clear high-exertion stops, add oceanfront sunbeds, Ayurvedic spa & quiet sunset lounge.',
    badge: 'Vibe Shift'
  },
  {
    id: 'dont_like_place',
    icon: '❤️',
    label: 'We don\'t like this place',
    description: 'Instantly replace the current activity with a personalized alternative nearby.',
    badge: 'Instant Swap'
  },
  {
    id: 'different_food',
    icon: '🍴',
    label: 'We want different food',
    description: 'Switch between authentic seafood thalis, vegan organic bistros, or beach cafes.',
    badge: 'Foodie Pivot'
  },
  {
    id: 'explore_nearby',
    icon: '📍',
    label: 'Explore hidden gems nearby',
    description: 'Discover uncrowded secret coves, artisan bakeries, and photo points within 15 min.',
    badge: 'Local Radar'
  }
];

export function calculateGroupCompatibility(members: GroupMember[] = []) {
  if (!members || members.length === 0) {
    return {
      overallScore: 92,
      breakdown: [
        { category: 'Adventure', score: 85, icon: 'Compass' },
        { category: 'Food & Dining', score: 95, icon: 'Utensils' },
        { category: 'Nightlife & Social', score: 78, icon: 'Moon' },
        { category: 'Nature & Scenic', score: 88, icon: 'Trees' },
        { category: 'Culture & Art', score: 80, icon: 'Landmark' }
      ],
      summary: 'High synergy! Your group shares strong culinary and nature interests, with a well-balanced appetite for daytime discovery.'
    };
  }

  // Count styles across members
  const styleCounts: Record<string, number> = {};
  members.forEach(m => {
    m.styles.forEach(s => {
      styleCounts[s] = (styleCounts[s] || 0) + 1;
    });
  });

  const totalMembers = members.length;
  const adventureScore = Math.min(100, Math.round(((styleCounts['Adventure'] || 1) / totalMembers) * 60 + 35));
  const foodScore = Math.min(100, Math.round(((styleCounts['Food'] || 1) / totalMembers) * 55 + 40));
  const nightlifeScore = Math.min(100, Math.round(((styleCounts['Nightlife'] || 1) / totalMembers) * 60 + 30));
  const natureScore = Math.min(100, Math.round(((styleCounts['Nature'] || 1) / totalMembers) * 55 + 40));
  const cultureScore = Math.min(100, Math.round(((styleCounts['Culture'] || 1) / totalMembers) * 50 + 35));

  const overallScore = Math.round((adventureScore + foodScore + nightlifeScore + natureScore + cultureScore) / 5);

  return {
    overallScore,
    breakdown: [
      { category: 'Food & Dining', score: foodScore, icon: 'Utensils' },
      { category: 'Nature & Scenic', score: natureScore, icon: 'Trees' },
      { category: 'Adventure', score: adventureScore, icon: 'Compass' },
      { category: 'Nightlife & Social', score: nightlifeScore, icon: 'Moon' },
      { category: 'Culture & Art', score: cultureScore, icon: 'Landmark' }
    ],
    summary: `${members.length} travellers analyzed. The itinerary harmonizes ${members[0]?.name || 'Traveller 1'}'s interests with the group's collective energy.`
  };
}

export async function generateTripFromInputs(params: {
  destinationId: string;
  destinationPlace?: { placeId: string; name: string; address: string; latitude: number; longitude: number; photoUrl?: string; };
  startCity?: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  companionType: TravelCompanion;
  travellersCount: number;
  travelMode?: TravelMode;
  budgetTier: BudgetTier;
  targetBudget?: number;
  preferences: UserPreferences;
}): Promise<Trip> {
  const apiKey = config.api.geminiKey;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const travelMode = params.travelMode || params.preferences.travelMode || 'Flight';
  const startCity = params.startCity || params.preferences.startCity || 'Bangalore';
  const destName = params.destinationPlace?.name || params.destinationId;
  const destAddress = params.destinationPlace?.address || destName;
  const heroImg = params.destinationPlace?.photoUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `You are an expert travel planner. Create a highly detailed and realistic ${params.durationDays}-day travel itinerary for a trip from ${startCity} to ${destName} (${destAddress}).
The travelers are a ${params.companionType} group of ${params.travellersCount}.
Mode of Travel: ${travelMode}.
Budget Level: ${params.budgetTier}.
Preferences: ${params.preferences.styles.join(', ')}. Pace: ${params.preferences.pace}. Dietary: ${params.preferences.food}.
Make sure to calculate realistic distance, travel times, and travel logic. Use rich, engaging markdown descriptions.`;

  const response = await ai.models.generateContent({
    model: config.models.defaultAiModel || 'gemini-1.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          routeSummary: {
            type: 'OBJECT',
            properties: {
              distanceKm: { type: 'NUMBER' },
              flightDuration: { type: 'STRING' },
              trainDuration: { type: 'STRING' },
              driveDuration: { type: 'STRING' },
              departureHub: { type: 'STRING' },
              arrivalHub: { type: 'STRING' },
              keyHighwayOrTrain: { type: 'STRING' },
              recommendedMode: { type: 'STRING' },
              notes: { type: 'STRING' }
            },
            required: ['distanceKm', 'departureHub', 'arrivalHub', 'recommendedMode']
          },
          clothingAdvice: { type: 'STRING', description: 'Brief advice on what clothing to pack.' },
          days: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                dayNumber: { type: 'NUMBER' },
                date: { type: 'STRING' },
                title: { type: 'STRING' },
                theme: { type: 'STRING' },
                vibe: { type: 'STRING' },
                weatherForecast: {
                  type: 'OBJECT',
                  properties: {
                    temp: { type: 'STRING' },
                    condition: { type: 'STRING' },
                    icon: { type: 'STRING' },
                    rainChance: { type: 'NUMBER' }
                  },
                  required: ['temp', 'condition', 'icon', 'rainChance']
                },
                activities: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      time: { type: 'STRING' },
                      endTime: { type: 'STRING' },
                      title: { type: 'STRING' },
                      category: { type: 'STRING' },
                      location: { type: 'STRING' },
                      estimatedCost: { type: 'NUMBER' },
                      travelTimeFromPrev: { type: 'STRING' },
                      duration: { type: 'STRING' },
                      description: { type: 'STRING' },
                      imageUrl: { type: 'STRING' },
                      recommendationReason: { type: 'STRING' },
                      isIndoor: { type: 'BOOLEAN' },
                      isRainSafe: { type: 'BOOLEAN' },
                      rating: { type: 'NUMBER' }
                    },
                    required: ['id', 'time', 'endTime', 'title', 'category', 'location', 'estimatedCost', 'travelTimeFromPrev', 'duration', 'description', 'imageUrl', 'recommendationReason', 'isIndoor', 'isRainSafe', 'rating']
                  }
                }
              },
              required: ['dayNumber', 'date', 'title', 'theme', 'vibe', 'weatherForecast', 'activities']
            }
          },
          packingList: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                name: { type: 'STRING' },
                category: { type: 'STRING' },
                checked: { type: 'BOOLEAN' },
                reason: { type: 'STRING' }
              },
              required: ['id', 'name', 'category', 'checked', 'reason']
            }
          },
          requirements: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                title: { type: 'STRING' },
                type: { type: 'STRING' },
                status: { type: 'STRING' },
                notes: { type: 'STRING' }
              },
              required: ['id', 'title', 'type', 'status', 'notes']
            }
          },
          bookings: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                title: { type: 'STRING' },
                type: { type: 'STRING' },
                status: { type: 'STRING' },
                estimatedCost: { type: 'NUMBER' },
                provider: { type: 'STRING' },
                notes: { type: 'STRING' }
              },
              required: ['id', 'title', 'type', 'status', 'estimatedCost', 'provider', 'notes']
            }
          }
        },
        required: ['routeSummary', 'clothingAdvice', 'days', 'packingList', 'requirements', 'bookings']
      }
    }
  });

  const text = response.text || '{}';
  let genData: any = {};
  
  try {
    genData = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON response", err);
    throw new Error("Invalid itinerary generation from AI");
  }

  return {
    id: `trip-${Date.now()}`,
    title: `${destName} ${params.companionType} Getaway`,
    destination: destName,
    destinationStateOrCountry: destAddress,
    startCity,
    routeSummary: genData.routeSummary,
    heroImage: heroImg,
    startDate: params.startDate,
    endDate: params.endDate,
    durationDays: params.durationDays,
    companionType: params.companionType,
    travellersCount: params.travellersCount,
    travelMode,
    budgetTier: params.budgetTier,
    targetBudget: params.targetBudget || 25000,
    currency: 'INR',
    preferences: {
      ...params.preferences,
      startCity
    },
    days: genData.days || [],
    packingList: genData.packingList || [],
    requirements: genData.requirements || [],
    bookings: genData.bookings || [],
    clothingAdvice: genData.clothingAdvice || '',
    createdAt: new Date().toISOString().split('T')[0],
    adaptationHistory: []
  };
}

export function adaptTripPlan(
  trip: Trip,
  triggerId: string,
  targetDayNumber: number = 1
): { updatedTrip: Trip; summaryMessage: string; changedCount: number } {
  const updatedTrip = JSON.parse(JSON.stringify(trip)) as Trip;
  const dayIndex = updatedTrip.days.findIndex(d => d.dayNumber === targetDayNumber);
  const targetDay = dayIndex !== -1 ? updatedTrip.days[dayIndex] : updatedTrip.days[0];

  let summaryMessage = '';
  let changedCount = 0;

  if (triggerId === 'rain') {
    // Replace all outdoor activities with high-rated indoor alternatives
    targetDay.weatherForecast = {
      temp: '25°C',
      condition: 'Rainy',
      icon: 'CloudRain',
      rainChance: 90
    };
    targetDay.theme = 'Monsoon Heritage, Artisan Cafes & Indoor Spas';
    targetDay.vibe = 'Petrichor scents, warm Goan poee, indoor art galleries & ambient jazz';

    targetDay.activities = targetDay.activities.map((act) => {
      if (act.category === 'Sightseeing' || act.category === 'Adventure') {
        changedCount++;
        return {
          ...act,
          title: 'Indoor Art & Heritage Immersion: Museum of Goa (MOG)',
          category: 'Culture',
          location: 'Pilerne Gallery Enclave',
          description: 'Contemporary indoor galleries celebrating Goa\'s vibrant maritime and cultural history sheltered from rain.',
          imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=600&auto=format&fit=crop',
          recommendationReason: 'Adapted for rain: 100% weather-proof indoor gallery with cozy coffee lounge.',
          isIndoor: true,
          isRainSafe: true,
          isUpdated: true,
          updatedReason: '🌧️ Replaced outdoor cliff walk due to sudden rain'
        };
      }
      if (act.title.includes('Fort') || act.title.includes('Beach')) {
        changedCount++;
        return {
          ...act,
          title: 'Covered Mandovi Heritage Cruise or Artisan Pottery Studio',
          category: 'Culture',
          location: 'Panjim Waterfront / Bicholim',
          description: 'Sheltered lounge deck with warm ginger chai and live acoustic Portuguese serenade.',
          imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop',
          recommendationReason: 'Adapted for rain: Enjoy panoramic misty river vistas from covered canopy deck.',
          isIndoor: true,
          isRainSafe: true,
          isUpdated: true,
          updatedReason: '🌧️ Replaced open-air fort sunset with sheltered river lounge'
        };
      }
      return act;
    });

    summaryMessage = `🌧️ Rain Mode Activated: Replaced ${changedCount} outdoor stops with air-conditioned art galleries, indoor spice cafes, and covered scenic lounges.`;
  } else if (triggerId === 'woke_up_late') {
    // Shift morning times to brunch & consolidate
    targetDay.theme = 'Lazy Morning & Twilight Highlights';
    targetDay.vibe = 'Slow morning recharge, giant sourdough brunch & sunset continuation';

    const shiftedActivities: Activity[] = [];
    changedCount = 2;

    // Merge breakfast and check-in into hearty brunch at 11:30 AM
    shiftedActivities.push({
      id: `woke-brunch-${Date.now()}`,
      time: '11:30 AM',
      endTime: '01:00 PM',
      title: 'Power Brunch at Baba Au Rhum (Late Rise Optimizer)',
      category: 'Food',
      location: 'Anjuna Bamboo Grove',
      estimatedCost: 1300,
      travelTimeFromPrev: '10 min scooter ride',
      duration: '1.5 hrs',
      description: 'Combined breakfast and lunch feast with double espresso, eggs benedict, and wood-fired focaccia.',
      imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Consolidated your morning stops so you don\'t miss out on prime afternoon attractions.',
      isIndoor: true,
      isRainSafe: true,
      isUpdated: true,
      updatedReason: '😴 Combined breakfast + lunch into brunch due to late morning'
    });

    // Pick top 3 subsequent afternoon and evening activities
    const remaining = targetDay.activities.filter(a => !a.time.includes('09:') && !a.time.includes('10:'));
    const timeSlots = ['01:30 PM', '04:00 PM', '06:30 PM', '09:00 PM'];
    remaining.forEach((act, idx) => {
      if (idx < timeSlots.length) {
        shiftedActivities.push({
          ...act,
          time: timeSlots[idx],
          isUpdated: true,
          updatedReason: '😴 Shifted schedule forward smoothly'
        });
      }
    });

    targetDay.activities = shiftedActivities;
    summaryMessage = `😴 Late Morning Adjusted: Merged early stops into an 11:30 AM brunch and shifted your afternoon timeline without rushing.`;
  } else if (triggerId === 'spend_less') {
    targetDay.theme = 'Budget-Friendly Authentic Secrets';
    targetDay.vibe = 'Local taverns, sunset cliffs, street poee & zero-cost nature bliss';

    targetDay.activities = targetDay.activities.map((act) => {
      if (act.estimatedCost > 1500) {
        changedCount++;
        return {
          ...act,
          title: `Iconic Local Tavern & Fish Thali: Vinayak Assagao`,
          estimatedCost: 450,
          description: 'Beloved local eatery renowned for mouthwatering ₹250 fish thalis, kokum sol kadhi, and fried prawns.',
          imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=600&auto=format&fit=crop',
          recommendationReason: 'Swapped for high-value authentic local tavern: cuts cost by 70% with stellar 4.8★ taste.',
          isUpdated: true,
          updatedReason: '💰 Budget optimized: Saved ₹1,800 on dining'
        };
      }
      return act;
    });

    summaryMessage = `💰 Budget Saved: Replaced fine dining with legendary authentic local food spots and free panoramic sunset cliffs.`;
  } else if (triggerId === 'more_adventure') {
    changedCount = 2;
    targetDay.theme = 'Adrenaline Rush & Wild Coastal Thrills';
    targetDay.vibe = 'Speedboats, high-flying parasail ropes, off-road trails & saltwater adrenaline';

    targetDay.activities.splice(1, 1, {
      id: `adv-${Date.now()}`,
      time: '02:30 PM',
      endTime: '04:30 PM',
      title: 'Tandem Parasailing & Jet Ski Speed Trail',
      category: 'Adventure',
      location: 'Morjim / Baga Sea Sports Hub',
      estimatedCost: 2200,
      travelTimeFromPrev: '15 min drive',
      duration: '2 hrs',
      description: '300-foot winchboat parasailing offering 360-degree ocean views followed by guided deep-sea jet ski wave jumps.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
      recommendationReason: '⚡ Injected top adrenaline adventure activity into today\'s itinerary.',
      isIndoor: false,
      isRainSafe: false,
      isUpdated: true,
      updatedReason: '⚡ Injected high-intensity water sports adventure'
    });

    summaryMessage = `⚡ Thrill Upgraded: Injected parasailing, jet skiing, and cliff jumping into your afternoon plan!`;
  } else if (triggerId === 'relaxed_day') {
    changedCount = 3;
    targetDay.theme = 'Pure Zen, Ayurvedic Rejuvenation & Sundowners';
    targetDay.vibe = 'Warm coconut oils, hammocks, ocean breeze & acoustic jazz';

    targetDay.activities = [
      {
        id: `rel-1-${Date.now()}`,
        time: '10:00 AM',
        title: 'Tropical Breakfast in Hammock Garden',
        category: 'Food',
        location: 'Artjuna Garden Cafe',
        estimatedCost: 800,
        travelTimeFromPrev: '5 min walk',
        duration: '1.5 hrs',
        description: 'Chilled iced lattes, acai berry bowls, and gentle acoustic guitar music under leafy mango trees.',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop',
        recommendationReason: 'Relaxed start with zero rush.',
        isIndoor: false,
        isRainSafe: true,
        isUpdated: true,
        updatedReason: '😌 Swapped for zen garden brunch'
      },
      {
        id: `rel-2-${Date.now()}`,
        time: '01:30 PM',
        title: 'Traditional Ayurvedic Abhyanga Massage & Steam',
        category: 'Relaxation',
        location: 'Devaaya Holistic Wellness Center',
        estimatedCost: 2400,
        travelTimeFromPrev: '15 min drive',
        duration: '2 hrs',
        description: 'Herbal medicated warm oil massage with herbal steam bath relieving all travel fatigue.',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
        recommendationReason: 'Full body restoration and relaxation.',
        isIndoor: true,
        isRainSafe: true,
        isUpdated: true,
        updatedReason: '😌 Added Ayurvedic wellness spa session'
      },
      {
        id: `rel-3-${Date.now()}`,
        time: '05:30 PM',
        title: 'Sunset Beach Bed Loungers & Fresh Coconut Water',
        category: 'Relaxation',
        location: 'Mandrem Quiet Sands',
        estimatedCost: 500,
        travelTimeFromPrev: '20 min drive',
        duration: '2.5 hrs',
        description: 'Cushioned oceanfront sunbeds listening to gentle waves without crowds or loud music.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
        recommendationReason: 'Peaceful uncrowded beach experience.',
        isIndoor: false,
        isRainSafe: false,
        isUpdated: true,
        updatedReason: '😌 Replaced packed fort with quiet beach sunset'
      }
    ];

    summaryMessage = `😌 Vibe Shifted to Relaxed: Removed hectic travel legs and scheduled an Ayurvedic massage & quiet beach beds.`;
  } else {
    // Generic smart swap
    changedCount = 1;
    if (targetDay.activities.length > 0) {
      targetDay.activities[0] = {
        ...targetDay.activities[0],
        title: 'Curated Artisan Food & Cultural Gem',
        description: 'Alternative local experience personalized based on your instant request.',
        isUpdated: true,
        updatedReason: '✨ Swapped for optimized local gem'
      };
    }
    summaryMessage = `✨ Itinerary re-optimized based on your new preference!`;
  }

  // Record adaptation history
  if (!updatedTrip.adaptationHistory) {
    updatedTrip.adaptationHistory = [];
  }
  updatedTrip.adaptationHistory.unshift({
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    trigger: triggerId,
    description: summaryMessage
  });

  return {
    updatedTrip,
    summaryMessage,
    changedCount
  };
}
