import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Sparkles, 
  Flame, 
  Wind, 
  Droplets, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDOOR_DETECTIVE_ACTIVITIES } from '../services/indoorDetectiveData';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';
import { IndoorDetectiveActivity } from '../types';

export const IndoorProtection: React.FC = () => {
  const { airQuality } = useApp();
  const [selectedActivity, setSelectedActivity] = useState<IndoorDetectiveActivity>(
    INDOOR_DETECTIVE_ACTIVITIES[0]
  );
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({
    h1: true,
    h2: false,
    h3: true,
    h4: false,
    h5: true,
  });

  const indoorChecklistItems = [
    { id: 'h1', title: 'Operate Kitchen Exhaust Fan 2 min prior to cooking', category: 'Kitchen' },
    { id: 'h2', title: 'Position HEPA purifier at least 1.5 feet away from walls/corners', category: 'Filtration' },
    { id: 'h3', title: 'Seal window frame gaps using weather-stripping foam or door draft snakes', category: 'Sealing' },
    { id: 'h4', title: 'Wash AC nylon mesh pre-filters every 14 days in warm water', category: 'HVAC' },
    { id: 'h5', title: 'Eliminate agarbatti, scented candles, and mosquito coils in bedrooms', category: 'Combustion' },
  ];

  const toggleChecklistItem = (id: string) => {
    setActiveChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Home className="w-6 h-6 text-emerald-400" />
          Indoor Air Quality & Indoor Air Detective
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Investigate household pollution sources, master ventilation timing, and deploy low-cost exposure reduction hacks
        </p>
      </div>

      {/* Transparent Sensor Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-sky-300">Data Integrity Notice: </strong>
          Indoor pollution assessments provided in this module are modeled behavioral guidelines based on peer-reviewed environmental combustion studies (CPCB, US EPA, WHO). BreatheWise AI does not claim to measure live physical indoor PPM without a connected hardware IoT sensor.
        </div>
      </div>

      {/* Feature 1: "Indoor Air Detective" Interactive Section */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Interactive Investigative Tool
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Indoor Air Detective
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Select a common household activity to uncover hidden airborne pollutants
          </span>
        </div>

        {/* Activity Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {INDOOR_DETECTIVE_ACTIVITIES.map((act) => {
            const isSelected = selectedActivity.id === act.id;

            return (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    act.exposureRisk === 'Severe'
                      ? 'bg-rose-500/20 text-rose-300'
                      : act.exposureRisk === 'High'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {act.exposureRisk}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <span className="text-xs font-semibold block text-white truncate">
                  {act.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Activity Deep Dive Card */}
        <div className="p-5 sm:p-6 rounded-2xl glass-card border border-purple-500/30 bg-slate-900/90 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs uppercase font-bold text-purple-400">Activity Report</span>
              <h3 className="text-lg font-bold text-white">{selectedActivity.title}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedActivity.typicalPollutants.map((pol, i) => (
                <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  {pol}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Explanation */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              What Happens Indoors:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              {selectedActivity.problemExplanation}
            </p>
          </div>

          {/* Immediate Low-Cost Hack vs Sustainable Fix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Immediate Zero/Low-Cost Hack
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedActivity.immediateHack}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Long-Term Sustainable Fix
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedActivity.sustainableFix}
              </p>
            </div>
          </div>

          {/* Ventilation Timing relative to outdoor smog */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block text-[11px]">Outdoor Smog Ventilation Rule:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedActivity.ventilationRule} (Current Outdoor AQI: {airQuality.currentAQI})
              </p>
            </div>
          </div>

          {/* Why This Matters */}
          <WhyThisMattersCard
            summary={selectedActivity.whyItMatters}
            details={[
              "Indoor Accumulation: In sealed rooms during winter, particle concentrations build up exponentially without continuous mechanical exhaust.",
              "Cumulative Lung Dose: Inhaling unvented smoke overnight causes acute mucosal swelling and disrupts airway cilia."
            ]}
          />

        </div>
      </div>

      {/* Feature 2: Core Indoor Protection Checklist */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Essential Indoor Air Quality Checklist
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Actions recommended to maintain indoor PM2.5 below 25 µg/m³ during winter smog episodes:
        </p>

        <div className="space-y-2.5">
          {indoorChecklistItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeChecklist[item.id]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!activeChecklist[item.id]}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${activeChecklist[item.id] ? 'line-through text-slate-400' : 'text-white'}`}>
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
