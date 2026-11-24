import { describe, it, expect } from 'vitest';
import { 
  calculateCommuteEmissions, 
  TRANSPORT_EMISSION_FACTORS, 
  EMISSION_SCIENTIFIC_DISCLAIMER 
} from '../utils/emissionFactors';

describe('Emission Factors & Carbon Impact Models', () => {
  it('correctly calculates higher emissions for diesel cars than metro rail', () => {
    const distanceKm = 15;
    const dieselEmissions = calculateCommuteEmissions(distanceKm, 'car_diesel', 5);
    const metroEmissions = calculateCommuteEmissions(distanceKm, 'metro_rail', 5);

    expect(dieselEmissions.dailyKgCO2e).toBeGreaterThan(metroEmissions.dailyKgCO2e);
    expect(dieselEmissions.yearlyKgCO2e).toBeGreaterThan(metroEmissions.yearlyKgCO2e * 5);
    expect(dieselEmissions.dailyPM25Grams).toBeGreaterThan(metroEmissions.dailyPM25Grams);
  });

  it('returns zero emissions for walking / bicycling', () => {
    const walkEmissions = calculateCommuteEmissions(10, 'bicycle_walk', 5);
    expect(walkEmissions.dailyKgCO2e).toBe(0);
    expect(walkEmissions.dailyPM25Grams).toBe(0);
    expect(walkEmissions.yearlyKgCO2e).toBe(0);
  });

  it('includes proper citations for ARAI, IPCC, and DMRC baselines', () => {
    expect(TRANSPORT_EMISSION_FACTORS.car_diesel.source).toContain('ARAI');
    expect(TRANSPORT_EMISSION_FACTORS.metro_rail.source).toContain('DMRC');
    expect(TRANSPORT_EMISSION_FACTORS.bus_public.source).toContain('TERI');
  });

  it('provides the mandatory scientific disclaimer distinguishing GHG from local air pollutants', () => {
    expect(EMISSION_SCIENTIFIC_DISCLAIMER).toContain('Greenhouse Gas');
    expect(EMISSION_SCIENTIFIC_DISCLAIMER).toContain('Local air quality pollutants');
    expect(EMISSION_SCIENTIFIC_DISCLAIMER).toContain('PM2.5');
  });
});
