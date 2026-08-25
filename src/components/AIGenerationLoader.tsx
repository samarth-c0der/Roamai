import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Loader2, Compass, MapPin } from 'lucide-react';

interface AIGenerationLoaderProps {
  destinationName: string;
}

const STEPS = [
  'Understanding your preferences',
  'Finding real verified places with Google Maps',
  'Optimizing route & travel times',
  'Calculating real-time weather & budget',
  'Building day-by-day AI itinerary',
  'Tailoring local packing checklist'
];

export const AIGenerationLoader: React.FC<AIGenerationLoaderProps> = ({
  destinationName
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/80 shadow-2xl relative z-10 text-center space-y-6">
        {/* Animated Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl bg-emerald-500/20 border border-emerald-500/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </motion.div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            Gemini AI Engine
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Planning Your Trip to {destinationName || 'Your Destination'}
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Fetching authentic landmarks, calculating routes & generating your custom plan...
          </p>
        </div>

        {/* Dynamic Progress Steps List */}
        <div className="space-y-3 text-left pt-2">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-sm ring-1 ring-emerald-500/20'
                    : isCompleted
                    ? 'bg-slate-800/40 border-slate-700/40 text-slate-300'
                    : 'bg-slate-900/30 border-transparent text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{step}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            initial={{ width: '10%' }}
            animate={{ width: `${Math.min(95, ((currentStepIndex + 1) / STEPS.length) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
