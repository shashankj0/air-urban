import React from 'react';
import { AQICategory, AQIStandard } from '../../types';

interface AQIGaugeProps {
  aqi: number;
  category: AQICategory;
  categoryLabel: string;
  color: string;
  standard: AQIStandard;
  size?: 'sm' | 'md' | 'lg';
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  categoryLabel,
  color,
  standard,
  size = 'md'
}) => {
  // Max scale is 500
  const clampedAQI = Math.min(Math.max(aqi, 0), 500);
  const percentage = clampedAQI / 500;
  
  // Circumference for stroke-dasharray (radius 70 => circumference 440)
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semicircle gauge: 180 degrees
  const halfCircumference = circumference / 2;
  const strokeDashoffset = halfCircumference - (percentage * halfCircumference);

  const dimensionClasses = {
    sm: 'w-36 h-24',
    md: 'w-48 h-32',
    lg: 'w-64 h-40',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className={`relative ${dimensionClasses} flex items-center justify-center overflow-hidden`}>
        <svg
          height="100%"
          width="100%"
          viewBox="0 0 160 100"
          className="transform"
        >
          {/* Background track arc */}
          <path
            d="M 20 85 A 60 60 0 0 1 140 85"
            fill="none"
            stroke="rgba(51, 65, 85, 0.5)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Active colored arc */}
          <path
            d="M 20 85 A 60 60 0 0 1 140 85"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="188.5"
            strokeDashoffset={188.5 - (percentage * 188.5)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center reading */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span 
            className="text-4xl font-extrabold tracking-tight drop-shadow-sm font-sans"
            style={{ color }}
          >
            {aqi}
          </span>
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {standard} AQI
          </span>
        </div>
      </div>

      {/* Category Tag */}
      <div 
        className="mt-1 px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 shadow-sm"
        style={{ 
          backgroundColor: `${color}18`, 
          borderColor: `${color}40`,
          color: color 
        }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        <span>{categoryLabel}</span>
      </div>
    </div>
  );
};
