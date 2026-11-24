import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles,
  Baby,
  UserCheck,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FamilyMemberProfile } from '../types';
import { WhyThisMattersCard } from '../components/ui/WhyThisMattersCard';

export const FamilySafety: React.FC = () => {
  const { 
    airQuality, 
    familyMembers, 
    addFamilyMember, 
    removeFamilyMember, 
    familyPreparednessScore 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'Adult' | 'Child' | 'Elderly' | 'Sensitive'>('Child');
  const [asthmaInput, setAsthmaInput] = useState(false);
  const [toleranceInput, setToleranceInput] = useState(15);
  const [precautionInput, setPrecautionInput] = useState('');

  const isSevere = airQuality.currentAQI > 300;
  const isPoor = airQuality.currentAQI > 150;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newMember: FamilyMemberProfile = {
      id: `fam_${Date.now()}`,
      name: nameInput.trim(),
      role: roleInput,
      hasAsthmaOrCardio: asthmaInput,
      outdoorToleranceMin: Number(toleranceInput),
      specialPrecaution: precautionInput.trim() || 'Standard protective precautions',
    };

    addFamilyMember(newMember);
    setNameInput('');
    setPrecautionInput('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            Family Air Safety Mode
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Household member protection plans, pediatric and elderly advisories, and transparent preparedness scoring
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Protection Score Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-400">
                Preparedness Evaluation
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Checklist-Based
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{familyPreparednessScore}%</span>
              <span className="text-xs text-emerald-400 font-semibold">
                {familyPreparednessScore >= 80 ? 'Optimal Protection Readiness' : 'Moderate Protection Readiness'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 max-w-sm">
            Based transparently on verified HEPA purifier availability, mask supply readiness, routine task completion, and sensitivity safeguards.
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${familyPreparednessScore}%` }}
          />
        </div>
      </div>

      {/* Household Profiles Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-sky-400" />
          Household Profiles ({familyMembers.length} Members)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => {
            const isChild = member.role === 'Child';
            const isElderly = member.role === 'Elderly';

            return (
              <div
                key={member.id}
                className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-800/80 text-sky-400">
                        {isChild ? <Baby className="w-4 h-4 text-emerald-400" /> : <Users className="w-4 h-4 text-sky-400" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{member.name}</h4>
                        <span className="text-[10px] text-slate-400">{member.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                      title="Remove member"
                      aria-label="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs my-3">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Max Outdoor Exposure Today:</span>
                      <span className="font-bold text-white">
                        {isSevere ? '0 min (Stay Indoors)' : `${member.outdoorToleranceMin} mins max`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span>Respiratory Sensitivity:</span>
                      <span className={member.hasAsthmaOrCardio ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {member.hasAsthmaOrCardio ? 'Yes (Asthma / Cardio)' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-sky-300 block mb-0.5">Precaution:</strong>
                    {member.specialPrecaution}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Current AQI: {airQuality.currentAQI}</span>
                  <span className={isSevere ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                    {isSevere ? 'Shield Active' : 'Normal Vigilance'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why This Matters for Families */}
      <WhyThisMattersCard
        title="WHY AGE-SPECIFIC SMOG PRECAUTIONS MATTER"
        summary="Children breathe 50% more air per kilogram of body weight than adults, and elderly lungs possess fewer defense cilia, making both vulnerable to severe inflammatory spikes during winter temperature inversions."
        details={[
          "Child Health Impact: Particulate PM2.5 crosses through unsealed growing airways, provoking lifelong lung capacity reductions and hyper-reactive airway disease.",
          "Elderly Cardiovascular Impact: Heavy particulate inhalation causes acute autonomic imbalance and triggers elevated arterial blood pressure within 2 hours.",
          "Transparent Family Preparedness: This score reflects environmental readiness actions (masks, purifier, sealed drafts) rather than a clinical health prediction."
        ]}
        beneficiaries="Parents, senior caregivers, school chaperones, and pregnant individuals."
        assumptions="Advisories align with American Academy of Pediatrics & Indian Academy of Pediatrics ambient guidelines."
      />

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-400" />
              Add Household Member Profile
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add children, seniors, or sensitive family members to receive specific daily exposure time bounds.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Name / Nickname:</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Diya, Grandmother, Papa"
                  className="w-full glass-input rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Role / Age Category:</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white bg-slate-900 border border-slate-800"
                >
                  <option value="Child">Child (Developing Lungs)</option>
                  <option value="Elderly">Elderly (60+ yrs)</option>
                  <option value="Sensitive">Sensitive (Asthma / Chronic)</option>
                  <option value="Adult">Adult</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Outdoor Tolerance Time (mins in moderate air):
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={toleranceInput}
                  onChange={(e) => setToleranceInput(Number(e.target.value))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  id="asthmaCheck"
                  checked={asthmaInput}
                  onChange={(e) => setAsthmaInput(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 cursor-pointer"
                />
                <label htmlFor="asthmaCheck" className="text-slate-300 font-medium cursor-pointer">
                  Diagnosed respiratory or cardiac sensitivity
                </label>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Specific Household Precaution / Reminder:
                </label>
                <input
                  type="text"
                  value={precautionInput}
                  onChange={(e) => setPrecautionInput(e.target.value)}
                  placeholder="e.g. Inhaler before bed, N95 for school van"
                  className="w-full glass-input rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-500 shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
