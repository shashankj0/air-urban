import { RoutineTask, AirQualityState, UserPreferences } from '../types';

export function generateDailyRoutine(
  aqiState: AirQualityState,
  preferences?: UserPreferences
): RoutineTask[] {
  const aqi = aqiState.currentAQI;
  const isSevere = aqi > 300;
  const isPoor = aqi > 150;
  const isModerate = aqi > 100;
  const commute = preferences?.commuteMode || 'car_petrol';

  const tasks: RoutineTask[] = [
    // Morning tasks
    {
      id: 'm1',
      timeSlot: 'morning',
      title: isSevere
        ? 'Indoor Cardio or Yoga Instead of Morning Run'
        : isPoor
        ? 'Shift Exercise to Afternoon Window'
        : 'Morning Walk in Park away from Arterial Roads',
      description: isSevere
        ? `AQI is ${aqi} (Severe). Ground-level thermal inversion traps peak pollutants between 6 AM and 9 AM. Exercise indoors with doors and windows closed.`
        : isPoor
        ? `AQI is ${aqi}. Postpone outdoor aerobic exertion until the cleanest escape window (${aqiState.smogEscapeWindow.startHour}).`
        : 'Air quality is acceptable. Enjoy a brisk morning walk in tree-covered green spaces.',
      pollutionReason: 'Morning cold air inversion traps heavy vehicular and biomass smoke at human breathing height.',
      whyThisMatters: 'Cardio doubles your respiratory tidal volume; moving exertion indoors prevents acute alveolar particulate deposition.',
      impactScore: 25,
      completed: false,
      iconName: 'Activity',
    },
    {
      id: 'm2',
      timeSlot: 'morning',
      title: 'Keep Windows Sealed During Peak Morning Traffic',
      description: 'Keep north and street-facing windows shut between 7:00 AM and 10:30 AM to prevent the morning traffic exhaust plume from penetrating the home.',
      pollutionReason: 'Peak commuter traffic and cold boundary conditions create highest diurnal particulate concentration.',
      whyThisMatters: 'Sealing exterior drafts during rush hour blocks 40–60% of outdoor particulate migration into living areas.',
      impactScore: 20,
      completed: false,
      iconName: 'ShieldAlert',
    },
    {
      id: 'm3',
      timeSlot: 'morning',
      title: commute.includes('car')
        ? 'Set Vehicle Air Conditioning to Cabin Recirculation'
        : commute === 'metro'
        ? 'Take Metro with N95 Mask for Station Walkway'
        : 'Equip Certified N95 Respirator for Commute',
      description: commute.includes('car')
        ? 'Turn AC knob to "Recirculation" mode before joining arterial traffic to avoid sucking exhaust fumes directly into car cabin.'
        : 'Wear a well-fitted N95 mask while walking through open stations and traffic intersections.',
      pollutionReason: 'Arterial roads experience PM2.5 and NO2 spikes up to 3x higher than citywide background monitor averages.',
      whyThisMatters: 'Recirculation mode reduces in-cabin particulate levels by up to 70% within 10 minutes of driving.',
      impactScore: 20,
      completed: false,
      iconName: 'Car',
    },

    // Afternoon tasks
    {
      id: 'a1',
      timeSlot: 'afternoon',
      title: 'Utilize Afternoon Smog Escape Window for Essential Errands',
      description: `Plan unavoidable grocery, transit, or outdoor tasks between ${aqiState.smogEscapeWindow.startHour} and ${aqiState.smogEscapeWindow.endHour}.`,
      pollutionReason: 'Solar radiation heats the surface, temporarily lifting the boundary inversion layer and dispersing particulate density.',
      whyThisMatters: 'Taking outdoor trips during peak solar mixing reduces particulate inhalation dose by ~45% compared to morning or night.',
      impactScore: 15,
      completed: false,
      iconName: 'Sun',
    },
    {
      id: 'a2',
      timeSlot: 'afternoon',
      title: 'Wet-Mop Indoor Living Space (Microfiber Clean)',
      description: 'Use a damp microfiber mop to capture settled fine dust and soot. Avoid dry-sweeping with brooms which resuspends fine particles into the air.',
      pollutionReason: 'Settled PM2.5 and PM10 continuously resuspend into breathing zones as family members walk across dry-swept floors.',
      whyThisMatters: 'Damp mopping traps particulate matter physically without mechanical aerosolization.',
      impactScore: 15,
      completed: false,
      iconName: 'Sparkles',
    },
    {
      id: 'a3',
      timeSlot: 'afternoon',
      title: 'Turn Off Engine at Long Red Lights (>20 Seconds)',
      description: 'Avoid vehicle idling at intersections or school pickup zones. Switch off engine during long traffic halts.',
      pollutionReason: 'Idling engines produce disproportionately dirty combustion, creating dense hot toxic clouds around pedestrian crossings.',
      whyThisMatters: 'Turning off the engine prevents unnecessary localized NO2 plumes and saves ~0.08 liters of fuel per 10 minutes of idling.',
      impactScore: 15,
      completed: false,
      iconName: 'Clock',
    },

    // Evening tasks
    {
      id: 'e1',
      timeSlot: 'evening',
      title: 'Operate Kitchen Exhaust Chimney Throughout Cooking',
      description: 'Switch on kitchen exhaust 2 minutes before igniting burners and keep running for 5 minutes post-cooking. Use lids on frying pans.',
      pollutionReason: 'Unvented gas burners and high-heat oil release heavy PM2.5, acrolein, and nitrogen dioxide that linger in living quarters.',
      whyThisMatters: 'Proper kitchen exhaust containment keeps indoor PM2.5 concentrations below 35 µg/m³ during food prep.',
      impactScore: 20,
      completed: false,
      iconName: 'Flame',
    },
    {
      id: 'e2',
      timeSlot: 'evening',
      title: 'Eliminate Evening Incense, Scented Candles, & Mosquito Coils',
      description: 'Use electrical mosquito repellents (or bed netting) and pure essential diffusers instead of burning coils or agarbatti.',
      pollutionReason: 'One burning mosquito coil emits the particulate equivalent of roughly 75 to 100 cigarettes in an enclosed room.',
      whyThisMatters: 'Combustion products in closed bedrooms during winter produce severe nighttime bronchospasms.',
      impactScore: 25,
      completed: false,
      iconName: 'Wind',
    },
    {
      id: 'e3',
      timeSlot: 'evening',
      title: 'Review Tomorrow’s Forecast & Set HEPA Sleep Mode',
      description: `Check the BreatheWise AI forecast for tomorrow morning and verify bedroom air purifier filter airflow.`,
      pollutionReason: 'Winter smog re-condenses after sunset as ground temperature cools, triggering high nighttime PM2.5 spikes.',
      whyThisMatters: 'Deep sleep in clean air (<25 µg/m³ PM2.5) enables full pulmonary and cardiovascular inflammatory recovery.',
      impactScore: 20,
      completed: false,
      iconName: 'Moon',
    },
  ];

  return tasks;
}
