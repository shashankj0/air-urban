import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AirQualityState, 
  AQIStandard, 
  UserPreferences, 
  RoutineTask, 
  CommunityChallenge, 
  FamilyMemberProfile,
  LocationInfo
} from '../types';
import { getWinterSmogDemoData, fetchLiveAirQuality, POPULAR_CITIES } from '../services/airQualityService';
import { generateDailyRoutine } from '../services/routineService';
import { SEVEN_DAYS_CAMPAIGN_TASKS } from '../services/communityData';
import { TRANSLATIONS, Language } from '../services/i18n';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  airQuality: AirQualityState;
  setAirQuality: React.Dispatch<React.SetStateAction<AirQualityState>>;
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  standard: AQIStandard;
  setStandard: (std: AQIStandard) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  refreshAirQuality: () => Promise<void>;
  changeLocation: (loc: LocationInfo) => Promise<void>;
  routineTasks: RoutineTask[];
  toggleRoutineTask: (id: string) => void;
  regenerateRoutines: () => void;
  sevenDaysTasks: CommunityChallenge[];
  toggleSevenDaysTask: (id: string) => void;
  familyMembers: FamilyMemberProfile[];
  addFamilyMember: (member: FamilyMemberProfile) => void;
  removeFamilyMember: (id: string) => void;
  familyPreparednessScore: number;
  totalCO2AvoidedKg: number;
  completedTasksCount: number;
  isLoadingAir: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'Advait',
  location: POPULAR_CITIES[0], // New Delhi by default
  standard: 'CPCB',
  language: 'en',
  theme: 'dark',
  notificationsEnabled: true,
  highPollutionThreshold: 250,
  commuteMode: 'car_petrol',
  dailyCommuteDistanceKm: 14,
  workType: 'office',
  hasPurifier: true,
  householdMembers: {
    adults: 2,
    children: 1,
    elderly: 1,
    hasRespiratorySensitivity: true,
  },
};

