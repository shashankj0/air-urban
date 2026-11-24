import { describe, it, expect } from 'vitest';
import { generateDailyRoutine } from '../services/routineService';
import { getWinterSmogDemoData } from '../services/airQualityService';
import { AirQualityState, UserPreferences } from '../types';

describe('Daily Routine Generator Service', () => {
  it('adapts morning routine to indoor workout during severe smog', () => {
    const severeAir: AirQualityState = getWinterSmogDemoData('CPCB');
    expect(severeAir.currentAQI).toBeGreaterThan(300);

    const tasks = generateDailyRoutine(severeAir);
    const morningExertionTask = tasks.find(t => t.id === 'm1');

    expect(morningExertionTask).toBeDefined();
    expect(morningExertionTask?.title).toContain('Indoor Cardio');
    expect(morningExertionTask?.description).toContain('doors and windows closed');
    expect(morningExertionTask?.pollutionReason).toContain('inversion');
  });

  it('generates morning, afternoon, and evening tasks', () => {
    const severeAir = getWinterSmogDemoData('CPCB');
    const tasks = generateDailyRoutine(severeAir);

    const morningTasks = tasks.filter(t => t.timeSlot === 'morning');
    const afternoonTasks = tasks.filter(t => t.timeSlot === 'afternoon');
    const eveningTasks = tasks.filter(t => t.timeSlot === 'evening');

    expect(morningTasks.length).toBeGreaterThanOrEqual(2);
    expect(afternoonTasks.length).toBeGreaterThanOrEqual(2);
    expect(eveningTasks.length).toBeGreaterThanOrEqual(2);
  });

  it('incorporates the Smog Escape Window into afternoon tasks', () => {
    const air = getWinterSmogDemoData('CPCB');
    const tasks = generateDailyRoutine(air);

    const afternoonEscapeTask = tasks.find(t => t.id === 'a1');
    expect(afternoonEscapeTask?.description).toContain(air.smogEscapeWindow.startHour);
  });

  it('includes kitchen exhaust and combustion elimination advice', () => {
    const air = getWinterSmogDemoData('CPCB');
    const tasks = generateDailyRoutine(air);

    const kitchenTask = tasks.find(t => t.id === 'e1');
    const combustionTask = tasks.find(t => t.id === 'e2');

    expect(kitchenTask?.title).toContain('Kitchen Exhaust');
    expect(combustionTask?.title).toContain('Incense');
  });
});
