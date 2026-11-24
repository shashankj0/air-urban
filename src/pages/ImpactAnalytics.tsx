import React, { useState } from 'react';
import { 
  BarChart3, 
  Calculator, 
  Leaf, 
  TrendingDown, 
  Download, 
  Compass, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Car
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { 
  TRANSPORT_EMISSION_FACTORS, 
  calculateCommuteEmissions, 
  ELECTRICITY_GRID_FACTOR_KG_KWH,
  EMISSION_SCIENTIFIC_DISCLAIMER 
} from '../utils/emissionFactors';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';

export const ImpactAnalytics: React.FC = () => {
  const { 
    preferences, 
    airQuality, 
    routineTasks, 
    totalCO2AvoidedKg, 
    familyPreparednessScore 
  } = useApp();

  // Calculator inputs
  const [distanceKm, setDistanceKm] = useState<number>(preferences.dailyCommuteDistanceKm || 15);
  const [currentMode, setCurrentMode] = useState<string>('car_petrol');
  const [targetMode, setTargetMode] = useState<string>('metro_rail');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [electricityKwh, setElectricityKwh] = useState<number>(180);

  // What-If Simulator state
  const [simCommuters, setSimCommuters] = useState<number>(5000);
  const [simDays, setSimDays] = useState<number>(30);

  // Calculate personal commute emissions
  const currentEmissions = calculateCommuteEmissions(distanceKm, currentMode, daysPerWeek);
  const targetEmissions = calculateCommuteEmissions(distanceKm, targetMode, daysPerWeek);

  const annualSavedKg = Math.max(0, currentEmissions.yearlyKgCO2e - targetEmissions.yearlyKgCO2e);
  const annualSavedPM25Grams = Math.max(0, (currentEmissions.dailyPM25Grams - targetEmissions.dailyPM25Grams) * (daysPerWeek * 50));

  // Comparison chart data
  const comparisonData = [
    { period: 'Daily', Current: currentEmissions.dailyKgCO2e, WithAlternative: targetEmissions.dailyKgCO2e },
    { period: 'Weekly', Current: currentEmissions.weeklyKgCO2e, WithAlternative: targetEmissions.weeklyKgCO2e },
    { period: 'Monthly', Current: currentEmissions.monthlyKgCO2e, WithAlternative: targetEmissions.monthlyKgCO2e },
    { period: 'Yearly', Current: currentEmissions.yearlyKgCO2e, WithAlternative: targetEmissions.yearlyKgCO2e },
  ];

  // Clean Route Intelligence comparison data
  const routeOptions = [
    { mode: 'Metro Rail + Walk', duration: '32 min', pm25Dose: '12 µg (AC sealed)', ghgKg: 0.21, costINR: 40, rating: 'Recommended', color: '#10b981' },
    { mode: 'AC City Bus', duration: '48 min', pm25Dose: '28 µg (Doors open)', ghgKg: 0.57, costINR: 25, rating: 'Good', color: '#06b6d4' },
    { mode: 'Open Auto Rickshaw', duration: '42 min', pm25Dose: '95 µg (High road soot)', ghgKg: 1.15, costINR: 140, rating: 'High Inhalation', color: '#f59e0b' },
    { mode: 'Motorcycle / Scooter', duration: '35 min', pm25Dose: '140 µg (Exhaust plume)', ghgKg: 0.67, costINR: 50, rating: 'Critical Inhalation', color: '#ef4444' },
  ];

  // What-If Simulation Calculation
  const simTotalSavedCO2Tonnes = Number(
    ((simCommuters * (15 * 2 * 0.143 - 15 * 2 * 0.014) * simDays) / 1000).toFixed(1)
  );

  const handleDownloadReport = () => {
    const reportData = {
      appName: 'BreatheWise AI - Personal Air Action Report',
      generatedAt: new Date().toISOString(),
      user: preferences.userName,
      location: airQuality.location.name,
      currentAQI: airQuality.currentAQI,
      standard: airQuality.standard,
      familyPreparednessScore: `${familyPreparednessScore}%`,
      estimatedCO2AvoidedThisWeek: `${totalCO2AvoidedKg} kg`,
      completedRoutineActions: routineTasks.filter(t => t.completed).map(t => t.title),
      calculatorSummary: {
        dailyCommuteKm: distanceKm * 2,
        currentMode: currentEmissions.vehicleName,
        targetMode: targetEmissions.vehicleName,
        annualCO2eSavedKg: annualSavedKg,
        annualTailpipePM25AvoidedGrams: annualSavedPM25Grams,
      },
      scientificCitation: 'IPCC AR6 & ARAI Indian Transport Database',
      disclaimer: EMISSION_SCIENTIFIC_DISCLAIMER,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BreatheWise_Report_${preferences.userName || 'User'}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Impact Analytics & Pollution Calculator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quantify personal and collective emissions avoided using documented IPCC and ARAI emission factors
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Action Report</span>
        </button>
      </div>

      {/* Scientific Distinction Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-300">Scientific Clarification: </strong>
          {EMISSION_SCIENTIFIC_DISCLAIMER}
        </div>
      </div>

      {/* Feature 1: Interactive Pollution Impact Calculator */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Interactive Commute Emissions Calculator</h2>
          </div>
          <span className="text-xs text-slate-400">ARAI & US EPA Factors</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Inputs */}
          <div className="lg:col-span-5 space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                One-Way Commute Distance: <span className="text-emerald-400 font-bold">{distanceKm} km</span> (Roundtrip {distanceKm * 2} km)
              </label>
              <input
                type="range"
                min="2"
                max="60"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Current Vehicle Mode:</label>
                <select
                  value={currentMode}
                  onChange={(e) => setCurrentMode(e.target.value)}
                  className="w-full glass-input rounded-xl px-2.5 py-2 text-white bg-slate-900 border border-slate-800"
                >
                  <option value="car_petrol">Petrol Car (Mid-size)</option>
                  <option value="car_diesel">Diesel Car (Mid-size)</option>
                  <option value="car_cng">CNG Car</option>
                  <option value="two_wheeler_petrol">Petrol 2-Wheeler</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sustainable Target Mode:</label>
                <select
                  value={targetMode}
                  onChange={(e) => setTargetMode(e.target.value)}
                  className="w-full glass-input rounded-xl px-2.5 py-2 text-white bg-slate-900 border border-slate-800"
                >
                  <option value="metro_rail">Metro Rail</option>
                  <option value="bus_public">City Bus</option>
                  <option value="car_ev">Electric Car</option>
                  <option value="two_wheeler_ev">Electric 2-Wheeler</option>
                  <option value="bicycle_walk">Bicycle / Walking</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Commute Days Per Week:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDaysPerWeek(d)}
                    className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      daysPerWeek === d ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Result Stat Callouts */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block">Annual GHG Avoided:</span>
                <span className="text-lg font-black text-emerald-400">{annualSavedKg.toFixed(1)} kg</span>
                <span className="text-[10px] text-slate-400 block">CO2 equivalent</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
                <span className="text-[10px] text-slate-400 block">Tailpipe PM2.5 Avoided:</span>
                <span className="text-lg font-black text-sky-400">{annualSavedPM25Grams.toFixed(1)} g</span>
                <span className="text-[10px] text-slate-400 block">Direct street soot</span>
              </div>
            </div>
          </div>

          {/* Right: Comparative Recharts BarChart */}
          <div className="lg:col-span-7 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Current" name="Current Vehicle Mode (kg CO2e)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="WithAlternative" name="Target Sustainable Mode (kg CO2e)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

      {/* Feature 2: Clean Route Intelligence (Differentiator B) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Special Differentiator
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Clean Route Intelligence (Commute Mode Exposure Comparison)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Estimated 15 km Urban Corridor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {routeOptions.map((opt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{opt.mode}</span>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                  >
                    {opt.rating}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] my-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Inhaled PM2.5 Dose:</span>
                    <strong className="text-white">{opt.pm25Dose}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Emissions:</span>
                    <strong className="text-teal-400">{opt.ghgKg} kg CO2e</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Cost:</span>
                    <strong className="text-white">₹{opt.costINR}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Trip Duration:</span>
                    <span className="text-slate-400">{opt.duration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                {opt.rating === 'Recommended' ? 'Safest in-cabin air with lowest overall particulate inhalation.' : 'Significant roadside exhaust plume exposure.'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 3: What-If Simulator (Differentiator C) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Special Differentiator
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              What-If Urban Scaling Simulator
            </h3>
          </div>
          <span className="text-xs text-slate-400">Simulate Citywide Policy Impacts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Number of Urban Commuters Switching to Metro Rail: <span className="text-purple-400 font-bold">{simCommuters.toLocaleString()} people</span>
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={simCommuters}
                onChange={(e) => setSimCommuters(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Duration of Winter Smog Episode: <span className="text-purple-400 font-bold">{simDays} days</span>
              </label>
              <input
                type="range"
                min="7"
                max="90"
                value={simDays}
                onChange={(e) => setSimDays(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Based on shifting 15 km roundtrips from average passenger cars to electric metro rail under winter temperature inversion.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 text-center space-y-2">
            <span className="text-xs uppercase font-bold text-purple-400 block">
              Simulated Collective Impact
            </span>
            <div className="text-4xl font-black text-white">
              {simTotalSavedCO2Tonnes} <span className="text-lg font-bold text-purple-300">Metric Tonnes CO2e</span>
            </div>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Prevents an estimated <strong>{(simTotalSavedCO2Tonnes * 1.8).toFixed(0)} kg</strong> of fine tailpipe soot and reduces street-level traffic congestion by ~14% along key arterial routes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
