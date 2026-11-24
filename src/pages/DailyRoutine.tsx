import React, { useState } from 'react';
import { 
  CheckSquare, 
  RotateCcw, 
  Sliders, 
  Sun, 
  Clock, 
  Moon, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Award,
  ChevronDown,
  ChevronUp,
  Car,
  Flame,
  Wind
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';
import { SmogEscapeBadge } from '../components/ui/SmogEscapeBadge';
import { RoutineTask } from '../types';

export const DailyRoutine: React.FC = () => {
  const { 
    airQuality, 
    preferences, 
    updatePreferences, 
    routineTasks, 
    toggleRoutineTask, 
    regenerateRoutines,
    completedTasksCount
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [commuteInput, setCommuteInput] = useState(preferences.commuteMode);
  const [distanceInput, setDistanceInput] = useState(preferences.dailyCommuteDistanceKm);
  const [workTypeInput, setWorkTypeInput] = useState(preferences.workType);
  const [purifierInput, setPurifierInput] = useState(preferences.hasPurifier);

  const filteredTasks = routineTasks.filter(
    t => activeFilter === 'all' || t.timeSlot === activeFilter
  );

  const progressPercentage = Math.round(
    (completedTasksCount / Math.max(1, routineTasks.length)) * 100
  );

  const handleSaveConfig = () => {
    updatePreferences({
      commuteMode: commuteInput,
      dailyCommuteDistanceKm: Number(distanceInput),
      workType: workTypeInput,
      hasPurifier: purifierInput,
    });
    regenerateRoutines();
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            Personalized Daily Routine Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            GenAI routines dynamically tailored to current AQI ({airQuality.currentAQI}), travel patterns, and household lifestyle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 font-medium transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tune Profile & Lifestyle</span>
          </button>

          <button
            onClick={regenerateRoutines}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 font-medium transition-colors"
            title="Regenerate routine based on latest AQI"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Re-adapt</span>
          </button>
        </div>
      </div>

      {/* Progress & Summary Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Daily Protection Progress
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{completedTasksCount} of {routineTasks.length}</span>
              <span className="text-xs text-slate-400">Actions Completed ({progressPercentage}%)</span>
            </div>
          </div>

          {progressPercentage === 100 ? (
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Full Daily Inhalation Shield Achieved!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Target: Complete morning and evening checklist items to minimize inhalation dose.
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Smog Escape Window */}
      <SmogEscapeBadge
        startHour={airQuality.smogEscapeWindow.startHour}
        endHour={airQuality.smogEscapeWindow.endHour}
        bestAQI={airQuality.smogEscapeWindow.bestAQI}
        advice={airQuality.smogEscapeWindow.advice}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'all', label: 'All Day', icon: Sparkles },
          { id: 'morning', label: 'Morning (Inversion Peak)', icon: Sun },
          { id: 'afternoon', label: 'Afternoon (Solar Mixing)', icon: Clock },
          { id: 'evening', label: 'Evening (Night Re-condensation)', icon: Moon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeFilter === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`glass-panel rounded-2xl p-5 border transition-all ${
              task.completed 
                ? 'border-emerald-500/40 bg-emerald-950/15' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleRoutineTask(task.id)}
                  aria-label={task.title}
                  className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {task.timeSlot}
                    </span>
                    <span className="text-[10px] text-teal-400 font-semibold">
                      +{task.impactScore} Protection Pts
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Why This Matters expandable inside card */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <WhyThisMattersCard
                summary={task.whyThisMatters}
                details={[
                  `Atmospheric Cause: ${task.pollutionReason}`,
                  `Health Impact: Substantially lowers immediate respiratory and vascular oxidative load.`
                ]}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Routine Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Tune Your Daily Routine Questionnaire
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              BreatheWise adapts advice based on your transport, distance, and household equipment.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Primary Commute Method:
                </label>
                <select
                  value={commuteInput}
                  onChange={(e) => setCommuteInput(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white bg-slate-900 border border-slate-800"
                >
                  <option value="car_petrol">Petrol Car</option>
                  <option value="car_diesel">Diesel Car</option>
                  <option value="car_ev">Electric Vehicle (Car)</option>
                  <option value="two_wheeler">2-Wheeler (Motorcycle/Scooter)</option>
                  <option value="metro">Metro Rail / Train</option>
                  <option value="bus">City Bus</option>
                  <option value="bicycle">Bicycle / Walking</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Daily Commute Distance (One Way in km):
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={distanceInput}
                  onChange={(e) => setDistanceInput(Number(e.target.value))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Daily Work Setting:
                </label>
                <select
                  value={workTypeInput}
                  onChange={(e) => setWorkTypeInput(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white bg-slate-900 border border-slate-800"
                >
                  <option value="office">Office (Indoor AC/Filtered)</option>
                  <option value="wfh">Work from Home (Residential)</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="outdoor">Outdoor / Site Fieldwork</option>
                  <option value="student">Student (School / College)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-semibold block">HEPA Air Purifier at Home?</span>
                  <span className="text-[11px] text-slate-400">Allows indoor closed-loop recirculation advice</span>
                </div>
                <input
                  type="checkbox"
                  checked={purifierInput}
                  onChange={(e) => setPurifierInput(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 shadow-md"
              >
                Save & Update Routines
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
