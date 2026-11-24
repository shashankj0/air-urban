export type AQIStandard = 'CPCB' | 'US_EPA';

export type AQICategory = 
  | 'good' 
  | 'satisfactory' 
  | 'moderate' 
  | 'poor' 
  | 'very_poor' 
  | 'severe';

export interface PollutantData {
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2: number;       // µg/m³
  so2: number;       // µg/m³
  o3: number;        // µg/m³
  co: number;        // mg/m³ or µg/m³
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number;    // %
  windSpeed: number;   // km/h
  windDirection: number; // degrees
  weatherCode?: number;
}

export interface HourlyForecast {
  time: string;        // ISO string or formatted hour
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  temperature: number;
  category: AQICategory;
}

export interface DailyForecast {
  date: string;
  maxAQI: number;
  avgAQI: number;
  dominantPollutant: string;
  category: AQICategory;
  recommendation: string;
}

export interface LocationInfo {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  isCustom?: boolean;
}

export interface AirQualityState {
  location: LocationInfo;
  currentAQI: number;
  standard: AQIStandard;
  category: AQICategory;
  categoryLabel: string;
  healthAdvisory: string;
  color: string;
  pollutants: PollutantData;
  weather: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastUpdated: string;
  isDemo: boolean;
  dataSource: string;
  smogEscapeWindow: {
    startHour: string;
    endHour: string;
    bestAQI: number;
    advice: string;
  };
}

export interface StructuredAIResponse {
  situationAnalysis: string;
  pollutionConcern: string;
  recommendedAction: string;
  whyItMatters: string;
  environmentalBenefit: string;
  exposureBenefit: string;
  estimatedCost: 'Free' | 'Low ($/₹)' | 'Medium ($$/₹₹)' | 'High ($$$/₹₹₹)';
  confidence: number; // e.g. 95%
  dataSource: string;
  medicalDisclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  structuredResponse?: StructuredAIResponse;
  timestamp: string;
  isVoiceInput?: boolean;
}

export interface UserPreferences {
  userName: string;
  location: LocationInfo;
  standard: AQIStandard;
  language: 'en' | 'hi' | 'te';
  theme: 'dark' | 'light' | 'system';
  geminiApiKey?: string;
  notificationsEnabled: boolean;
  highPollutionThreshold: number; // AQI value to alert at
  commuteMode: 'car_petrol' | 'car_diesel' | 'car_ev' | 'two_wheeler' | 'metro' | 'bus' | 'bicycle' | 'walk';
  dailyCommuteDistanceKm: number;
  workType: 'office' | 'wfh' | 'hybrid' | 'outdoor' | 'student';
  hasPurifier: boolean;
  householdMembers: {
    adults: number;
    children: number;
    elderly: number;
    hasRespiratorySensitivity: boolean;
  };
}

export interface RoutineTask {
  id: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  title: string;
  description: string;
  pollutionReason: string;
  whyThisMatters: string;
  impactScore: number;
  completed: boolean;
  iconName: string;
}

export interface IndoorDetectiveActivity {
  id: string;
  title: string;
  icon: string;
  typicalPollutants: string[];
  exposureRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  problemExplanation: string;
  immediateHack: string;
  sustainableFix: string;
  whyItMatters: string;
  ventilationRule: string;
}

export interface SustainableAlternativeItem {
  id: string;
  category: 'transport' | 'household' | 'community';
  title: string;
  currentProblem: string;
  suggestedAlternative: string;
  whyItIsBetter: string;
  emissionAvoidedKgCO2e: number;
  annualSavingsFormatted: string;
  longTermBenefit: string;
  emissionFactorCitation: string;
}

export interface CommunityChallenge {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  actionPrompt: string;
  co2eSavingKg: number;
  participantsCount: number;
  completed: boolean;
  category: 'transport' | 'household' | 'community' | 'advocacy';
}

export interface FamilyMemberProfile {
  id: string;
  name: string;
  role: 'Adult' | 'Child' | 'Elderly' | 'Sensitive';
  hasAsthmaOrCardio: boolean;
  outdoorToleranceMin: number;
  specialPrecaution: string;
}

export interface CleanRouteOption {
  mode: string;
  durationMin: number;
  pm25ExposureUgM3: number;
  ghgEmissionsKg: number;
  costINR: number;
  safetyRating: 'High' | 'Medium' | 'Low';
  recommended: boolean;
  whyThisMatters: string;
}
