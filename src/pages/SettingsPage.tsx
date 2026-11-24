import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  MapPin, 
  Key, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Trash2, 
  Download, 
  Save, 
  Check,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES } from '../services/airQualityService';
import { AQIStandard } from '../types';

export const SettingsPage: React.FC = () => {
  const { 
    preferences, 
    updatePreferences, 
    standard, 
    setStandard, 
    language, 
    setLanguage 
  } = useApp();

  const [userName, setUserName] = useState(preferences.userName);
  const [geminiApiKey, setGeminiApiKey] = useState(preferences.geminiApiKey || '');
  const [highThreshold, setHighThreshold] = useState(preferences.highPollutionThreshold || 250);
  const [notifications, setNotifications] = useState(preferences.notificationsEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updatePreferences({
      userName: userName.trim(),
      geminiApiKey: geminiApiKey.trim(),
      highPollutionThreshold: Number(highThreshold),
      notificationsEnabled: notifications,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear your local preferences and saved routines? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      preferences,
      exportTimestamp: new Date().toISOString(),
      appName: 'BreatheWise AI'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breathewise_settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            Preferences & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, alert thresholds, AI keys, and local data privacy
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* Profile & Location */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-emerald-400" />
          User Profile & Location Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Display Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Primary Urban Center:</label>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span>{preferences.location.name}</span>
              <span className="text-[10px] text-slate-500">Change via top navbar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standards & Multilingual */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-sky-400" />
          Air Quality Standard & Language
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">AQI Reporting Standard:</label>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value as AQIStandard)}
              className="w-full glass-input rounded-xl px-3 py-2 text-white bg-slate-900 border border-slate-800"
            >
              <option value="CPCB">CPCB (India Standard, 0–500 scale)</option>
              <option value="US_EPA">US EPA AirNow (0–500 scale)</option>
            </select>
            <span className="text-[10px] text-slate-500 block mt-1">
              Select CPCB for Indian regulatory sub-index breakpoints.
            </span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Interface Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full glass-input rounded-xl px-3 py-2 text-white bg-slate-900 border border-slate-800"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* GenAI Key Configuration */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Key className="w-4 h-4 text-purple-400" />
          GenAI Assistant Connection (Google Gemini)
        </h3>

        <div className="text-xs space-y-2">
          <p className="text-slate-300 leading-relaxed">
            BreatheWise AI includes a built-in rule engine that runs locally with 100% structured validity. To connect a live Google Gemini 1.5 Flash endpoint, enter your key below:
          </p>

          <input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full glass-input rounded-xl px-3 py-2 text-white"
          />

          <span className="text-[10px] text-slate-500 block">
            Keys are stored locally in your browser's private storage and never logged or exposed.
          </span>
        </div>
      </div>

      {/* Pollution Alert Thresholds */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bell className="w-4 h-4 text-amber-400" />
          Pollution Spike Alerts & Thresholds
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Notify when AQI exceeds:</span>
              <span className="text-amber-400 font-bold">{highThreshold} AQI</span>
            </div>
            <input
              type="range"
              min="100"
              max="400"
              step="25"
              value={highThreshold}
              onChange={(e) => setHighThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-slate-200 font-semibold block">Browser Push Notifications</span>
              <span className="text-[10px] text-slate-400">Receive alerts before morning rush hours</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 rounded text-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy, Export & Local Data */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Privacy Controls & Local Data
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          BreatheWise AI is built with privacy-first engineering. We collect zero personally identifiable healthcare data. All your saved daily routines and household profiles exist exclusively on your device.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Settings Backup (JSON)</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/40 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Clear Local Storage Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
