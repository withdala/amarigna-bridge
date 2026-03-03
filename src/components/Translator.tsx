import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Volume2, 
  History, 
  Trash2, 
  Globe2,
  Keyboard,
  Settings2,
  CheckCircle2,
  Info,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useTranslation } from '../hooks/useTranslation';
import { useAmharicTransliteration } from '../hooks/useAmharicTransliteration';
import { Language, HistoryItem } from '../types';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

const languageMap = {
  en: 'English',
  am: 'Amharic (\u12a0\u121b\u122d\u129b)'
};

export function Translator() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>('en');
  const [targetLang, setTargetLang] = useState<Language>('am');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPhoneticEnabled, setIsPhoneticEnabled] = useState(true);
  
  const { translate, isLoading } = useTranslation();
  const { suggestions, transliterate, setSuggestions, processInput } = useAmharicTransliteration();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      const newItem: HistoryItem = { ...result, id: crypto.randomUUID() };
      const updatedHistory = [newItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('translation_history', JSON.stringify(updatedHistory));
      toast.success('Translated successfully');
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

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    if (sourceLang === 'am' && isPhoneticEnabled) {
      // Live phonetic transliteration logic for additions
      if (value.length > sourceText.length) {
        const { text: newText, newCursor } = processInput(value, cursorPosition);
        value = newText;
        setSourceText(value);
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(newCursor, newCursor);
          }
        }, 0);
      } else {
        setSourceText(value);
      }

      // Update suggestions based on the word currently being typed
      const textBeforeCursor = value.substring(0, cursorPosition);
      const matches = textBeforeCursor.match(/([\u1200-\u137Fa-zA-Z]+)$/);
      if (matches) {
        const currentWord = matches[1];
        transliterate(currentWord);
      } else {
        setSuggestions([]);
      }
    } else {
      setSourceText(value);
    }
  };

  const selectSuggestion = (suggestion: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart || 0;
    const textBeforeCursor = sourceText.substring(0, cursorPosition);
    const textAfterCursor = sourceText.substring(cursorPosition);
    
    const lastWordMatch = textBeforeCursor.match(/([\u1200-\u137Fa-zA-Z]+)$/);
    if (!lastWordMatch) {
      // If no word match found, just insert the suggestion at cursor
      const newText = textBeforeCursor + suggestion + suffix + textAfterCursor;
      setSourceText(newText);
      const newPos = textBeforeCursor.length + suggestion.length + suffix.length;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
      return;
    }
    
    const lastWord = lastWordMatch[1];
    const newTextBeforeCursor = textBeforeCursor.substring(0, textBeforeCursor.length - lastWord.length) + suggestion + suffix;
    const newText = newTextBeforeCursor + textAfterCursor;
    
    setSourceText(newText);
    setSuggestions([]);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = newTextBeforeCursor.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (sourceLang === 'am' && isPhoneticEnabled && suggestions.length > 0) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const char = e.key === ' ' ? ' ' : String.fromCharCode(10);
        selectSuggestion(suggestions[0], char);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
      <div className="relative rounded-3xl overflow-hidden mb-8 h-48 md:h-64 flex items-center justify-center">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e47d820f-8982-4b2d-bbd1-7e2dd867dbdd/linguist-background-a7df2afd-1772578672104.webp" 
          alt="Linguist Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative text-center space-y-3 px-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 text-white/90"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold tracking-widest uppercase">Intelligent Translation</span>
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter"
          >
            Linguist Amharic
          </motion.h1>
          <p className="text-white/80 text-sm md:text-base max-w-md font-medium">
            Bridging cultures with Google-powered translation and intuitive phonetic typing.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-sm">
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200">
                <Globe2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-slate-700">{languageMap[sourceLang]}</span>
             </div>
             <Button variant="ghost" size="icon" onClick={handleSwap} className="rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary transition-all active:rotate-180 duration-500 h-10 w-10">
               <RefreshCcw className="w-4 h-4" />
             </Button>
             <div className="flex items-center gap-2 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-sm font-bold text-slate-700">{languageMap[targetLang]}</span>
             </div>
           </div>

           {sourceLang === 'am' && (
             <div className="flex items-center space-x-3 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
               <Keyboard className="w-4 h-4 text-indigo-600" />
               <Label htmlFor="phonetic-mode" className="text-xs font-bold uppercase tracking-wider text-indigo-700">Google Typing</Label>
               <Switch 
                id="phonetic-mode" 
                checked={isPhoneticEnabled} 
                onCheckedChange={setIsPhoneticEnabled}
                className="data-[state=checked]:bg-indigo-600"
               />
             </div>
           )}
        </div>

        <AnimatePresence>
          {sourceLang === 'am' && isPhoneticEnabled && suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-4 bg-white border border-indigo-100 rounded-2xl shadow-xl shadow-indigo-500/5 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2 mr-3 text-indigo-600">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Suggestions</span>
                </div>
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => selectSuggestion(s)} 
                    className="group relative px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
                  >
                    {s} 
                    <span className="ml-3 text-[9px] opacity-40 group-hover:opacity-100 font-mono">
                      {idx === 0 ? 'SPACE' : idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-2xl shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm relative group">
            {sourceLang === 'am' && isPhoneticEnabled && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-none px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full">Phonetic active</Badge>
              </div>
            )}
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Input</span>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-colors" onClick={() => handleSpeak(sourceText, sourceLang)} disabled={!sourceText}>
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              <Textarea 
                ref={textareaRef}
                placeholder={sourceLang === 'am' && isPhoneticEnabled ? "Type phonetically (e.g. 'selam')" : "Enter text here..."}
                className="min-h-[250px] border-none shadow-none focus-visible:ring-0 text-xl md:text-2xl p-0 bg-transparent resize-none leading-relaxed placeholder:text-slate-300 font-medium"
                value={sourceText} 
                onChange={handleSourceChange} 
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                 <div className="flex gap-2">
                   {sourceText && (
                     <Button variant="ghost" size="sm" onClick={() => setSourceText('')} className="text-slate-400 hover:text-destructive text-xs font-bold">
                       <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear
                     </Button>
                   )}
                 </div>
                 <span className="text-[10px] font-mono font-bold text-slate-400">{sourceText.length} CHARACTERS</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden relative group">
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-[4px] z-20 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
                      <Languages className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em] animate-pulse">Processing</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <CardContent className="p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Translation</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-colors" onClick={() => handleSpeak(translatedText, targetLang)} disabled={!translatedText}>
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-colors" onClick={() => handleCopy(translatedText)} disabled={!translatedText}>
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="min-h-[250px] text-xl md:text-2xl font-semibold text-slate-800">
                {translatedText ? (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="whitespace-pre-wrap leading-relaxed">
                    {translatedText}
                  </motion.p>
                ) : (
                  <p className="text-slate-300 italic flex items-center gap-3 mt-4">
                    Translation will appear here...
                  </p>
                )}
              </div>
              {translatedText && (
                <div className="flex justify-end items-center mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified by Google</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          className="px-12 h-16 rounded-2xl text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90 text-white tracking-tight" 
          onClick={handleTranslate} 
          disabled={isLoading || !sourceText.trim()}
        >
          {isLoading ? (
             <div className="flex items-center gap-3">
               <RefreshCcw className="w-5 h-5 animate-spin" /> Translating...
             </div>
          ) : 'Translate Now'}
        </Button>
      </div>

      {history.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <History className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-slate-400 hover:text-destructive font-bold text-xs uppercase tracking-widest">
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {history.map((item) => (
                <motion.div 
                  key={item.id} 
                  layout 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all border-slate-200/50 group cursor-pointer active:scale-[0.99] bg-white/60 backdrop-blur-sm" 
                    onClick={() => { 
                      setSourceText(item.sourceText); 
                      setTranslatedText(item.translatedText); 
                      setSourceLang(item.sourceLang); 
                      setTargetLang(item.targetLang); 
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-slate-50 border-slate-200">{languageMap[item.sourceLang]}</Badge>
                            <ArrowRightLeft className="w-3 h-3 text-slate-300" />
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-slate-50 border-slate-200">{languageMap[item.targetLang]}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original</p>
                               <p className="text-sm font-semibold text-slate-600 line-clamp-2">{item.sourceText}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Translation</p>
                               <p className="text-sm font-bold text-slate-900 line-clamp-2">{item.translatedText}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all bg-slate-100 hover:bg-primary hover:text-white" 
                            onClick={(e) => { e.stopPropagation(); handleCopy(item.translatedText); }}
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
    </div>
  );
}