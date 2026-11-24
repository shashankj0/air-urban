import React, { useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Compass, 
  Clock, 
  HelpCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { AQIGauge } from '../components/ui/AQIGauge';
import { POLLUTANT_SAFE_LIMITS } from '../utils/aqiCalculators';
import { SmogEscapeBadge } from '../components/ui/SmogEscapeBadge';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';

export const LiveAirQuality: React.FC = () => {
  const { airQuality, standard, setStandard } = useApp();
  const [selectedChartMetric, setSelectedChartMetric] = useState<'aqi' | 'pm25'>('aqi');

  const pollutants = [
    {
      key: 'pm25',
      name: 'PM2.5 (Fine Particulates)',
      value: airQuality.pollutants.pm25,
      unit: 'µg/m³',
      cpcbLimit: POLLUTANT_SAFE_LIMITS.pm25.cpcb,
      whoLimit: POLLUTANT_SAFE_LIMITS.pm25.who,
      description: 'Particles <2.5 µm that penetrate deep into lung alveoli and enter the bloodstream.',
      risk: airQuality.pollutants.pm25 > 120 ? 'Critical' : airQuality.pollutants.pm25 > 60 ? 'High' : 'Moderate',
      color: '#ef4444'
    },
    {
      key: 'pm10',
      name: 'PM10 (Coarse Dust)',
      value: airQuality.pollutants.pm10,
      unit: 'µg/m³',
      cpcbLimit: POLLUTANT_SAFE_LIMITS.pm10.cpcb,
      whoLimit: POLLUTANT_SAFE_LIMITS.pm10.who,
      description: 'Inhalable particles <10 µm from road dust, construction, and biomass smoke.',
      risk: airQuality.pollutants.pm10 > 250 ? 'Severe' : airQuality.pollutants.pm10 > 100 ? 'High' : 'Moderate',
      color: '#f97316'
    },
    {
      key: 'no2',
      name: 'NO2 (Nitrogen Dioxide)',
      value: airQuality.pollutants.no2,
      unit: 'µg/m³',
      cpcbLimit: POLLUTANT_SAFE_LIMITS.no2.cpcb,
      whoLimit: POLLUTANT_SAFE_LIMITS.no2.who,
      description: 'Toxic reddish-brown gas emitted from diesel vehicles, power plants, and gas stoves.',
      risk: airQuality.pollutants.no2 > 80 ? 'Elevated' : 'Safe',
      color: '#eab308'
    },
    {
      key: 'so2',
      name: 'SO2 (Sulfur Dioxide)',
      value: airQuality.pollutants.so2,
      unit: 'µg/m³',
      cpcbLimit: POLLUTANT_SAFE_LIMITS.so2.cpcb,
      whoLimit: POLLUTANT_SAFE_LIMITS.so2.who,
      description: 'Pungent gas from coal combustion, diesel industrial fuel, and refineries.',
      risk: airQuality.pollutants.so2 > 80 ? 'Elevated' : 'Safe',
      color: '#06b6d4'
    },
    {
      key: 'o3',
      name: 'O3 (Surface Ozone)',
      value: airQuality.pollutants.o3,
      unit: 'µg/m³',
      cpcbLimit: POLLUTANT_SAFE_LIMITS.o3.cpcb,
      whoLimit: POLLUTANT_SAFE_LIMITS.o3.who,
      description: 'Secondary pollutant formed when NOx and VOCs react in strong sunlight.',
      risk: airQuality.pollutants.o3 > 100 ? 'Elevated' : 'Safe',
      color: '#3b82f6'
    },
    {
      key: 'co',
      name: 'CO (Carbon Monoxide)',
      value: airQuality.pollutants.co,
      unit: 'mg/m³',
      cpcbLimit: POLLUTANT_SAFE_LIMITS.co.cpcb,
      whoLimit: POLLUTANT_SAFE_LIMITS.co.who,
      description: 'Colorless, odorless asphyxiant gas from incomplete vehicle and stove combustion.',
      risk: airQuality.pollutants.co > 2.0 ? 'Elevated' : 'Safe',
      color: '#a855f7'
    },
  ];

  const chartData = airQuality.hourly.map((h) => ({
    time: h.time,
    aqi: h.aqi,
    pm25: h.pm25,
    temp: h.temperature,
  }));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Wind className="w-6 h-6 text-emerald-400" />
            Intelligent Live Air Quality Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pollutant breakdown, meteorological parameters, and diurnal forecast curves
          </p>
        </div>

        {/* Standard Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 text-[11px] font-medium">Standard:</span>
          <button
            onClick={() => setStandard('CPCB')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              standard === 'CPCB'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CPCB (India 0–500)
          </button>
          <button
            onClick={() => setStandard('US_EPA')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              standard === 'US_EPA'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            US EPA (0–500)
          </button>
        </div>
      </div>

      {/* Main Gauge & Meteorological Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Big AQI Gauge Card */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Current Concentration</span>
              <h3 className="text-lg font-bold text-white">{airQuality.location.name}</h3>
            </div>
            {airQuality.isDemo && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Demo Sim
              </span>
            )}
          </div>

          <div className="my-6">
            <AQIGauge
              aqi={airQuality.currentAQI}
              category={airQuality.category}
              categoryLabel={airQuality.categoryLabel}
              color={airQuality.color}
              standard={standard}
              size="lg"
            />
          </div>

          <div className="w-full bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1">
            <span className="font-semibold text-slate-300 block">Health Impact:</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {airQuality.healthAdvisory}
            </p>
          </div>
        </div>

        {/* Right: Weather & Inversion Drivers */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">Meteorological Dynamics</span>
                <h3 className="text-base font-bold text-white">Atmospheric Inversion Factors</h3>
              </div>
              <span className="text-xs text-slate-400">Open-Meteo Sensor Grid</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Thermometer className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Temperature</span>
                <span className="text-lg font-black text-white">{airQuality.weather.temperature}°C</span>
                <span className="text-[10px] text-slate-500 block">Cold traps air</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Droplets className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Humidity</span>
                <span className="text-lg font-black text-white">{airQuality.weather.humidity}%</span>
                <span className="text-[10px] text-slate-500 block">High moisture / fog</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Wind className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Wind Speed</span>
                <span className="text-lg font-black text-white">{airQuality.weather.windSpeed} km/h</span>
                <span className="text-[10px] text-slate-500 block">
                  {airQuality.weather.windSpeed < 5 ? 'Stagnant Air' : 'Moderate Flow'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Compass className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Wind Direction</span>
                <span className="text-lg font-black text-white">{airQuality.weather.windDirection}°</span>
                <span className="text-[10px] text-slate-500 block">NW Boundary flow</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
              <strong className="text-amber-400">Atmospheric Analysis:</strong> Calm winds (&lt;5 km/h) combined with cold surface temperatures create a nocturnal thermal inversion ceiling. Pollutants emitted from transport and heating cannot rise and remain trapped at chest level.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Scale: {standard === 'CPCB' ? 'National Air Quality Index (CPCB India)' : 'AirNow EPA Scale'}</span>
            <span className="text-emerald-400 font-semibold">Continuous Updates</span>
          </div>
        </div>
      </div>

      {/* Smog Escape Window */}
      <SmogEscapeBadge
        startHour={airQuality.smogEscapeWindow.startHour}
        endHour={airQuality.smogEscapeWindow.endHour}
        bestAQI={airQuality.smogEscapeWindow.bestAQI}
        advice={airQuality.smogEscapeWindow.advice}
      />

      {/* Hourly Diurnal Forecast Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              24-Hour Diurnal Pollution & Dispersion Forecast
            </h3>
            <p className="text-xs text-slate-400">
              Notice the afternoon dip when solar heat breaks the thermal inversion layer
            </p>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedChartMetric('aqi')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedChartMetric === 'aqi'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AQI Trend
            </button>
            <button
              onClick={() => setSelectedChartMetric('pm25')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedChartMetric === 'pm25'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PM2.5 (µg/m³)
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={airQuality.color} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor={airQuality.color} stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'dataMax + 40']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedChartMetric === 'aqi' ? 'aqi' : 'pm25'}
                name={selectedChartMetric === 'aqi' ? `${standard} AQI` : 'PM2.5 (µg/m³)'}
                stroke={selectedChartMetric === 'aqi' ? airQuality.color : '#38bdf8'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={selectedChartMetric === 'aqi' ? 'url(#aqiGradient)' : 'url(#pm25Gradient)'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800 pt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              Clean Window: {airQuality.smogEscapeWindow.startHour} – {airQuality.smogEscapeWindow.endHour}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              Peak Inversion: 06:00 – 09:00 AM
            </span>
          </div>
          <span>Refreshes with hourly meteorological runs</span>
        </div>
      </div>

      {/* Comprehensive Pollutant Breakdown Cards */}
      <div>
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Pollutant Sub-Index Breakdown vs Safe Standards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((p) => {
            const ratioCPCB = Number((p.value / p.cpcbLimit).toFixed(1));
            const isExceeded = p.value > p.cpcbLimit;

            return (
              <div 
                key={p.key} 
                className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">Current Concentration</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isExceeded ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {p.risk}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black text-white">{p.value}</span>
                    <span className="text-xs text-slate-400">{p.unit}</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] mb-3">
                    <div className="flex justify-between text-slate-300">
                      <span>CPCB Safe Standard:</span>
                      <span className="font-semibold">{p.cpcbLimit} {p.unit}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>WHO Safe Guideline:</span>
                      <span className="font-semibold">{p.whoLimit} {p.unit}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>CPCB Limit Ratio:</span>
                      <span className={isExceeded ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {ratioCPCB}x safe limit
                      </span>
                    </div>
                  </div>

                  {/* Visual ratio bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (p.value / (p.cpcbLimit * 2)) * 100)}%`,
                        backgroundColor: isExceeded ? '#ef4444' : '#10b981'
                      }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Outlook */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          5-Day Air Quality & Wind Dispersion Outlook
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {airQuality.daily.map((day, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-300 block">{day.date}</span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-xl font-black text-white">{day.avgAQI}</span>
                  <span className="text-[10px] text-slate-400">AQI</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-300 inline-block mb-2">
                  {day.dominantPollutant} Dominant
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                {day.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Matters Educational Card */}
      <WhyThisMattersCard
        title="WHY AQI STANDARDS DIFFER: CPCB vs US EPA"
        summary="A city with 120 µg/m³ of PM2.5 reads as 'Poor' (AQI 290) in India's CPCB standard, but 'Very Unhealthy' (AQI 185) in the US EPA scale. Knowing which standard you are viewing is essential to prevent false complacency."
        details={[
          "CPCB Sub-Index: Designed by Indian Central Pollution Control Board with breakpoints tailored to developing world baseline ambient exposures (0–30 Good, 31–60 Satisfactory, 61–90 Moderate, 91–120 Poor, 121–250 Very Poor, 250+ Severe).",
          "US EPA Scale: Tighter breakpoints on lower levels (0–12 Good, 12.1–35.4 Moderate, 35.5–55.4 Sensitive, 55.5–150.4 Unhealthy).",
          "Transparency Rule: BreatheWise AI clearly labels and recalculates both formulas dynamically, ensuring you never mix scales silently."
        ]}
        beneficiaries="Healthcare workers, school administrators, and international travelers."
        assumptions="Calculations utilize standard piecewise linear interpolation without truncation."
      />

    </div>
  );
};
