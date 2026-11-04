import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  RefreshCw,
  Languages,
  User,
  Bot,
  Square,
  HelpCircle,
  Headphones,
} from 'lucide-react';
import { useSpeechToText } from '../../hooks/useSpeechToText.js';
import { useVoiceAgent } from '../../hooks/useVoiceAgent.js';
import { api } from '../../services/api.js';

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AgentState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

export const VoiceAgentModal: React.FC<VoiceAgentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [agentState, setAgentState] = useState<AgentState>('IDLE');
  const [userCaption, setUserCaption] = useState<string>('');
  const [aiCaption, setAiCaption] = useState<string>('');
  const [persona, setPersona] = useState<'COACH' | 'TECH' | 'SENSEI'>('COACH');
  const [isMuted, setIsMuted] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { speak, stop: stopSpeaking, isSpeaking, voices, selectedVoice, setSelectedVoice } =
    useVoiceAgent();

  const handleUserSpokenFinal = (finalText: string) => {
    if (!finalText.trim()) return;
    setUserCaption(finalText);
    stopListening();
    processAiResponse(finalText);
  };

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSttSupported,
  } = useSpeechToText({
    continuous: true,
    lang: persona === 'SENSEI' ? 'ja-JP' : 'en-US',
    onResult: (text, isFinal) => {
      setUserCaption(text);

      // Auto-send after 1.8 seconds of silence when continuous
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (text.trim().length > 3) {
          handleUserSpokenFinal(text);
        }
      }, 1800);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      stopListening();
      setAgentState('IDLE');
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    } else {
      // Greet user on opening
      const greeting =
        persona === 'SENSEI'
          ? 'こんにちは！私は日本語メンターです。何でも聞いてください。(Hello! I am your Japanese Language Mentor. Feel free to speak!)'
          : 'Hello! I am your Campus Placement Voice Coach. What would you like to practice today?';

      setAiCaption(greeting);
      setAgentState('SPEAKING');
      speak(greeting, {
        onEnd: () => {
          setAgentState('LISTENING');
          startListening();
        },
      });
    }
  }, [isOpen, persona]);

  const processAiResponse = async (promptText: string) => {
    setAgentState('THINKING');
    setAiCaption('Analyzing placement concepts & preparing response...');

    let fullAnswer = '';

    // Add persona prefix to guide backend RAG
    let adjustedPrompt = promptText;
    if (persona === 'SENSEI') {
      adjustedPrompt = `[JAPANESE_MENTOR_MODE] The student asks: "${promptText}". Please respond in concise Japanese with helpful English phonetic romaji and translations.`;
    } else if (persona === 'TECH') {
      adjustedPrompt = `[TECHNICAL_INTERVIEW_MODE] Act as a Senior Tech Interviewer: "${promptText}". Be direct, concise, and evaluate technical correctness.`;
    }

    try {
      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api.getToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({ prompt: adjustedPrompt, sessionId }),
      });

      if (!response.ok) throw new Error('Voice Agent connection failed.');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                if (data.type === 'token') {
                  fullAnswer += data.chunk;
                  setAiCaption(fullAnswer);
                } else if (data.type === 'done') {
                  setSessionId(data.sessionId);
                }
              } catch {
                // ignore
              }
            }
          }
        }
      }

      // Transition to speaking state
      setAgentState('SPEAKING');
      speak(fullAnswer, {
        onEnd: () => {
          if (!isMuted) {
            setAgentState('LISTENING');
            resetTranscript();
            startListening();
          } else {
            setAgentState('IDLE');
          }
        },
      });
    } catch {
      const fallback =
        'I had trouble processing that audio stream. Could you please repeat your question?';
      setAiCaption(fallback);
      setAgentState('SPEAKING');
      speak(fallback, {
        onEnd: () => {
          setAgentState('LISTENING');
          startListening();
        },
      });
    }
  };

  const handleInterrupt = () => {
    stopSpeaking();
    stopListening();
    resetTranscript();
    setAgentState('LISTENING');
    startListening();
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      setIsMuted(true);
      setAgentState('IDLE');
    } else {
      setIsMuted(false);
      resetTranscript();
      setAgentState('LISTENING');
      startListening();
    }
  };

  const handlePromptClick = (p: string) => {
    stopSpeaking();
    setUserCaption(p);
    processAiResponse(p);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col items-center p-4 sm:p-8 text-center text-white">
        {/* Top Action Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 mb-4 sm:mb-6 gap-2.5">
          <div className="w-full sm:w-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Voice Agent
              </span>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Persona Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs max-w-full">
            <button
              onClick={() => {
                setPersona('COACH');
                stopSpeaking();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                persona === 'COACH' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coach
            </button>
            <button
              onClick={() => {
                setPersona('TECH');
                stopSpeaking();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                persona === 'TECH' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => {
                setPersona('SENSEI');
                stopSpeaking();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                persona === 'SENSEI' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              日本語 Sensei
            </button>
          </div>

          <button
            onClick={onClose}
            className="hidden sm:inline-flex p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Voice Orb Visualizer */}
        <div className="relative my-8 flex items-center justify-center">
          {/* Ambient Glow */}
          <div
            className={`absolute w-44 h-44 rounded-full blur-3xl opacity-50 transition-all duration-700 ${
              agentState === 'SPEAKING'
                ? 'bg-emerald-500 scale-125'
                : agentState === 'LISTENING'
                ? 'bg-cyan-500 scale-110'
                : agentState === 'THINKING'
                ? 'bg-purple-500 animate-pulse'
                : 'bg-slate-700'
            }`}
          />

          {/* Animated Central Orb */}
          <div
            className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-2 ${
              agentState === 'SPEAKING'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 border-emerald-300 scale-105 shadow-emerald-500/50'
                : agentState === 'LISTENING'
                ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 border-cyan-300 animate-pulse shadow-cyan-500/50'
                : agentState === 'THINKING'
                ? 'bg-gradient-to-tr from-purple-700 to-indigo-500 border-purple-300 rotate-180 duration-1000'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            {agentState === 'SPEAKING' ? (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-6 bg-white rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-10 bg-white rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-7 bg-white rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce delay-100" />
              </div>
            ) : agentState === 'LISTENING' ? (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            ) : agentState === 'THINKING' ? (
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Headphones className="w-8 h-8 text-slate-400" />
            )}
          </div>
        </div>

        {/* Current State Status Tag */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
              agentState === 'SPEAKING'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : agentState === 'LISTENING'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700 animate-pulse'
                : agentState === 'THINKING'
                ? 'bg-purple-950/80 text-purple-300 border-purple-700'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {agentState === 'SPEAKING'
              ? 'Voice Agent Speaking...'
              : agentState === 'LISTENING'
              ? 'Listening to you... Speak now'
              : agentState === 'THINKING'
              ? 'Thinking & Retrieving Grounded Context...'
              : 'Voice Session Paused'}
          </span>
        </div>

        {/* Live Captions Area */}
        <div className="w-full max-w-lg min-h-[90px] max-h-40 overflow-y-auto px-4 py-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-left leading-relaxed space-y-2 mb-6">
          {userCaption && (
            <p className="text-cyan-400">
              <strong className="text-slate-400">You: </strong>
              {userCaption}
            </p>
          )}
          <p className="text-slate-200 font-sans">
            <strong className="text-brand-400">Agent: </strong>
            {aiCaption || 'Ready. Speak any question, prompt, or technical doubt.'}
          </p>
        </div>

        {/* Quick Voice Starters */}
        <div className="w-full max-w-lg mb-6">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">Try speaking one of these:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {(persona === 'SENSEI'
              ? [
                  'How do you say nice to meet you?',
                  'Explain the particle WA vs GA',
                  'Pronounce common daily greetings',
                ]
              : persona === 'TECH'
              ? [
                  'Conduct a mock technical interview',
                  'Explain Deadlocks and Coffman conditions',
                  'How does B-Tree indexing work in databases?',
                ]
              : [
                  'Conduct a mock HR interview with me',
                  'How do I solve train platform questions?',
                  'What are the best tips for Accenture aptitude?',
                ]
            ).map((starter, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(starter)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors border border-slate-700/60"
              >
                "{starter}"
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls Bar */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {/* Mic Toggle Button */}
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40 ring-4 ring-rose-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isListening ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Interrupt / Stop Speaking Button */}
          {agentState === 'SPEAKING' && (
            <button
              onClick={handleInterrupt}
              className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Interrupt & Speak</span>
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all"
          >
            End Voice Call
          </button>
        </div>
      </div>
    </div>
  );
};
