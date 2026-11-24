import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface WhyThisMattersCardProps {
  title?: string;
  summary: string;
  details?: string[];
  beneficiaries?: string;
  assumptions?: string;
  highlightColor?: string;
}

export const WhyThisMattersCard: React.FC<WhyThisMattersCardProps> = ({
  title = 'WHY THIS MATTERS',
  summary,
  details,
  beneficiaries,
  assumptions,
  highlightColor = '#10b981'
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl glass-card border border-emerald-500/20 p-4 transition-all hover:border-emerald-500/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              {title}
            </h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        {(details || beneficiaries || assumptions) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-white p-1 rounded-md text-xs flex items-center gap-1 font-medium transition-colors"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs space-y-2.5 animate-fadeIn">
          {details && details.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-300 block text-[11px]">Key Mechanisms:</span>
              {details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}

          {beneficiaries && (
            <div className="text-[11px]">
              <span className="font-semibold text-slate-300">Who Benefits Most: </span>
              <span className="text-slate-400">{beneficiaries}</span>
            </div>
          )}

          {assumptions && (
            <div className="text-[10px] text-slate-500 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-400">Scientific Assumptions: </span>
              {assumptions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
