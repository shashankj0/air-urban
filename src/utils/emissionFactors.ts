/**
 * Emission Factors & Carbon/Pollution Impact Models
 * Sources:
 * - Central Electricity Authority (CEA) India CO2 Baseline Database (Ver 19.0, 2023)
 * - Automotive Research Association of India (ARAI) Emission Factors
 * - IPCC Guidelines for National Greenhouse Gas Inventories
 * - US EPA GHG Emission Factors Hub
 */

export interface VehicleEmissionModel {
  name: string;
  factorKgCO2ePerKm: number; // kg CO2e per passenger km
  pm25GramsPerKm: number;    // g PM2.5 tailpipe & tire wear per vehicle km
  noxGramsPerKm: number;     // g NOx per vehicle km
  source: string;
}

export const TRANSPORT_EMISSION_FACTORS: Record<string, VehicleEmissionModel> = {
  car_diesel: {
    name: 'Diesel Car (Mid-size)',
    factorKgCO2ePerKm: 0.171,
    pm25GramsPerKm: 0.045,
    noxGramsPerKm: 0.450,
    source: 'ARAI & IPCC 2021 Transport Inventory',
  },
  car_petrol: {
    name: 'Petrol Car (Mid-size)',
    factorKgCO2ePerKm: 0.143,
    pm25GramsPerKm: 0.015,
    noxGramsPerKm: 0.180,
    source: 'ARAI & US EPA Hub',
  },
  car_cng: {
    name: 'CNG Car',
    factorKgCO2ePerKm: 0.119,
    pm25GramsPerKm: 0.008,
    noxGramsPerKm: 0.120,
    source: 'CPCB & Petroleum Ministry Statistics',
  },
  two_wheeler_petrol: {
    name: 'Petrol 2-Wheeler (Motorcycle/Scooter)',
    factorKgCO2ePerKm: 0.045,
    pm25GramsPerKm: 0.012,
    noxGramsPerKm: 0.110,
    source: 'ARAI Emission Factors 2022',
  },
  car_ev: {
    name: 'Electric Car (Grid charged)',
    factorKgCO2ePerKm: 0.053, // Based on India Grid average of 0.71 kg CO2/kWh and 7.5 km/kWh
    pm25GramsPerKm: 0.005, // Non-tailpipe (brake/tire) only
    noxGramsPerKm: 0.000, // Zero tailpipe
    source: 'CEA Grid Factor & BEE EV Metrics',
  },
  two_wheeler_ev: {
    name: 'Electric 2-Wheeler',
    factorKgCO2ePerKm: 0.012,
    pm25GramsPerKm: 0.002,
    noxGramsPerKm: 0.000,
    source: 'BEE & NITI Aayog EV Whitepaper',
  },
  bus_public: {
    name: 'City Bus (Per passenger)',
    factorKgCO2ePerKm: 0.038,
    pm25GramsPerKm: 0.004,
    noxGramsPerKm: 0.040,
    source: 'TERI Urban Transport Study (Average occupancy 40 passengers)',
  },
  metro_rail: {
    name: 'Metro Rail (Per passenger)',
    factorKgCO2ePerKm: 0.014,
    pm25GramsPerKm: 0.001,
    noxGramsPerKm: 0.000,
    source: 'DMRC / BMRCL Sustainability Report 2023',
  },
  bicycle_walk: {
    name: 'Bicycle / Walking',
    factorKgCO2ePerKm: 0.000,
    pm25GramsPerKm: 0.000,
    noxGramsPerKm: 0.000,
    source: 'Zero Emission Human-Powered Mode',
  },
};

/**
 * Grid Electricity Emission Factor:
 * India CEA Weighted Average: 0.713 kg CO2e / kWh
 * Global Average: ~0.436 kg CO2e / kWh
 */
export const ELECTRICITY_GRID_FACTOR_KG_KWH = 0.713;

/**
 * Cooking Fuel Factors:
 * LPG cylinder: 1.63 kg CO2e per kg of LPG (or ~23.2 kg CO2e per 14.2 kg domestic cylinder)
 * Induction cooktop (1.5 kW, 1 hour): 1.07 kg CO2e on coal grid
 */
export const COOKING_LPG_KG_CO2E_PER_CYLINDER = 23.2;

/**
 * Calculates estimated daily, monthly, and yearly carbon footprint for commute
 */
export function calculateCommuteEmissions(
  distanceKmOneWay: number,
  modeKey: string,
  daysPerWeek: number = 5
) {
  const roundTripKm = distanceKmOneWay * 2;
  const factor = TRANSPORT_EMISSION_FACTORS[modeKey] || TRANSPORT_EMISSION_FACTORS.car_petrol;

  const dailyKgCO2e = roundTripKm * factor.factorKgCO2ePerKm;
  const weeklyKgCO2e = dailyKgCO2e * daysPerWeek;
  const monthlyKgCO2e = weeklyKgCO2e * 4.33;
  const yearlyKgCO2e = dailyKgCO2e * (daysPerWeek * 50);

  // Toxic local pollutants (tailpipe g)
  const dailyPM25Grams = roundTripKm * factor.pm25GramsPerKm;
  const dailyNOxGrams = roundTripKm * factor.noxGramsPerKm;

  return {
    dailyKgCO2e: Number(dailyKgCO2e.toFixed(2)),
    weeklyKgCO2e: Number(weeklyKgCO2e.toFixed(1)),
    monthlyKgCO2e: Number(monthlyKgCO2e.toFixed(1)),
    yearlyKgCO2e: Number(yearlyKgCO2e.toFixed(1)),
    dailyPM25Grams: Number(dailyPM25Grams.toFixed(2)),
    dailyNOxGrams: Number(dailyNOxGrams.toFixed(2)),
    vehicleName: factor.name,
    citation: factor.source,
  };
}

/**
 * Scientific Clarification Note
 */
export const EMISSION_SCIENTIFIC_DISCLAIMER = 
  "Scientific Distinction: Greenhouse Gas (GHG) emissions (e.g. CO2 equivalent) drive global climate warming. Local air quality pollutants (PM2.5, PM10, NO2, SO2, CO) cause acute toxic smog and respiratory inhalation risk. Reducing your personal fossil travel reduces both GHG and local tailpipe emissions, but your individual CO2 savings do not directly equal a localized drop in citywide AQI due to regional meteorological, industrial, and atmospheric dispersion factors.";
