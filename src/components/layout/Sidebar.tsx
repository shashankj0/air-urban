import React from 'react';
import { 
  LayoutDashboard, 
  Wind, 
  Bot, 
  CheckSquare, 
  Home, 
  Leaf, 
  Users, 
  Globe2, 
  BarChart3, 
  Settings,
  X,
  Mic,
  Compass,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile, onOpenVoiceAssistant }) => {
  const { activeTab, setActiveTab, t, airQuality, completedTasksCount, routineTasks } = useApp();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'liveAQI', label: t.nav.liveAQI, icon: Wind },
    { id: 'assistant', label: t.nav.assistant, icon: Bot, isGenAI: true },
    { id: 'routine', label: t.nav.routine, icon: CheckSquare, badge: `${completedTasksCount}/${routineTasks.length}` },
    { id: 'indoor', label: t.nav.indoor, icon: Home },
    { id: 'alternatives', label: t.nav.alternatives, icon: Leaf },
    { id: 'family', label: t.nav.family, icon: Users },
    { id: 'community', label: t.nav.community, icon: Globe2 },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-slate-800/80 transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside sidebar (on mobile) */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 md:hidden">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400" /> BreatheWise AI
            </span>
            <button 
              onClick={onCloseMobile}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick AQI Status Pill */}
          <div className="p-4 border-b border-slate-800/60">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                  {airQuality.location.name.split(',')[0]}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-white">{airQuality.currentAQI}</span>
                  <span className="text-[10px] text-slate-400">{airQuality.standard} AQI</span>
                </div>
              </div>
              <div 
                className="px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 border"
                style={{ 
                  backgroundColor: `${airQuality.color}20`, 
                  borderColor: `${airQuality.color}40`,
                  color: airQuality.color 
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: airQuality.color }} />
                {airQuality.categoryLabel}
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.isGenAI && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Voice Assistant Quick Action */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => handleSelect('assistant')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all focus:outline-none"
          >
            <Mic className="w-4 h-4" />
            <span>Voice & AI Assistant</span>
          </button>
          <div className="text-[10px] text-slate-500 text-center mt-2">
            BreatheWise AI v1.0 • Clean Air Tech
          </div>
        </div>
      </aside>
    </>
  );
};
