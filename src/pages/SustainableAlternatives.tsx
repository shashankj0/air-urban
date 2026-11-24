import React, { useState } from 'react';
import { 
  Leaf, 
  Car, 
  Home, 
  Users, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Info
} from 'lucide-react';
import { SUSTAINABLE_ALTERNATIVES_DATA } from '../services/alternativesData';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';
import { SustainableAlternativeItem } from '../types';

export const SustainableAlternatives: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'transport' | 'household' | 'community'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = SUSTAINABLE_ALTERNATIVES_DATA.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.suggestedAlternative.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            Sustainable Alternatives Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-backed alternatives with documented emission factors, estimated cost savings, and systemic benefits
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'transport', label: 'Transport' },
            { id: 'household', label: 'Household' },
            { id: 'community', label: 'Community' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scientific Distinction Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-300">Methodology & Assumptions: </strong>
          Emissions avoided are calculated using scientifically published emission factors from ARAI, the Central Electricity Authority (CEA Ver 19.0), and US EPA GHG Hub. BreatheWise clearly distinguishes regional greenhouse gases (kg CO2e) from localized toxic inhalation pollutants (PM2.5 / NOx).
        </div>
      </div>

      {/* Alternatives Cards List */}
      <div className="space-y-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Title & Category Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{item.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Avoids {item.emissionAvoidedKgCO2e} kg CO2e / yr
                </span>
              </div>
            </div>

            {/* Problem vs Suggested Alternative Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">
                  Current Practice Problem:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {item.currentProblem}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Suggested Sustainable Alternative:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {item.suggestedAlternative}
                </p>
              </div>
            </div>

            {/* Why It Is Better & Long Term Benefit */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Why It Is Better:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {item.whyItIsBetter}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-teal-300 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> {item.annualSavingsFormatted}
                </span>
                <span className="text-slate-400 italic">
                  Citation: {item.emissionFactorCitation}
                </span>
              </div>
            </div>

            {/* Why This Matters */}
            <WhyThisMattersCard
              summary={item.longTermBenefit}
              details={[
                "Systemic Scaling: When 5% of a city's commuters adopt this routine, peak smog concentrations decline measurably at road intersections.",
                "Air Inhalation Reduction: Cuts direct human exposure during heavy transit hours."
              ]}
            />
          </div>
        ))}
      </div>

    </div>
  );
};
