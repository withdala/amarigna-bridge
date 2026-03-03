import React from 'react';
import { Terminal, Copy, Check, Code2, Server, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

const codeSnippets = {
  bash: `curl -X POST https://api.linguist.com/translate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "text": "Hello, how are you?",
    "source_lang": "en",
    "target_lang": "am"
  }'`,
  python: `import requests

url = "https://api.linguist.com/translate"
payload = {
    "text": "Hello, how are you?",
    "source_lang": "en",
    "target_lang": "am"
}
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
  js: `const response = await fetch('https://api.linguist.com/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello, how are you?',
    source_lang: 'en',
    target_lang: 'am'
  })
});

const data = await response.json();`
};

export function API() {
  const [selectedLang, setSelectedLang] = React.useState<'bash' | 'python' | 'js'>('bash');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      <div className="text-center space-y-2 mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
        >
          <Code2 className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Linguist API
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Integrate high-quality Amharic translation into your own applications with our powerful REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/5 shadow-sm">
          <CardHeader>
            <Zap className="w-6 h-6 text-yellow-500 mb-2" />
            <CardTitle className="text-lg">Ultra Fast</CardTitle>
            <CardDescription>Average latency under 200ms globally.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-primary/5 shadow-sm">
          <CardHeader>
            <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
            <CardTitle className="text-lg">Secure</CardTitle>
            <CardDescription>Enterprise-grade security and data encryption.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-primary/5 shadow-sm">
          <CardHeader>
            <Server className="w-6 h-6 text-blue-500 mb-2" />
            <CardTitle className="text-lg">Scalable</CardTitle>
            <CardDescription>Built to handle millions of requests daily.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quick Start Guide</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl border bg-white/50 backdrop-blur-sm">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold">Get your API Key</h4>
                <p className="text-sm text-muted-foreground">Sign up for a developer account to receive your unique authentication key.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl border bg-white/50 backdrop-blur-sm">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold">Choose your library</h4>
                <p className="text-sm text-muted-foreground">We provide SDKs for Python, JavaScript, Ruby, and more.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl border bg-white/50 backdrop-blur-sm">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold">Start translating</h4>
                <p className="text-sm text-muted-foreground">Call our endpoints and start building multilingual experiences.</p>
              </div>
            </div>
          </div>
          <Button size="lg" className="w-full">Request API Access</Button>
        </div>

        <Card className="bg-zinc-950 text-zinc-300 border-none overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-3 rounded-md text-xs ${selectedLang === 'bash' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800'}`}
                onClick={() => setSelectedLang('bash')}
              >
                cURL
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-3 rounded-md text-xs ${selectedLang === 'python' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800'}`}
                onClick={() => setSelectedLang('python')}
              >
                Python
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-3 rounded-md text-xs ${selectedLang === 'js' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800'}`}
                onClick={() => setSelectedLang('js')}
              >
                JavaScript
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white"
              onClick={() => copyToClipboard(codeSnippets[selectedLang])}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-6">
            <pre className="font-mono text-sm overflow-x-auto">
              <code>{codeSnippets[selectedLang]}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-2xl h-64 grayscale contrast-125 brightness-50 relative group">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e47d820f-8982-4b2d-bbd1-7e2dd867dbdd/api-hero-image-7d27e8dd-1772576592676.webp" 
          alt="API Illustration"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <h3 className="text-white text-3xl font-bold tracking-widest uppercase">Developer First</h3>
        </div>
      </div>
    </div>
  );
}