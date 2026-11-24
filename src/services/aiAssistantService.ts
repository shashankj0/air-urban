import { StructuredAIResponse, AirQualityState, UserPreferences } from '../types';

/**
 * Prompt Injection and Jailbreak Guard
 * Detects malicious prompt patterns attempting to bypass safety rules or leak system instructions.
 */
export function sanitizeAndGuardPrompt(prompt: string): { isSafe: boolean; reason?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { isSafe: false, reason: 'Empty or invalid prompt.' };
  }

  const suspiciousPatterns = [
    /ignore previous instructions/i,
    /disregard all previous/i,
    /system prompt/i,
    /you are now in developer mode/i,
    /jailbreak/i,
    /bypass safety/i,
    /act as DAN/i,
    /reveal your internal/i,
    /<script/i,
    /javascript:/i,
    /DROP TABLE/i,
    /--/i,
    /__proto__/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(prompt)) {
      return {
        isSafe: false,
        reason: 'Input contains prohibited keywords or prompt injection patterns.',
      };
    }
  }

  return { isSafe: true };
}

/**
 * Intelligent Offline Rule-Based GenAI Engine
 * Generates context-aware, structured environmental & health responses
 * when no API key is provided or when offline.
 */
export function generateIntelligentLocalResponse(
  userQuery: string,
  aqiState: AirQualityState,
  preferences?: UserPreferences
): StructuredAIResponse {
  const query = userQuery.toLowerCase();
  const currentAQI = aqiState.currentAQI;
  const isSevere = currentAQI > 300;
  const isPoor = currentAQI > 150;
  const isModerate = currentAQI > 100;
  const location = aqiState.location.name;

  // Question Category 1: Morning walk / Exercise / Running outdoors
  if (query.includes('walk') || query.includes('exercise') || query.includes('run') || query.includes('jog') || query.includes('outdoor workout')) {
    if (isSevere) {
      return {
        situationAnalysis: `Current AQI in ${location} is ${currentAQI} (Severe/Hazardous), driven by PM2.5 levels of ${aqiState.pollutants.pm25} µg/m³. Severe winter temperature inversion traps heavy toxic particulates near ground level.`,
        pollutionConcern: `High physical exertion increases ventilation rate by 4x to 10x, deeply pulling fine PM2.5 and ultrafine particles into pulmonary alveoli and the bloodstream, triggering vascular inflammation and respiratory distress.`,
        recommendedAction: `Avoid all outdoor jogging or walking. Move your workout indoors with closed windows and run an air purifier on medium/high. If you must step out, do so between ${aqiState.smogEscapeWindow.startHour} and ${aqiState.smogEscapeWindow.endHour} wearing a certified, tight-fitting N95/N99 respirator.`,
        whyItMatters: `Exercising in severe smog delivers more particulate mass to your lungs in 30 minutes than a full day of resting indoors. Restricting exertion protects cardiac and respiratory systems.`,
        environmentalBenefit: `Prevents secondary aerosol buildup and respiratory emergencies.`,
        exposureBenefit: `Reduces inhaled PM2.5 dose by up to 85–92% compared to an outdoor morning run.`,
        estimatedCost: 'Free',
        confidence: 96,
        dataSource: 'WHO Air Quality Guidelines & CPCB Health Advisory Protocols',
        medicalDisclaimer: 'BreatheWise AI provides environmental exposure guidance, not individualized medical diagnosis. Individuals with chronic cardiovascular or respiratory conditions should consult their physician.',
      };
    } else if (isPoor) {
      return {
        situationAnalysis: `Current AQI in ${location} is ${currentAQI} (Poor / Unhealthy). Fine particulate matter PM2.5 is at ${aqiState.pollutants.pm25} µg/m³, exceeding safe standards.`,
        pollutionConcern: `Prolonged aerobic exercise outdoors will cause airway irritation, coughing, and reduced lung capacity, especially in the early morning when stagnation is highest.`,
        recommendedAction: `Shift your walk or run to the early afternoon window (${aqiState.smogEscapeWindow.startHour}) when solar heating has lifted surface smog, or choose low-intensity indoor yoga and stretching.`,
        whyItMatters: `Shifting exertion timing to hours with active thermal mixing cuts particulate intake without skipping exercise routines entirely.`,
        environmentalBenefit: `Zero vehicle use if walking locally.`,
        exposureBenefit: `Avoids peak diurnal pollution exposure, cutting particulate intake by 40–55%.`,
        estimatedCost: 'Free',
        confidence: 92,
        dataSource: 'Open-Meteo & Central Pollution Control Board (CPCB)',
        medicalDisclaimer: 'General health guidance only. Stop activity immediately if you experience chest tightness, shortness of breath, or dizziness.',
      };
    } else {
      return {
        situationAnalysis: `Current AQI in ${location} is ${currentAQI} (${aqiState.categoryLabel}). Air quality is within acceptable bounds with low to moderate particulate load.`,
        pollutionConcern: `Minimal immediate exposure concern for general population. Sensitive individuals should monitor how they feel.`,
        recommendedAction: `Safe to go for your morning walk or run. Outdoor green corridors or parks away from high-traffic arterial roads are ideal.`,
        whyItMatters: `Exercising in clean or satisfactory air boosts cardiovascular fitness and mental well-being with minimal toxic inhalation.`,
        environmentalBenefit: `Walking produces zero tailpipe and greenhouse gas emissions.`,
        exposureBenefit: `Exercising away from major roads reduces direct NO2 and black carbon inhalation by ~30%.`,
        estimatedCost: 'Free',
        confidence: 94,
        dataSource: 'CPCB & EPA Air Quality Indices',
        medicalDisclaimer: 'Always listen to your body and adjust pace if sensitive.',
      };
    }
  }

  // Question Category 2: Children / Kids playing outside / School
  if (query.includes('child') || query.includes('kid') || query.includes('school') || query.includes('play')) {
    if (isPoor || isSevere) {
      return {
        situationAnalysis: `Children have higher breathing rates per kilogram of body weight and their developing lungs are uniquely vulnerable to PM2.5 and NO2 at current AQI (${currentAQI}).`,
        pollutionConcern: `Fine particles deposit deep in growing alveoli, reducing lung capacity growth and worsening asthma triggers or acute upper-respiratory infections.`,
        recommendedAction: `Keep children's playtime indoors today. Recommend schools suspend outdoor sports and morning assemblies during smog hours. Ensure school commute is conducted with closed vehicle windows or N95 masks.`,
        whyItMatters: `Childhood exposure to severe particulate spikes is clinically correlated with increased lifelong asthma incidence and missed school days.`,
        environmentalBenefit: `Advocating for indoor school recess protects thousands of students concurrently.`,
        exposureBenefit: `Cuts direct particulate inhalation by up to 75% compared to active outdoor sports.`,
        estimatedCost: 'Free',
        confidence: 97,
        dataSource: 'UNICEF Clean Air for Children Initiative & WHO Pediatric Respiratory Studies',
        medicalDisclaimer: 'Consult your pediatrician for tailored asthma management action plans.',
      };
    } else {
      return {
        situationAnalysis: `Current AQI is ${currentAQI} (${aqiState.categoryLabel}). Outdoor conditions are safe for regular children's play and sports.`,
        pollutionConcern: `Low ambient threat. Normal precautions apply.`,
        recommendedAction: `Encourage outdoor physical play in parks, residential compounds, and sports fields. Keep children well-hydrated.`,
        whyItMatters: `Outdoor physical activity is vital for motor development, bone density, and circadian rhythm.`,
        environmentalBenefit: `Unplugged outdoor play saves indoor household electricity.`,
        exposureBenefit: `Natural daylight exposure and fresh air circulation.`,
        estimatedCost: 'Free',
        confidence: 95,
        dataSource: 'WHO & CPCB Ambient Standards',
        medicalDisclaimer: 'Maintain standard hydration and general outdoor safety.',
      };
    }
  }

  // Question Category 3: Indoor air / Purifier / Indoor pollution hacks
  if (query.includes('indoor') || query.includes('purifier') || query.includes('hack') || query.includes('house') || query.includes('home') || query.includes('clean air')) {
    return {
      situationAnalysis: `Indoor air during winter smog often reaches 60–80% of outdoor pollution levels if windows are drafty, and can become worse if indoor combustion (cooking, incense, coils) takes place.`,
      pollutionConcern: `Indoor accumulation of PM2.5, VOCs from cleaning agents, and nitrogen dioxide from gas burners in unventilated living spaces.`,
      recommendedAction: `1. Keep windows tightly shut during early morning and late evening smog peaks. 2. Wet-mop floors with microfiber cloth instead of dry broom sweeping. 3. Avoid agarbatti (incense sticks), dhoop, and mosquito coils. 4. Always turn on the kitchen exhaust fan before lighting gas stoves. 5. If using a HEPA purifier, place it away from walls in the most occupied room.`,
      whyItMatters: `Most urban residents spend 85–90% of their day indoors. Optimizing indoor practices drastically lowers total daily inhalation dose even without expensive appliances.`,
      environmentalBenefit: `Zero-waste, low-energy indoor air quality management hacks.`,
      exposureBenefit: `Can reduce indoor PM2.5 concentrations by 40% to 70%.`,
      estimatedCost: 'Low ($/₹)',
      confidence: 95,
      dataSource: 'EPA Indoor Air Quality Guide & CPCB Household Protocols',
      medicalDisclaimer: 'Indoor hacks reduce exposure but do not replace prescribed medical therapies for respiratory disorders.',
    };
  }

  // Question Category 4: Commute / Cycling / Travel / Traffic
  if (query.includes('cycling') || query.includes('cycle') || query.includes('bike') || query.includes('commute') || query.includes('travel') || query.includes('car')) {
    if (isSevere) {
      return {
        situationAnalysis: `At AQI ${currentAQI}, heavy traffic corridors have extreme localized concentrations of black carbon, diesel soot, and toxic NO2.`,
        pollutionConcern: `Cycling or open two-wheeler riding requires intense respiration directly inside the high-exposure vehicular exhaust plume.`,
        recommendedAction: `Avoid cycling or open two-wheeler commuting today. Choose Metro Rail, local trains, or closed air-conditioned buses with recirculated air. If driving, keep vehicle AC on 'Recirculation' mode to block tunnel and tailpipe ingress.`,
        whyItMatters: `Inhalation of ultrafine traffic particles during heavy exertion damages endothelial vessel linings within hours.`,
        environmentalBenefit: `Public metro rail saves ~0.15 kg CO2e per passenger-kilometer compared to private cars.`,
        exposureBenefit: `Air-conditioned transit or metro reduces direct in-cabin particulate exposure by 60–80%.`,
        estimatedCost: 'Low ($/₹)',
        confidence: 93,
        dataSource: 'International Council on Clean Transportation (ICCT) & TERI Commuter Exposure Studies',
        medicalDisclaimer: 'Travel safety advisory based on environmental data; obey local traffic and transport regulations.',
      };
    } else {
      return {
        situationAnalysis: `Current AQI is ${currentAQI}. Traffic corridors still exhibit elevated local roadside particulate spikes.`,
        pollutionConcern: `Tailpipe emissions alongside arterial roads during peak rush hours.`,
        recommendedAction: `Cycling is viable if choosing separated green trails or secondary roads instead of congested arterial highways. Wear a lightweight dust mask during rush hours.`,
        whyItMatters: `Route choice is the most effective lever for cyclists: moving one street away from heavy diesel traffic cuts toxic exposure by up to 50%.`,
        environmentalBenefit: `Zero tailpipe emissions and zero fossil fuel burning.`,
        exposureBenefit: `Bypassing main highway corridors avoids heavy diesel exhaust plumes.`,
        estimatedCost: 'Free',
        confidence: 91,
        dataSource: 'Urban Exposure Mapping & CPCB Transport Guidelines',
        medicalDisclaimer: 'Ensure helmet and high-visibility gear when cycling.',
      };
    }
  }

  // Question Category 5: Reducing personal contribution / sustainability
  if (query.includes('contribution') || query.includes('reduce') || query.includes('impact') || query.includes('sustainable') || query.includes('emissions')) {
    return {
      situationAnalysis: `Urban winter smog is amplified by widespread localized emissions: vehicular idling, biomass/waste burning, diesel generator sets, and inefficient household energy.`,
      pollutionConcern: `Every single vehicle trip and biomass fire directly adds fine soot that stays trapped under the winter thermal inversion layer for days.`,
      recommendedAction: `1. Turn off your vehicle engine at red lights over 20 seconds. 2. Shift 2 commute trips per week to Metro or carpool. 3. Strictly report or avoid dry leaf and garbage burning in your neighborhood. 4. Use electric induction cooktop for water boiling. 5. Combine weekend errands into a single trip.`,
      whyItMatters: `Collective urban air quality improves only when individuals and communities actively curb low-level ground emissions that inversion traps.`,
      environmentalBenefit: `Cuts an estimated 8.5 kg CO2e and 35g of toxic NOx per commuter each week.`,
      exposureBenefit: `Directly improves local neighborhood breathing zone air quality.`,
      estimatedCost: 'Free',
      confidence: 94,
      dataSource: 'BEE Energy Audits & ARAI Vehicular Idling Benchmarks',
      medicalDisclaimer: 'Environmental stewardship advice.',
    };
  }

  // Question Category 6: Winter Smog general / Precaution / Masks
  return {
    situationAnalysis: `In ${location}, current AQI stands at ${currentAQI} (${aqiState.categoryLabel}) with dominant pollutant PM2.5 at ${aqiState.pollutants.pm25} µg/m³. Atmospheric conditions show ${aqiState.weather.temperature}°C with ${aqiState.weather.humidity}% humidity.`,
    pollutionConcern: `Fine particulate matter (PM2.5) penetrates deep into the bloodstream, while stagnant winter weather prevents vertical dispersion.`,
    recommendedAction: `1. Wear a certified N95 or FFP2 respirator outdoors (cloth masks and surgical masks do not seal fine PM2.5). 2. Plan high-exertion outdoor activities around the cleanest window (${aqiState.smogEscapeWindow.startHour}–${aqiState.smogEscapeWindow.endHour}). 3. Keep indoor air clean using wet mopping and HEPA filtration. 4. Maintain adequate hydration and nasal saline rinsing if throat feels dry.`,
    whyItMatters: `Multi-layered personal protection shields both upper and lower airways from cumulative inflammatory damage during multi-week winter smog episodes.`,
    environmentalBenefit: `Prevents avoidable health emergencies and raises community awareness.`,
    exposureBenefit: `Proper N95 mask sealing filters out over 95% of airborne particulate matter.`,
    estimatedCost: 'Low ($/₹)',
    confidence: 95,
    dataSource: 'CPCB Guidelines for Winter Smog Preparedness & US EPA AirNow',
    medicalDisclaimer: 'BreatheWise AI is an environmental data assistant and does not provide clinical diagnosis or medical prescriptions.',
  };
}

