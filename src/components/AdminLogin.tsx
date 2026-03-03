import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  AlertCircle,
  Chrome
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase, AUTH_REDIRECT_URL } from '../lib/supabase';
import { toast } from 'sonner';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Explicitly set the redirect URL to the production domain
          redirectTo: AUTH_REDIRECT_URL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google Login Error:', error);
      toast.error(error.message || 'Failed to initialize Google login');
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

    // Only allow ygtw20@gmail.com for admin access
    if (email.toLowerCase() !== 'ygtw20@gmail.com') {
      toast.error('Access restricted to authorized administrators only.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: AUTH_REDIRECT_URL,
        },
      });
      if (error) throw error;
      setIsEmailSent(true);
      toast.success('Magic link sent! Check your email.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>
              Please sign in with an authorized account to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEmailSent ? (
              <>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 gap-3 hover:bg-slate-50 border-slate-200 shadow-sm" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <Chrome className="w-5 h-5 text-[#4285F4]" />
                    Continue with Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or secure login</span>
                  </div>
                </div>

                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="ygtw20@gmail.com" 
                        className="pl-10 h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 shadow-lg shadow-primary/20" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="bg-green-50 p-4 rounded-xl flex items-center justify-center text-green-700">
                  <Mail className="w-5 h-5 mr-2" />
                  Email sent to {email}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Check your inbox and click the link to sign in securely.
                </p>
                <Button variant="ghost" onClick={() => setIsEmailSent(false)} className="text-sm underline">
                  Try another email
                </Button>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] text-amber-700 leading-relaxed font-bold">
                  Troubleshooting Google Login:
                </p>
                <p className="text-[10px] text-amber-600 leading-relaxed">
                  Ensure Redirect URLs in Supabase include {AUTH_REDIRECT_URL}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}