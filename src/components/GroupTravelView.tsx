import React from 'react';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Compass,
  Utensils,
  Moon,
  Trees,
  Landmark,
  Plus,
  Smile
} from 'lucide-react';
import { Trip, GroupMember } from '../types';
import { calculateGroupCompatibility } from '../services/aiPlanner';

interface GroupTravelViewProps {
  trip: Trip;
}

export const GroupTravelView: React.FC<GroupTravelViewProps> = ({ trip }) => {
  const members: GroupMember[] = trip.preferences.groupMembers || [
    { id: 'm1', name: 'Rohan', styles: ['Adventure', 'Photography'], food: 'Non-vegetarian' },
    { id: 'm2', name: 'Friend 1 (Kabir)', styles: ['Food', 'Nightlife'], food: 'Non-vegetarian' },
    { id: 'm3', name: 'Friend 2 (Tara)', styles: ['Nature', 'Relaxation'], food: 'Vegetarian' }
  ];

  const compatibility = calculateGroupCompatibility(members);

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-200" />
              <span className="text-xs uppercase font-bold tracking-wider text-teal-100">
                Group Harmony Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Group Travel Synergy: {compatibility.overallScore}%
            </h2>
            <p className="text-xs sm:text-sm text-teal-50 max-w-2xl leading-relaxed">
              {compatibility.summary}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
            <span className="text-[11px] font-semibold text-teal-100 block">Collective Vibe Match</span>
            <span className="text-3xl font-black">{compatibility.overallScore}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Group Members */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/80 dark:border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Traveller Profiles</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {members.length} Travellers
              </span>
            </div>

            <div className="space-y-3">
              {members.map((member, idx) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-200 to-teal-200 text-emerald-900 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{member.food}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {member.styles.map((style) => (
                        <span
                          key={style}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Compatibility Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/80 dark:border-white/15 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Category Synergy Breakdown</h3>

            <div className="space-y-4">
              {compatibility.breakdown.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      {item.category === 'Adventure' && <Compass className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.category === 'Food & Dining' && <Utensils className="w-3.5 h-3.5 text-amber-600" />}
                      {item.category === 'Nightlife & Social' && <Moon className="w-3.5 h-3.5 text-purple-600" />}
                      {item.category === 'Nature & Scenic' && <Trees className="w-3.5 h-3.5 text-teal-600" />}
                      {item.category === 'Culture & Art' && <Landmark className="w-3.5 h-3.5 text-cyan-600" />}
                      <span>{item.category}</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.score}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Harmony Note */}
            <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>How RoamAI Harmonized Your Itinerary</span>
              </div>
              <p className="leading-relaxed">
                Daytime adventures satisfy thrill cravings, while afternoons and dinners are clustered around top-rated regional cafes and ambient nightlife, balanced with scenic relaxation stops for the whole group.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