/**
 * Call live Gemini API if API key is provided, with safety fallback
 */
export async function askGeminiAirAssistant(
  prompt: string,
  aqiState: AirQualityState,
  apiKey?: string,
  preferences?: UserPreferences
): Promise<StructuredAIResponse> {
  const guard = sanitizeAndGuardPrompt(prompt);
  if (!guard.isSafe) {
    return {
      situationAnalysis: 'Security & Safety Filter Triggered',
      pollutionConcern: 'Prompt contains unauthorized or potentially harmful commands.',
      recommendedAction: 'Please ask questions strictly related to air quality, pollution protection, health precautions, or low-emission routines.',
      whyItMatters: 'To ensure safety and data integrity, BreatheWise AI rejects prompt injection attempts and system-level overrides.',
      environmentalBenefit: 'N/A',
      exposureBenefit: 'N/A',
      estimatedCost: 'Free',
      confidence: 100,
      dataSource: 'BreatheWise AI Security Firewall',
      medicalDisclaimer: 'This system operates strictly as an environmental protection advisory.',
    };
  }

  // If no API key is provided, use our intelligent context-aware local engine
  if (!apiKey || apiKey.trim().length < 5) {
    return generateIntelligentLocalResponse(prompt, aqiState, preferences);
  }

  // Call Gemini 1.5 Flash endpoint
  try {
    const systemInstruction = `You are BreatheWise AI, an expert environmental scientist and personal air quality protection assistant.
Context:
Location: ${aqiState.location.name}
Current AQI: ${aqiState.currentAQI} (${aqiState.standard} Standard, Category: ${aqiState.categoryLabel})
PM2.5: ${aqiState.pollutants.pm25} µg/m³, PM10: ${aqiState.pollutants.pm10} µg/m³
Temperature: ${aqiState.weather.temperature}°C, Humidity: ${aqiState.weather.humidity}%, Wind: ${aqiState.weather.windSpeed} km/h
Cleanest window: ${aqiState.smogEscapeWindow.startHour} to ${aqiState.smogEscapeWindow.endHour}

Rules:
1. Provide actionable, low-emission daily routines and indoor hacks tailored to this location and pollution level.
2. Clearly explain WHY your recommendation matters.
3. Distinguish GHG (CO2e) from local toxic pollutants (PM2.5/NO2).
4. Never diagnose medical conditions or guarantee health cures. Always include medical disclaimers.
5. Return strictly valid JSON matching this schema:
{
  "situationAnalysis": "string",
  "pollutionConcern": "string",
  "recommendedAction": "string",
  "whyItMatters": "string",
  "environmentalBenefit": "string",
  "exposureBenefit": "string",
  "estimatedCost": "Free" | "Low ($/₹)" | "Medium ($$/₹₹)" | "High ($$$/₹₹₹)",
  "confidence": number between 80 and 99,
  "dataSource": "string citation",
  "medicalDisclaimer": "string"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.warn('Gemini API call returned non-200, falling back to local engine:', res.status);
      return generateIntelligentLocalResponse(prompt, aqiState, preferences);
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return generateIntelligentLocalResponse(prompt, aqiState, preferences);
    }

    const parsed: StructuredAIResponse = JSON.parse(candidateText);
    return parsed;
  } catch (err) {
    console.warn('Error during Gemini API call, using intelligent local engine:', err);
    return generateIntelligentLocalResponse(prompt, aqiState, preferences);
  }
}
