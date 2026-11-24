import { AQICategory, AQIStandard, PollutantData } from '../types';

/**
 * CPCB (India) AQI Breakpoints:
 * Good: 0 - 50
 * Satisfactory: 51 - 100
 * Moderate: 101 - 200
 * Poor: 201 - 300
 * Very Poor: 301 - 400
 * Severe: 401 - 500
 */

// CPCB Sub-index Breakpoints for PM2.5 (24h average in µg/m³)
const CPCB_PM25_BREAKPOINTS = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 30, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 60, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 90, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 120, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 250, cHigh: 500, iLow: 401, iHigh: 500 },
];

// CPCB Sub-index Breakpoints for PM10 (24h average in µg/m³)
const CPCB_PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 50, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 100, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 250, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 350, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 430, cHigh: 600, iLow: 401, iHigh: 500 },
];

// US EPA PM2.5 Breakpoints (µg/m³)
const US_EPA_PM25_BREAKPOINTS = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
];

/**
 * Linear interpolation formula:
 * Ip = [ (IHi - ILo) / (BPHi - BPLo) ] * (Cp - BPLo) + ILo
 */
function interpolate(
  cp: number,
  breakpoints: { cLow: number; cHigh: number; iLow: number; iHigh: number }[]
): number {
  if (cp <= 0) return 0;
  
  for (const bp of breakpoints) {
    if (cp >= bp.cLow && cp <= bp.cHigh) {
      const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (cp - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }

  // If concentration exceeds highest threshold, extrapolate linearly up to 500+
  const last = breakpoints[breakpoints.length - 1];
  if (cp > last.cHigh) {
    const aqi = ((last.iHigh - last.iLow) / (last.cHigh - last.cLow)) * (cp - last.cLow) + last.iLow;
    return Math.min(Math.round(aqi), 500);
  }

  return 0;
}

export function calculateCPCB_AQI(pollutants: PollutantData): { aqi: number; dominant: string } {
  const pm25SubIndex = interpolate(pollutants.pm25, CPCB_PM25_BREAKPOINTS);
  const pm10SubIndex = interpolate(pollutants.pm10, CPCB_PM10_BREAKPOINTS);
  
  // In CPCB, AQI is the maximum of sub-indices provided PM2.5 or PM10 is among the measured
  let maxAQI = pm25SubIndex;
  let dominant = 'PM2.5';

  if (pm10SubIndex > maxAQI) {
    maxAQI = pm10SubIndex;
    dominant = 'PM10';
  }

  return {
    aqi: Math.min(maxAQI, 500),
    dominant
  };
}

export function calculateUS_AQI(pm25: number): number {
  return interpolate(pm25, US_EPA_PM25_BREAKPOINTS);
}

export function getAQICategory(aqi: number, standard: AQIStandard = 'CPCB'): {
  category: AQICategory;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  advisory: string;
} {
  if (standard === 'CPCB') {
    if (aqi <= 50) {
      return {
        category: 'good',
        label: 'Good',
        color: '#10b981', // Emerald
        bgClass: 'bg-emerald-500/10',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/30',
        advisory: 'Minimal health impact. Clean air ideal for all outdoor activities and natural ventilation.'
      };
    } else if (aqi <= 100) {
      return {
        category: 'satisfactory',
        label: 'Satisfactory',
        color: '#84cc16', // Lime
        bgClass: 'bg-lime-500/10',
        textClass: 'text-lime-400',
        borderClass: 'border-lime-500/30',
        advisory: 'Minor breathing discomfort to sensitive people. Generally acceptable for outdoor sports.'
      };
    } else if (aqi <= 200) {
      return {
        category: 'moderate',
        label: 'Moderate',
        color: '#f59e0b', // Amber
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/30',
        advisory: 'Breathing discomfort to people with lungs, asthma and heart diseases. Sensitive groups should reduce prolonged outdoor exertion.'
      };
    } else if (aqi <= 300) {
      return {
        category: 'poor',
        label: 'Poor',
        color: '#f97316', // Orange
        bgClass: 'bg-orange-500/10',
        textClass: 'text-orange-400',
        borderClass: 'border-orange-500/30',
        advisory: 'Breathing discomfort to most people on prolonged exposure. Wear N95 outdoors, keep windows closed during rush hours.'
      };
    } else if (aqi <= 400) {
      return {
        category: 'very_poor',
        label: 'Very Poor',
        color: '#ef4444', // Red
        bgClass: 'bg-rose-500/10',
        textClass: 'text-rose-400',
        borderClass: 'border-rose-500/30',
        advisory: 'Respiratory illness on prolonged exposure. Avoid morning jogs, run indoor HEPA purifiers, close doors and seal gaps.'
      };
    } else {
      return {
        category: 'severe',
        label: 'Severe (Hazardous)',
        color: '#991b1b', // Deep Burgundy / Red-800
        bgClass: 'bg-red-950/40',
        textClass: 'text-red-400',
        borderClass: 'border-red-600/50',
        advisory: 'Emergency condition. Affects healthy people and seriously impacts those with existing diseases. Stay strictly indoors, wear N95/N99 if stepping out.'
      };
    }
  } else {
    // US EPA Standard
    if (aqi <= 50) {
      return {
        category: 'good',
        label: 'Good',
        color: '#10b981',
        bgClass: 'bg-emerald-500/10',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/30',
        advisory: 'Air quality is satisfactory and poses little or no risk.'
      };
    } else if (aqi <= 100) {
      return {
        category: 'moderate',
        label: 'Moderate',
        color: '#f59e0b',
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/30',
        advisory: 'Acceptable quality; very small number of sensitive individuals may experience symptoms.'
      };
    } else if (aqi <= 150) {
      return {
        category: 'poor',
        label: 'Unhealthy for Sensitive Groups',
        color: '#f97316',
        bgClass: 'bg-orange-500/10',
        textClass: 'text-orange-400',
        borderClass: 'border-orange-500/30',
        advisory: 'Members of sensitive groups may experience health effects. General public less likely to be affected.'
      };
    } else if (aqi <= 200) {
      return {
        category: 'poor',
        label: 'Unhealthy',
        color: '#ef4444',
        bgClass: 'bg-rose-500/10',
        textClass: 'text-rose-400',
        borderClass: 'border-rose-500/30',
        advisory: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.'
      };
    } else if (aqi <= 300) {
      return {
        category: 'very_poor',
        label: 'Very Unhealthy',
        color: '#a855f7',
        bgClass: 'bg-purple-500/10',
        textClass: 'text-purple-400',
        borderClass: 'border-purple-500/30',
        advisory: 'Health alert: The risk of health effects is increased for everyone.'
      };
    } else {
      return {
        category: 'severe',
        label: 'Hazardous',
        color: '#991b1b',
        bgClass: 'bg-red-950/40',
        textClass: 'text-red-400',
        borderClass: 'border-red-600/50',
        advisory: 'Health warning of emergency conditions: everyone is more likely to be affected.'
      };
    }
  }
}

/**
 * Standard WHO & CPCB reference limits (24-hour mean):
 * PM2.5: CPCB 60 µg/m³, WHO 15 µg/m³
 * PM10: CPCB 100 µg/m³, WHO 45 µg/m³
 * NO2: CPCB 80 µg/m³, WHO 25 µg/m³
 * SO2: CPCB 80 µg/m³, WHO 40 µg/m³
 * O3: CPCB 100 µg/m³ (8h), WHO 100 µg/m³
 * CO: CPCB 2 mg/m³ (8h), WHO 4 mg/m³
 */
export const POLLUTANT_SAFE_LIMITS = {
  pm25: { cpcb: 60, who: 15, unit: 'µg/m³', name: 'Fine Particulate Matter (PM2.5)' },
  pm10: { cpcb: 100, who: 45, unit: 'µg/m³', name: 'Coarse Particulate Matter (PM10)' },
  no2: { cpcb: 80, who: 25, unit: 'µg/m³', name: 'Nitrogen Dioxide (NO2)' },
  so2: { cpcb: 80, who: 40, unit: 'µg/m³', name: 'Sulfur Dioxide (SO2)' },
  o3: { cpcb: 100, who: 100, unit: 'µg/m³', name: 'Ozone (O3)' },
  co: { cpcb: 2.0, who: 4.0, unit: 'mg/m³', name: 'Carbon Monoxide (CO)' },
};
