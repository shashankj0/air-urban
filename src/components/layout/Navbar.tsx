import React, { useState } from 'react';
import { 
  Wind, 
  MapPin, 
  Search, 
  RefreshCw, 
  Globe, 
  Sparkles, 
  Sliders, 
  Menu, 
  X,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POPULAR_CITIES, searchLocations } from '../../services/airQualityService';
import { LocationInfo } from '../../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    airQuality, 
    preferences, 
    standard, 
    setStandard, 
    language, 
    setLanguage, 
    t, 
    isDemoMode, 
    toggleDemoMode, 
    refreshAirQuality,
    changeLocation,
    isLoadingAir
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setIsSearching(true);
      const results = await searchLocations(q);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const selectCity = (city: LocationInfo) => {
    changeLocation(city);
    setIsLocationModalOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wind className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                BreatheWise <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block leading-none">
                Winter Smog & Urban Air Protection
              </p>
            </div>
          </div>
        </div>

        {/* Center: Location Badge / Search */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all text-xs font-medium text-slate-200 hover:border-emerald-500/50"
            title="Click to search or change city"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[150px] truncate">{airQuality.location.name}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              Change <Search className="w-3 h-3 text-slate-400" />
            </span>
          </button>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* AQI Standard Toggle (CPCB vs US EPA) */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setStandard('CPCB')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                standard === 'CPCB'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Central Pollution Control Board (India Standard)"
            >
              CPCB (IN)
            </button>
            <button
              onClick={() => setStandard('US_EPA')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                standard === 'US_EPA'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="US Environmental Protection Agency Standard"
            >
              US EPA
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={toggleDemoMode}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isDemoMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
            }`}
            title={isDemoMode ? "Currently simulating severe winter smog episode. Click to switch to live sensors." : "Currently on live API data. Click to test winter smog demo episode."}
          >
            {isDemoMode ? (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Smog Demo</span>
              </>
            ) : (
              <>
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Live Data</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              aria-label="Select language"
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refreshAirQuality()}
            disabled={isLoadingAir}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 focus:outline-none"
            title="Refresh Air Quality"
            aria-label="Refresh Air Quality Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingAir ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Location Search Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700/80 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Select City or Location
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type city name (e.g. Delhi, Mumbai, Lahore, Beijing)..."
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Quick Popular Cities */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-400 block mb-2">
                Quick Select Urban Centers:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => selectCity(c)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border-t border-slate-800 pt-3 max-h-48 overflow-y-auto">
                <label className="text-xs font-medium text-slate-400 block mb-1">Search Results:</label>
                <div className="space-y-1">
                  {searchResults.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectCity(loc)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200 flex justify-between items-center transition-colors"
                    >
                      <span className="font-medium">{loc.name}</span>
                      <span className="text-slate-400 text-[11px]">{loc.region ? `${loc.region}, ` : ''}{loc.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
              <span>Uses Open-Meteo Global Geocoding</span>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
