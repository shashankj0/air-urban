import { describe, it, expect } from 'vitest';
import { 
  calculateCPCB_AQI, 
  calculateUS_AQI, 
  getAQICategory, 
  POLLUTANT_SAFE_LIMITS 
} from '../utils/aqiCalculators';
import { PollutantData } from '../types';

describe('AQI Calculators & Standards', () => {
  it('correctly calculates CPCB AQI for Good air (PM2.5 <= 30)', () => {
    const pollutants: PollutantData = {
      pm25: 15,
      pm10: 25,
      no2: 20,
      so2: 10,
      o3: 30,
      co: 0.5,
    };
    const res = calculateCPCB_AQI(pollutants);
    expect(res.aqi).toBeLessThanOrEqual(50);
    const cat = getAQICategory(res.aqi, 'CPCB');
    expect(cat.category).toBe('good');
  });

  it('correctly calculates CPCB AQI for Moderate air (PM2.5 between 61 and 90)', () => {
    const pollutants: PollutantData = {
      pm25: 75,
      pm10: 120,
      no2: 45,
      so2: 15,
      o3: 40,
      co: 1.2,
    };
    const res = calculateCPCB_AQI(pollutants);
    expect(res.aqi).toBeGreaterThan(100);
    expect(res.aqi).toBeLessThanOrEqual(200);
    const cat = getAQICategory(res.aqi, 'CPCB');
    expect(cat.category).toBe('moderate');
  });

  it('correctly calculates CPCB AQI for Severe Winter Smog (PM2.5 > 250)', () => {
    const pollutants: PollutantData = {
      pm25: 350,
      pm10: 450,
      no2: 95,
      so2: 25,
      o3: 40,
      co: 2.8,
    };
    const res = calculateCPCB_AQI(pollutants);
    expect(res.aqi).toBeGreaterThanOrEqual(400);
    const cat = getAQICategory(res.aqi, 'CPCB');
    expect(cat.category).toBe('severe');
    expect(cat.label).toContain('Severe');
  });

  it('correctly distinguishes US EPA AQI from CPCB AQI for the same PM2.5 level', () => {
    const pm25Val = 45; // Moderate in India CPCB (75), but Unhealthy for Sensitive Groups in US EPA (>120)
    const cpcb = calculateCPCB_AQI({ pm25: pm25Val, pm10: 70, no2: 30, so2: 10, o3: 20, co: 0.8 });
    const usAqi = calculateUS_AQI(pm25Val);

    // Verify US EPA and CPCB are distinct calculations
    expect(cpcb.aqi).not.toEqual(usAqi);
    expect(usAqi).toBeGreaterThanOrEqual(100);
  });

  it('ensures pollutant safe reference limits match standard regulatory guidelines', () => {
    expect(POLLUTANT_SAFE_LIMITS.pm25.cpcb).toBe(60);
    expect(POLLUTANT_SAFE_LIMITS.pm25.who).toBe(15);
    expect(POLLUTANT_SAFE_LIMITS.pm10.cpcb).toBe(100);
    expect(POLLUTANT_SAFE_LIMITS.no2.cpcb).toBe(80);
  });
});
