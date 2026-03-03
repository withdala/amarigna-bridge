export type Language = 'en' | 'am';

export interface TranslationResult {
  translatedText: string;
  sourceText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: number;
}

export interface HistoryItem extends TranslationResult {
  id: string;
}