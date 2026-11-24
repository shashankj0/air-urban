import React from 'react';
import { 
  Wind, 
  ShieldAlert, 
  Activity, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Leaf, 
  Thermometer, 
  Droplets,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AQIGauge } from '../components/ui/AQIGauge';
import { SmogEscapeBadge } from '../components/ui/SmogEscapeBadge';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';

export const HomeDashboard: React.FC = () => {
  const { 
    airQuality, 
    preferences, 
    standard, 
    t, 
    setActiveTab, 
    routineTasks, 
    toggleRoutineTask,
    familyPreparednessScore,
    totalCO2AvoidedKg,
    completedTasksCount
  } = useApp();

  const isSevere = airQuality.currentAQI > 300;
  const isPoor = airQuality.currentAQI > 150;

  const quickQuestions = [
    'Is it safe to go for a morning walk today?',
    'Should my children play outside this afternoon?',
    'How can I reduce indoor pollution without a purifier?',
    'What should I do during severe winter smog?'
  ];

  const handleAskQuick = (question: string) => {
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Alert Banner for Severe / Poor Air */}
      {(isPoor || isSevere) && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
          isSevere 
            ? 'bg-rose-950/40 border-rose-600/50 text-rose-200' 
            : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isSevere ? 'text-rose-400' : 'text-amber-400'}`} />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold block sm:inline">
              {isSevere ? 'EMERGENCY WINTER SMOG ADVISORY: ' : 'HIGH POLLUTION CAUTION: '}
            </span>
            <span>
              {airQuality.healthAdvisory}
            </span>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-700 text-slate-300">
                Dominant: PM2.5 ({airQuality.pollutants.pm25} µg/m³)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-700 text-slate-300">
                Inversion Layer: Active
              </span>
              <button 
                onClick={() => setActiveTab('assistant')} 
                className="underline font-semibold text-white hover:text-emerald-300"
              >
                Get Custom Safety Advice →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section: Location & Live Air Quality Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: AQI Overview Hero Card */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl -z-10 pointer-events-none" />
          
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Atmospheric Monitor
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {airQuality.location.name}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {airQuality.isDemo && (
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Winter Smog Simulation
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Updated: {airQuality.lastUpdated}
                </span>
              </div>
            </div>

            {/* Gauge + Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-4">
              <div className="sm:col-span-5 flex justify-center">
                <AQIGauge
                  aqi={airQuality.currentAQI}
                  category={airQuality.category}
                  categoryLabel={airQuality.categoryLabel}
                  color={airQuality.color}
                  standard={standard}
                  size="md"
                />
              </div>

              <div className="sm:col-span-7 space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block font-medium">PM2.5 (Fine Soot)</span>
                    <span className="text-base font-bold text-white">{airQuality.pollutants.pm25}</span>
                    <span className="text-[10px] text-slate-400 ml-1">µg/m³</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block font-medium">PM10 (Dust)</span>
                    <span className="text-base font-bold text-white">{airQuality.pollutants.pm10}</span>
                    <span className="text-[10px] text-slate-400 ml-1">µg/m³</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block font-medium">NO2 (Traffic Exhaust)</span>
                    <span className="text-base font-bold text-white">{airQuality.pollutants.no2}</span>
                    <span className="text-[10px] text-slate-400 ml-1">µg/m³</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block font-medium">Temperature & Humid</span>
                    <span className="text-base font-bold text-white">{airQuality.weather.temperature}°C</span>
                    <span className="text-[10px] text-slate-400 ml-1">({airQuality.weather.humidity}%)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                  {airQuality.healthAdvisory}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="truncate max-w-xs">{airQuality.dataSource}</span>
            <button
              onClick={() => setActiveTab('liveAQI')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Full Forecast & Pollutants Breakdown →
            </button>
          </div>
        </div>

        {/* Right: Key Impact Metric Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          
          {/* Card 1: Family Protection Score */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                Family Protection Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{familyPreparednessScore}%</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Prepared</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Transparent checklist-based household preparedness score.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('family')}
              className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30 shrink-0"
            >
              View Plan →
            </button>
          </div>

          {/* Card 2: Daily Routine Progress */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Today's Daily Checklist
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {completedTasksCount} / {routineTasks.length}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">Tasks Completed</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adaptive routines designed for current AQI {airQuality.currentAQI}.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('routine')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 shrink-0"
            >
              Checklist →
            </button>
          </div>

          {/* Card 3: Avoided Emissions */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-teal-400" />
                Estimated CO2e Avoided
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{totalCO2AvoidedKg} kg</span>
                <span className="text-[11px] text-teal-400 font-semibold">This Week</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Via zero-idling, clean transit, and household efficiency.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 shrink-0"
            >
              Calculator →
            </button>
          </div>

        </div>
      </div>

      {/* Smog Escape Window Highlight */}
      <SmogEscapeBadge
        startHour={airQuality.smogEscapeWindow.startHour}
        endHour={airQuality.smogEscapeWindow.endHour}
        bestAQI={airQuality.smogEscapeWindow.bestAQI}
        advice={airQuality.smogEscapeWindow.advice}
        onExplore={() => setActiveTab('routine')}
      />

      {/* Quick AI Assistant Questions Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ask BreatheWise GenAI Assistant</h2>
              <p className="text-xs text-slate-400">Instant answers tailored to your location, AQI, and lifestyle</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('assistant')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold hidden sm:flex items-center gap-1"
          >
            Open Assistant Chat →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuick(q)}
              className="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 transition-all text-xs text-slate-200 hover:text-white flex items-center justify-between group"
            >
              <span className="pr-2">{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Why This Matters Differentiator Section */}
      <WhyThisMattersCard
        title="WHY PROACTIVE WINTER SMOG MANAGEMENT MATTERS"
        summary="Winter air pollution isn't just unpleasant haze—thermal inversion traps toxic ultrafine combustion particles at street level where they cause acute cardiovascular strain within hours."
        details={[
          "Thermal Inversion Physics: Cold, dense night air gets trapped under a warm boundary lid, preventing smoke from rising or dispersing vertically.",
          "Particle Inhalation Deposition: Fine PM2.5 crosses directly from the lung alveoli into systemic capillary blood circulation, increasing clotting and blood pressure.",
          "Diurnal Exposure Shifting: Moving outdoor chores from early morning to 1:00 PM–3:30 PM cuts total particulate mass inhaled by up to 50% without altering your to-do list."
        ]}
        beneficiaries="Children, asthmatics, older adults, daily commuters, and pregnant women."
        assumptions="Based on CPCB meteorological dispersion models and WHO particulate deposition curves."
      />

      {/* Today's Priority Routine Checklist Preview */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Today's Priority Routine Checklist
            </h3>
            <p className="text-xs text-slate-400">Adapted for {airQuality.categoryLabel} pollution</p>
          </div>
          <button
            onClick={() => setActiveTab('routine')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            Manage All Routines →
          </button>
        </div>

        <div className="space-y-2.5">
          {routineTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              onClick={() => toggleRoutineTask(task.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                task.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}} // Handled by parent div
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                />
                <div>
                  <span className={`text-xs font-semibold block ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block line-clamp-1">
                    {task.description}
                  </span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                {task.timeSlot}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
