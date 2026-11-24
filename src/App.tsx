import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomeDashboard } from './pages/HomeDashboard';
import { LiveAirQuality } from './pages/LiveAirQuality';
import { AIAssistant } from './pages/AIAssistant';
import { DailyRoutine } from './pages/DailyRoutine';
import { IndoorProtection } from './pages/IndoorProtection';
import { SustainableAlternatives } from './pages/SustainableAlternatives';
import { FamilySafety } from './pages/FamilySafety';
import { CommunityHub } from './pages/CommunityHub';
import { ImpactAnalytics } from './pages/ImpactAnalytics';
import { SettingsPage } from './pages/SettingsPage';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HomeDashboard />;
      case 'liveAQI':
        return <LiveAirQuality />;
      case 'assistant':
        return <AIAssistant />;
      case 'routine':
        return <DailyRoutine />;
      case 'indoor':
        return <IndoorProtection />;
      case 'alternatives':
        return <SustainableAlternatives />;
      case 'family':
        return <FamilySafety />;
      case 'community':
        return <CommunityHub />;
      case 'analytics':
        return <ImpactAnalytics />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onCloseMobile={() => setMobileMenuOpen(false)} 
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-5xl overflow-hidden">
          {renderActivePage()}
        </main>
      </div>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
