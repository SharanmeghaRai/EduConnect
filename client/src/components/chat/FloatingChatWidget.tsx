import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useSpeechToText } from '../../hooks/useSpeechToText.js';
import { useVoiceAgent } from '../../hooks/useVoiceAgent.js';
import { VoiceAgentModal } from './VoiceAgentModal.js';
import { WhatsAppShareButton, WhatsAppIcon } from '../ui/WhatsAppButton.js';
import {
  formatAiChatShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../../utils/whatsapp.js';

interface Message {
  role: 'USER' | 'ASSISTANT';
  content: string;
  citations?: any[];
  id?: string;
  feedback?: number;
}

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ASSISTANT',
      content:
        'Hello! I am **CampusPrep AI**, your placement preparation mentor. Ask me any aptitude question, technical CS concept, interview framework, or portal question!',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Text-To-Speech (Voice Agent)
  const { speak, stop: stopSpeaking, isSpeaking } = useVoiceAgent();

  // Speech-To-Text (Voice Input / Dictation)
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
    continuous: true,
    onResult: (text, isFinal) => {
      if (isFinal) {
        setPrompt((prev) => (prev ? `${prev.trim()} ${text.trim()}` : text.trim()));
      }
    },
  });

  const suggestedPrompts = [
    'What past aptitude papers from Sahyadri are available?',
    'How do I solve train problems crossing a platform?',
    'Explain STAR method for HR interviews',
    'SQL query for second highest salary',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

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
      const savedKey = localStorage.getItem('educonnect_gemini_key');
      if (savedKey) {
        headers['x-gemini-key'] = savedKey;
      }

      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ prompt: text, sessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || `Server error (${response.status})`);
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
                  setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { ...assistantMessage },
                  ]);
                } else if (data.type === 'done') {
                  setSessionId(data.sessionId);
                  assistantMessage.citations = data.citations;
                  setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { ...assistantMessage },
                  ]);
                }
              } catch {
                // ignore chunk parse edge
              }
            }
          }
        }
      }
    } catch (err: any) {
      assistantMessage.content +=
        `\n\n*Unable to contact server: ${err.message || 'Network error'}. Please verify server is running on port 5000.*`;
      setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (msgIndex: number, rating: number) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, feedback: rating } : m))
    );
  };

  const handleToggleSpeak = (msgIndex: number, text: string) => {
    if (speakingMessageIndex === msgIndex && isSpeaking) {
      stopSpeaking();
      setSpeakingMessageIndex(null);
    } else {
      stopSpeaking();
      setSpeakingMessageIndex(msgIndex);
      speak(text, {
        onEnd: () => setSpeakingMessageIndex(null),
      });
    }
  };

  const handleToggleMic = () => {
    if (!isSttSupported) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)]">
      {/* Popover Chat Window */}
      {isOpen ? (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] max-w-[430px] h-[550px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-lg shadow-soft-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">CampusPrep AI Mentor</h4>
                <p className="text-[10px] text-brand-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Voice & RAG Enabled
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Direct WhatsApp Aptitude Sir Doubt Link */}
              <a
                href={`https://wa.me/${APTITUDE_SIR_PHONE}?text=${encodeURIComponent(
                  'Hello Aptitude Sir! 👋 I am using EduConnect and have an aptitude question/doubt. Could you please guide me?'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title={`Chat with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Aptitude Sir</span>
              </a>

              {/* Launch Full Voice Agent Mode Button */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Launch Hands-Free Voice Agent Call"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-300" />
                <span>Voice Agent</span>
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  stopListening();
                  setIsOpen(false);
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestedPrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[11px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ASSISTANT' && (
                  <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-300 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed shadow-soft-sm ${
                    msg.role === 'USER'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</div>

                  {/* Grounded Citation Chips */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Linked Resources
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((c, cIdx) => (
                          <a
                            key={cIdx}
                            href={c.url}
                            target={c.url.startsWith('/reference-materials') ? '_blank' : undefined}
                            rel={c.url.startsWith('/reference-materials') ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 hover:border-brand-400"
                          >
                            <span>{c.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Toolbar: Audio Speak Aloud + Thumbs Feedback */}
                  {msg.role === 'ASSISTANT' && (
                    <div className="mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-slate-400">
                      {/* Speak Aloud & WhatsApp Share Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(idx, msg.content)}
                          className={`inline-flex items-center gap-1 text-[11px] hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                            speakingMessageIndex === idx && isSpeaking ? 'text-brand-600 dark:text-brand-400 font-bold' : ''
                          }`}
                          title={speakingMessageIndex === idx && isSpeaking ? 'Stop Speech' : 'Read Aloud with Voice Agent'}
                        >
                          {speakingMessageIndex === idx && isSpeaking ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
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
                          variant="icon-only"
                          size="sm"
                          title={`Ask Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
                          className="!p-1 !border-none !bg-transparent text-slate-400 hover:text-[#25D366]"
                        />
                      </div>

                      {idx > 0 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleFeedback(idx, 1)}
                            className={`p-1 hover:text-emerald-500 rounded ${msg.feedback === 1 ? 'text-emerald-500 font-bold' : ''}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, -1)}
                            className={`p-1 hover:text-rose-500 rounded ${msg.feedback === -1 ? 'text-rose-500 font-bold' : ''}`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'USER' && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Speech Error Banner */}
          {sttError && (
            <div className="px-3 py-2 bg-rose-50 dark:bg-rose-950/80 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between text-[11px] text-rose-700 dark:text-rose-300 animate-fade-in">
              <div className="flex items-center gap-1.5 overflow-hidden mr-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{sttError}</span>
              </div>
              <button
                type="button"
                onClick={handleToggleMic}
                className="text-[10px] font-bold text-rose-700 dark:text-rose-300 underline shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Listening Pulsing Status Banner */}
          {isListening && (
            <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between text-[11px] text-rose-700 dark:text-rose-300">
              <span className="flex items-center gap-1.5 animate-pulse font-semibold overflow-hidden mr-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <span className="truncate">
                  {interimTranscript ? `"${interimTranscript}"` : 'Listening... Speak now'}
                </span>
              </span>
              <button
                type="button"
                onClick={stopListening}
                className="text-[10px] font-bold text-rose-700 dark:text-rose-300 underline shrink-0"
              >
                Stop Mic
              </button>
            </div>
          )}

          {/* Prompt Input Form with Speech-to-Text Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isListening ? 'Listening to voice...' : 'Ask formula, code logic, or speak...'}
              disabled={loading}
              className={`flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 border transition-colors ${
                isListening
                  ? 'border-rose-400 ring-2 ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />

            {/* Speech-To-Text Microphone Button */}
            {isSttSupported && (
              <button
                type="button"
                onClick={handleToggleMic}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak with Speech-to-Text'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-soft-sm shrink-0"
              title="Send Prompt"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      ) : (
        /* Floating Launcher Pill */
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-soft-xl hover:shadow-glow-brand transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <Sparkles className="w-4 h-4 text-brand-200 group-hover:rotate-12 transition-transform" />
          <span>Ask CampusPrep AI</span>
          <span className="ml-1 pl-1.5 border-l border-white/20 text-[10px] text-brand-200 flex items-center gap-1 font-mono">
            <Mic className="w-3 h-3" /> Voice
          </span>
        </button>
      )}

      {/* Interactive Full Voice Agent Modal */}
      <VoiceAgentModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
};
