import React, { useState, useEffect } from 'react';
import { Languages, ArrowRightLeft, Copy, Volume2, History, Trash2, Github, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { useTranslation } from '../hooks/useTranslation';
import { Language, HistoryItem } from '../types';
import { toast } from 'sonner';

const languageMap = {
  en: 'English',
  am: 'Amharic (አማርኛ)'
};

export function Translator() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>('en');
  const [targetLang, setTargetLang] = useState<Language>('am');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { translate, isLoading } = useTranslation();

  useEffect(() => {
    const savedHistory = localStorage.getItem('translation_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    const result = await translate(sourceText, sourceLang, targetLang);
    if (result) {
      setTranslatedText(result.translatedText);
      const newItem: HistoryItem = {
        ...result,
        id: crypto.randomUUID(),
      };
      const updatedHistory = [newItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('translation_history', JSON.stringify(updatedHistory));
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSpeak = (text: string, lang: Language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : 'am-ET';
    window.speechSynthesis.speak(utterance);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translation_history');
    toast.info('History cleared');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header section */}
      <div className="text-center space-y-2 mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
        >
          <Languages className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Linguist Amharic
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Instant translation between English and Amharic with high accuracy and speed.
        </p>
      </div>

      {/* Main Translation Interface */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Source Language Card */}
        <Card className="shadow-lg border-primary/5 bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {languageMap[sourceLang]}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleSpeak(sourceText, sourceLang)}
                disabled={!sourceText}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            <Textarea 
              placeholder="Enter text here..."
              className="min-h-[200px] border-none shadow-none focus-visible:ring-0 text-lg p-0 bg-transparent"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
            <div className="flex justify-end mt-4">
               <span className="text-xs text-muted-foreground">{sourceText.length} characters</span>
            </div>
          </CardContent>
        </Card>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12 shadow-md hover:rotate-180 transition-transform duration-300 bg-white"
            onClick={handleSwap}
          >
            <ArrowRightLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Target Language Card */}
        <Card className="shadow-lg border-primary/5 bg-white/50 backdrop-blur-sm overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {languageMap[targetLang]}
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleSpeak(translatedText, targetLang)}
                  disabled={!translatedText}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="min-h-[200px] text-lg">
              {translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <p className="text-muted-foreground italic">Translation will appear here...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="px-12 h-14 rounded-full text-lg font-semibold shadow-xl transition-all hover:scale-105"
          onClick={handleTranslate}
          disabled={isLoading || !sourceText.trim()}
        >
          Translate Now
        </Button>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10 border-t"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent History
            </h2>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">{languageMap[item.sourceLang]}</p>
                          <p className="text-sm line-clamp-2">{item.sourceText}</p>
                        </div>
                        <div className="hidden md:block">
                           <Globe2 className="w-4 h-4 text-muted-foreground/40" />
                        </div>
                        <div className="flex items-center justify-between md:justify-start gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">{languageMap[item.targetLang]}</p>
                            <p className="text-sm font-medium line-clamp-2">{item.translatedText}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setSourceText(item.sourceText);
                              setTranslatedText(item.translatedText);
                              setSourceLang(item.sourceLang);
                              setTargetLang(item.targetLang);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="pt-12 pb-6 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
           <a href="#" className="hover:text-primary flex items-center gap-1">
             <Github className="w-4 h-4" /> GitHub
           </a>
           <a href="#" className="hover:text-primary">Privacy Policy</a>
           <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
        <p>© {new Date().getFullYear()} Linguist Amharic. Powered by Open Source Translation API.</p>
      </footer>
    </div>
  );
}