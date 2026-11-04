import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Plus,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  MessageSquare,
  Loader2,
  BookOpen,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones,
  Globe,
  AlertCircle,
  Key,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { useSpeechToText } from '../hooks/useSpeechToText.js';
import { useVoiceAgent } from '../hooks/useVoiceAgent.js';
import { VoiceAgentModal } from '../components/chat/VoiceAgentModal.js';
import { WhatsAppShareButton, WhatsAppIcon } from '../components/ui/WhatsAppButton.js';
import {
  formatAiChatShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../utils/whatsapp.js';

interface Message {
  role: 'USER' | 'ASSISTANT';
  content: string;
  citations?: any[];
  feedback?: number;
}

export const ChatPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [geminiKey, setGeminiKey] = useState<string>(
    () => localStorage.getItem('educonnect_gemini_key') || ''
  );
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(geminiKey);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ASSISTANT',
      content:
        'Welcome to **CampusPrep AI Full Workspace**! I am your dedicated technical mentor and career coach.\n\nAsk me anything about aptitude shortcuts, Japanese JLPT N5 vocabulary, DSA patterns, operating system deadlocks, HR interview questions (STAR method), or portal resources.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const [sttLang, setSttLang] = useState<'en-US' | 'ja-JP'>('en-US');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Text-To-Speech (Voice Agent)
  const { speak, stop: stopSpeaking, isSpeaking } = useVoiceAgent();

  // Speech-To-Text (Voice Dictation)
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSttSupported,
    error: sttError,
  } = useSpeechToText({
    lang: sttLang,
    continuous: true,
    onResult: (text, isFinal) => {
      if (isFinal) {
        setPrompt((prev) => (prev ? `${prev.trim()} ${text.trim()}` : text.trim()));
      }
    },
  });

  const suggestedPrompts = [
    'What past aptitude papers from Sahyadri are available for Accenture and TCS?',
    'How do I solve train problems crossing a platform or moving in opposite directions?',
    'Explain the 4 Coffman conditions for Deadlocks in Operating Systems',
    'Write SQL query to find the 2nd highest salary in an Employee table',
    'What is the STAR framework for behavioral interviews?',
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.chat.listSessions();
        setSessions(res.sessions || []);
      } catch (err) {
        console.error('Failed to load chat sessions:', err);
      }
    };
    fetchSessions();
  }, []);

  // Load message history when selecting an existing session
  useEffect(() => {
    if (!activeSessionId) return;
    const loadSessionMessages = async () => {
      try {
        const res = await api.chat.getMessages(activeSessionId);
        if (res.messages && res.messages.length > 0) {
          const formatted: Message[] = res.messages.map((m: any) => ({
            role: m.role as 'USER' | 'ASSISTANT',
            content: m.content,
            citations: m.citationsJson ? JSON.parse(m.citationsJson) : [],
            feedback: m.feedbackRating,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.warn('Failed to load session messages:', err);
      }
    };
    loadSessionMessages();
  }, [activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleMic = () => {
    if (!isSttSupported) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening(sttLang);
    }
  };

  const handleToggleLang = () => {
    const nextLang = sttLang === 'en-US' ? 'ja-JP' : 'en-US';
    setSttLang(nextLang);
    if (isListening) {
      stopListening();
      setTimeout(() => {
        startListening(nextLang);
      }, 300);
    }
  };

  const handleToggleSpeak = (idx: number, content: string) => {
    if (speakingMessageIndex === idx && isSpeaking) {
      stopSpeaking();
      setSpeakingMessageIndex(null);
    } else {
      stopSpeaking();
      setSpeakingMessageIndex(idx);
      speak(content, {
        onEnd: () => setSpeakingMessageIndex(null),
      });
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || prompt;
    if (!text.trim() || loading) return;

    if (isListening) {
      stopListening();
      resetTranscript();
    }

    const userMessage: Message = { role: 'USER', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    let assistantMessage: Message = { role: 'ASSISTANT', content: '', citations: [] };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const token = api.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (geminiKey) {
        headers['x-gemini-key'] = geminiKey;
      }

      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ prompt: text, sessionId: activeSessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || `Server responded with ${response.status}`);
      }

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
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                if (data.type === 'token') {
                  assistantMessage.content += data.chunk;
                  setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
                } else if (data.type === 'done') {
                  setActiveSessionId(data.sessionId);
                  assistantMessage.citations = data.citations;
                  setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
                }
              } catch {
                // pass
              }
            }
          }
        }
      }
    } catch (err: any) {
      assistantMessage.content += `\n\n*Unable to connect to placement AI engine: ${err.message || 'Network error'}*`;
      setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(undefined);
    setMessages([
      {
        role: 'ASSISTANT',
        content:
          'Started a new placement guidance workspace. What technical topic or interview problem would you like to review?',
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6 animate-fade-in">
      {/* Left Drawer: Session History (hidden on small screens) */}
      <Card className="w-72 shrink-0 hidden md:flex flex-col p-4 border-slate-200 dark:border-slate-800">
        <Button
          size="sm"
          onClick={handleNewChat}
          className="w-full text-xs font-bold gap-2 mb-4 justify-center"
        >
          <Plus className="w-4 h-4" /> New Guidance Session
        </Button>

        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
          Recent Sessions
        </h4>

        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold truncate transition-colors flex items-center gap-2 ${
                activeSessionId === s.id
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{s.title || 'Placement Session'}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Chat Workspace */}
      <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800">
        {/* Workspace Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                CampusPrep AI Technical Mentor
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Grounded in 25 Exams, Sahyadri Past Papers & Placement Materials
              </p>
            </div>
          </div>

          {/* Action Buttons: WhatsApp Aptitude Sir, Gemini Key & Voice Agent */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <a
              href={`https://wa.me/${APTITUDE_SIR_PHONE}?text=${encodeURIComponent(
                'Hello Aptitude Sir! 👋 I am practicing on EduConnect and have an aptitude question/doubt. Could you please guide me?'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-soft-sm transition-all active:scale-95"
              title={`Chat directly with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Ask Aptitude Sir</span>
            </a>

            <button
              onClick={() => {
                setKeyInput(geminiKey);
                setShowKeyModal(true);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                geminiKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <Key className={`w-3.5 h-3.5 ${geminiKey ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>{geminiKey ? 'Live Gemini AI' : 'AI Key'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVoiceModalOpen(true)}
              className="text-xs font-semibold gap-2 border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 shadow-soft-sm"
            >
              <Headphones className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
              <span><span className="hidden sm:inline">Interactive </span>Voice Agent</span>
            </Button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 sm:gap-3 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ASSISTANT' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-300 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 leading-relaxed shadow-soft-sm ${
                  msg.role === 'USER'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</div>

                {/* Grounded Citation Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Grounded Portal Resources:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c, cIdx) => (
                        <a
                          key={cIdx}
                          href={c.url}
                          target={c.url.startsWith('/reference-materials') ? '_blank' : undefined}
                          rel={c.url.startsWith('/reference-materials') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 hover:border-brand-500 shadow-sm transition-all hover:shadow"
                        >
                          <BookOpen className="w-3 h-3 text-brand-500" />
                          <span>{c.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read Aloud Voice Agent & WhatsApp Controls for Assistant Messages */}
                {msg.role === 'ASSISTANT' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(idx, msg.content)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-semibold text-xs ${
                          speakingMessageIndex === idx && isSpeaking
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                            : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/70 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {speakingMessageIndex === idx && isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                            <span>Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-brand-500" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>

                      <WhatsAppShareButton
                        shareOptions={{
                          phone: APTITUDE_SIR_PHONE,
                          text: formatAiChatShareText(
                            messages[idx - 1]?.content || 'Aptitude Doubt',
                            msg.content
                          ),
                        }}
                        variant="outline"
                        size="sm"
                        label="Ask Aptitude Sir"
                        title={`Chat with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
                        className="!text-[11px] !py-1 text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/10 font-bold"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      WhatsApp Aptitude Sir Direct ({APTITUDE_SIR_FORMATTED_PHONE})
                    </span>
                  </div>
                )}
              </div>

              {msg.role === 'USER' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {suggestedPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:border-brand-500 transition-colors shadow-soft-sm"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Speech Recognition Error Banner */}
        {sttError && (
          <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/80 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{sttError}</span>
            </div>
            <button
              type="button"
              onClick={handleToggleMic}
              className="text-xs font-bold underline hover:text-rose-900 dark:hover:text-rose-100 ml-3 shrink-0"
            >
              Retry Mic
            </button>
          </div>
        )}

        {/* Speech-to-Text Listening Pulsing Banner with Real-time Interim Transcript */}
        {isListening && (
          <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
            <div className="flex items-center gap-2 font-medium overflow-hidden mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
              <span className="truncate">
                Listening ({sttLang === 'ja-JP' ? 'Japanese 日本語' : 'English'})...{' '}
                {interimTranscript ? (
                  <strong className="text-rose-900 dark:text-rose-100 italic">"{interimTranscript}"</strong>
                ) : (
                  'Speak into your microphone now'
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline shrink-0"
            >
              Done / Stop Mic
            </button>
          </div>
        )}

        {/* Input Bar with Speech-to-Text and Language Selector */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-3"
        >
          {/* Language Selector Toggle */}
          <button
            type="button"
            onClick={handleToggleLang}
            className="px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors flex items-center gap-1 shrink-0"
            title={`Speech language: ${sttLang}. Click to toggle English / Japanese`}
          >
            <Globe className="w-3.5 h-3.5 text-brand-500" />
            <span>{sttLang === 'ja-JP' ? '日本語' : 'EN'}</span>
          </button>

          {/* Speech-To-Text Microphone Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
            title={
              !isSttSupported
                ? 'Speech recognition not supported in this browser'
                : isListening
                ? 'Stop Listening'
                : 'Speak with Speech-to-Text Microphone'
            }
          >
            {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isListening
                ? interimTranscript
                  ? `[Live Voice]: ${interimTranscript}...`
                  : `Listening (${sttLang === 'ja-JP' ? 'Japanese' : 'English'})... Speak now`
                : 'Ask formula derivation, Japanese grammar, coding logic, or click mic...'
            }
            disabled={loading}
            className={`flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 border transition-colors ${
              isListening
                ? 'border-rose-400 ring-2 ring-rose-500/20 bg-rose-50/20'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          <Button
            type="submit"
            disabled={!prompt.trim() || loading}
            size="md"
            className="font-bold text-xs px-5 shadow-soft-sm shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </Card>

      {/* Interactive Full Voice Agent Call Modal */}
      <VoiceAgentModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Gemini AI API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Connect Gemini 1.5 Flash
                  </h3>
                  <p className="text-[10px] text-slate-400">Real-Time AI Mentorship Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Connect your free Google Gemini API key to activate live generative responses for any coding, aptitude, or interview question.
            </p>

            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste AIzaSy... key here"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <p className="text-[11px] text-slate-400">
                Get a free API key at{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 font-semibold underline hover:text-brand-500"
                >
                  aistudio.google.com
                </a>
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {geminiKey ? (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('educonnect_gemini_key');
                    setGeminiKey('');
                    setKeyInput('');
                    setShowKeyModal(false);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                >
                  Disconnect Key
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Built-in engine active</span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const cleaned = keyInput.trim();
                    if (cleaned) {
                      localStorage.setItem('educonnect_gemini_key', cleaned);
                      setGeminiKey(cleaned);
                    } else {
                      localStorage.removeItem('educonnect_gemini_key');
                      setGeminiKey('');
                    }
                    setShowKeyModal(false);
                  }}
                  className="text-xs font-bold shadow-soft-sm"
                >
                  Save & Activate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
