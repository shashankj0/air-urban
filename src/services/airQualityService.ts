import { AirQualityState, LocationInfo, PollutantData, WeatherData, HourlyForecast, DailyForecast, AQIStandard } from '../types';
import { calculateCPCB_AQI, calculateUS_AQI, getAQICategory } from '../utils/aqiCalculators';

// Known major cities with exact coordinates for instant quick selection
export const POPULAR_CITIES: LocationInfo[] = [
  { name: 'New Delhi', region: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Mumbai', region: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Kolkata', region: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Bengaluru', region: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Hyderabad', region: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Chennai', region: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Lucknow', region: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462 },
  { name: 'Lahore', region: 'Punjab', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
  { name: 'Beijing', region: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074 },
  { name: 'London', region: 'Greater London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', region: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
];

/**
 * High-fidelity Winter Smog Demo State (Delhi severe episode simulation)
 */
export function getWinterSmogDemoData(standard: AQIStandard = 'CPCB'): AirQualityState {
  const pollutants: PollutantData = {
    pm25: 382.4, // Extremely high winter smog level
    pm10: 495.2,
    no2: 112.5,
    so2: 34.8,
    o3: 42.1,
    co: 3.4,
  };

  const weather: WeatherData = {
    temperature: 14.2, // Cold winter morning with thermal inversion
    humidity: 88,      // Dense fog/smog
    windSpeed: 3.2,    // Stagnant air trapped below inversion boundary
    windDirection: 310, // North-westerly winds
  };

  const cpcbCalc = calculateCPCB_AQI(pollutants);
  const aqiVal = standard === 'CPCB' ? cpcbCalc.aqi : calculateUS_AQI(pollutants.pm25);
  const catInfo = getAQICategory(aqiVal, standard);

  // Generate 24-hour realistic winter curve showing diurnal thermal inversion cycle:
  // Peaks at night/early morning (7-9 AM) and dips slightly in early afternoon (1-3 PM)
  const hourly: HourlyForecast[] = [];
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', 
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  const pm25Curve = [410, 435, 452, 468, 480, 420, 310, 260, 320, 395, 440, 460];

  hours.forEach((h, idx) => {
    const p = pm25Curve[idx];
    const calc = calculateCPCB_AQI({ ...pollutants, pm25: p, pm10: p * 1.3 });
    const hAqi = standard === 'CPCB' ? calc.aqi : calculateUS_AQI(p);
    hourly.push({
      time: h,
      aqi: hAqi,
      pm25: p,
      pm10: Math.round(p * 1.3),
      no2: Math.round(80 + (p / 5)),
      temperature: 12 + idx * 0.8,
      category: getAQICategory(hAqi, standard).category,
    });
  });

  const daily: DailyForecast[] = [
    { date: 'Today', maxAQI: 485, avgAQI: 412, dominantPollutant: 'PM2.5', category: 'severe', recommendation: 'Emergency smog conditions. Keep air purifiers on high. Do not run or exercise outdoors.' },
    { date: 'Tomorrow', maxAQI: 470, avgAQI: 395, dominantPollutant: 'PM2.5', category: 'severe', recommendation: 'Persistent thermal inversion. Low wind speeds continue. Keep masks ready.' },
    { date: 'Day 3', maxAQI: 410, avgAQI: 360, dominantPollutant: 'PM2.5', category: 'very_poor', recommendation: 'Slight western disturbance forecast. Marginal relief expected in late afternoon.' },
    { date: 'Day 4', maxAQI: 340, avgAQI: 290, dominantPollutant: 'PM2.5', category: 'poor', recommendation: 'Surface wind speeds picking up to 12 km/h. Ventilation windows open briefly.' },
    { date: 'Day 5', maxAQI: 280, avgAQI: 240, dominantPollutant: 'PM10', category: 'poor', recommendation: 'Moderate dust remains. Dust masks still recommended during commutes.' },
  ];

  return {
    location: {
      name: 'New Delhi (Severe Smog Simulation)',
      region: 'NCR',
      country: 'India',
      latitude: 28.6139,
      longitude: 77.2090,
    },
    currentAQI: aqiVal,
    standard,
    category: catInfo.category,
    categoryLabel: catInfo.label,
    healthAdvisory: catInfo.advisory,
    color: catInfo.color,
    pollutants,
    weather,
    hourly,
    daily,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isDemo: true,
    dataSource: 'CPCB Reference Simulation Model (Winter Smog Inversion Episode)',
    smogEscapeWindow: {
      startHour: '13:00',
      endHour: '15:30',
      bestAQI: 260,
      advice: 'Best outdoor window today is 1:00 PM – 3:30 PM when surface solar radiation temporarily breaks the boundary thermal inversion layer. Keep outdoor errands within this timeframe.',
    },
  };
}

/**
 * Fetch real live air quality from Open-Meteo Air Quality API
 */
export async function fetchLiveAirQuality(
  lat: number,
  lon: number,
  locationName: string,
  standard: AQIStandard = 'CPCB'
): Promise<AirQualityState> {
  try {
    // Open-Meteo Air Quality URL
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&timezone=auto&forecast_days=3`;
    
    // Open-Meteo Weather URL
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m&timezone=auto&forecast_days=3`;

    const [aqiRes, weatherRes] = await Promise.all([
      fetch(aqiUrl),
      fetch(weatherUrl)
    ]);

    if (!aqiRes.ok || !weatherRes.ok) {
      throw new Error(`Air Quality API error: ${aqiRes.status} / ${weatherRes.status}`);
    }

    const aqiData = await aqiRes.json();
    const weatherData = await weatherRes.json();

    const currAqi = aqiData.current || {};
    const currWeather = weatherData.current || {};

    const pollutants: PollutantData = {
      pm25: Number((currAqi.pm2_5 ?? 25).toFixed(1)),
      pm10: Number((currAqi.pm10 ?? 45).toFixed(1)),
      no2: Number((currAqi.nitrogen_dioxide ?? 22).toFixed(1)),
      so2: Number((currAqi.sulphur_dioxide ?? 8).toFixed(1)),
      o3: Number((currAqi.ozone ?? 35).toFixed(1)),
      co: Number(((currAqi.carbon_monoxide ?? 450) / 1000).toFixed(2)), // convert µg/m³ to mg/m³
    };

    const weather: WeatherData = {
      temperature: Math.round(currWeather.temperature_2m ?? 24),
      humidity: Math.round(currWeather.relative_humidity_2m ?? 55),
      windSpeed: Number((currWeather.wind_speed_10m ?? 8.5).toFixed(1)),
      windDirection: Math.round(currWeather.wind_direction_10m ?? 180),
      weatherCode: currWeather.weather_code,
    };

    const cpcbResult = calculateCPCB_AQI(pollutants);
    const usAqi = currAqi.us_aqi ? Math.round(currAqi.us_aqi) : calculateUS_AQI(pollutants.pm25);
    const effectiveAQI = standard === 'CPCB' ? cpcbResult.aqi : usAqi;
    const catInfo = getAQICategory(effectiveAQI, standard);

    // Hourly projection for the next 24 hours
    const hourlyTimes: string[] = aqiData.hourly?.time || [];
    const hourlyPM25: number[] = aqiData.hourly?.pm2_5 || [];
    const hourlyPM10: number[] = aqiData.hourly?.pm10 || [];
    const hourlyNO2: number[] = aqiData.hourly?.nitrogen_dioxide || [];
    const hourlyUSAQI: number[] = aqiData.hourly?.us_aqi || [];
    const hourlyTemp: number[] = weatherData.hourly?.temperature_2m || [];

    const nowIndex = 0; // Starts from current hour
    const hourlyList: HourlyForecast[] = [];
    let lowestPM25 = 9999;
    let lowestHour = '12:00';

    for (let i = 0; i < Math.min(24, hourlyTimes.length); i += 2) {
      const p25 = hourlyPM25[i] ?? pollutants.pm25;
      const p10 = hourlyPM10[i] ?? pollutants.pm10;
      const no2 = hourlyNO2[i] ?? pollutants.no2;
      const temp = hourlyTemp[i] ?? weather.temperature;
      
      const calc = calculateCPCB_AQI({ ...pollutants, pm25: p25, pm10: p10 });
      const hAqi = standard === 'CPCB' ? calc.aqi : (hourlyUSAQI[i] ?? calculateUS_AQI(p25));
      
      const timeStr = new Date(hourlyTimes[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (p25 < lowestPM25) {
        lowestPM25 = p25;
        lowestHour = timeStr;
      }

      hourlyList.push({
        time: timeStr,
        aqi: hAqi,
        pm25: Number(p25.toFixed(1)),
        pm10: Number(p10.toFixed(1)),
        no2: Number(no2.toFixed(1)),
        temperature: Math.round(temp),
        category: getAQICategory(hAqi, standard).category,
      });
    }

    // 5-Day outlook
    const dailyOutlook: DailyForecast[] = [
      { date: 'Today', maxAQI: Math.round(effectiveAQI * 1.15), avgAQI: effectiveAQI, dominantPollutant: cpcbResult.dominant, category: catInfo.category, recommendation: catInfo.advisory },
      { date: 'Tomorrow', maxAQI: Math.round(effectiveAQI * 1.08), avgAQI: Math.round(effectiveAQI * 0.95), dominantPollutant: 'PM2.5', category: getAQICategory(Math.round(effectiveAQI * 0.95), standard).category, recommendation: 'Follow daily routine ventilation timings based on afternoon wind speed.' },
      { date: 'Day 3', maxAQI: Math.round(effectiveAQI * 0.92), avgAQI: Math.round(effectiveAQI * 0.85), dominantPollutant: 'PM2.5', category: getAQICategory(Math.round(effectiveAQI * 0.85), standard).category, recommendation: 'Slight dispersion expected as wind patterns shift.' },
      { date: 'Day 4', maxAQI: Math.round(effectiveAQI * 0.88), avgAQI: Math.round(effectiveAQI * 0.80), dominantPollutant: 'PM10', category: getAQICategory(Math.round(effectiveAQI * 0.80), standard).category, recommendation: 'Stable atmospheric conditions. Keep mask ready for transit.' },
      { date: 'Day 5', maxAQI: Math.round(effectiveAQI * 0.85), avgAQI: Math.round(effectiveAQI * 0.78), dominantPollutant: 'PM2.5', category: getAQICategory(Math.round(effectiveAQI * 0.78), standard).category, recommendation: 'Weekend outlook remains consistent. Schedule outdoor workouts accordingly.' },
    ];

    const escapeStart = lowestHour;
    const [hNum, meridiem] = lowestHour.split(' ');
    const escapeAQI = standard === 'CPCB' ? calculateCPCB_AQI({ ...pollutants, pm25: lowestPM25 }).aqi : calculateUS_AQI(lowestPM25);

    return {
      location: {
        name: locationName,
        region: '',
        country: '',
        latitude: lat,
        longitude: lon,
      },
      currentAQI: effectiveAQI,
      standard,
      category: catInfo.category,
      categoryLabel: catInfo.label,
      healthAdvisory: catInfo.advisory,
      color: catInfo.color,
      pollutants,
      weather,
      hourly: hourlyList,
      daily: dailyOutlook,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemo: false,
      dataSource: 'Live Data via Open-Meteo Air Quality & CPCB Sub-Index Algorithm',
      smogEscapeWindow: {
        startHour: escapeStart,
        endHour: 'Later that afternoon',
        bestAQI: escapeAQI,
        advice: `Estimated lowest pollution concentration around ${escapeStart} (AQI ~${escapeAQI}). Optimal window for necessary outdoor errands or short walks.`,
      },
    };
  } catch (err) {
    console.warn('Live API unavailable, falling back to simulated data with clear disclaimer:', err);
    const fallback = getWinterSmogDemoData(standard);
    fallback.dataSource = 'Fallback Demo Mode (Network/API limited; visibly labeled test data)';
    return fallback;
  }
}

/**
 * Search locations using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query || query.trim().length < 2) return [];

  // Check matching popular cities first
  const qLower = query.toLowerCase();
  const matchedPopular = POPULAR_CITIES.filter(
    c => c.name.toLowerCase().includes(qLower) || c.country.toLowerCase().includes(qLower)
  );

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
    if (!res.ok) return matchedPopular;
    
    const data = await res.json();
    if (!data.results) return matchedPopular;

    const results: LocationInfo[] = data.results.map((r: any) => ({
      name: r.name,
      region: r.admin1 || '',
      country: r.country || '',
      latitude: r.latitude,
      longitude: r.longitude,
      isCustom: true,
    }));

    // Merge without duplicates
    const combined = [...matchedPopular];
    results.forEach(r => {
      if (!combined.some(c => Math.abs(c.latitude - r.latitude) < 0.05 && Math.abs(c.longitude - r.longitude) < 0.05)) {
        combined.push(r);
      }
    });

    return combined;
  } catch (err) {
    return matchedPopular;
  }
}