const DEFAULT_FAMILY_MEMBERS: FamilyMemberProfile[] = [
  { id: 'f1', name: 'Rohan (Self)', role: 'Adult', hasAsthmaOrCardio: false, outdoorToleranceMin: 45, specialPrecaution: 'Wears N95 for motorcycle commute' },
  { id: 'f2', name: 'Aarav (Son, 7 yrs)', role: 'Child', hasAsthmaOrCardio: false, outdoorToleranceMin: 20, specialPrecaution: 'No outdoor school sports during severe smog' },
  { id: 'f3', name: 'Kavita (Grandmother, 68 yrs)', role: 'Elderly', hasAsthmaOrCardio: true, outdoorToleranceMin: 0, specialPrecaution: 'Strictly indoor HEPA bedroom; uses prescribed inhaler' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(false);

  // Load preferences from localStorage or fallback
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('breathewise_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [standard, setStandardState] = useState<AQIStandard>(preferences.standard || 'CPCB');
  const [language, setLanguageState] = useState<Language>(preferences.language || 'en');

  // Air Quality state
  const [airQuality, setAirQuality] = useState<AirQualityState>(() => {
    return getWinterSmogDemoData(preferences.standard || 'CPCB');
  });

  // Daily routine tasks
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>(() => {
    return generateDailyRoutine(airQuality, preferences);
  });

  // 7 Days campaign tasks
  const [sevenDaysTasks, setSevenDaysTasks] = useState<CommunityChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('breathewise_7days');
      return saved ? JSON.parse(saved) : SEVEN_DAYS_CAMPAIGN_TASKS;
    } catch {
      return SEVEN_DAYS_CAMPAIGN_TASKS;
    }
  });

  // Family members list
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberProfile[]>(() => {
    try {
      const saved = localStorage.getItem('breathewise_family');
      return saved ? JSON.parse(saved) : DEFAULT_FAMILY_MEMBERS;
    } catch {
      return DEFAULT_FAMILY_MEMBERS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('breathewise_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('breathewise_7days', JSON.stringify(sevenDaysTasks));
  }, [sevenDaysTasks]);

  useEffect(() => {
    localStorage.setItem('breathewise_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...partial };
      if (partial.standard) setStandardState(partial.standard);
      if (partial.language) setLanguageState(partial.language);
      return updated;
    });
  };

  const setStandard = (std: AQIStandard) => {
    setStandardState(std);
    updatePreferences({ standard: std });
    // Update current AQI with standard
    if (isDemoMode) {
      setAirQuality(getWinterSmogDemoData(std));
    } else {
      refreshAirQuality(std);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updatePreferences({ language: lang });
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const refreshAirQuality = async (overrideStd?: AQIStandard) => {
    const std = overrideStd || standard;
    setIsLoadingAir(true);
    try {
      if (isDemoMode) {
        setAirQuality(getWinterSmogDemoData(std));
      } else {
        const live = await fetchLiveAirQuality(
          preferences.location.latitude,
          preferences.location.longitude,
          preferences.location.name,
          std
        );
        setAirQuality(live);
      }
    } finally {
      setIsLoadingAir(false);
    }
  };

  const toggleDemoMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    if (nextMode) {
      setAirQuality(getWinterSmogDemoData(standard));
    } else {
      setIsLoadingAir(true);
      fetchLiveAirQuality(
        preferences.location.latitude,
        preferences.location.longitude,
        preferences.location.name,
        standard
      ).then(res => {
        setAirQuality(res);
      }).finally(() => {
        setIsLoadingAir(false);
      });
    }
  };

  const changeLocation = async (loc: LocationInfo) => {
    updatePreferences({ location: loc });
    setIsLoadingAir(true);
    try {
      if (!isDemoMode) {
        const live = await fetchLiveAirQuality(loc.latitude, loc.longitude, loc.name, standard);
        setAirQuality(live);
      } else {
        const demo = getWinterSmogDemoData(standard);
        demo.location = loc;
        setAirQuality(demo);
      }
    } finally {
      setIsLoadingAir(false);
    }
  };

  const toggleRoutineTask = (id: string) => {
    setRoutineTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const regenerateRoutines = () => {
    setRoutineTasks(generateDailyRoutine(airQuality, preferences));
  };

  const toggleSevenDaysTask = (id: string) => {
    setSevenDaysTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addFamilyMember = (member: FamilyMemberProfile) => {
    setFamilyMembers(prev => [...prev, member]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
  };

  // Compute Family Preparedness Score based strictly on transparent checklist criteria
  const familyPreparednessScore = React.useMemo(() => {
    let score = 30; // base awareness
    if (preferences.hasPurifier) score += 25;
    if (preferences.householdMembers.hasRespiratorySensitivity) score += 10;
    const completedRoutineRatio = routineTasks.filter(t => t.completed).length / Math.max(1, routineTasks.length);
    score += Math.round(completedRoutineRatio * 25);
    const completed7DaysCount = sevenDaysTasks.filter(t => t.completed).length;
    score += Math.min(10, completed7DaysCount * 2);
    return Math.min(100, score);
  }, [preferences, routineTasks, sevenDaysTasks]);

  // Total avoided CO2e (kg)
  const totalCO2AvoidedKg = React.useMemo(() => {
    const routinePoints = routineTasks.filter(t => t.completed).length * 1.5;
    const challengeKg = sevenDaysTasks
      .filter(t => t.completed)
      .reduce((acc, curr) => acc + curr.co2eSavingKg, 0);
    return Number((routinePoints + challengeKg + 14.8).toFixed(1));
  }, [routineTasks, sevenDaysTasks]);

  const completedTasksCount = routineTasks.filter(t => t.completed).length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        airQuality,
        setAirQuality,
        preferences,
        updatePreferences,
        standard,
        setStandard,
        language,
        setLanguage,
        t,
        isDemoMode,
        toggleDemoMode,
        refreshAirQuality,
        changeLocation,
        routineTasks,
        toggleRoutineTask,
        regenerateRoutines,
        sevenDaysTasks,
        toggleSevenDaysTask,
        familyMembers,
        addFamilyMember,
        removeFamilyMember,
        familyPreparednessScore,
        totalCO2AvoidedKg,
        completedTasksCount,
        isLoadingAir,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
