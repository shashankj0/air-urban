import { describe, it, expect } from 'vitest';
import { getWinterSmogDemoData } from '../services/airQualityService';
import { askGeminiAirAssistant, generateIntelligentLocalResponse } from '../services/aiAssistantService';
import { SEVEN_DAYS_CAMPAIGN_TASKS } from '../services/communityData';
import { INDOOR_DETECTIVE_ACTIVITIES } from '../services/indoorDetectiveData';
import { SUSTAINABLE_ALTERNATIVES_DATA } from '../services/alternativesData';

describe('BreatheWise AI End-to-End System Integration', () => {
  it('generates fully structured AI responses conforming to the required 7-point schema', async () => {
    const air = getWinterSmogDemoData('CPCB');
    const prompt = 'Is it safe to go for a morning walk today?';
    
    const response = await askGeminiAirAssistant(prompt, air);

    // Verify all 7 required structured points are present and non-empty
    expect(response.situationAnalysis).toBeTruthy();
    expect(response.pollutionConcern).toBeTruthy();
    expect(response.recommendedAction).toBeTruthy();
    expect(response.whyItMatters).toBeTruthy();
    expect(response.environmentalBenefit).toBeTruthy();
    expect(response.exposureBenefit).toBeTruthy();
    expect(response.estimatedCost).toBeTruthy();
    expect(response.confidence).toBeGreaterThanOrEqual(80);
    expect(response.dataSource).toBeTruthy();
    expect(response.medicalDisclaimer).toContain('not');
  });

  it('contains complete, structured Indoor Detective activities with hacks and explanations', () => {
    expect(INDOOR_DETECTIVE_ACTIVITIES.length).toBeGreaterThanOrEqual(8);
    
    INDOOR_DETECTIVE_ACTIVITIES.forEach((activity) => {
      expect(activity.id).toBeTruthy();
      expect(activity.title).toBeTruthy();
      expect(activity.typicalPollutants.length).toBeGreaterThan(0);
      expect(activity.problemExplanation).toBeTruthy();
      expect(activity.immediateHack).toBeTruthy();
      expect(activity.sustainableFix).toBeTruthy();
      expect(activity.whyItMatters).toBeTruthy();
      expect(activity.ventilationRule).toBeTruthy();
    });
  });

  it('contains verified sustainable alternatives with defensible emission factors and citations', () => {
    expect(SUSTAINABLE_ALTERNATIVES_DATA.length).toBeGreaterThanOrEqual(6);

    SUSTAINABLE_ALTERNATIVES_DATA.forEach((alt) => {
      expect(alt.emissionAvoidedKgCO2e).toBeGreaterThan(0);
      expect(alt.currentProblem).toBeTruthy();
      expect(alt.suggestedAlternative).toBeTruthy();
      expect(alt.whyItIsBetter).toBeTruthy();
      expect(alt.emissionFactorCitation).toBeTruthy();
    });
  });

  it('initializes the complete 7 Days to Cleaner Air campaign with actionable targets', () => {
    expect(SEVEN_DAYS_CAMPAIGN_TASKS.length).toBe(7);
    
    for (let day = 1; day <= 7; day++) {
      const task = SEVEN_DAYS_CAMPAIGN_TASKS.find(t => t.dayNumber === day);
      expect(task).toBeDefined();
      expect(task?.co2eSavingKg).toBeGreaterThan(0);
      expect(task?.actionPrompt).toBeTruthy();
    }
  });

  it('accurately identifies the Smog Escape Window from diurnal curves', () => {
    const air = getWinterSmogDemoData('CPCB');
    expect(air.smogEscapeWindow.startHour).toBeDefined();
    expect(air.smogEscapeWindow.endHour).toBeDefined();
    expect(air.smogEscapeWindow.bestAQI).toBeLessThan(air.currentAQI);
  });
});
