import React from 'react';
import { GraduationCap, Trophy, BookOpen, Star, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const modules = [
  { 
    title: "Amharic Alphabet", 
    description: "Learn the basic Ge'ez script characters and pronunciation.",
    lessons: 12,
    progress: 45,
    icon: BookOpen,
    color: "bg-blue-500"
  },
  { 
    title: "Common Greetings", 
    description: "Master everyday phrases for social interactions.",
    lessons: 8,
    progress: 10,
    icon: Star,
    color: "bg-purple-500"
  },
  { 
    title: "Food & Dining", 
    description: "Vocabulary for restaurants, markets, and traditional dishes.",
    lessons: 15,
    progress: 0,
    icon: PlayCircle,
    color: "bg-green-500"
  },
  { 
    title: "Travel Essentials", 
    description: "Navigate Ethiopia with confidence using these key phrases.",
    lessons: 10,
    progress: 0,
    icon: GraduationCap,
    color: "bg-orange-500"
  }
];

export function Learn() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      <div className="text-center space-y-2 mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
        >
          <GraduationCap className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Learn Amharic
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Interactive lessons designed to help you speak, read, and write Amharic with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color} text-white`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  {module.progress > 0 && (
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {module.progress}% Complete
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
                    <span>{module.lessons} Lessons</span>
                    {module.progress > 0 && <span>Progress</span>}
                  </div>
                  {module.progress > 0 ? (
                    <Progress value={module.progress} className="h-2" />
                  ) : (
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      Start Learning
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Daily Challenge</h2>
          <p className="opacity-90 max-w-md">Test your knowledge with today's quiz and earn double XP towards your weekly goal.</p>
          <Button className="mt-4 w-fit bg-white text-black hover:bg-white/90">
             Join Challenge <Trophy className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e47d820f-8982-4b2d-bbd1-7e2dd867dbdd/learn-hero-image-68543f9f-1772576592946.webp" 
          alt="Learning Illustration"
          className="w-full h-80 object-cover"
        />
      </div>
    </div>
  );
}