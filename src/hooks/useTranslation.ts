import { useState, useCallback } from 'react';
import { Language, TranslationResult } from '../types';
import { toast } from 'sonner';

export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const translate = useCallback(async (text: string, sourceLang: Language, targetLang: Language): Promise<TranslationResult | null> => {
    if (!text.trim()) return null;

    setIsLoading(true);
    try {
      // Using MyMemory API for translation
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return {
          translatedText: data.responseData.translatedText,
          sourceText: text,
          sourceLang,
          targetLang,
          timestamp: Date.now()
        };
      } else {
        toast.error("Translation failed. Please try again later.");
        return null;
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Network error. Please check your connection.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { translate, isLoading };
};