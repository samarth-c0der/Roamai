import { Activity, TravelStyle } from '../types';

export interface AlternativePlaceOption {
  id: string;
  title: string;
  category: Activity['category'];
  location: string;
  estimatedCost: number;
  duration: string;
  description: string;
  imageUrl: string;
  recommendationReason: string;
  rating: number;
  tags: string[];
  matchScore: number; // e.g. 96 (%)
  badge?: string; // e.g. "Hidden Gem", "Sunset Favorite", "Locals Pick", "Budget Save"
  vibe: string;
}

// Curated database of high-quality alternative spots across destinations and categories
export const DESTINATION_ALTERNATIVES: Record<string, AlternativePlaceOption[]> = {
  goa: [
    {
      id: 'alt-goa-1',
      title: 'Hidden Portuguese Bakery & Espresso Yard',
      category: 'Food',
      location: 'Fontainhas, Panaji',
      estimatedCost: 450,
      duration: '1.5 hours',
      description: 'A secluded 120-year-old courtyard serving freshly baked pastel de nata, artisan cold brews, and cardamom poi.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Perfect uncrowded morning spot with authentic heritage architecture and artisan breakfast.',
      rating: 4.8,
      tags: ['Pastries & Coffee', 'Heritage Courtyard', 'Quiet Vibe'],
      matchScore: 97,
      badge: 'Hidden Gem',
      vibe: 'Cozy & Aesthetic'
    },
    {
      id: 'alt-goa-2',
      title: 'Secret Cola Beach Freshwater Lagoon & Kayak',
      category: 'Adventure',
      location: 'South Goa Coast',
      estimatedCost: 800,
      duration: '2.5 hours',
      description: 'An emerald lagoon fed by fresh mountain streams right on the edge of the Arabian Sea with wooden kayak rentals.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Escapes tourist crowds with tranquil nature, swimming, and scenic kayak routes under palms.',
      rating: 4.9,
      tags: ['Lagoon Kayaking', 'Wild Beach', 'Freshwater Dip'],
      matchScore: 98,
      badge: 'Top Rated',
      vibe: 'Scenic & Peaceful'
    },
    {
      id: 'alt-goa-3',
      title: 'Artisan Organic Spice Plantation & Herbal Tasting',
      category: 'Sightseeing',
      location: 'Ponda Valley',
      estimatedCost: 600,
      duration: '2 hours',
      description: 'Lush guided walk tasting freshly harvested vanilla, cinnamon, and botanical teas followed by an organic buffet.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Shaded, relaxing experience matching your taste for natural sights and authentic regional food.',
      rating: 4.7,
      tags: ['Spice Walk', 'Organic Buffet', 'Cool Canopy'],
      matchScore: 94,
      badge: 'Locals Pick',
      vibe: 'Serene Nature'
    },
    {
      id: 'alt-goa-4',
      title: 'Cabo de Rama Cliffside Sunset Picnic',
      category: 'Relaxation',
      location: 'Canacona, South Goa',
      estimatedCost: 0,
      duration: '2 hours',
      description: 'Dramatic sea cliffs overlooking endless azure waters. Watch dolphins play while the sun dips into the ocean.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Panoramic sunset vista with 100% free access and zero commercial noise.',
      rating: 4.9,
      tags: ['Cliffside Sunset', 'Free Entry', 'Photography'],
      matchScore: 99,
      badge: 'Sunset Favorite',
      vibe: 'Romantic & Sunset'
    },
    {
      id: 'alt-goa-5',
      title: 'Morjim Eco-Chiringuito & Organic Seafood Dining',
      category: 'Food',
      location: 'Morjim Beach, North Goa',
      estimatedCost: 1200,
      duration: '2 hours',
      description: 'Barefoot luxury beach shack serving catch-of-the-day grilled with Goan recheado masala and coconut water coolers.',
      imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'High quality food with oceanfront deck seating and chill acoustic music.',
      rating: 4.8,
      tags: ['Catch of the Day', 'Beachfront Deck', 'Craft Cocktails'],
      matchScore: 95,
      badge: 'Foodie Choice',
      vibe: 'Chill Coastal'
    },
    {
      id: 'alt-goa-6',
      title: 'Divar Island Heritage Cycling Expedition',
      category: 'Culture',
      location: 'Divar Island, Mandovi River',
      estimatedCost: 950,
      duration: '3 hours',
      description: 'Ferry across the river with geared cycles to explore sleepy village lanes, baroque chapels, and paddy views.',
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Active cultural immersion away from commercial strips with friendly island locals.',
      rating: 4.8,
      tags: ['Island Cycling', 'Ferry Ride', 'Historic Chapels'],
      matchScore: 92,
      badge: 'Adventure Pick',
      vibe: 'Active Cultural'
    }
  ],
  manali: [
    {
      id: 'alt-manali-1',
      title: 'Jogini Waterfall Pine Forest Hike',
      category: 'Adventure',
      location: 'Vashisht Village',
      estimatedCost: 0,
      duration: '3 hours',
      description: 'Picturesque mountain trail passing through apple orchards and pine woods leading to cascading sacred falls.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Popular rewarding hike offering spectacular Pir Panjal range panoramas and crisp mountain air.',
      rating: 4.9,
      tags: ['Waterfall Hike', 'Free Trail', 'Pine Forest'],
      matchScore: 98,
      badge: 'Must Visit',
      vibe: 'Himalayan Adventure'
    },
    {
      id: 'alt-manali-2',
      title: 'Old Manali Artisan Woodfired Cafe & Live Jam',
      category: 'Food',
      location: 'Old Manali Club House Road',
      estimatedCost: 650,
      duration: '2 hours',
      description: 'Bohemian wooden cafe overlooking the roaring Manalsu river serving fresh trout, apple crumbles, and mountain herbal tea.',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Classic mountain ambiance with warm fireplace, live acoustic jams, and delicious comfort food.',
      rating: 4.8,
      tags: ['Riverside Cafe', 'Woodfired Oven', 'Live Music'],
      matchScore: 96,
      badge: 'Cafe Vibe',
      vibe: 'Bohemian & Warm'
    },
    {
      id: 'alt-manali-3',
      title: 'Naggar Castle & Roerich Art Gallery Stroll',
      category: 'Culture',
      location: 'Naggar Valley',
      estimatedCost: 350,
      duration: '2.5 hours',
      description: 'Ancient Himalayan timber-and-stone fortress with breathtaking views over the Beas river and Himalayan art archives.',
      imageUrl: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Rich historical perspective and scenic architecture outside the crowded central bazaar.',
      rating: 4.7,
      tags: ['Ancient Fortress', 'Panoramic View', 'Art History'],
      matchScore: 93,
      badge: 'Heritage Gem',
      vibe: 'Historic & Inspiring'
    },
    {
      id: 'alt-manali-4',
      title: 'Sethan Village Igloo & Stargazing Meadow',
      category: 'Relaxation',
      location: 'Sethan Valley (Hampta Foothills)',
      estimatedCost: 1100,
      duration: '3 hours',
      description: 'Buddhist high-altitude hamlet offering pristine snowscapes, hot butter tea, and crystal clear night sky views.',
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Unmatched stargazing and tranquility away from conventional tourist routes.',
      rating: 4.9,
      tags: ['Stargazing', 'High Altitude', 'Quiet Hamlet'],
      matchScore: 99,
      badge: 'Unique Experience',
      vibe: 'Astral & Majestic'
    }
  ],
  wayanad: [
    {
      id: 'alt-wayanad-1',
      title: 'Banasura Sagar Bamboo Raft & Island Trail',
      category: 'Adventure',
      location: 'Padinjarathara, Wayanad',
      estimatedCost: 550,
      duration: '2.5 hours',
      description: 'Cruise over Asia’s second largest earth dam on eco-friendly bamboo rafts with misty floating island backdrops.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Gentle water adventure surrounded by misty Western Ghat peaks and cool breeze.',
      rating: 4.8,
      tags: ['Bamboo Raft', 'Earth Dam', 'Island Views'],
      matchScore: 97,
      badge: 'Eco Adventure',
      vibe: 'Misty & Calming'
    },
    {
      id: 'alt-wayanad-2',
      title: 'Kuruva Island River Walk & Herbal Plantation',
      category: 'Sightseeing',
      location: 'Kabini River Basin',
      estimatedCost: 400,
      duration: '2.5 hours',
      description: 'Densely forested evergreen delta with bamboo footbridges, rare orchids, and tranquil river streams.',
      imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Immersive canopy walk with rich biodiversity and peaceful freshwater pools.',
      rating: 4.7,
      tags: ['Forest Walk', 'Kabini Stream', 'Rare Flora'],
      matchScore: 95,
      badge: 'Nature Sanctuary',
      vibe: 'Lush & Refreshing'
    },
    {
      id: 'alt-wayanad-3',
      title: 'Edakkal Prehistoric Rock Engravings & Vista',
      category: 'Culture',
      location: 'Ambikuthi Mala',
      estimatedCost: 300,
      duration: '2 hours',
      description: 'Neolithic age petroglyphs and stone-age cave drawings carved 6,000 years ago perched atop a panoramic mountain.',
      imageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=600&auto=format&fit=crop',
      recommendationReason: 'Fascinating archaeological wonder with rewarding valley views from the high cliff summit.',
      rating: 4.8,
      tags: ['Ancient Caves', 'Archaeology', 'Summit View'],
      matchScore: 92,
      badge: 'Heritage Wonder',
      vibe: 'Mystical & Ancient'
    }
  ]
};

