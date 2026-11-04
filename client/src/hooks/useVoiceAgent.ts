import { useState, useEffect, useRef, useCallback } from 'react';

export const useVoiceAgent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available system voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);

      // Prefer high quality English voice (Google, Microsoft, Natural, Samantha)
      const preferred =
        available.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')) ||
        available.find((v) => v.lang.startsWith('en')) ||
        available[0];

      if (preferred) setSelectedVoice(preferred);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Clean Markdown tags so the spoken voice sounds natural
  const sanitizeTextForSpeech = (text: string): string => {
    return text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*•]\s+/g, '')
      .replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Detect if text contains Japanese Hiragana, Katakana, or Kanji
  const isJapaneseText = (text: string): boolean => {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
  };

  const speak = useCallback(
    (
      rawText: string,
      options: {
        lang?: string;
        rate?: number;
        pitch?: number;
        onEnd?: () => void;
      } = {}
    ) => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      const cleanText = sanitizeTextForSpeech(rawText);
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const isJp = isJapaneseText(rawText);

      // Language & Voice resolution
      if (isJp) {
        utterance.lang = 'ja-JP';
        const jpVoice = voices.find((v) => v.lang.startsWith('ja'));
        if (jpVoice) utterance.voice = jpVoice;
      } else {
        utterance.lang = options.lang || 'en-US';
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      utterance.rate = options.rate || (isJp ? 0.9 : 1.05);
      utterance.pitch = options.pitch || 1.0;

      utterance.onstart = () => setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, voices, selectedVoice]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
  };
};
