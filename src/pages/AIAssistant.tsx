import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Key,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askGeminiAirAssistant } from '../services/aiAssistantService';
import { voiceService } from '../services/voiceService';
import { ChatMessage, StructuredAIResponse } from '../types';

export const AIAssistant: React.FC = () => {
  const { airQuality, preferences, updatePreferences } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${preferences.userName || 'there'}! I am your BreatheWise AI Air Protection Assistant. Current air quality in ${airQuality.location.name} is ${airQuality.currentAQI} (${airQuality.categoryLabel}). How can I help you, your family, or your daily routine stay protected today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(preferences.geminiApiKey || '');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const presetQueries = [
    'Is it safe to go for a morning walk today?',
    'Should my children play outside this afternoon?',
    'How can I reduce indoor pollution without an expensive purifier?',
    'What should I do during severe winter smog?',
    'Is cycling a good option for my commute today?',
    'What precautions should my elderly family members take?',
    'How can our household reduce our own air pollution footprint?'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const structuredResp = await askGeminiAirAssistant(
        textToSend.trim(),
        airQuality,
        preferences.geminiApiKey,
        preferences
      );

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        structuredResponse: structuredResp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error fetching assistant response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    setVoiceError(null);
    if (!voiceService.isSpeechSupported()) {
      setVoiceError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startListening(
        (transcript) => {
          setIsListening(false);
          setInputValue(transcript);
          handleSend(transcript);
        },
        (error) => {
          setIsListening(false);
          setVoiceError(`Voice error: ${error}`);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleSpeak = (msgId: string, resp: StructuredAIResponse) => {
    if (isSpeakingId === msgId) {
      voiceService.stopSpeaking();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(msgId);
      const speechText = `${resp.situationAnalysis}. Recommended action: ${resp.recommendedAction}. Why this matters: ${resp.whyItMatters}`;
      voiceService.speak(speechText, () => {
        setIsSpeakingId(null);
      });
    }
  };

  const handleSaveApiKey = () => {
    updatePreferences({ geminiApiKey: apiKeyInput.trim() });
    setShowApiKeyModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-400" />
              GenAI Air Protection Assistant
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> GenAI Powered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Context-aware protection routines, exposure hacks, and structured environmental intelligence
          </p>
        </div>

        {/* API Key & Engine Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 font-medium transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span>{preferences.geminiApiKey ? 'Gemini 1.5 Active' : 'Configure Gemini API Key'}</span>
          </button>
        </div>
      </div>

      {/* Preset Question Chips */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Common Winter Smog & Lifestyle Questions:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-left px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-950/40 text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 text-xs transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Error Notification */}
      {voiceError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{voiceError}</span>
          <button onClick={() => setVoiceError(null)} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 min-h-[480px] max-h-[680px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* User Message Bubble */}
            {msg.sender === 'user' && (
              <div className="max-w-xl rounded-2xl px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-medium shadow-md">
                <p>{msg.text}</p>
                <span className="text-[10px] text-emerald-200/80 block text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            )}

            {/* Assistant Welcome / Simple Text */}
            {msg.sender === 'assistant' && msg.text && (
              <div className="max-w-2xl rounded-2xl p-4 glass-card border border-slate-800 text-xs sm:text-sm text-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>BreatheWise AI Assistant</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
                <span className="text-[10px] text-slate-500 block">{msg.timestamp}</span>
              </div>
            )}

            {/* Structured AI Response Card */}
            {msg.sender === 'assistant' && msg.structuredResponse && (
              <div className="w-full max-w-3xl rounded-3xl p-5 sm:p-6 glass-card border border-purple-500/30 bg-slate-900/90 shadow-xl space-y-4">
                
                {/* Header with audio TTS trigger */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Validated Environmental Intelligence</span>
                      <span className="text-[10px] text-slate-400">Context: {airQuality.location.name} (AQI {airQuality.currentAQI})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(msg.id, msg.structuredResponse!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                    title={isSpeakingId === msg.id ? "Stop voice audio" : "Listen to voice explanation"}
                  >
                    {isSpeakingId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-rose-300">Stop Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Listen to Voice</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 1. Situation Analysis */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    1. Situation Analysis
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {msg.structuredResponse.situationAnalysis}
                  </p>
                </div>

                {/* 2. Pollution Concern */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block mb-1">
                    2. Inhalation & Atmospheric Concern
                  </span>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {msg.structuredResponse.pollutionConcern}
                  </p>
                </div>

                {/* 3. Recommended Action */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                    3. Recommended Action
                  </span>
                  <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    {msg.structuredResponse.recommendedAction}
                  </p>
                </div>

                {/* 4. WHY THIS MATTERS (Core Differentiator) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>WHY THIS MATTERS</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {msg.structuredResponse.whyItMatters}
                  </p>
                </div>

                {/* 5. Benefits & Cost Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Environmental Benefit:</span>
                    <span className="font-semibold text-teal-300 text-xs block mt-0.5">
                      {msg.structuredResponse.environmentalBenefit}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Inhalation Exposure Benefit:</span>
                    <span className="font-semibold text-emerald-300 text-xs block mt-0.5">
                      {msg.structuredResponse.exposureBenefit}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Estimated Cost:</span>
                    <span className="font-semibold text-white text-xs block mt-0.5">
                      {msg.structuredResponse.estimatedCost}
                    </span>
                  </div>
                </div>

                {/* Confidence, Source & Medical Disclaimer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[10px] text-slate-400">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Confidence: {msg.structuredResponse.confidence}% ({msg.structuredResponse.dataSource})
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="italic text-slate-500 bg-slate-950/40 p-2 rounded-lg border border-slate-900">
                    {msg.structuredResponse.medicalDisclaimer}
                  </p>
                </div>

              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl glass-card border border-purple-500/20 max-w-sm">
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-ping" />
            <span className="text-xs text-slate-300 font-medium">
              BreatheWise AI is evaluating atmospheric conditions...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title={isListening ? "Listening... Click to stop" : "Click to speak voice question"}
            aria-label="Voice question input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Ask about morning walks, children safety, indoor hacks, winter smog..."}
            className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Gemini API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-purple-400" />
              Configure Google Gemini API Key
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              BreatheWise AI includes an intelligent built-in expert engine that works immediately without any API key. If you wish to connect your own live Gemini 1.5 Flash endpoint, enter your key below:
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Your key is stored securely in your browser's localStorage and never transmitted to third parties.
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput('');
                  updatePreferences({ geminiApiKey: '' });
                  setShowApiKeyModal(false);
                }}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear Key
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
