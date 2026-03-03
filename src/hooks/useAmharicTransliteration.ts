import { useState, useCallback, useRef, useMemo } from 'react';
import { amharicMap } from '../lib/amharic-phonetic';

/**
 * Hook for Amharic phonetic transliteration using Google Input Tools API.
 * This provides the "Google Typing" functionality requested by the user.
 * 
 * Also provides a live transliteration function for immediate feedback.
 */
export function useAmharicTransliteration() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize reverse map to efficiently find English roots of Amharic characters
  const reverseMap = useMemo(() => {
    const rev: Record<string, string> = {};
    
    // Default reverse mapping from amharicMap
    Object.entries(amharicMap).forEach(([en, am]) => {
      // Map it if it's not already there (prefer shorter keys for roots)
      if (!rev[am] || en.length < rev[am].length) {
        rev[am] = en;
      }
    });

    // Explicit overrides for the 6th order (root consonants) and base vowels
    // This ensures that "ህ" + "e" always results in "ሀ" correctly.
    const rootOverrides: Record<string, string> = {
      '\u1205': 'h', '\u120d': 'l', '\u1215': 'H', '\u121d': 'm', '\u122d': 'r',
      '\u1235': 's', '\u123d': 'sh', '\u1245': 'q', '\u1265': 'b', '\u1275': 't',
      '\u127d': 'ch', '\u1295': 'n', '\u129d': 'Ny', '\u12ad': 'k', '\u12cd': 'w',
      '\u12dd': 'z', '\u12e5': 'Zh', '\u12ed': 'y', '\u12f5': 'd', '\u1305': 'j',
      '\u130d': 'g', '\u1325': 'T', '\u132d': 'C', '\u1335': 'P', '\u133d': 'Ts',
      '\u134d': 'f', '\u1355': 'p',
      '\u12a0': 'a', '\u12a1': 'u', '\u12a2': 'i', '\u12a4': 'e', '\u12a5': 'ee', '\u12a6': 'o'
    };
    Object.assign(rev, rootOverrides);
    
    return rev;
  }, []);

  /**
   * Processes live input to provide immediate transliteration.
   * Converts English characters to Amharic as they are typed.
   */
  const processInput = useCallback((text: string, cursorPosition: number): { text: string, newCursor: number } => {
    if (cursorPosition === 0) return { text, newCursor: 0 };
    
    const charJustTyped = text[cursorPosition - 1];
    
    // We only process alphanumeric input for live transliteration
    if (!/^[a-zA-Z]$/.test(charJustTyped)) {
      return { text, newCursor: cursorPosition };
    }
    
    // Check if there's a character before the one just typed
    const prevChar = cursorPosition > 1 ? text[cursorPosition - 2] : null;
    
    let combinedEn = charJustTyped;
    let charsToReplace = 1;
    
    // If the previous character is already Amharic, try to "combine" it
    if (prevChar && reverseMap[prevChar]) {
      const baseEn = reverseMap[prevChar];
      // Try combining the English root of the previous Amharic char with the new English char
      combinedEn = baseEn + charJustTyped;
      charsToReplace = 2;
    }
    
    // Check for a mapping in the amharicMap
    if (amharicMap[combinedEn]) {
      const amChar = amharicMap[combinedEn];
      const newText = text.substring(0, cursorPosition - charsToReplace) + amChar + text.substring(cursorPosition);
      return { 
        text: newText, 
        newCursor: cursorPosition - charsToReplace + amChar.length 
      };
    } else {
      // If no combination, just transliterate the single character if it has a mapping
      if (amharicMap[charJustTyped]) {
        const amChar = amharicMap[charJustTyped];
        const newText = text.substring(0, cursorPosition - 1) + amChar + text.substring(cursorPosition);
        return { 
          text: newText, 
          newCursor: cursorPosition - 1 + amChar.length 
        };
      }
    }
    
    return { text, newCursor: cursorPosition };
  }, [reverseMap]);

  const transliterate = useCallback(async (word: string) => {
    // If it's not strictly letters (Latin or Amharic), don't transliterate via Google
    if (!word || !/^[a-zA-Z\u1200-\u137F]+$/.test(word)) {
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

  return { suggestions, isLoading, transliterate, setSuggestions, processInput };
}