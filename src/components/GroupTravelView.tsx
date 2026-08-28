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
  const members: GroupMember[] = trip.preferences.groupMembers || [];

  const compatibility = calculateGroupCompatibility(members);

  if (members.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl space-y-4 max-w-lg mx-auto mt-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Group Members Added Yet</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Invite your friends to this trip and let AI calculate your collective vibe match and harmonize the itinerary.
        </p>
        <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer mt-2">
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      
      {/* Top Banner with Centered Collective Vibe Match */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-teal-500/30 text-center space-y-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Engine Header */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Users className="w-4 h-4 text-teal-400" />
            <span>Group Harmony Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Group Travel Synergy & Harmony
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {compatibility.summary}
          </p>
        </div>

        {/* Centered Collective Vibe Match Showcase */}
        <div className="flex justify-center relative z-10">
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-400/60 shadow-[0_0_35px_rgba(16,185,129,0.25)] text-center min-w-[260px] sm:min-w-[320px] space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">
              Collective Vibe Match
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {compatibility.overallScore}%
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {compatibility.overallScore >= 85
                  ? 'Super High Cohesion'
                  : compatibility.overallScore >= 70
                  ? 'Strong Group Alignment'
                  : 'Balanced Consensus'}
                {' '}• {members.length} Travelers in Sync
              </span>
            </div>
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
