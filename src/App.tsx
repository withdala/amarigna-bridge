import { Translator } from './components/Translator';
import { Toaster } from 'sonner';

function App() {
  return (
    <main className="min-h-screen bg-[#f8fafc] selection:bg-primary/20">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/e47d820f-8982-4b2d-bbd1-7e2dd867dbdd/texture-background-899fee1b-1772574675171.webp')`, backgroundRepeat: 'repeat', backgroundSize: '300px' }}
        />
      </div>

      <div className="relative z-10">
        <nav className="p-6 border-b bg-white/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <span className="block w-5 h-5 flex items-center justify-center">L</span>
              </div>
              Linguist
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Translator</a>
              <a href="#" className="hover:text-primary transition-colors">Dictionary</a>
              <a href="#" className="hover:text-primary transition-colors">Learn</a>
              <a href="#" className="hover:text-primary transition-colors">API</a>
            </div>
            <button className="md:hidden p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </nav>
        
        <Translator />
      </div>

      <Toaster position="top-center" expand={true} richColors />
    </main>
  );
}

export default App;