import { useState, useEffect } from 'react';
import { Translator } from './components/Translator';
import { Dictionary } from './components/Dictionary';
import { Learn } from './components/Learn';
import { API } from './components/API';
import { Calendar as CalendarComponent } from './components/Calendar';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Toaster } from 'sonner';
import { 
  Languages, 
  Book, 
  GraduationCap, 
  Code2, 
  Menu, 
  X, 
  LogOut,
  LayoutDashboard,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

type Section = 'translator' | 'dictionary' | 'learn' | 'calendar' | 'api' | 'admin';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('translator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const approvedAdmin = 'ygtw20@gmail.com';
  const isAdmin = session?.user?.email === approvedAdmin;

  useEffect(() => {
    // Check for query parameters on load (useful for OAuth redirects)
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    if (sectionParam === 'admin') {
      setActiveSection('admin');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
      setActiveSection('translator');
    }
  };

  const navItems = [
    { id: 'translator', label: 'Translator', icon: Languages },
    { id: 'dictionary', label: 'Dictionary', icon: Book },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'api', label: 'API', icon: Code2 },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
  ];

  const renderSection = () => {
    if (activeSection === 'admin') {
      if (isLoading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
      if (!session || !isAdmin) return <AdminLogin />;
      return <AdminDashboard />;
    }

    switch (activeSection) {
      case 'translator':
        return <Translator />;
      case 'dictionary':
        return <Dictionary />;
      case 'learn':
        return <Learn />;
      case 'calendar':
        return <CalendarComponent />;
      case 'api':
        return <API />;
      default:
        return <Translator />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-primary/20 flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`, backgroundRepeat: 'repeat' }}
        />
      </div>

      <header className="relative z-20 sticky top-0 bg-white/80 backdrop-blur-xl border-b shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between py-4">
          <div 
            className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer group"
            onClick={() => setActiveSection('translator')}
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Languages className="w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              Linguist
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'secondary' : 'ghost'}
                size="sm"
                className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all font-medium ${
                  activeSection === item.id 
                    ? 'text-primary bg-primary/10 shadow-inner' 
                    : 'text-muted-foreground hover:text-primary hover:bg-slate-100'
                }`}
                onClick={() => setActiveSection(item.id as Section)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}

            {session && (
              <div className="flex items-center gap-3 ml-4 border-l pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Signed in as</span>
                  <span className="text-xs font-semibold text-primary truncate max-w-[120px]">{session.user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout} 
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-xl bg-slate-100 h-10 w-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b bg-white backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'secondary' : 'ghost'}
                    className={`justify-start gap-4 h-14 rounded-2xl transition-all ${
                      activeSection === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => {
                      setActiveSection(item.id as Section);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold text-base">{item.label}</span>
                  </Button>
                ))}
                {session && (
                  <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                    <div className="px-4 py-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Account</p>
                       <p className="text-sm font-semibold truncate">{session.user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start gap-4 h-14 rounded-2xl text-destructive hover:bg-destructive/5"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold text-base">Logout</span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 flex-grow pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-16 border-t bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
               <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                  <Languages className="w-5 h-5" />
                </div>
                Linguist
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The most accurate English to Amharic translation platform. Empowering communication through technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Resources</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => setActiveSection('translator')} className="text-left text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Translator</button>
                <button onClick={() => setActiveSection('dictionary')} className="text-left text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Dictionary</button>
                <button onClick={() => setActiveSection('learn')} className="text-left text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Learn</button>
                <button onClick={() => setActiveSection('calendar')} className="text-left text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Calendar</button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Developers</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => setActiveSection('api')} className="text-left text-sm font-medium hover:text-primary transition-colors text-muted-foreground">API Reference</button>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground flex items-center gap-2">
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
                <button onClick={() => setActiveSection('admin')} className="text-left text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Admin Console</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Linguist Amharic. Engineered for clarity.</p>
            <div className="flex gap-8 text-xs font-semibold text-muted-foreground">
               <a href="#" className="hover:text-primary">Privacy</a>
               <a href="#" className="hover:text-primary">Terms</a>
               <a href="#" className="hover:text-primary">Security</a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" expand={true} richColors closeButton />
    </div>
  );
}

export default App;