// Generic generator if specific destination alternatives are exhausted or for international/other destinations
export function getAlternativeOptionsForActivity(
  destination: string,
  currentActivity: Activity,
  userStyles: TravelStyle[] = []
): AlternativePlaceOption[] {
  const destKey = destination.toLowerCase().trim();
  const matchedList = DESTINATION_ALTERNATIVES[destKey] || [];

  // Filter out the place itself if matching title
  const filtered = matchedList.filter(
    (alt) => alt.title.toLowerCase() !== currentActivity.title.toLowerCase()
  );

  if (filtered.length >= 3) {
    return filtered;
  }

  // Create context-aware dynamic alternatives
  const fallbackAlternatives: AlternativePlaceOption[] = [
    {
      id: `dyn-alt-${Date.now()}-1`,
      title: `Secret Sunset Vantage Point & Cafe in ${destination}`,
      category: 'Relaxation',
      location: `${destination} Scenic District`,
      estimatedCost: Math.round(currentActivity.estimatedCost * 0.8),
      duration: currentActivity.duration || '2 hours',
      description: `Uncrowded panoramic vantage point with cozy patio seating, iced teas, and sunset view.`,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      recommendationReason: `Personalized alternative tailored to escape dense crowds and enjoy scenic relaxation.`,
      rating: 4.9,
      tags: ['Sunset View', 'Quiet Patio', 'Scenic Spot'],
      matchScore: 98,
      badge: 'Top Alternative',
      vibe: 'Scenic & Chilled'
    },
    {
      id: `dyn-alt-${Date.now()}-2`,
      title: `Artisan Culinary Stroll & Tasting Kitchen`,
      category: 'Food',
      location: `${destination} Heritage Quarter`,
      estimatedCost: Math.round(currentActivity.estimatedCost * 1.1) || 500,
      duration: '2 hours',
      description: `Authentic regional kitchen known among locals for signature tasting platters and farm-fresh ingredients.`,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
      recommendationReason: `High-rated local food alternative matching your preference for quality dining.`,
      rating: 4.8,
      tags: ['Local Tasting', 'Farm Fresh', 'Authentic'],
      matchScore: 96,
      badge: 'Foodie Pick',
      vibe: 'Delicious & Cultural'
    },
    {
      id: `dyn-alt-${Date.now()}-3`,
      title: `Guided Eco Trail & Nature Walk`,
      category: 'Adventure',
      location: `${destination} Nature Reserve`,
      estimatedCost: Math.max(200, Math.round(currentActivity.estimatedCost * 0.9)),
      duration: '2.5 hours',
      description: `Well-marked scenic nature path featuring endemic birds, shady tree groves, and viewpoint halts.`,
      imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop',
      recommendationReason: `Outdoor adventure alternative with fresh air and great photography angles.`,
      rating: 4.7,
      tags: ['Nature Trail', 'Photography', 'Fresh Air'],
      matchScore: 94,
      badge: 'Active & Fresh',
      vibe: 'Adventurous Nature'
    },
    {
      id: `dyn-alt-${Date.now()}-4`,
      title: `Historic Heritage Walk & Local Craft Atelier`,
      category: 'Culture',
      location: `${destination} Old Town`,
      estimatedCost: 300,
      duration: '1.5 hours',
      description: `Intimate walking exploration of local heritage structures, handcraft studios, and historic story spots.`,
      imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=600&auto=format&fit=crop',
      recommendationReason: `Enriching cultural alternative that takes you into the authentic stories and architecture of ${destination}.`,
      rating: 4.8,
      tags: ['Heritage Walk', 'Craft Workshops', 'Architecture'],
      matchScore: 93,
      badge: 'Culture Pick',
      vibe: 'Inspiring & Local'
    }
  ];

  return [...filtered, ...fallbackAlternatives].slice(0, 6);
}
