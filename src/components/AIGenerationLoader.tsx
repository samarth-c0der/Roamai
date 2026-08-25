import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Loader2, Compass, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIGenerationLoaderProps {
  destinationName: string;
  onComplete: () => void;
}

const STEPS = [
  'Understanding your preferences',
  'Finding the best places',
  'Optimizing travel time',
  'Checking your budget',
  'Building your itinerary',
  'Preparing your trip checklist'
];

export const AIGenerationLoader: React.FC<AIGenerationLoaderProps> = ({
  destinationName,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Confetti celebration
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore if not supported
          }
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/80 shadow-2xl relative z-10 text-center space-y-6">
        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 blur-lg opacity-40 animate-pulse" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl">
            <Compass className="w-10 h-10 animate-spin text-slate-950" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            RoamAI Engine
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Creating your perfect {destinationName} trip…
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalizing schedule, packing guide, and travel companions
          </p>
        </div>

        {/* Progress Checklist */}
        <div className="space-y-2.5 text-left bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 text-xs transition-colors py-1 ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-white font-bold'
                    : 'text-slate-500'
                }`}
              >
                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
                <span>{step}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Live status ticker */}
        <p className="text-[11px] text-slate-400 font-mono">
          ✓ Real-time route optimization active
        </p>
      </div>
    </div>
  );
};
