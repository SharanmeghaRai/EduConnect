import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechToTextOptions {
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  lang?: string;
  continuous?: boolean;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const { onResult, onError, lang = 'en-US', continuous = false } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep callback refs stable across re-renders to prevent effect teardowns
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const langRef = useRef(lang);
  langRef.current = lang;

  const continuousRef = useRef(continuous);
  continuousRef.current = continuous;

  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const createAndStartRecognition = useCallback(async (targetLang?: string) => {
    if (!isSupported) {
      const msg = 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or a Chromium-based browser.';
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    // Pre-flight check for microphone access permission
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release audio track so SpeechRecognition can acquire it
        stream.getTracks().forEach((track) => track.stop());
      } catch (mediaErr: any) {
        console.warn('Microphone permission check failed:', mediaErr);
        let errMsg = 'Microphone access denied. Please click the microphone/lock icon in your browser address bar to allow audio.';
        if (mediaErr.name === 'NotFoundError' || mediaErr.name === 'DevicesNotFoundError') {
          errMsg = 'No microphone device found on your system. Please connect an audio input device.';
        }
        setError(errMsg);
        onErrorRef.current?.(errMsg);
        setIsListening(false);
        shouldListenRef.current = false;
        return;
      }
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setError('Speech recognition class not found.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = continuousRef.current;
      recognition.interimResults = true;
      recognition.lang = targetLang || langRef.current || 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript;
          } else {
            interimStr += item[0].transcript;
          }
        }

        if (finalStr.trim()) {
          setTranscript((prev) => (prev ? `${prev} ${finalStr.trim()}` : finalStr.trim()));
          setInterimTranscript('');
          onResultRef.current?.(finalStr.trim(), true);
        } else if (interimStr.trim()) {
          setInterimTranscript(interimStr.trim());
          onResultRef.current?.(interimStr.trim(), false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('SpeechRecognition error:', event.error);

        // Non-fatal errors in Chrome
        if (event.error === 'no-speech') {
          setInterimTranscript('');
          return;
        }

        if (event.error === 'aborted') {
          return;
        }

        let errMsg = 'Voice recognition error.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errMsg = 'Microphone permission denied. Click the lock/camera icon in your address bar to allow microphone access.';
          shouldListenRef.current = false;
          setIsListening(false);
        } else if (event.error === 'audio-capture') {
          errMsg = 'No microphone detected. Please plug in or enable a microphone.';
          shouldListenRef.current = false;
          setIsListening(false);
        } else if (event.error === 'network') {
          errMsg = 'Speech network error occurred. Please ensure your internet connection is active.';
          shouldListenRef.current = false;
          setIsListening(false);
        }

        setError(errMsg);
        onErrorRef.current?.(errMsg);
      };

      recognition.onend = () => {
        setInterimTranscript('');

        // If continuous is enabled and user has not stopped, auto-restart
        if (shouldListenRef.current && continuousRef.current) {
          clearRestartTimer();
          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current) {
              createAndStartRecognition(langRef.current);
            }
          }, 250);
          return;
        }

        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (startErr: any) {
      console.warn('Failed to start SpeechRecognition:', startErr);
      setError(startErr.message || 'Failed to start speech recognition.');
      setIsListening(false);
      shouldListenRef.current = false;
    }
  }, [isSupported]);

  const startListening = useCallback(
    (customLang?: string) => {
      clearRestartTimer();
      shouldListenRef.current = true;
      setError(null);
      setInterimTranscript('');
      createAndStartRecognition(customLang || langRef.current);
    },
    [createAndStartRecognition]
  );

  const stopListening = useCallback(() => {
    clearRestartTimer();
    shouldListenRef.current = false;
    setIsListening(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      clearRestartTimer();
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
