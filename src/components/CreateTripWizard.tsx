import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Plus,
  Trash2,
  Sliders,
  Compass,
  AlertTriangle,
  Smile,
  ShieldAlert,
  Clock,
  Heart,
  Navigation,
  PlaneTakeoff,
  Locate,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPinned
} from 'lucide-react';
import {
  TravelStyle,
  TravelPace,
  FoodPreference,
  AlcoholPreference,
  TravelCompanion,
  TravelMode,
  BudgetTier,
  UserPreferences,
  GroupMember,
  DestinationPreset
} from '../types';
import { Step1DestinationSearch, SelectedDestinationPlace } from './Step1DestinationSearch';

interface CreateTripWizardProps {
  initialDestinationId?: string;
  onGenerateTrip: (tripParams: {
    destinationId: string;
    destinationPlace?: SelectedDestinationPlace;
    startCity: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    companionType: TravelCompanion;
    travellersCount: number;
    travelMode: TravelMode;
    budgetTier: BudgetTier;
    targetBudget: number;
    preferences: UserPreferences;
  }) => void;
  onCancel: () => void;
}

export const TRAVEL_MODES: {
  id: TravelMode;
  label: string;
  icon: string;
  desc: string;
  tag: string;
}[] = [
    { id: 'Flight', label: 'Flight', icon: '✈️', desc: 'Fastest air transit & airport transfers', tag: 'Fast & Direct' },
    { id: 'Train', label: 'Train / Railway', icon: '🚆', desc: 'Scenic rail routes & sleeper/express berths', tag: 'Scenic Comfort' },
    { id: 'Car / Road Trip', label: 'Car / Road Trip', icon: '🚗', desc: 'Highway drive with pitstops & total freedom', tag: 'High Flexibility' },
    { id: 'Bus', label: 'Bus / Sleeper Coach', icon: '🚌', desc: 'Overnight Volvo AC & sleeper intercity', tag: 'Budget Friendly' },
    { id: 'Bike / Motorcycle', label: 'Bike / Motorcycle', icon: '🏍️', desc: 'Thrilling open-road highway & mountain passes', tag: 'Adventure Ride' },
    { id: 'Self-Drive Rental', label: 'Self-Drive / Rental', icon: '🚙', desc: 'Rental car or hired SUV at destination', tag: 'Local Freedom' }
  ];

