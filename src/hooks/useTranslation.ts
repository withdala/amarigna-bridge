import { useState, useCallback, useRef } from 'react';
import { Language, TranslationResult } from '../types';
import { toast } from 'sonner';

/**
 * Hook for Google Translate API interaction.
 * Uses the robust client=gtx endpoint for reliable translation results.
 */
export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const translate = useCallback(async (
    text: string, 
    sourceLang: Language, 
    targetLang: Language
  ): Promise<TranslationResult | null> => {
    if (!text.trim()) return null;

    setIsLoading(true);
    try {
      // client=gtx is more stable for general use
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Google Translate API request failed');
      }

      const data = await response.json();
      
      // Response format: [[["translated", "source", ...], ...]]
      if (data && data[0]) {
        const translatedText = data[0]
          .map((part: any[]) => part[0])
          .filter((t: any) => typeof t === 'string')
          .join('');
        
        return {
          translatedText,
          sourceText: text,
          sourceLang,
          targetLang,
          timestamp: Date.now()
        };
      } else {
        toast.error("Translation failed. Invalid response from Google.");
        return null;
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error("Translation service unavailable. Please check your connection.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { translate, isLoading };
};