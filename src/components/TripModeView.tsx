import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Navigation,
  Sparkles,
  Zap,
  Clock,
  MapPin,
  Compass,
  ArrowRight,
  CheckCircle2,
  Circle,
  Share2,
  Sun,
  CloudRain,
  CloudSun,
  RefreshCw,
  Sliders,
  DollarSign,
  PhoneCall,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Trip, Activity, ExpenseItem } from '../types';
import { DayExpenseTracker } from './DayExpenseTracker';

interface TripModeViewProps {
  trip: Trip;
  activeDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
  onOpenAdapt: () => void;
  onOpenActivityDetails: (activity: Activity) => void;
  onReplaceActivity?: (activityId: string) => void;
  onToggleActivityCompleted: (activityId: string) => void;
  onAddExpense?: (expense: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
  onDeleteExpense?: (expenseId: string) => void;
  onExitTripMode: () => void;
}

export const TripModeView: React.FC<TripModeViewProps> = ({
  trip,
  activeDayNumber,
  onSelectDay,
  onOpenAdapt,
  onOpenActivityDetails,
  onReplaceActivity,
  onToggleActivityCompleted,
  onAddExpense,
  onDeleteExpense,
  onExitTripMode
}) => {
  const currentDay = trip.days.find(d => d.dayNumber === activeDayNumber) || trip.days[0];
  const nextActivity = currentDay.activities.find(a => !a.completed) || currentDay.activities[0];
  
  const [navAlert, setNavAlert] = useState<string | null>(null);

  const handleStartNav = (act: Activity) => {
    setNavAlert(`🛰️ GPS Navigation initialized for ${act.title} at ${act.location}. Turn-by-turn route active.`);
    setTimeout(() => setNavAlert(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24 text-left">
      {/* Top Mobile/Desktop Status Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Live Trip Companion
              </span>
              <h2 className="text-sm font-bold text-white -mt-0.5">
                {trip.destination} • Day {currentDay.dayNumber} of {trip.durationDays}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdapt}
              className="px-3 py-1.5 rounded-xl bg-teal-600/90 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Change Plan</span>
            </button>

            <button
              onClick={onExitTripMode}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              Exit Trip Mode
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Navigation Feedback Toast */}
        {navAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{navAlert}</span>
          </motion.div>
        )}

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {trip.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                day.dayNumber === activeDayNumber
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <span>Day {day.dayNumber}</span>
              <span className="text-[10px] opacity-80">{day.weatherForecast.temp}</span>
            </button>
          ))}
        </div>

        {/* Hero Greeting & Today Status */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {currentDay.date}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                  Good morning! Here's your plan for today.
                </h1>
              </div>

              {/* Live Weather Badge */}
              <div className="px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{currentDay.weatherForecast.temp} • {currentDay.weatherForecast.condition}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Today's Vibe: <span className="text-emerald-300 font-medium">{currentDay.vibe}</span>
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-700/70">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Stops Today</span>
                <span className="text-base font-extrabold text-white">{currentDay.activities.length} Places</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Day Spend</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {trip.currency}{currentDay.activities.reduce((acc, a) => acc + a.estimatedCost, 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="text-base font-extrabold text-teal-400">
                  {currentDay.activities.filter(a => a.completed).length}/{currentDay.activities.length} Visited
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NEXT ACTIVITY HERO CARD */}
        {nextActivity && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-900 rounded-3xl p-6 border-2 border-emerald-500/60 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                  Next Up
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  {nextActivity.travelTimeFromPrev || '15 min away'}
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-400">
                {nextActivity.time}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 my-3">
              <img
                src={nextActivity.imageUrl}
                alt={nextActivity.title}
                className="w-full sm:w-32 h-32 rounded-2xl object-cover shrink-0 border border-emerald-500/30"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white">{nextActivity.title}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{nextActivity.location}</span>
                </p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {nextActivity.description}
                </p>
                <div className="text-[11px] text-emerald-200 font-medium">
                  <strong>Why now: </strong> {nextActivity.recommendationReason}
                </div>
              </div>
            </div>

            {/* Next Stop Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-500/20">
              <button
                onClick={() => handleStartNav(nextActivity)}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Navigation</span>
              </button>

              {onReplaceActivity && (
                <button
                  onClick={() => onReplaceActivity(nextActivity.id)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Replace with alternative places"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Replace Stop</span>
                </button>
              )}

              <button
                onClick={onOpenAdapt}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Adapt Day</span>
              </button>

              <button
                onClick={() => onToggleActivityCompleted(nextActivity.id)}
                className="py-3 px-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Arrived</span>
              </button>
            </div>
          </div>
        )}

        {/* Day Expense Tracker & Budget Comparison in Trip Mode */}
        {onAddExpense && onDeleteExpense && (
          <DayExpenseTracker
            trip={trip}
            day={currentDay}
            onAddExpense={onAddExpense}
            onDeleteExpense={onDeleteExpense}
            className="dark bg-slate-800/90 border-slate-700/80 text-white"
          />
        )}

        {/* Complete Today's Timeline */}
        <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Today's Schedule Timeline</h3>
            <span className="text-xs text-slate-400">Click any stop for details</span>
          </div>

          <div className="space-y-3">
            {currentDay.activities.map((activity, idx) => {
              const isDone = activity.completed;
              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    isDone
                      ? 'bg-slate-900/60 border-slate-700/40 opacity-60'
                      : activity.isUpdated
                      ? 'bg-teal-950/30 border-teal-500/60'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => onToggleActivityCompleted(activity.id)}
                      className="mt-0.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    <div
                      onClick={() => onOpenActivityDetails(activity)}
                      className="cursor-pointer space-y-1 min-w-0"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400">{activity.time}</span>
                        <span className="text-xs text-slate-400">• {activity.duration}</span>
                        {activity.isUpdated && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Updated
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {activity.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">{activity.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onReplaceActivity && !isDone && (
                      <button
                        onClick={() => onReplaceActivity(activity.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                        title="Replace place with alternatives"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleStartNav(activity)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Navigate"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Persistent Floating Quick Adapt Bar */}
      <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40">
        <div className="bg-slate-950/95 backdrop-blur-lg border border-slate-700/90 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-2">
            <span className="text-base">⚡</span>
            <span className="text-xs font-semibold text-slate-200">Something changed?</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdapt}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Adapt Itinerary Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
