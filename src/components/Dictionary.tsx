import React, { useState } from 'react';
import { Search, Book, Bookmark, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const mockWords = [
  { word: 'Hello', translation: '\u1230\u120b\u121d', definition: 'A common greeting used to start a conversation.' },
  { word: 'Water', translation: '\u12cd\u1203', definition: 'A clear, colorless, odorless, and tasteless liquid essential for all known forms of life.' },
  { word: 'Book', translation: '\u1218\u133d\u1210\u134d', definition: 'A set of written, printed, or blank pages fastened together along one side and encased in protective covers.' },
  { word: 'Friend', translation: '\u1313\u12f0\u129b', definition: 'A person with whom one has a bond of mutual affection, typically one exclusive of sexual or family relations.' },
];

export function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = mockWords.filter(w => 
    w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.translation.includes(searchTerm)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      <div className="text-center space-y-2 mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
        >
          <Book className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Dictionary
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore common Amharic and English words, their meanings, and usage.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input 
          className="pl-10 h-14 text-lg rounded-full shadow-lg border-primary/10 bg-white/50 backdrop-blur-sm"
          placeholder="Search for a word (e.g., Hello, \u1230\u120b\u121d)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredWords.length > 0 ? (
          filteredWords.map((word, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">{word.word}</h3>
                        <span className="text-primary font-medium text-lg">-</span>
                        <h3 className="text-2xl font-bold text-primary">{word.translation}</h3>
                      </div>
                      <p className="text-muted-foreground italic text-sm">{word.definition}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e47d820f-8982-4b2d-bbd1-7e2dd867dbdd/dictionary-hero-image-87c853c2-1772576598906.webp" 
          alt="Dictionary Illustration"
          className="w-full h-64 object-cover"
        />
      </div>
    </div>
  );
}