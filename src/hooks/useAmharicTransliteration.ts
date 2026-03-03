import { useState, useCallback, useRef } from 'react';

/**
 * Hook for Amharic phonetic transliteration using Google Input Tools API.
 * This provides the "Google Typing" functionality requested by the user.
 */
export function useAmharicTransliteration() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const transliterate = useCallback(async (word: string) => {
    // If it's not strictly letters, don't transliterate
    if (!word || !/^[a-zA-Z]+$/.test(word)) {
      setSuggestions([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      // itc=am-t-i0-und is the official input tool code for Amharic transliteration
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=am-t-i0-und&num=6&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;
      
      const response = await fetch(url, { signal: abortControllerRef.current.signal });
      const data = await response.json();

      if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
        const candidates = data[1][0][1];
        setSuggestions(candidates);
      } else {
        setSuggestions([]);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Transliteration error:', error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suggestions, isLoading, transliterate, setSuggestions };
}