const TRAVEL_STYLES: { id: TravelStyle; label: string; icon: string; desc: string }[] = [
  { id: 'Adventure', label: 'Adventure', icon: '🧗', desc: 'Trekking, watersports & adrenaline' },
  { id: 'Relaxation', label: 'Relaxation', icon: '🌴', desc: 'Beaches, spa & unrushed vibe' },
  { id: 'Nightlife', label: 'Nightlife', icon: '🍸', desc: 'Clubs, sunset bars & music' },
  { id: 'Nature', label: 'Nature', icon: '🌿', desc: 'Rainforests, wildlife & greenery' },
  { id: 'Culture', label: 'Culture', icon: '🏛️', desc: 'Heritage forts, art & history' },
  { id: 'Food', label: 'Food', icon: '🥘', desc: 'Local delicacies, cafes & street food' },
  { id: 'Photography', label: 'Photography', icon: '📸', desc: 'Scenic vistas & Instagram aesthetics' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️', desc: 'Flea markets & boutique souvenirs' },
  { id: 'Luxury', label: 'Luxury', icon: '✨', desc: 'Fine dining & private yachts' },
  { id: 'Backpacking', label: 'Backpacking', icon: '🎒', desc: 'Offbeat trails & budget gems' },
  { id: 'Spiritual', label: 'Spiritual', icon: '🛕', desc: 'Temples, yoga & inner peace' },
  { id: 'Hidden gems', label: 'Hidden gems', icon: '🗺️', desc: 'Secret coves & uncrowded spots' }
];

const IDEAL_DAYS = [
  'Wake up early and explore',
  'Slow morning + sightseeing',
  'Adventure all day',
  'Food + cafes',
  'Beach + nightlife',
  'Photography + hidden places'
];

const AVOIDANCES = [
  'Crowded places',
  'Long travel',
  'Expensive restaurants',
  'Night travel',
  'Adventure activities',
  'Alcohol-focused places'
];

const getTodayFormattedDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCalculatedEndDate = (startString: string, days: number) => {
  const parts = startString.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const start = new Date(parts[0], parts[1] - 1, parts[2]);
    const end = new Date(start);
    end.setDate(start.getDate() + Math.max(1, days) - 1);
    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, '0');
    const day = String(end.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return startString;
};

const getCalculatedDaysBetween = (startString: string, endString: string) => {
  const startParts = startString.split('-').map(Number);
  const endParts = endString.split('-').map(Number);
  if (
    startParts.length === 3 && !isNaN(startParts[0]) && !isNaN(startParts[1]) && !isNaN(startParts[2]) &&
    endParts.length === 3 && !isNaN(endParts[0]) && !isNaN(endParts[1]) && !isNaN(endParts[2])
  ) {
    const start = new Date(startParts[0], startParts[1] - 1, startParts[2]);
    const end = new Date(endParts[0], endParts[1] - 1, endParts[2]);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }
  return 4;
};

// Helper to estimate transit cost based on travel mode, budget tier, duration, travellers, and distance
export const getTravelModeTransitCost = (
  mode: TravelMode,
  tier: BudgetTier,
  duration: number,
  travellers: number,
  distanceKm: number = 600
) => {
  // Distance scaling factor (base is ~600km)
  const distFactor = Math.max(0.6, Math.min(2.5, distanceKm / 600));

  switch (mode) {
    case 'Flight': {
      // Per person roundtrip flights + airport cabs
      const baseFlight =
        tier === 'Budget' ? 4500 : tier === 'Moderate' ? 6500 : tier === 'Premium' ? 10500 : 18000;
      const flightPerPerson = Math.round(baseFlight * (0.7 + 0.3 * distFactor));
      const airportTransfer = tier === 'Budget' ? 600 : 1200;
      return flightPerPerson * travellers + airportTransfer;
    }
    case 'Train': {
      // Per person roundtrip rail fares + station local transit
      const baseTrain =
        tier === 'Budget' ? 700 : tier === 'Moderate' ? 1600 : tier === 'Premium' ? 2800 : 4500;
      const trainPerPerson = Math.round(baseTrain * (0.6 + 0.4 * distFactor));
      const stationCab = tier === 'Budget' ? 300 : 600;
      return trainPerPerson * travellers + stationCab;
    }
    case 'Car / Road Trip': {
      // Highway fuel + FASTag tolls per car (1 car per 4-5 people)
      const carsCount = Math.max(1, Math.ceil(travellers / 4));
      const roundTripDist = distanceKm * 2;
      const fuelPerCar = Math.round(roundTripDist * 8.5);
      const tollsPerCar = Math.round((roundTripDist / 100) * 120);
      const tierComfortBonus = tier === 'Budget' ? 0 : tier === 'Moderate' ? 1000 : tier === 'Premium' ? 2500 : 4500;
      return carsCount * (fuelPerCar + tollsPerCar + tierComfortBonus);
    }
    case 'Bus': {
      // Per person roundtrip intercity Volvo/sleeper bus
      const baseBus =
        tier === 'Budget' ? 800 : tier === 'Moderate' ? 1300 : tier === 'Premium' ? 2000 : 2800;
      const busPerPerson = Math.round(baseBus * (0.6 + 0.4 * distFactor));
      return busPerPerson * travellers;
    }
    case 'Bike / Motorcycle': {
      // 1 bike per 2 riders, rental + fuel per day
      const bikesCount = Math.max(1, Math.ceil(travellers / 2));
      const bikePerDay =
        tier === 'Budget' ? 900 : tier === 'Moderate' ? 1400 : tier === 'Premium' ? 2200 : 3500;
      const roundTripDist = distanceKm * 2;
      const totalFuel = Math.round((roundTripDist / 35) * 105);
      return bikesCount * (bikePerDay * duration + totalFuel);
    }
    case 'Self-Drive Rental': {
      // Rental car at destination (1 car per 4 people) per day + fuel
      const carsCount = Math.max(1, Math.ceil(travellers / 4));
      const rentalPerDay =
        tier === 'Budget' ? 1600 : tier === 'Moderate' ? 2500 : tier === 'Premium' ? 4200 : 6800;
      const dailyFuel = 600;
      return carsCount * (rentalPerDay + dailyFuel) * duration;
    }
    default:
      return 2500 * travellers;
  }
};

// Calculate realistic tiered budget based on destination avg cost, duration, travellers, mode of travel, AND route distance
export const calculateTierBudget = (
  tier: BudgetTier,
  destination: DestinationPreset,
  duration: number,
  travellers: number,
  travelMode: TravelMode = 'Flight',
  distanceKm: number = 600
) => {
  const baseCost = destination?.avgCostPerDay || 7000;
  // Multiplier considering room sharing for 2+ people
  const groupFactor = travellers <= 1 ? 1 : 1 + (travellers - 1) * 0.70;

  let groundDailyPerPerson = 0;
  if (tier === 'Budget') {
    groundDailyPerPerson = Math.max(1200, Math.round(baseCost * 0.32));
  } else if (tier === 'Moderate') {
    groundDailyPerPerson = Math.round(baseCost * 0.70);
  } else if (tier === 'Premium') {
    groundDailyPerPerson = Math.round(baseCost * 1.35);
  } else {
    // Luxury
    groundDailyPerPerson = Math.round(baseCost * 2.30);
  }

  const groundTotal = groundDailyPerPerson * duration * groupFactor;
  const transitTotal = getTravelModeTransitCost(travelMode, tier, duration, travellers, distanceKm);
  const totalMin = groundTotal + transitTotal;

  return Math.max(2500, Math.round(totalMin / 500) * 500);
};

export const CreateTripWizard: React.FC<CreateTripWizardProps> = ({
  initialDestinationId = '',
  onGenerateTrip,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Step 1: Destination (Google Places Interactive Map)
  const [selectedDestinationPlace, setSelectedDestinationPlace] = useState<SelectedDestinationPlace | null>(null);
  const [selectedDestId, setSelectedDestId] = useState<string>(initialDestinationId);

  // Step 2: Starting Point / Departure Location & Geolocation
  const [startCity, setStartCity] = useState<string>('');
  const [customStartCity, setCustomStartCity] = useState<string>('');
  const [isCustomCityInput, setIsCustomCityInput] = useState<boolean>(false);
  const [originSearch, setOriginSearch] = useState<string>('');
  const [originSelectionMode, setOriginSelectionMode] = useState<'ask_location' | 'manual' | 'detected'>('ask_location');
  const [locatingStatus, setLocatingStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [locationErrorMsg, setLocationErrorMsg] = useState<string>('');
  const [detectedLocationData, setDetectedLocationData] = useState<{
    cityName: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
  } | null>(null);

  // Step 3: Dates, Duration & Mode of Travel
  const [durationDays, setDurationDays] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>(() => getTodayFormattedDate());
  const [endDate, setEndDate] = useState<string>(() => getCalculatedEndDate(getTodayFormattedDate(), 4));
  const [travelMode, setTravelMode] = useState<TravelMode>('Flight');

  // Step 4: Travellers
  const [companionType, setCompanionType] = useState<TravelCompanion>('Friends');
  const [travellersCount, setTravellersCount] = useState<number>(3);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: 'm1', name: 'Traveller 1', styles: ['Adventure', 'Culture'], food: 'No preference' },
    { id: 'm2', name: 'Traveller 2', styles: ['Food', 'Nature'], food: 'No preference' },
    { id: 'm3', name: 'Traveller 3', styles: ['Relaxation', 'Hidden gems'], food: 'No preference' }
  ]);

  // Step 5: Budget
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Moderate');
  const [customBudget, setCustomBudget] = useState<number>(30000);

  // Step 6: Preferences (default nothing selected)
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([]);
  const [travelPace, setTravelPace] = useState<TravelPace | null>(null);
  const [foodPreference, setFoodPreference] = useState<FoodPreference | null>(null);
  const [alcoholPreference, setAlcoholPreference] = useState<AlcoholPreference | null>(null);
  const [selectedIdealDays, setSelectedIdealDays] = useState<string[]>([]);
  const [selectedAvoidances, setSelectedAvoidances] = useState<string[]>([]);

  // Dynamically resolved destination preset for downstream logistics & AI calculation
  const selectedDestination: DestinationPreset = useMemo(() => {
    if (selectedDestinationPlace) {
      return {
        id: selectedDestinationPlace.placeId,
        name: selectedDestinationPlace.name,
        tagline: `Journey to ${selectedDestinationPlace.name}`,
        region: selectedDestinationPlace.address.split(',')[0] || selectedDestinationPlace.name,
        country: selectedDestinationPlace.address.includes('India') ? 'India' : 'International',
        heroImage:
          selectedDestinationPlace.photoUrl ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        climate: 'Pleasant & Moderate',
        avgCostPerDay: 7000,
        bestMonths: 'Year-round',
        popularFor: ['Culture', 'Food', 'Nature', 'Sightseeing'] as TravelStyle[],
        shortDescription: selectedDestinationPlace.address
      };
    }
    return {
      id: 'custom-destination',
      name: 'Selected Destination',
      tagline: 'Your Personalized Journey',
      region: 'Explore',
      country: 'Global',
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      climate: 'Pleasant',
      avgCostPerDay: 7000,
      bestMonths: 'Year-round',
      popularFor: ['Culture', 'Food', 'Nature', 'Sightseeing'],
      shortDescription: 'Search any destination with Google Maps'
    };
  }, [selectedDestinationPlace]);

  // Effective Start City & Route Calculation
  const effectiveStartCity = isCustomCityInput && customStartCity.trim() ? customStartCity.trim() : (startCity || 'Origin City');
  const currentRouteDetails = useMemo(() => ({
    distanceKm: 600,
    routeTitle: `${effectiveStartCity} to ${selectedDestination.name}`,
    keyHighwayOrTrain: 'Direct Transit Corridor',
    recommendedMode: travelMode,
    flightDuration: '2h',
    trainDuration: '8h',
    driveDuration: '10h'
  }), [effectiveStartCity, selectedDestination.name, travelMode]);

  // Browser Geolocation Detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocatingStatus('error');
      setLocationErrorMsg('Geolocation is not supported by your browser. Please choose your departure city manually below.');
      setOriginSelectionMode('manual');
      return;
    }

    setLocatingStatus('locating');
    setLocationErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Reverse geocoding via OpenStreetMap Nominatim with a 4-second timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.municipality ||
              data.address?.state_district ||
              data.address?.county ||
              data.address?.state;
            const stateName = data.address?.state;
            const countryName = data.address?.country;

            if (cityName) {
              setStartCity(cityName);
              setIsCustomCityInput(false);
              setCustomStartCity('');
              setDetectedLocationData({
                cityName,
                state: stateName,
                country: countryName,
                lat,
                lng
              });
              setLocatingStatus('success');
              setOriginSelectionMode('detected');
              return;
            }
          }
        } catch {
          setLocatingStatus('error');
          setLocationErrorMsg('Unable to fetch city from coordinates. Please enter manually.');
          setOriginSelectionMode('manual');
        }
      },
      (err) => {
        setLocatingStatus('error');
        setOriginSelectionMode('manual');
        if (err.code === 1) {
          setLocationErrorMsg('Location permission was denied. No worries! Please choose or search your starting city manually below.');
        } else if (err.code === 2) {
          setLocationErrorMsg('Unable to determine your GPS location. Please pick your starting city manually below.');
        } else {
          setLocationErrorMsg('Location request timed out. Please choose your departure city manually below.');
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedDestinationPlace) {
      return;
    }

    if (currentStep < totalSteps) {
      if (currentStep === 4) {
        // Entering Step 5 (Budget): calculate default based on selected tier, destination, duration, travellers, travelMode, and route distance
        setCustomBudget(
          calculateTierBudget(
            budgetTier,
            selectedDestination,
            durationDays,
            travellersCount,
            travelMode,
            currentRouteDetails.distanceKm
          )
        );
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Trigger AI Generation
      const targetDestName = selectedDestinationPlace?.name || selectedDestination.name || selectedDestId;
      onGenerateTrip({
        destinationId: targetDestName,
        destinationPlace: selectedDestinationPlace || {
          placeId: `custom-dest-${Date.now()}`,
          name: targetDestName,
          address: selectedDestination.region || targetDestName,
          latitude: 11.4102,
          longitude: 76.6950
        },
        startCity: effectiveStartCity,
        startDate,
        endDate,
        durationDays,
        companionType,
        travellersCount,
        travelMode,
        budgetTier,
        targetBudget: customBudget,
        preferences: {
          styles: selectedStyles.length > 0 ? selectedStyles : ['Culture', 'Food', 'Nature', 'Hidden gems'],
          pace: travelPace || 'Balanced',
          food: foodPreference || 'No preference',
          alcohol: alcoholPreference || 'No',
          travelMode,
          startCity: effectiveStartCity,
          idealDay: selectedIdealDays,
          avoidances: selectedAvoidances,
          groupMembers: companionType === 'Friends' || companionType === 'Group' ? groupMembers : undefined
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const toggleStyle = (style: TravelStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const togglePace = (pace: TravelPace) => {
    setTravelPace((prev) => (prev === pace ? null : pace));
  };

  const toggleFood = (food: FoodPreference) => {
    setFoodPreference((prev) => (prev === food ? null : food));
  };

  const toggleAlcohol = (alc: AlcoholPreference) => {
    setAlcoholPreference((prev) => (prev === alc ? null : alc));
  };

  const toggleIdealDay = (item: string) => {
    if (selectedIdealDays.includes(item)) {
      setSelectedIdealDays(selectedIdealDays.filter((i) => i !== item));
    } else {
      setSelectedIdealDays([...selectedIdealDays, item]);
    }
  };

  const toggleAvoidance = (item: string) => {
    if (selectedAvoidances.includes(item)) {
      setSelectedAvoidances(selectedAvoidances.filter((i) => i !== item));
    } else {
      setSelectedAvoidances([...selectedAvoidances, item]);
    }
  };

  const clearAllStep6Preferences = () => {
    setSelectedStyles([]);
    setTravelPace(null);
    setFoodPreference(null);
    setAlcoholPreference(null);
    setSelectedIdealDays([]);
    setSelectedAvoidances([]);
  };

  // Adjust travellers count sync with members
  const updateTravellerCount = (newCount: number) => {
    const val = Math.max(1, Math.min(10, newCount));
    setTravellersCount(val);
    if (companionType === 'Solo') {
      setTravellersCount(1);
    } else if (companionType === 'Couple') {
      setTravellersCount(2);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Header & Progress */}
        <div className="wizard-container-card bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/15 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? 'Back to Home' : 'Previous Step'}</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Step {currentStep} of {totalSteps}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedDestinationPlace}
                className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all ${currentStep === 1 && !selectedDestinationPlace
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 cursor-pointer'
                  }`}
              >
                <span>{currentStep === totalSteps ? 'Generate AI Itinerary' : 'Continue →'}</span>
                {currentStep === totalSteps ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 ease-out rounded-full shadow-xs"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step Titles */}
          <div className="text-left mt-4">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Where are you going?
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Search for any city, place, landmark, hotel, or address.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Where are you starting your trip from?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Share your current location or pick your departure hub to calculate exact routes, travel times, and transit costs.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  When, how long, & how do you want to travel?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Select your trip dates, total duration, and preferred mode of transportation to {selectedDestination.name}.
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Who are you travelling with?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  We balance individual group preferences so everyone enjoys the trip.
                </p>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What is your budget?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  We'll calibrate stays, experiences, food, and {travelMode} transit to match your comfort.
                </p>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What kind of traveller are you?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Select your vibe, dining habits, and things to avoid for full itinerary personalization.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Wizard Step Content */}
        <div className="wizard-step-card bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/15 mb-6 text-left">
          <AnimatePresence mode="wait">
            {/* STEP 1: DESTINATION INTERACTIVE MAP SEARCH */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Step1DestinationSearch
                  selectedPlace={selectedDestinationPlace}
                  onSelectPlace={(place) => {
                    setSelectedDestinationPlace(place);
                    setSelectedDestId(place.placeId);
                  }}
                  onClearPlace={() => {
                    setSelectedDestinationPlace(null);
                  }}
                />
              </motion.div>
            )}

            {/* STEP 2: DEDICATED STARTING POINT / LOCATION STEP */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* 1. LOCATION-FIRST ASKING SCREEN */}
                {originSelectionMode === 'ask_location' && (
                  <div className="space-y-5">
                    <div className="p-6 sm:p-8 rounded-3xl border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-50/90 via-teal-50/40 to-white text-center space-y-5 shadow-sm">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md ring-8 ring-emerald-100/80 mx-auto">
                        <Locate className="w-8 h-8 animate-pulse" />
                      </div>

                      <div className="max-w-md mx-auto space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Where are you starting your trip from?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Allow location access so TripCraft can pinpoint your closest departure hub, calculate accurate route distances to <strong className="text-emerald-950">{selectedDestination.name}</strong>, and tailor your transit budget.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                        <button
                          type="button"
                          id="detect-location-first-btn"
                          onClick={handleDetectLocation}
                          disabled={locatingStatus === 'locating'}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {locatingStatus === 'locating' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Detecting GPS Location...</span>
                            </>
                          ) : (
                            <>
                              <MapPinned className="w-4 h-4" />
                              <span>Use My Current Location</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          id="choose-manually-first-btn"
                          onClick={() => setOriginSelectionMode('manual')}
                          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50"
                        >
                          <Navigation className="w-4 h-4 text-slate-500" />
                          <span>Choose Manually</span>
                        </button>
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                        <span>🔒 Used only for real-time corridor & transit calculations. Never stored.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DETECTED LOCATION CONFIRMATION SCREEN */}
                {originSelectionMode === 'detected' && (
                  <div className="space-y-5">
                    <div className="p-5 rounded-2xl border-2 border-emerald-400/90 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 space-y-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                                Location Detected
                              </span>
                              {detectedLocationData?.lat && detectedLocationData?.lng && (
                                <span className="text-[11px] text-slate-500 font-medium">
                                  GPS: {detectedLocationData.lat.toFixed(2)}°, {detectedLocationData.lng.toFixed(2)}°
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-black text-emerald-950 mt-0.5">
                              {effectiveStartCity} {detectedLocationData?.state ? `(${detectedLocationData.state})` : ''}
                            </h4>
                            <p className="text-xs text-emerald-900/80 mt-0.5">
                              Departure hub confirmed for route to <strong className="text-emerald-950">{selectedDestination.name}</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            id="change-detected-origin-btn"
                            onClick={() => setOriginSelectionMode('manual')}
                            className="px-3.5 py-2 rounded-xl border border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Change Manually</span>
                          </button>
                          <button
                            type="button"
                            id="redetect-origin-btn"
                            onClick={handleDetectLocation}
                            disabled={locatingStatus === 'locating'}
                            className="p-2 rounded-xl border border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-800 transition-all cursor-pointer shadow-xs disabled:opacity-60"
                            title="Re-detect GPS location"
                          >
                            <Locate className={`w-4 h-4 ${locatingStatus === 'locating' ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>


                  </div>
                )}

                {/* 3. MANUAL SELECTION SCREEN (FALLBACK OR EXPLICIT CHOICE) */}
                {originSelectionMode === 'manual' && (
                  <div className="space-y-6">
                    {/* Notice if permission was denied or error */}
                    {locatingStatus === 'error' && (
                      <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-900">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-semibold">{locationErrorMsg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 cursor-pointer self-start sm:self-auto"
                        >
                          Retry GPS Detection
                        </button>
                      </div>
                    )}

                    {/* Search / Filter departure city */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                          Select or Search Departure Hub
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Active: {effectiveStartCity}
                          </span>
                          <button
                            type="button"
                            id="detect-location-top-btn"
                            onClick={handleDetectLocation}
                            disabled={locatingStatus === 'locating'}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Locate className="w-3 h-3" />
                            <span>Detect Location</span>
                          </button>
                        </div>
                      </div>

                      {/* Simple Origin City Input */}
                      <div className="mt-2">
                        <label className="text-xs font-bold text-slate-700 block mb-2">
                          Enter Departure City
                        </label>
                        <input
                          type="text"
                          value={startCity}
                          onChange={(e) => setStartCity(e.target.value)}
                          placeholder="e.g. Mumbai, New York, London..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: DATES, DURATION & MODE OF TRAVEL */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* 1. TRIP DURATION */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                    Trip Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { days: 3, label: '3 Days', sub: '2 Nights', isPlus: false },
                      { days: 4, label: '4 Days', sub: '3 Nights', isPlus: false },
                      { days: 5, label: '5 Days', sub: '4 Nights', isPlus: false },
                      { days: 6, label: '6+ Days', sub: '5+ Nights', isPlus: true }
                    ].map((opt) => {
                      const isSelected = opt.isPlus ? durationDays >= 6 : durationDays === opt.days;
                      return (
                        <button
                          key={opt.days}
                          type="button"
                          onClick={() => {
                            setDurationDays(opt.days);
                            setEndDate(getCalculatedEndDate(startDate, opt.days));
                          }}
                          className={`wizard-option-btn py-3.5 px-4 rounded-2xl border-2 text-center transition-all ${isSelected
                              ? 'is-selected border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                            }`}
                        >
                          <span className="text-lg block font-extrabold">{opt.label}</span>
                          <span className="text-[11px] text-slate-500">{opt.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DATE INPUTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Start Date
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const today = getTodayFormattedDate();
                          setStartDate(today);
                          setEndDate(getCalculatedEndDate(today, durationDays));
                        }}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                      >
                        Today
                      </button>
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setStartDate(newStart);
                        if (newStart && endDate) {
                          if (newStart > endDate) {
                            setEndDate(getCalculatedEndDate(newStart, durationDays));
                          } else {
                            const calculatedDays = getCalculatedDaysBetween(newStart, endDate);
                            setDurationDays(calculatedDays);
                          }
                        }
                      }}
                      className="wizard-option-card w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        End Date
                      </label>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {durationDays} {durationDays >= 6 ? 'Days (6+ option)' : durationDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => {
                        const newEnd = e.target.value;
                        setEndDate(newEnd);
                        if (startDate && newEnd) {
                          const calculatedDays = getCalculatedDaysBetween(startDate, newEnd);
                          setDurationDays(calculatedDays);
                        }
                      }}
                      className="wizard-option-card w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 3. MODE OF TRAVEL SELECTOR */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Mode of Travel (From {effectiveStartCity} to {selectedDestination.name})
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Selected: {travelMode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TRAVEL_MODES.map((mode) => {
                      const isSelected = travelMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          id={`travel-mode-${mode.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          onClick={() => setTravelMode(mode.id)}
                          className={`wizard-option-btn p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${isSelected
                              ? 'is-selected border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white font-medium'
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-2xl">{mode.icon}</span>
                              <span
                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'
                                  }`}
                              >
                                {mode.tag}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{mode.label}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{mode.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="mt-2.5 pt-1.5 border-t border-emerald-200 flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Chosen Transport</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="wizard-option-card p-4 rounded-2xl border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Optimal Season:</strong> {selectedDestination.bestMonths} is the ideal time to travel to {selectedDestination.name} with {selectedDestination.climate}.
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 4: TRAVELLERS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                    Companion Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(['Solo', 'Couple', 'Friends', 'Family', 'Group'] as TravelCompanion[]).map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => {
                          setCompanionType(comp);
                          if (comp === 'Solo') setTravellersCount(1);
                          else if (comp === 'Couple') setTravellersCount(2);
                          else if (comp === 'Friends' && travellersCount < 3) setTravellersCount(3);
                        }}
                        className={`wizard-option-btn p-3.5 rounded-2xl border-2 text-center transition-all ${companionType === comp
                            ? 'is-selected border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                          }`}
                      >
                        <span className="text-xl block mb-1">
                          {comp === 'Solo' && '🎒'}
                          {comp === 'Couple' && '💑'}
                          {comp === 'Friends' && '🏄‍♂️'}
                          {comp === 'Family' && '👨‍👩‍👧‍👦'}
                          {comp === 'Group' && '🚌'}
                        </span>
                        <span className="text-xs font-bold">{comp}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Travellers */}
                <div className="wizard-option-card flex items-center justify-between p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Total Travellers</h4>
                    <p className="text-xs text-slate-500">How many people are going on this trip?</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateTravellerCount(travellersCount - 1)}
                      disabled={travellersCount <= 1}
                      className="wizard-option-btn w-9 h-9 rounded-xl border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-base font-extrabold text-slate-900 w-6 text-center">
                      {travellersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateTravellerCount(travellersCount + 1)}
                      disabled={travellersCount >= 12}
                      className="wizard-option-btn w-9 h-9 rounded-xl border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Group Synergy Preview */}
                {(companionType === 'Friends' || companionType === 'Group') && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-emerald-950">Group Synergy Enabled</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800">
                        {groupMembers.length} Friend Profiles
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                      RoamAI will compute individual interest compatibility and balance adventure, food, and nightlife so no one gets left out.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: BUDGET */}
            {currentStep === 5 && (() => {
              const minNeededBudget = calculateTierBudget('Budget', selectedDestination, durationDays, travellersCount, travelMode, currentRouteDetails.distanceKm);
              const maxBudgetCap = Math.max(minNeededBudget + 20000, calculateTierBudget('Luxury', selectedDestination, durationDays, travellersCount, travelMode, currentRouteDetails.distanceKm) * 1.25);
              const currentTransitCost = getTravelModeTransitCost(travelMode, budgetTier, durationDays, travellersCount, currentRouteDetails.distanceKm);
              const groundRemaining = Math.max(0, customBudget - currentTransitCost);
              const staysPortion = Math.round(groundRemaining * 0.45);
              const foodPortion = Math.round(groundRemaining * 0.35);
              const activitiesPortion = Math.round(groundRemaining * 0.20);
              const transitPercent = Math.min(100, Math.round((currentTransitCost / customBudget) * 100));

              return (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Mode of Travel Impact Callout */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {travelMode === 'Flight' ? '✈️' : travelMode === 'Train' ? '🚆' : travelMode === 'Car / Road Trip' ? '🚗' : travelMode === 'Bus' ? '🚌' : travelMode === 'Bike / Motorcycle' ? '🏍️' : '🚙'}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                              Budget Calibrated for {travelMode} ({effectiveStartCity} ➔ {selectedDestination.name})
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                              {travellersCount} {travellersCount === 1 ? 'Traveller' : 'Travellers'}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            {travelMode === 'Flight' && `Includes roundtrip airfares + airport cab transfers for ${travellersCount} pax.`}
                            {travelMode === 'Train' && `Includes express rail reservations + local station transit for ${travellersCount} pax.`}
                            {travelMode === 'Car / Road Trip' && `Includes highway fuel (${currentRouteDetails.distanceKm * 2} km RT) + FASTag toll allocation across ${travellersCount} pax.`}
                            {travelMode === 'Bus' && `Includes AC Volvo sleeper intercity fares for ${travellersCount} pax.`}
                            {travelMode === 'Bike / Motorcycle' && `Includes bike rental + fuel for ${Math.ceil(travellersCount / 2)} motorcycle(s) over ${durationDays} days.`}
                            {travelMode === 'Self-Drive Rental' && `Includes self-drive SUV rental + fuel for ${durationDays} days.`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-800 block">Est. Transit</span>
                        <span className="text-sm font-extrabold text-emerald-950">₹{currentTransitCost.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Quick Mode Switcher in Budget Step */}
                    <div className="pt-2 border-t border-emerald-200/60">
                      <span className="text-[10px] font-bold text-emerald-900 block mb-1.5 uppercase tracking-wider">
                        Switch Mode of Travel to Compare:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {TRAVEL_MODES.map((m) => {
                          const isCurrent = travelMode === m.id;
                          const modeCost = calculateTierBudget(budgetTier, selectedDestination, durationDays, travellersCount, m.id, currentRouteDetails.distanceKm);
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setTravelMode(m.id);
                                setCustomBudget(modeCost);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${isCurrent
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-white/80 hover:bg-white text-slate-700 border border-emerald-200/80 hover:border-emerald-300'
                                }`}
                            >
                              <span>{m.icon}</span>
                              <span>{m.label}</span>
                              <span className={`text-[10px] ml-0.5 ${isCurrent ? 'text-emerald-200' : 'text-slate-500'}`}>
                                (₹{modeCost.toLocaleString()})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Budget Tier
                      </label>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Min for {selectedDestination.name} ({durationDays}D, {travelMode}): ₹{minNeededBudget.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(
                        [
                          { tier: 'Budget', icon: '🪙', note: 'Hostels, local food & economical transit', label: 'Minimum Needed' },
                          { tier: 'Moderate', icon: '💳', note: 'Boutique stays & comfortable transit', label: 'Standard' },
                          { tier: 'Premium', icon: '💎', note: 'Resorts & upgraded travel', label: 'Upgraded' },
                          { tier: 'Luxury', icon: '👑', note: '5-star villas & premier travel', label: 'All-Inclusive' }
                        ] as { tier: BudgetTier; icon: string; note: string; label: string }[]
                      ).map((b) => {
                        const tierAmount = calculateTierBudget(b.tier, selectedDestination, durationDays, travellersCount, travelMode, currentRouteDetails.distanceKm);
                        const isSelected = budgetTier === b.tier;
                        return (
                          <button
                            key={b.tier}
                            type="button"
                            onClick={() => {
                              setBudgetTier(b.tier);
                              setCustomBudget(tierAmount);
                            }}
                            className={`wizard-option-btn p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${isSelected
                                ? 'is-selected border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                              }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-2xl block">{b.icon}</span>
                                {b.tier === 'Budget' && (
                                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                    Min
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold">{b.tier}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{b.note}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                              <span className="text-[10px] text-slate-500 font-semibold">{b.label}</span>
                              <span className="text-xs font-extrabold" style={{ color: '#003f6d' }}>
                                ₹{tierAmount.toLocaleString()}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Approximate Total Budget Input */}
                  <div className="wizard-option-card p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block">
                          Total Trip Budget (INR ₹)
                        </label>
                        <p className="text-[11px] text-slate-500">
                          {budgetTier === 'Budget'
                            ? `Calculated baseline minimum required for ${selectedDestination.name} with ${travelMode} over ${durationDays} days.`
                            : `Adjust your planned spending cap across travel, stays, food & activities.`}
                        </p>
                      </div>
                      <span className="font-extrabold text-emerald-700" style={{ fontSize: '21px' }}>
                        ₹{customBudget.toLocaleString()} Total
                      </span>
                    </div>

                    <input
                      type="range"
                      min={minNeededBudget}
                      max={maxBudgetCap}
                      step={1000}
                      value={Math.max(minNeededBudget, customBudget)}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="font-semibold text-emerald-900">₹{minNeededBudget.toLocaleString()} (Minimum)</span>
                      <span style={{ fontSize: '20px', color: '#0369a1' }}>₹{Math.round(customBudget / travellersCount).toLocaleString()} / person</span>
                      <span style={{ color: '#0369a1' }}>₹{Math.round(maxBudgetCap).toLocaleString()}</span>
                    </div>

                    {/* Estimated Cost Breakdown Bar & Chips */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Estimated Spending Allocation:</span>
                        <span className="text-slate-500 font-semibold">{durationDays} Days / {travellersCount} Travellers</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-100">
                          <div className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#003f6d' }}>
                            <span>{travelMode === 'Flight' ? '✈️' : travelMode === 'Train' ? '🚆' : travelMode === 'Car / Road Trip' ? '🚗' : travelMode === 'Bus' ? '🚌' : travelMode === 'Bike / Motorcycle' ? '🏍️' : '🚙'}</span>
                            <span style={{ color: '#003f6d' }}>{travelMode} Transit ({transitPercent}%)</span>
                          </div>
                          <div className="text-xs font-extrabold mt-0.5" style={{ color: '#003f6d' }}>
                            <span style={{ color: '#003f6d' }}>₹{currentTransitCost.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-indigo-50/80 border border-indigo-100">
                          <div className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#003f6d' }}>
                            <span>🏨</span>
                            <span style={{ color: '#003f6d' }}>Stays & Hotels</span>
                          </div>
                          <div className="text-xs font-extrabold mt-0.5" style={{ color: '#003f6d' }}>
                            <span style={{ color: '#003f6d' }}>₹{staysPortion.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-100">
                          <div className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#003f6d' }}>
                            <span>🍽️</span>
                            <span style={{ color: '#003f6d' }}>Food & Dining</span>
                          </div>
                          <div className="text-xs font-extrabold mt-0.5" style={{ color: '#003f6d' }}>
                            <span style={{ color: '#003f6d' }}>₹{foodPortion.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-100">
                          <div className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#003f6d' }}>
                            <span>🎟️</span>
                            <span style={{ color: '#003f6d' }}>Activities & Sights</span>
                          </div>
                          <div className="text-xs font-extrabold mt-0.5" style={{ color: '#003f6d' }}>
                            <span style={{ color: '#003f6d' }}>₹{activitiesPortion.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* STEP 6: TRAVELLER PERSONALITY & PREFERENCES */}
            {currentStep === 6 && (() => {
              const totalSelectedCount =
                selectedStyles.length +
                (travelPace ? 1 : 0) +
                (foodPreference ? 1 : 0) +
                (alcoholPreference ? 1 : 0) +
                selectedAvoidances.length;

              return (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-7"
                >
                  {/* Preferences Header & Clear Button */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">
                        {totalSelectedCount === 0
                          ? 'All questions are optional — tap any choice to customize your AI plan'
                          : `${totalSelectedCount} preference${totalSelectedCount > 1 ? 's' : ''} customized`}
                      </span>
                    </div>
                    {totalSelectedCount > 0 && (
                      <button
                        type="button"
                        onClick={clearAllStep6Preferences}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        Clear All Choices
                      </button>
                    )}
                  </div>

                  {/* 1. Travel Style */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span>1. Travel Style</span>
                        <span className="text-[10px] font-normal text-slate-500 lowercase">(select any vibes)</span>
                      </label>
                      {selectedStyles.length > 0 && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {selectedStyles.length} selected
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {TRAVEL_STYLES.map((style) => {
                        const isSelected = selectedStyles.includes(style.id);
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => toggleStyle(style.id)}
                            className={`wizard-option-btn p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${isSelected
                                ? 'is-selected border-emerald-600 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500/20'
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white font-medium hover:bg-slate-50/50'
                              }`}
                          >
                            <span className="text-lg shrink-0 mt-0.5">{style.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold block">{style.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                              </div>
                              <span className="text-[10px] text-slate-500 block leading-tight whitespace-normal mt-0.5">
                                {style.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Travel Pace & 3. Food Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Travel Pace */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          2. Travel Pace
                        </label>
                        {travelPace && (
                          <button
                            type="button"
                            onClick={() => setTravelPace(null)}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Relaxed', 'Balanced', 'Packed'] as TravelPace[]).map((pace) => {
                          const isSelected = travelPace === pace;
                          return (
                            <button
                              key={pace}
                              type="button"
                              onClick={() => togglePace(pace)}
                              className={`wizard-option-btn py-2.5 px-3 rounded-xl border text-center text-xs transition-all cursor-pointer whitespace-normal ${isSelected
                                  ? 'is-selected border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/20'
                                  : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white font-medium'
                                }`}
                            >
                              {pace}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Food Preference */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          3. Food Preference
                        </label>
                        {foodPreference && (
                          <button
                            type="button"
                            onClick={() => setFoodPreference(null)}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Vegetarian', 'Non-vegetarian', 'Vegan', 'No preference'] as FoodPreference[]).map(
                          (food) => {
                            const isSelected = foodPreference === food;
                            return (
                              <button
                                key={food}
                                type="button"
                                onClick={() => toggleFood(food)}
                                className={`wizard-option-btn py-2.5 px-3 rounded-xl border text-center text-xs transition-all cursor-pointer whitespace-normal break-words flex items-center justify-center min-h-[42px] ${isSelected
                                    ? 'is-selected border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/20'
                                    : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white font-medium'
                                  }`}
                              >
                                <span className="leading-snug text-center">{food}</span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. Alcohol Question */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        4. Do you drink alcohol?
                      </label>
                      {alcoholPreference && (
                        <button
                          type="button"
                          onClick={() => setAlcoholPreference(null)}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Yes', 'Occasionally', 'No'] as AlcoholPreference[]).map((alc) => {
                        const isSelected = alcoholPreference === alc;
                        return (
                          <button
                            key={alc}
                            type="button"
                            onClick={() => toggleAlcohol(alc)}
                            className={`wizard-option-btn py-2.5 px-4 rounded-xl border text-center text-xs transition-all cursor-pointer whitespace-normal ${isSelected
                                ? 'is-selected border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/20'
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white font-medium'
                              }`}
                          >
                            {alc}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Avoidances */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span>5. Anything you want to avoid?</span>
                        <span className="text-[10px] font-normal text-slate-500 lowercase">(optional)</span>
                      </label>
                      {selectedAvoidances.length > 0 && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          {selectedAvoidances.length} selected
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {AVOIDANCES.map((avoid) => {
                        const isSelected = selectedAvoidances.includes(avoid);
                        return (
                          <button
                            key={avoid}
                            type="button"
                            onClick={() => toggleAvoidance(avoid)}
                            className={`wizard-option-btn p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${isSelected
                                ? 'is-selected border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white font-medium'
                              }`}
                          >
                            <span className="leading-snug break-words flex-1">{avoid}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* Bottom Actions Sticky Floating Bar */}
        <div className="sticky bottom-4 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/80 dark:border-white/20 shadow-2xl flex items-center justify-between gap-4 mt-6">
          {currentStep > 1 ? (
            <button
              id="wizard-back-btn"
              type="button"
              onClick={handleBack}
              className="px-5 sm:px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              ← Back
            </button>
          ) : (
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {selectedDestinationPlace
                  ? 'Destination selected! Click Continue to configure trip details.'
                  : 'Search and select any place or address above to proceed.'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
            <button
              id="wizard-continue-btn"
              type="button"
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedDestinationPlace}
              className={`px-6 sm:px-9 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 border ${currentStep === 1 && !selectedDestinationPlace
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 border-emerald-400/40 hover:scale-102 active:scale-98 cursor-pointer'
                }`}
            >
              <span>{currentStep === totalSteps ? 'Generate AI Itinerary' : 'Continue →'}</span>
              {currentStep === totalSteps ? (
                <Sparkles className="w-4 h-4 text-emerald-200" />
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
