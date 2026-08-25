import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Luggage,
  RefreshCw,
  Eye,
  ChevronRight,
  Calendar,
  Users,
  MapPin,
  Compass,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

import { ThemeConfig, Trip } from '../types';
import { BeachAudioPill } from './BeachAtmosphere';
import { BeachWavesEffect } from './BeachWavesEffect';
import { SnowAudioPill, SnowfallEffect } from './SnowfallAtmosphere';
import { ThemeHeroBackdrop } from './ThemeHeroBackdrop';
import heroCardImage from '../assets/images/regenerated_image_1787112827232.png';

interface LandingPageProps {
  currentTheme?: ThemeConfig;
  recentTrip?: Trip | null;
  onOpenTrip?: (tripId: string) => void;
  onStartPlanning: (destinationId?: string) => void;
  onOpenThemeModal?: () => void;
  onOpenMapSearch?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentTheme,
  recentTrip,
  onOpenTrip,
  onStartPlanning,
  onOpenThemeModal,
  onOpenMapSearch
}) => {
  const isDark = currentTheme?.isDark ?? false;
  const isBeachTheme = currentTheme?.id === 'beach';
  const isSnowTheme = currentTheme?.id === 'snow';
  const primaryColor = currentTheme?.primaryColor || 'var(--color-primary)';
  const secondaryColor = currentTheme?.secondaryColor || 'var(--color-secondary)';
  const heroGradient = currentTheme?.heroGradient || 'var(--gradient-hero)';
  const heroBannerBg = currentTheme?.heroBannerBg || 'var(--hero-banner-bg)';
  const heroAtmosphereGlow = currentTheme?.heroAtmosphereGlow || 'var(--hero-atmosphere-glow)';
  const vibeTextGradient = currentTheme?.vibeTextGradient || 'var(--vibe-text-gradient)';
  const heroBadgeBg = currentTheme?.heroBadgeBg || 'var(--hero-badge-bg)';
  const heroBadgeBorder = currentTheme?.heroBadgeBorder || 'var(--hero-badge-border)';
  const heroBadgeText = currentTheme?.heroBadgeText || 'var(--hero-badge-text)';

  const preview = currentTheme?.previewTrip || {
    title: 'Personalized AI Journey',
    image: heroCardImage,
    subtitle: 'Tailored Itinerary • Real Coordinates • Live Weather',
    budget: 'Smart Calibrated Budget',
    temp: '26°C ☀️',
    day1Title: 'Day 1 • Arrival & Highlights',
    activity1: { time: '10:00 AM', title: 'Local Heritage Immersion', category: 'Culture', cost: '₹500' },
    activity2: { time: '05:30 PM', title: 'Golden Hour Sunset Vista', category: 'Relaxation', cost: '₹300' }
  };

  const displayTrip = recentTrip;
  const hasUserRecentTrip = Boolean(recentTrip);
  const isUserTrip = hasUserRecentTrip;

  return (
    <div className="min-h-screen transition-colors duration-300 relative bg-transparent">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-white/20 dark:border-white/10 transition-colors duration-300 z-10 bg-transparent"
      >
        {/* Dynamic atmospheric ambient glow behind the headline */}
        <div 
          className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] blur-3xl pointer-events-none rounded-full transition-all duration-500 opacity-40"
          style={{ background: heroAtmosphereGlow }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div 
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-xs transition-colors duration-300 backdrop-blur-md"
                  style={{
                    backgroundColor: heroBadgeBg,
                    border: `1px solid ${heroBadgeBorder}`,
                    color: heroBadgeText
                  }}
                >
                  <Sparkles 
                    className="w-3.5 h-3.5 animate-pulse" 
                    style={{ color: primaryColor }}
                  />
                  <span>{currentTheme?.name || 'Next-Gen AI Travel Companion'}</span>
                </div>

                {/* Beach Theme Ambient Waves Audio Pill */}
                {isBeachTheme && <BeachAudioPill />}

                {/* Snow Theme Snowfall & Alpine Wind Audio Pill */}
                {isSnowTheme && <SnowAudioPill />}
              </div>

              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] transition-colors duration-300"
                style={{ 
                  color: isDark ? '#f8fafc' : '#0f172a',
                  textShadow: isDark 
                    ? '0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' 
                    : '0 1px 10px rgba(255,255,255,0.95), 0 1px 3px rgba(255,255,255,0.9)'
                }}
              >
                <span>Your trip.</span> <br />
                <span 
                  className="bg-clip-text text-transparent font-black transition-all duration-300 inline-block"
                  style={{
                    backgroundImage: vibeTextGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Your vibe.
                </span> <br />
                <span>Your itinerary.</span>
              </h1>

              <p 
                className="text-lg sm:text-xl max-w-xl leading-relaxed font-semibold transition-colors duration-300"
                style={{ 
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  textShadow: isDark 
                    ? '0 2px 10px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)' 
                    : '0 1px 8px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {currentTheme?.tagline || 'Travel that adapts dynamically.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  id="hero-plan-btn"
                  onClick={() => onStartPlanning()}
                  className="px-7 py-3.5 rounded-2xl font-semibold text-base shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98 group cursor-pointer hover:brightness-105"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#ffffff',
                    boxShadow: `0 10px 25px -5px ${primaryColor}40`
                  }}
                >
                  <span className="font-semibold">Plan My Trip</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {onOpenMapSearch && (
                  <button
                    id="hero-map-search-btn"
                    onClick={onOpenMapSearch}
                    className="px-6 py-3.5 rounded-2xl border font-semibold text-base shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer bg-emerald-500/20 hover:bg-emerald-500/30 text-slate-900 dark:text-emerald-300 border-emerald-400/40 backdrop-blur-xl"
                  >
                    <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                    <span>Search Any Place on Maps</span>
                  </button>
                )}
              </div>

              {/* Real-time Adaptation Highlight Micro-badge */}
              <div 
                className="flex flex-wrap items-center gap-3 pt-4 border-t text-xs"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)' }}
              >
                <div 
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-xl border shadow-xs"
                  style={{
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.45)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="font-bold">Dynamic Real-Time Re-routing</span>
                </div>

                <div 
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-xl border shadow-xs"
                  style={{
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.45)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="font-bold">Group Synergy Balancer</span>
                </div>

                <div 
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-xl border shadow-xs"
                  style={{
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.45)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="font-bold">Weather-Adaptive</span>
                </div>
              </div>
            </div>

            {/* Right Column: User's Recently Planned or Demo Itinerary Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                key={currentTheme?.id || 'beach'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl p-5 shadow-2xl relative z-10 text-left transition-colors duration-300 bg-white/35 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/15"
              >
                {/* Destination Hero Header */}
                <div className="relative rounded-2xl overflow-hidden mb-4 h-52 group">
                  <img
                    src={displayTrip?.heroImage || heroCardImage || preview.image}
                    alt={displayTrip?.destination || preview.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.08] saturate-[1.16]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5"
                      style={{
                        backgroundColor: hasUserRecentTrip ? primaryColor : 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        border: hasUserRecentTrip ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {hasUserRecentTrip ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>Recently Planned Itinerary</span>
                        </>
                      ) : (
                        <>
                          <Compass className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                          <span>Curated Demo Itinerary</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-300 font-medium truncate mb-0.5">
                          {displayTrip?.title || preview.title}
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
                          {displayTrip?.destination || 'Goa, India'}
                        </h3>
                      </div>
                      <span className="shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/10 text-white">
                        {displayTrip?.days?.[0]?.weatherForecast ? `${displayTrip.days[0].weatherForecast.temp} ${displayTrip.days[0].weatherForecast.icon}` : preview.temp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trip Metric Badges */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div 
                    className="p-3 rounded-2xl border flex flex-col items-center text-center transition-colors bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/40 dark:border-white/10"
                  >
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">
                      <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                      <span>Duration</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {displayTrip?.durationDays || 4} Days
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-2xl border flex flex-col items-center text-center transition-colors bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/40 dark:border-white/10"
                  >
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">
                      <Users className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                      <span>Travelers</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate max-w-full">
                      {displayTrip?.companionType || 'Friends'} ({displayTrip?.travellersCount || 3})
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-2xl border flex flex-col items-center text-center transition-colors bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/40 dark:border-white/10"
                  >
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold mb-0.5">
                      <Zap className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                      <span>Budget</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {displayTrip?.currency || '₹'}{displayTrip?.targetBudget?.toLocaleString() || '30,000'}
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => {
                    if (hasUserRecentTrip && displayTrip?.id && onOpenTrip) {
                      onOpenTrip(displayTrip.id);
                    } else {
                      onStartPlanning();
                    }
                  }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white cursor-pointer shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>
                    {hasUserRecentTrip && displayTrip?.destination 
                      ? `Open ${displayTrip.destination.split(',')[0]} Itinerary` 
                      : 'Create Your Itinerary'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Core Pillars Section */}
      <section 
        className="py-16 border-b border-white/20 dark:border-white/10 transition-colors duration-300 relative z-10 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ 
                color: isDark ? '#f8fafc' : '#0f172a',
                textShadow: isDark 
                  ? '0 2px 10px rgba(0,0,0,0.8)' 
                  : '0 1px 6px rgba(255,255,255,0.9)'
              }}
            >
              Why travellers choose RoamAI
            </h2>
            <p 
              className="text-sm sm:text-base mt-2 font-medium"
              style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}
            >
              Most tools output a rigid list of places. RoamAI acts as your living travel companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div 
              className="rounded-2xl p-6 border text-left relative group transition-all bg-white/35 dark:bg-slate-900/40 backdrop-blur-2xl border-white/45 dark:border-white/15 shadow-md hover:bg-white/45 dark:hover:bg-slate-900/55 hover:shadow-xl"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform shadow-xs"
                style={{
                  backgroundColor: `${primaryColor}25`,
                  color: primaryColor
                }}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Personalized</h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 leading-relaxed font-medium">
                “Built around your interests, budget and travel style.”
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-white/30 dark:border-white/10">
                Matches food diets, alcohol preference, daily stamina, and multi-friend group compatibility scores.
              </p>
            </div>

            {/* Pillar 2 */}
            <div 
              className="rounded-2xl p-6 border text-left relative group transition-all bg-white/35 dark:bg-slate-900/40 backdrop-blur-2xl border-white/45 dark:border-white/15 shadow-md hover:bg-white/45 dark:hover:bg-slate-900/55 hover:shadow-xl"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform shadow-xs"
                style={{
                  backgroundColor: `${secondaryColor}25`,
                  color: secondaryColor
                }}
              >
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Adaptive</h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 leading-relaxed font-medium">
                “Your itinerary changes when your plans change.”
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-white/30 dark:border-white/10">
                Woke up late? Sudden rain shower? Want to spend less? 1-tap re-optimizes your whole schedule in seconds.
              </p>
            </div>

            {/* Pillar 3 */}
            <div 
              className="rounded-2xl p-6 border text-left relative group transition-all bg-white/35 dark:bg-slate-900/40 backdrop-blur-2xl border-white/45 dark:border-white/15 shadow-md hover:bg-white/45 dark:hover:bg-slate-900/55 hover:shadow-xl"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform shadow-xs"
                style={{
                  backgroundColor: `${primaryColor}25`,
                  color: primaryColor
                }}
              >
                <Luggage className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Prepared</h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 leading-relaxed font-medium">
                “Know what to pack, book and prepare before you leave.”
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-white/30 dark:border-white/10">
                Weather-smart packing lists, official government permit warnings, booking checklists & clothing advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Product Loop: PLAN -> PREPARE -> TRAVEL -> ADAPT */}
      <section 
        className="py-16 text-white relative overflow-hidden z-10 border-b border-white/20 dark:border-white/10 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-black/40 backdrop-blur-md border border-white/30 text-white"
            >
              The Complete Travel Lifecycle
            </div>
            <h2 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md"
            >
              From daydreaming to on-the-ground reality
            </h2>
            <p className="text-white/90 text-sm mt-2 font-medium drop-shadow-xs">
              How RoamAI stays with you across every stage of your trip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Step 1 */}
            <div className="bg-black/35 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 dark:border-white/15 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold tracking-wider" style={{ color: primaryColor }}>STEP 01</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white"
                >
                  PLAN
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Vibe & Group Quiz</h3>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Define your pace, food preferences, alcohol habits, and travel personality. Group harmony engine calculates everyone's match.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-black/35 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 dark:border-white/15 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold tracking-wider" style={{ color: secondaryColor }}>STEP 02</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white"
                >
                  PREPARE
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Smart Checklist & Permits</h3>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Personalized packing list for target climate, document requirements, and direct government permit reminders.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-black/35 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 dark:border-white/15 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold tracking-wider" style={{ color: primaryColor }}>STEP 03</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white"
                >
                  TRAVEL
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Trip Mode Companion</h3>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Live on-ground dashboard: "Next stop in 15 min", real-time weather alerts, remaining day budget, and 1-tap navigation.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-black/35 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 dark:border-white/15 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold tracking-wider text-amber-400">STEP 04</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">ADAPT</span>
              </div>
              <h3 className="text-base font-bold text-white">Dynamic AI Pivot</h3>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Plans change when you travel. Hit “Something Changed?” to instantly re-route for rain, fatigue, spontaneous cravings or thrill.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section 
        className="py-16 transition-colors duration-300 relative z-10 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 text-left">
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ 
                  color: isDark ? '#f8fafc' : '#0f172a',
                  textShadow: isDark 
                    ? '0 2px 10px rgba(0,0,0,0.8)' 
                    : '0 1px 6px rgba(255,255,255,0.9)'
                }}
              >
                Explore Any Destination with AI
              </h2>
              <p 
                className="text-sm mt-1 font-medium"
                style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}
              >
                Type any city, town, or landmark worldwide. Gemini AI and Google Maps will create a custom itinerary.
              </p>
            </div>
            <button
              onClick={() => onStartPlanning()}
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer px-5 py-2.5 rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-xs hover:bg-white/60"
              style={{ color: primaryColor }}
            >
              <span>Launch Trip Planner</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 rounded-3xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Predefined Data • 100% Live AI & Maps</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Where would you like to travel next?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Search any address or country. The AI companion analyzes local weather, authentic food spots, real coordinates, transit hubs, and generates dynamic day-by-day itineraries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => onStartPlanning()}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>Start New Itinerary</span>
              </button>
              {onOpenMapSearch && (
                <button
                  onClick={onOpenMapSearch}
                  className="px-5 py-3.5 rounded-2xl border border-slate-300/80 dark:border-white/20 font-bold text-sm text-slate-900 dark:text-white bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:bg-white/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Map</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section 
        className="py-16 text-white text-center relative overflow-hidden transition-all duration-300 z-10 bg-white/15 dark:bg-black/35 backdrop-blur-2xl border-t border-white/30 dark:border-white/15 shadow-2xl"
      >
        {isBeachTheme && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <BeachWavesEffect height="100px" showFoam={true} showSparkles={false} />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Ready to experience travel that adapts to you?
          </h2>
          <p className="text-white/95 text-sm sm:text-base max-w-xl mx-auto font-medium drop-shadow-xs">
            Take the 2-minute personality quiz and generate a personalized, dynamic itinerary with packing lists and live trip mode.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onStartPlanning()}
              className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-base shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Planning Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
