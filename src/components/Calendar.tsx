import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar as CalendarIcon, ArrowRightLeft, Sparkles, History, MapPin } from 'lucide-react';
import { toEthiopian, formatEthiopianDate, getDayName } from '../lib/calendar-utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ethiopianDate, setEthiopianDate] = useState<{year: number, month: number, day: number} | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      if (!isNaN(date.getTime())) {
        setEthiopianDate(toEthiopian(date));
      }
    }
  }, [selectedDate]);

  const handleNow = () => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    toast.success("Updated to current date");
  };

  const getAmharicDay = () => {
    if (!selectedDate) return "";
    return getDayName(new Date(selectedDate), 'am');
  };

  const getEnglishDay = () => {
    if (!selectedDate) return "";
    return getDayName(new Date(selectedDate), 'en');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          <CalendarIcon className="w-4 h-4" />
          Date Converter
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Ethiopian Calendar</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Convert Gregorian dates to the unique Ethiopian calendar (Ge'ez calendar). 
          The Ethiopian calendar is 7-8 years behind the Gregorian and consists of 13 months.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
           <div className="h-2 bg-primary w-full" />
           <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="w-5 h-5 text-primary" />
              Select Date
            </CardTitle>
            <CardDescription>Choose a Gregorian date to convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date-input">Gregorian Date</Label>
              <Input 
                id="date-input"
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-12 text-lg focus-visible:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-11"
                onClick={handleNow}
              >
                Today
              </Button>
              <Button 
                variant="default" 
                className="flex-1 h-11"
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setFullYear(date.getFullYear() + 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
              >
                Next Year
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
               <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-sm text-slate-600 leading-relaxed">
                 Did you know? Ethiopian New Year (Enkutatash) falls on September 11th (or 12th in leap years).
               </p>
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/5 to-white overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Result</span>
                <ArrowRightLeft className="w-4 h-4 text-slate-400" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900">
                {ethiopianDate && formatEthiopianDate(ethiopianDate, 'am')}
              </CardTitle>
              <CardDescription className="text-lg font-medium text-slate-500">
                {ethiopianDate && formatEthiopianDate(ethiopianDate, 'en')}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold mb-1">AMHARIC DAY</p>
                    <p className="text-xl font-bold text-slate-800">{getAmharicDay()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold mb-1">ENGLISH DAY</p>
                    <p className="text-xl font-bold text-slate-800">{getEnglishDay()}</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-slate-900 text-slate-100 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <MapPin className="w-24 h-24" />
             </div>
             <CardHeader>
               <CardTitle className="text-white">Quick Facts</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-slate-300 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Months in a year</span>
                  <span className="font-bold text-primary">13</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Days in first 12 months</span>
                  <span className="font-bold text-primary">30</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Days in Pagume (13th month)</span>
                  <span className="font-bold text-primary">5 or 6</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Current Gap</span>
                  <span className="font-bold text-primary">~7-8 Years</span>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      <div 
        className="mt-12 rounded-3xl h-64 bg-cover bg-center overflow-hidden flex items-end relative group"
        style={{ backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/e47d820f-8982-4b2d-bbd1-7e2dd867dbdd/ethiopian-calendar-banner-3a7622eb-1772576871885.webp')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative p-8 w-full">
           <h3 className="text-2xl font-bold text-white mb-2">Explore the Ge'ez Calendar</h3>
           <p className="text-white/80 max-w-xl">
             Steeped in history, the Ethiopian calendar tracks time differently than the Western world, 
             maintaining the tradition of the ancient Orthodox Tewahedo Church.
           </p>
        </div>
      </div>
    </div>
  );
};