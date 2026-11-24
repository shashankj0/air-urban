import React from 'react';
import { ShieldCheck, HeartHandshake, Info, Cpu, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800/60">
          
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>BreatheWise AI Platform</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Empowering urban citizens, families, and communities to proactively navigate winter smog and severe air pollution through GenAI guidance, low-emission daily routines, and transparent environmental science.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Environmental Data Integrity</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Ambient meteorological and pollutant data powered by Open-Meteo Air Quality & CPCB Sub-Index algorithm. Emissions factors cross-referenced with ARAI, CEA CO2 Baseline Database (Ver 19.0), and US EPA GHG Hub.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              <span>Responsible AI & Medical Disclaimer</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              BreatheWise AI is an environmental exposure and routine optimization system. It does not provide clinical diagnosis or prescribe medical treatments. Always consult licensed medical professionals for personalized pulmonary care.
            </p>
          </div>

        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 BreatheWise AI. All rights reserved.</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> WCAG 2.2 AA Compliant
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy First (Zero health data tracking)</span>
            <span>•</span>
            <span>CPCB India & US EPA AQI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
