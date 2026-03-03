import React, { useState } from 'react';
import { 
  Shield, 
  LogIn, 
  Mail, 
  AlertCircle,
  Chrome,
  ArrowLeft,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const approvedAdmin = 'ygtw20@gmail.com';

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (email.toLowerCase() !== approvedAdmin) {
      toast.error('Unauthorized access: This area is reserved for the system administrator.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setIsEmailSent(true);
      toast.success('Security link dispatched. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-slate-200/60 overflow-hidden relative bg-white/80 backdrop-blur-xl rounded-[2rem]">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-primary" />
          
          <CardHeader className="space-y-4 text-center pb-10 pt-12">
            <div className="mx-auto bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black tracking-tight text-slate-900">Administrator Hub</CardTitle>
              <CardDescription className="text-slate-500 font-medium text-lg">
                Secure authentication required for dashboard access.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-12">
            {!isEmailSent ? (
              <>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 gap-4 hover:bg-slate-50 border-slate-200 shadow-sm rounded-2xl text-slate-700 font-bold transition-all active:scale-95" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <Chrome className="w-5 h-5 text-[#4285F4]" />
                    Authorize with Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="bg-white px-4 text-slate-300">Secure Direct Login</span>
                  </div>
                </div>

                <form onSubmit={handleMagicLink} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Admin Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="ygtw20@gmail.com" 
                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 shadow-2xl shadow-primary/30 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Send Secure Link"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-8 py-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100 flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-green-900 text-xl">Dispatch Successful</p>
                    <p className="text-sm text-green-700 font-medium">
                      A verification link was sent to<br/>
                      <span className="font-bold underline">{email}</span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-sm text-slate-500 font-medium italic">
                    Please check your mailbox (including spam) and follow the instructions to continue.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEmailSent(false)} 
                    className="text-primary font-bold hover:bg-primary/5 rounded-xl h-12"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Shield className="w-4 h-4 text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Internal Security Policy</p>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Access is restricted to authorized personnel. Session activity and geolocation data are logged for security audits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}