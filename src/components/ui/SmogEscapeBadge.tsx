import React from 'react';
import { SunMedium, Compass, Clock, ArrowRight } from 'lucide-react';

interface SmogEscapeBadgeProps {
  startHour: string;
  endHour: string;
  bestAQI: number;
  advice: string;
  onExplore?: () => void;
}

export const SmogEscapeBadge: React.FC<SmogEscapeBadgeProps> = ({
  startHour,
  endHour,
  bestAQI,
  advice,
  onExplore,
}) => {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
          <SunMedium className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Smog Escape Window
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Lowest Pollution Today
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> {startHour} – {endHour}
            </span>
            <span className="text-xs text-amber-300/80 font-medium">
              (Est. AQI ~{bestAQI})
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            {advice}
          </p>
        </div>
      </div>

      {onExplore && (
        <button
          onClick={onExplore}
          className="self-end sm:self-center shrink-0 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <span>Plan Routine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
