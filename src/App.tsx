import { useState, useEffect } from 'react';
import { Translator } from './components/Translator';
import { Dictionary } from './components/Dictionary';
import { Learn } from './components/Learn';
import { API } from './components/API';
import { Calendar } from './components/Calendar';
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
  Github, 
  CalendarDays,
  LayoutDashboard,
  LogOut,
  User,
  ExternalLink,
  Lock
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
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If user logs in and is on admin section, it will naturally refresh
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
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'api', label: 'API', icon: Code2 },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
  ];

  const renderSection = () => {
    if (activeSection === 'admin') {
      if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Checking Authorization</p>
          </div>
        </div>
      );
      
      // Admin protection: If no session or not approved admin, show login
      if (!session || !isAdmin) {
        return <AdminLogin />;
      }
      
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
        return <Calendar />;
      case 'api':
        return <API />;
      default:
        return <Translator />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] selection:bg-primary/20 flex flex-col font-sans text-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[140px]" />
      </div>

      <header className="relative z-50 sticky top-0 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer group select-none"
            onClick={() => setActiveSection('translator')}
          >
            <div className="bg-primary text-white p-2 rounded-2xl shadow-xl shadow-primary/20 group-hover:scale-110 group-active:scale-95 transition-all">
              <Languages className="w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">
              Linguist
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 px-5 h-11 rounded-xl transition-all font-bold text-sm ${
                  activeSection === item.id 
                    ? 'text-primary bg-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
                onClick={() => setActiveSection(item.id as Section)}
              >
                <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-primary' : 'text-slate-400'}`} />
                {item.label}
              </Button>
            ))}

            {session && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout} 
                  className="h-11 w-11 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!session && activeSection !== 'admin' && (
              <Button 
                variant="outline"
                className="hidden md:flex h-11 px-6 rounded-xl border-slate-200 font-bold text-sm gap-2"
                onClick={() => setActiveSection('admin')}
              >
                <Lock className="w-4 h-4" />
                Admin Access
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-2xl bg-slate-100 h-12 w-12"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-3">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`justify-start gap-4 h-16 rounded-2xl transition-all ${
                      activeSection === item.id ? 'bg-primary/10 text-primary font-black' : 'text-slate-600 font-bold'
                    }`}
                    onClick={() => {
                      setActiveSection(item.id as Section);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="w-5 h-5 opacity-70" />
                    <span className="text-base">{item.label}</span>
                  </Button>
                ))}
                {session && (
                  <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
                    <div className="px-4 flex items-center gap-3">
                       <div className="bg-primary/10 p-2 rounded-lg">
                          <User className="w-5 h-5 text-primary" />
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticated</p>
                          <p className="text-sm font-bold truncate max-w-[200px]">{session.user.email}</p>
                       </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start gap-4 h-16 rounded-2xl text-destructive hover:bg-destructive/5 font-black"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 flex-grow pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-20 border-t border-slate-200 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
               <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                <div className="bg-primary text-white p-1.5 rounded-xl">
                  <Languages className="w-5 h-5" />
                </div>
                Linguist
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                The definitive English to Amharic translation suite. We combine neural translation with human-centric input methods to deliver unmatched clarity.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-6 text-xs uppercase tracking-[0.3em] text-slate-400">Platform</h4>
              <div className="flex flex-col gap-4">
                <button onClick={() => setActiveSection('translator')} className="text-left text-sm font-bold hover:text-primary transition-colors text-slate-600">Translator</button>
                <button onClick={() => setActiveSection('dictionary')} className="text-left text-sm font-bold hover:text-primary transition-colors text-slate-600">Dictionary</button>
                <button onClick={() => setActiveSection('learn')} className="text-left text-sm font-bold hover:text-primary transition-colors text-slate-600">Learning Hub</button>
                <button onClick={() => setActiveSection('calendar')} className="text-left text-sm font-bold hover:text-primary transition-colors text-slate-600">Calendar</button>
              </div>
            </div>
            <div>
              <h4 className="font-black mb-6 text-xs uppercase tracking-[0.3em] text-slate-400">Resources</h4>
              <div className="flex flex-col gap-4">
                <button onClick={() => setActiveSection('api')} className="text-left text-sm font-bold hover:text-primary transition-colors text-slate-600">Developer API</button>
                <a href="#" className="text-sm font-bold hover:text-primary transition-colors text-slate-600 flex items-center gap-2">
                  GitHub Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => setActiveSection('admin')} className="text-left text-sm font-bold hover:text-primary transition-colors text-slate-600 flex items-center gap-2">
                  Admin Console <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">\u00a9 {new Date().getFullYear()} Linguist Labs</p>
              <p className="text-xs text-slate-500 font-medium">Engineered for precision and cultural accuracy.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
               <a href="#" className="hover:text-primary transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" expand={true} richColors closeButton />
    </div>
  );
}

export default App;