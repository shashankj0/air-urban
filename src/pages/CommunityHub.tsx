import React, { useState } from 'react';
import { 
  Globe2, 
  Calendar, 
  Users, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';

export const CommunityHub: React.FC = () => {
  const { sevenDaysTasks, toggleSevenDaysTask } = useApp();
  const [activeTab, setActiveTab] = useState<'campaign' | 'leaderboard'>('campaign');

  const completedCount = sevenDaysTasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / sevenDaysTasks.length) * 100);

  // Anonymous leaderboard data (privacy-preserving)
  const leaderboard = [
    { rank: 1, handle: 'GreenCommuter_Delhi', actions: 28, co2AvoidedKg: 84.5, badge: 'Clean Air Champion' },
    { rank: 2, handle: 'EcoFamily_Gurugram', actions: 26, co2AvoidedKg: 78.2, badge: 'Smog Warrior' },
    { rank: 3, handle: 'MetroRider_Noida', actions: 24, co2AvoidedKg: 71.0, badge: 'Zero-Idler' },
    { rank: 4, handle: 'SolarKitchen_Bengaluru', actions: 21, co2AvoidedKg: 64.3, badge: 'Induction Master' },
    { rank: 5, handle: 'CleanCanopy_Chandigarh', actions: 19, co2AvoidedKg: 55.8, badge: 'Tree Guardian' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-emerald-400" />
            Community Impact Hub & 7-Day Campaign
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join community-wide air stewardship challenges with anonymous participation and collective impact tracking
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('campaign')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'campaign'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            "7 Days to Cleaner Air"
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anonymous Leaderboard
          </button>
        </div>
      </div>

      {/* Collective Community Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 text-center">
          <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Citizens Participating</span>
          <span className="text-2xl font-black text-white">29,480</span>
          <span className="text-[10px] text-emerald-400 block">+1,240 this week</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 text-center">
          <TrendingUp className="w-5 h-5 text-teal-400 mx-auto mb-1" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Collective CO2e Avoided</span>
          <span className="text-2xl font-black text-white">142.6 <span className="text-sm font-semibold text-teal-300">Tonnes</span></span>
          <span className="text-[10px] text-teal-400 block">Via verified habit shifts</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 text-center">
          <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Challenges Completed</span>
          <span className="text-2xl font-black text-white">88,210</span>
          <span className="text-[10px] text-purple-400 block">Across 18 urban districts</span>
        </div>
      </div>

      {activeTab === 'campaign' ? (
        /* "7 Days to Cleaner Air" Campaign */
        <div className="space-y-4">
          
          {/* Campaign Progress Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Flagship Community Challenge
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  "7 Days to Cleaner Air" Challenge
                </h2>
              </div>
              <div className="text-xs text-slate-300 font-semibold">
                Completed {completedCount} of 7 Days ({progressPercent}%)
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              One simple, impactful daily habit shift each day to systematically reduce low-level ground emissions that winter smog traps.
            </p>

            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 7 Days List */}
          <div className="space-y-3">
            {sevenDaysTasks.map((task) => (
              <div
                key={task.id}
                className={`glass-panel rounded-2xl p-5 border transition-all ${
                  task.completed
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleSevenDaysTask(task.id)}
                      className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Day {task.dayNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.participantsCount.toLocaleString()} participants
                        </span>
                      </div>

                      <h3 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="mt-2 text-[11px] text-teal-300 font-medium">
                        <strong>Action Target:</strong> {task.actionPrompt}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800 shrink-0">
                    -{task.co2eSavingKg} kg CO2e
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Why This Matters Card */}
          <WhyThisMattersCard
            title="WHY 7-DAY COLLECTIVE HABIT SHIFTS WORK"
            summary="Smog is an aggregate crisis. When thousands of neighbours simultaneously cut vehicle idling, eliminate nighttime dry-leaf burning, and practice mindful indoor ventilation, localized street concentrations drop fast."
            details={[
              "Cumulative Micro-Actions: Eliminating 15 minutes of idling saves ~0.3 kg CO2e and removes dense toxic carbon monoxide clouds from intersections.",
              "Social Contagion: Participating in structured daily challenges increases sustained long-term green transit adoption by 3.4x."
            ]}
          />

        </div>
      ) : (
        /* Anonymous Leaderboard */
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase text-purple-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Privacy-Preserving Leaderboard
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Top Community Contributors</h3>
            </div>
            <span className="text-xs text-slate-400">Zero location or personal identity revealed</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {leaderboard.map((user) => (
              <div key={user.rank} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    user.rank === 1 ? 'bg-amber-500 text-slate-950 font-black' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950 font-black' :
                    user.rank === 3 ? 'bg-amber-700 text-white font-black' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {user.rank}
                  </span>
                  <div>
                    <span className="font-bold text-white block">{user.handle}</span>
                    <span className="text-[10px] text-emerald-400">{user.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white block">{user.co2AvoidedKg} kg CO2e</span>
                  <span className="text-[10px] text-slate-400">{user.actions} habits verified</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 text-center">
            Your contributions are recorded anonymously. Enable leaderboard participation in Settings.
          </div>
        </div>
      )}

    </div>
  );
};
