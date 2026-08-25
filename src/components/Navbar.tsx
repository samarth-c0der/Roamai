import React, { useState } from 'react';
import { Compass, Sparkles, Navigation, Bookmark, User, Plus, Menu, X, ChevronDown, Check, Sliders, MapPin, Palette } from 'lucide-react';
import { Trip, ThemeConfig } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'wizard' | 'itinerary' | 'trip_mode' | 'my_trips' | 'map_search';
  onNavigate: (view: 'landing' | 'wizard' | 'itinerary' | 'trip_mode' | 'my_trips' | 'map_search') => void;
  activeTrip: Trip | null;
  savedTripsCount: number;
  onLoadPreset: (destId: 'goa' | 'manali' | 'wayanad') => void;
  currentTheme: ThemeConfig;
  onOpenThemeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeTrip,
  savedTripsCount,
  onLoadPreset,
  currentTheme,
  onOpenThemeModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-transparent transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                onNavigate('landing');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                style={{ background: currentTheme.heroGradient }}
              >
                <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="text-xl font-bold tracking-tight text-white font-sans"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                  >
                    Roam<span style={{ color: currentTheme.primaryColor }}>AI</span>
                  </span>
                  <span 
                    className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm"
                  >
                    Companion
                  </span>
                </div>
                <p 
                  className="text-[11px] text-white/80 -mt-0.5 hidden sm:block font-medium"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                >
                  Plan • Prepare • Travel • Adapt
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('landing')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'landing'
                    ? 'text-white font-bold bg-white/20 backdrop-blur-md shadow-xs border border-white/30'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
              >
                <span>Discover</span>
              </button>

              <button
                onClick={() => onNavigate('map_search')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'map_search'
                    ? 'text-white font-bold bg-white/20 backdrop-blur-md shadow-xs border border-white/30'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-300" />
                <span>Place Search</span>
              </button>

              <button
                onClick={() => onNavigate('my_trips')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'my_trips'
                    ? 'text-white font-bold bg-white/20 backdrop-blur-md shadow-xs border border-white/30'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
              >
                <span>My Trips</span>
                {savedTripsCount > 0 && (
                  <span 
                    className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold bg-white text-slate-900 shadow-xs"
                  >
                    {savedTripsCount}
                  </span>
                )}
              </button>

              {activeTrip && (
                <button
                  onClick={() => onNavigate('itinerary')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    currentView === 'itinerary'
                      ? 'text-white font-bold bg-white/20 backdrop-blur-md shadow-xs border border-white/30'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>{activeTrip.destination} Itinerary</span>
                </button>
              )}

              {activeTrip && (
                <button
                  onClick={() => onNavigate('trip_mode')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
                    currentView === 'trip_mode'
                      ? 'text-white font-bold bg-white/20 backdrop-blur-md shadow-xs border border-white/30'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  <Navigation className="w-3.5 h-3.5 text-amber-300" />
                  <span>Trip Mode</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Color Theme Selector Pill */}
            <button
              onClick={onOpenThemeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 bg-black/25 hover:bg-black/35 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              title="Change color theme palette"
            >
              <div 
                className="w-3 h-3 rounded-full shadow-2xs border border-white/40"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              <span className="font-semibold">{currentTheme.name}</span>
              <Palette className="w-3.5 h-3.5 text-white/80 ml-0.5" />
            </button>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/30 bg-black/25 hover:bg-black/35 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                title="Switch demo destinations or settings"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold">Demo Trips</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 text-left text-white">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Quick Load Destination</p>
                  </div>
                  <button
                    onClick={() => {
                      onLoadPreset('goa');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>🌴 Goa (4 Days • Friends)</span>
                    {activeTrip?.destination === 'Goa' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onLoadPreset('manali');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>🏔️ Manali (5 Days • High Altitude)</span>
                    {activeTrip?.destination === 'Manali' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onLoadPreset('wayanad');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>🌿 Wayanad (3 Days • Rainforest)</span>
                    {activeTrip?.destination === 'Wayanad' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <div className="my-1 border-t border-white/10"></div>
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] text-slate-400">Personalized AI Engine Active</p>
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <button
              onClick={() => onNavigate('wizard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Plan My Trip</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenThemeModal}
              className="p-2 rounded-xl border border-white/30 bg-black/25 text-white text-xs font-semibold flex items-center shadow-xs"
              title="Theme options"
            >
              <Palette className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => onNavigate('wizard')}
              className="p-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Plan</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-white bg-black/25 hover:bg-black/35 border border-white/30 shadow-xs transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/20 bg-slate-900/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2 shadow-2xl text-white">
          <button
            onClick={() => {
              onNavigate('landing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
          >
            Discover & Features
          </button>
          <button
            onClick={() => {
              onNavigate('map_search');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Places & Map Search</span>
          </button>
          <button
            onClick={() => {
              onNavigate('my_trips');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>My Trips</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-white text-slate-900 font-bold">
              {savedTripsCount}
            </span>
          </button>
          {activeTrip && (
            <button
              onClick={() => {
                onNavigate('itinerary');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-white/15 text-white"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>{activeTrip.destination} Itinerary</span>
            </button>
          )}
          {activeTrip && (
            <button
              onClick={() => {
                onNavigate('trip_mode');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-white/15 text-white"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Trip Mode (Live Companion)</span>
            </button>
          )}
          
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenThemeModal();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-white/80" />
                <span>Color Theme: {currentTheme.name}</span>
              </span>
              <div className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: currentTheme.primaryColor }} />
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <p className="text-xs font-semibold text-white/60 px-4">Switch Demo Destination</p>
            <div className="grid grid-cols-3 gap-2 px-2">
              <button
                onClick={() => {
                  onLoadPreset('goa');
                  setIsMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 text-xs rounded-lg border border-white/20 bg-white/10 text-white font-semibold text-center hover:bg-white/20"
              >
                🌴 Goa
              </button>
              <button
                onClick={() => {
                  onLoadPreset('manali');
                  setIsMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 text-xs rounded-lg border border-white/20 bg-white/10 text-white font-semibold text-center hover:bg-white/20"
              >
                🏔️ Manali
              </button>
              <button
                onClick={() => {
                  onLoadPreset('wayanad');
                  setIsMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 text-xs rounded-lg border border-white/20 bg-white/10 text-white font-semibold text-center hover:bg-white/20"
              >
                🌿 Wayanad
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
