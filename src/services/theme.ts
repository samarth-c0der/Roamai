import { ThemeConfig, ThemeId } from '../types';

export const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: 'beach',
    name: 'Beach Theme',
    vibe: 'Crystal Seashore & Ocean Waves',
    tagline: 'Coastal surf and sun',
    icon: '🏖️',
    primaryColor: '#0284c7', // sky-600 ocean blue
    secondaryColor: '#0d9488', // teal-600 aqua
    accentColor: '#f59e0b', // amber-500 golden sun
    canvasBg: '#f4fbfe',
    canvasTint: 'linear-gradient(180deg, #e0f2fe 0%, #f4fbfe 280px, #f4fbfe 100%)',
    cardBg: '#ffffff',
    cardBorder: '#dbeafe',
    optionBg: '#f8fbff',
    optionHoverBg: '#e0f2fe',
    optionSelectedBg: '#bae6fd',
    optionBorder: '#7dd3fc',
    bgSubtle: '#e0f2fe',
    borderSubtle: '#bae6fd',
    taglineColor: '#075985',
    heroGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 50%, #f59e0b 100%)',
    heroBannerBg: 'linear-gradient(180deg, rgba(224, 242, 254, 0.30) 0%, rgba(204, 251, 241, 0.10) 55%, #f4fbfe 100%)',
    heroAtmosphereGlow: 'radial-gradient(ellipse at 50% 32%, rgba(2, 132, 199, 0.20) 0%, rgba(13, 148, 136, 0.15) 40%, rgba(245, 158, 11, 0.10) 70%, transparent 100%)',
    vibeTextGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 50%, #f59e0b 100%)',
    heroBadgeBg: 'rgba(224, 242, 254, 0.85)',
    heroBadgeBorder: 'rgba(186, 230, 253, 0.75)',
    heroBadgeText: '#0369a1',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    activeRingClass: 'ring-sky-500 border-sky-500',
    primaryBtnClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
    secondaryBtnClass: 'bg-sky-50 text-sky-800 hover:bg-sky-100',
    textAccentClass: 'text-sky-600',
    swatches: ['#0284c7', '#0d9488', '#f59e0b', '#f4fbfe'],
    isDark: false,
    heroPhotoUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=90&w=2400&auto=format&fit=crop',
    heroPhotoPosition: 'center 50%',
    heroPhotoTag: '🌊 Crystal Seashore & Foaming Ocean Surf • 29°C',
    heroFloatingPhotos: [
      { url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=85&w=800&auto=format&fit=crop', title: 'Seashore Surf & Foam', location: 'Golden Sand Shore • 29°C' },
      { url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=85&w=800&auto=format&fit=crop', title: 'Turquoise Seashore', location: 'Crystal Water Line • 28°C' }
    ],
    previewTrip: {
      title: 'Goa Coastal & Seashore Escape',
      image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=90&w=1200&auto=format&fit=crop',
      subtitle: '4 Days • 3 Travellers • Coastal Sun',
      budget: '₹30,000 Budget',
      temp: '29°C ☀️',
      day1Title: 'Day 1 • Arrival & Sunset Highlights',
      activity1: { time: '04:30 PM', title: 'Anjuna Beach Sunset & Coconut Mocktails', category: 'Relaxation', cost: '₹500' },
      activity2: { time: '07:30 PM', title: 'Curlies Beach Shack Fresh Seafood & Music', category: 'Food', cost: '₹1,800' }
    }
  },
  {
    id: 'mountain',
    name: 'Green Mountain Theme',
    vibe: 'Lush Green Mountain Slopes & Emerald Peaks',
    tagline: 'Lush green mountain peaks & valley',
    icon: '🌿',
    primaryColor: '#059669', // emerald-600
    secondaryColor: '#047857', // emerald-700
    accentColor: '#10b981', // emerald-500
    canvasBg: '#f2fbf6',
    canvasTint: 'linear-gradient(180deg, #ecfdf5 0%, #f2fbf6 280px, #f8fafc 100%)',
    cardBg: '#ffffff',
    cardBorder: '#d1fae5',
    optionBg: '#f0fdf4',
    optionHoverBg: '#dcfce7',
    optionSelectedBg: '#bbf7d0',
    optionBorder: '#86efac',
    bgSubtle: '#ecfdf5',
    borderSubtle: '#a7f3d0',
    taglineColor: '#065f46',
    heroGradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
    heroBannerBg: 'linear-gradient(180deg, rgba(236, 253, 245, 0.35) 0%, rgba(240, 253, 244, 0.12) 55%, #f2fbf6 100%)',
    heroAtmosphereGlow: 'radial-gradient(ellipse at 50% 32%, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.18) 40%, rgba(4, 120, 87, 0.10) 70%, transparent 100%)',
    vibeTextGradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
    heroBadgeBg: 'rgba(220, 252, 231, 0.90)',
    heroBadgeBorder: 'rgba(167, 243, 208, 0.85)',
    heroBadgeText: '#065f46',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    activeRingClass: 'ring-emerald-500 border-emerald-500',
    primaryBtnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    secondaryBtnClass: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
    textAccentClass: 'text-emerald-600',
    swatches: ['#059669', '#10b981', '#047857', '#ecfdf5'],
    isDark: false,
    heroPhotoUrl: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/6/2025/03/24213648/manali-tourist-places-fi.jpeg',
    heroPhotoPosition: 'center 45%',
    heroPhotoTag: '🌿 100% Lush Emerald Green Mountain Peaks • 4K Ultra HD',
    heroFloatingPhotos: [
      { url: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/6/2025/03/24213648/manali-tourist-places-fi.jpeg', title: 'Lush Green Mountain', location: 'Emerald Ridge • 2,200m' },
      { url: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/6/2025/03/24213648/manali-tourist-places-fi.jpeg', title: 'Green Forest Valley', location: 'Pine Slopes • 2,050m' }
    ],
    previewTrip: {
      title: 'Manali Alpine & Summit Escape',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=90&w=1200&auto=format&fit=crop',
      subtitle: '4 Days • 2 Travellers • Alpine Adventure',
      budget: '₹26,000 Budget',
      temp: '15°C 🏔️',
      day1Title: 'Day 1 • Solang Ridge & Cedar Woods Walk',
      activity1: { time: '10:00 AM', title: 'Solang Valley Paragliding & Alpine Panorama', category: 'Adventure', cost: '₹2,500' },
      activity2: { time: '02:30 PM', title: 'Old Manali Riverside Wooden Cafe & Trout', category: 'Food', cost: '₹1,200' }
    }
  },
  {
    id: 'waterfall',
    name: 'Waterfall Theme',
    vibe: 'Cascading Rapids & Emerald Gorge',
    tagline: 'Cascades, rapids and pools',
    icon: '🌊',
    primaryColor: '#06b6d4', // cyan-500
    secondaryColor: '#059669', // emerald-600
    accentColor: '#2563eb', // blue-600
    canvasBg: '#f0faf9',
    canvasTint: 'linear-gradient(180deg, #e0f7f6 0%, #f0faf9 280px, #f0faf9 100%)',
    cardBg: '#ffffff',
    cardBorder: '#ccf1ee',
    optionBg: '#f5fcfb',
    optionHoverBg: '#e6fbf8',
    optionSelectedBg: '#cffafe',
    optionBorder: '#67e8f9',
    bgSubtle: '#e6fbf8',
    borderSubtle: '#a5f3fc',
    taglineColor: '#164e63',
    heroGradient: 'linear-gradient(135deg, #06b6d4 0%, #059669 50%, #2563eb 100%)',
    heroBannerBg: 'linear-gradient(180deg, rgba(207, 250, 254, 0.25) 0%, rgba(209, 250, 229, 0.10) 55%, #f0faf9 100%)',
    heroAtmosphereGlow: 'radial-gradient(ellipse at 50% 32%, rgba(6, 182, 212, 0.20) 0%, rgba(5, 150, 105, 0.15) 40%, rgba(37, 99, 235, 0.10) 70%, transparent 100%)',
    vibeTextGradient: 'linear-gradient(135deg, #06b6d4 0%, #059669 50%, #2563eb 100%)',
    heroBadgeBg: 'rgba(207, 250, 254, 0.85)',
    heroBadgeBorder: 'rgba(103, 232, 249, 0.75)',
    heroBadgeText: '#0e7490',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    activeRingClass: 'ring-cyan-500 border-cyan-500',
    primaryBtnClass: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20',
    secondaryBtnClass: 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100',
    textAccentClass: 'text-cyan-600',
    swatches: ['#06b6d4', '#059669', '#2563eb', '#f0faf9'],
    isDark: false,
    heroPhotoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=90&w=2560&auto=format&fit=crop',
    heroPhotoPosition: 'center 35%',
    heroPhotoTag: '🌊 Cascading Natural Waterfalls & Emerald Canyon Rapids',
    heroFloatingPhotos: [
      { url: 'https://images.unsplash.com/photo-1546271876-af6caec5fae5?q=85&w=800&auto=format&fit=crop', title: 'Athirappilly Cascade', location: 'Natural Waterfall Rapids • 22°C' },
      { url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?q=85&w=800&auto=format&fit=crop', title: 'Forest Plunge Basin', location: 'Lush Moss Gorge • 21°C' }
    ],
    previewTrip: {
      title: 'Athirappilly & Meghalaya Waterfalls',
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=90&w=1200&auto=format&fit=crop',
      subtitle: '5 Days • 2 Travellers • Waterfall Explorer',
      budget: '₹24,000 Budget',
      temp: '22°C 🌊',
      day1Title: 'Day 1 • Living Root Bridges & Cascade Plunge',
      activity1: { time: '09:30 AM', title: 'Nohkalikai Falls Viewpoint & Canyon Mist', category: 'Sightseeing', cost: '₹200' },
      activity2: { time: '01:30 PM', title: 'Bamboo Rafting & Natural Emerald Lagoon Dip', category: 'Adventure', cost: '₹1,500' }
    }
  },
  {
    id: 'trekking',
    name: 'Trekking Theme',
    vibe: 'Forest Trails & Campfire Earth',
    tagline: 'Backcountry trails and summits',
    icon: '🥾',
    primaryColor: '#15803d', // green-700
    secondaryColor: '#b45309', // amber-700
    accentColor: '#65a30d', // lime-600
    canvasBg: '#f5f9f4',
    canvasTint: 'linear-gradient(180deg, #ecfdf3 0%, #f5f9f4 280px, #f5f9f4 100%)',
    cardBg: '#ffffff',
    cardBorder: '#ddede0',
    optionBg: '#f8fbf8',
    optionHoverBg: '#edf8ee',
    optionSelectedBg: '#dcfce7',
    optionBorder: '#86efac',
    bgSubtle: '#edf8ee',
    borderSubtle: '#bbf7d0',
    taglineColor: '#14532d',
    heroGradient: 'linear-gradient(135deg, #15803d 0%, #047857 50%, #b45309 100%)',
    heroBannerBg: 'linear-gradient(180deg, rgba(236, 253, 243, 0.25) 0%, rgba(254, 243, 199, 0.08) 55%, #f5f9f4 100%)',
    heroAtmosphereGlow: 'radial-gradient(ellipse at 50% 32%, rgba(21, 128, 61, 0.35) 0%, rgba(180, 83, 9, 0.22) 40%, rgba(101, 163, 13, 0.18) 70%, transparent 100%)',
    vibeTextGradient: 'linear-gradient(135deg, #15803d 0%, #047857 50%, #b45309 100%)',
    heroBadgeBg: 'rgba(220, 252, 231, 0.85)',
    heroBadgeBorder: 'rgba(187, 247, 208, 0.75)',
    heroBadgeText: '#166534',
    badgeClass: 'bg-green-50 text-green-800 border-green-200',
    activeRingClass: 'ring-green-600 border-green-600',
    primaryBtnClass: 'bg-green-700 hover:bg-green-800 text-white shadow-green-700/20',
    secondaryBtnClass: 'bg-green-50 text-green-800 hover:bg-green-100',
    textAccentClass: 'text-green-700',
    swatches: ['#15803d', '#b45309', '#65a30d', '#f5f9f4'],
    isDark: false,
    heroPhotoUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=90&w=2400&auto=format&fit=crop',
    heroPhotoPosition: 'center 36%',
    heroPhotoTag: '🥾 Highland Ridge Trail • 2,100m',
    heroFloatingPhotos: [
      { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=85&w=800&auto=format&fit=crop', title: 'Highland Trail', location: 'Western Ghats • 2,100m' },
      { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=85&w=800&auto=format&fit=crop', title: 'Bamboo Ridge', location: 'Wayanad Forest • 18°C' }
    ],
    previewTrip: {
      title: 'Wayanad & Chembra Peak Trek',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=90&w=1200&auto=format&fit=crop',
      subtitle: '3 Days • Solo/Duo • Backpacker Vibe',
      budget: '₹16,000 Budget',
      temp: '18°C 🥾',
      day1Title: 'Day 1 • Bamboo Canopy Trail & Base Camp',
      activity1: { time: '08:00 AM', title: 'Chembra Peak Heart Lake Forest Trek', category: 'Adventure', cost: '₹750' },
      activity2: { time: '06:00 PM', title: 'Rustic Campfire Dinner & Spice Plantation Walk', category: 'Relaxation', cost: '₹1,100' }
    }
  },
  {
    id: 'snow',
    name: 'Snow Theme',
    vibe: 'Glacial Ice & Arctic Frost',
    tagline: 'Powder snow and peaks',
    icon: '❄️',
    primaryColor: '#0ea5e9', // sky-500 glacial ice
    secondaryColor: '#6366f1', // indigo-500 aurora
    accentColor: '#38bdf8', // sky-400 diamond frost
    canvasBg: '#f4f8fd',
    canvasTint: 'linear-gradient(180deg, #eef2ff 0%, #f4f8fd 280px, #f4f8fd 100%)',
    cardBg: '#ffffff',
    cardBorder: '#d9e8fb',
    optionBg: '#f9fbff',
    optionHoverBg: '#ebf4ff',
    optionSelectedBg: '#e0f2fe',
    optionBorder: '#7dd3fc',
    bgSubtle: '#eef6ff',
    borderSubtle: '#bfdbfe',
    taglineColor: '#0c4a6e',
    heroGradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #38bdf8 100%)',
    heroBannerBg: 'linear-gradient(180deg, rgba(238, 246, 255, 0.25) 0%, rgba(240, 249, 255, 0.10) 55%, #f4f8fd 100%)',
    heroAtmosphereGlow: 'radial-gradient(ellipse at 50% 32%, rgba(14, 165, 233, 0.35) 0%, rgba(99, 102, 241, 0.25) 40%, rgba(56, 189, 248, 0.2) 70%, transparent 100%)',
    vibeTextGradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #0284c7 100%)',
    heroBadgeBg: 'rgba(224, 242, 254, 0.85)',
    heroBadgeBorder: 'rgba(186, 230, 253, 0.75)',
    heroBadgeText: '#0369a1',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    activeRingClass: 'ring-sky-500 border-sky-500',
    primaryBtnClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
    secondaryBtnClass: 'bg-sky-50 text-sky-800 hover:bg-sky-100',
    textAccentClass: 'text-sky-600',
    swatches: ['#0ea5e9', '#6366f1', '#38bdf8', '#f4f8fd'],
    isDark: false,
    heroPhotoUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=90&w=2400&auto=format&fit=crop',
    heroPhotoPosition: 'center 35%',
    heroPhotoTag: '❄️ Snow-Capped Alpine Mountain Summit • -6°C',
    heroFloatingPhotos: [
      { url: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=85&w=800&auto=format&fit=crop', title: 'Mt. Apharwat Snow Peak', location: 'Gulmarg Glacier • 4,390m' },
      { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=85&w=800&auto=format&fit=crop', title: 'Snow Mountain Ridge', location: 'Himalayan Ridge • -5°C' }
    ],
    previewTrip: {
      title: 'Gulmarg Snow Peak & Alpine Ski Escapade',
      image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=90&w=1200&auto=format&fit=crop',
      subtitle: '4 Days • 2 Travellers • Snow Mountain',
      budget: '₹34,000 Budget',
      temp: '-3°C ❄️',
      day1Title: 'Day 1 • Gondola Phase II & Powder Run',
      activity1: { time: '10:00 AM', title: 'Gulmarg Gondola Ride to Mt. Apharwat', category: 'Adventure', cost: '₹2,100' },
      activity2: { time: '03:00 PM', title: 'Warm Kashmiri Kahwa & Wood-fired Pizza at Highlands', category: 'Food', cost: '₹950' }
    }
  }
];

export const DEFAULT_THEME_ID: ThemeId = 'mountain';

export function getTheme(id: ThemeId): ThemeConfig {
  return THEME_OPTIONS.find((t) => t.id === id) || THEME_OPTIONS[0];
}

export function getSavedThemeId(): ThemeId {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('roamai_theme_id') as ThemeId;
    if (saved && THEME_OPTIONS.some((t) => t.id === saved)) {
      return saved;
    }
  }
  return DEFAULT_THEME_ID;
}

export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-canvas-bg', theme.canvasBg);
  root.style.setProperty('--color-canvas-tint', theme.canvasTint);
  root.style.setProperty('--color-card-bg', theme.cardBg);
  root.style.setProperty('--color-card-border', theme.cardBorder);
  root.style.setProperty('--color-option-bg', theme.optionBg);
  root.style.setProperty('--color-option-hover', theme.optionHoverBg);
  root.style.setProperty('--color-option-selected-bg', theme.optionSelectedBg);
  root.style.setProperty('--color-option-border', theme.optionBorder);
  root.style.setProperty('--color-bg-subtle', theme.bgSubtle);
  root.style.setProperty('--color-border-subtle', theme.borderSubtle);
  root.style.setProperty('--gradient-hero', theme.heroGradient);
  if (theme.heroBannerBg) root.style.setProperty('--hero-banner-bg', theme.heroBannerBg);
  if (theme.heroAtmosphereGlow) root.style.setProperty('--hero-atmosphere-glow', theme.heroAtmosphereGlow);
  if (theme.vibeTextGradient) root.style.setProperty('--vibe-text-gradient', theme.vibeTextGradient);
  if (theme.heroBadgeBg) root.style.setProperty('--hero-badge-bg', theme.heroBadgeBg);
  if (theme.heroBadgeBorder) root.style.setProperty('--hero-badge-border', theme.heroBadgeBorder);
  if (theme.heroBadgeText) root.style.setProperty('--hero-badge-text', theme.heroBadgeText);
  if (theme.taglineColor) {
    root.style.setProperty('--color-tagline-text', theme.isDark ? '#e2e8f0' : theme.taglineColor);
  }
  root.setAttribute('data-theme', theme.id);
  
  // Set background color directly on html and body for smooth transitions
  root.style.backgroundColor = theme.canvasBg;
  if (document.body) {
    document.body.setAttribute('data-theme', theme.id);
    document.body.style.backgroundColor = theme.canvasBg;
    if (theme.isDark) {
      document.body.classList.add('theme-dark');
      root.classList.add('dark');
      root.setAttribute('data-theme-mode', 'dark');
      document.body.setAttribute('data-theme-mode', 'dark');
      root.style.setProperty('--color-text-main', '#f8fafc');
      root.style.setProperty('--color-text-secondary', '#cbd5e1');
      root.style.setProperty('--color-text-muted', '#94a3b8');
      root.style.colorScheme = 'dark';
    } else {
      document.body.classList.remove('theme-dark');
      root.classList.remove('dark');
      root.setAttribute('data-theme-mode', 'light');
      document.body.setAttribute('data-theme-mode', 'light');
      root.style.setProperty('--color-text-main', '#0f172a');
      root.style.setProperty('--color-text-secondary', '#334155');
      root.style.setProperty('--color-text-muted', '#64748b');
      root.style.colorScheme = 'light';
    }
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('roamai_theme_id', theme.id);
    } catch {
      // ignore
    }
  }
}
