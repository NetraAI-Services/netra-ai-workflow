'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { NetraLogo } from '@/components/shared/NetraLogo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Zap, BarChart2, Calendar } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1] as const;

const FEATURES = [
  { icon: Zap, label: 'AI Content Generation', desc: 'Create stunning posts in seconds' },
  { icon: Calendar, label: 'Smart Scheduling', desc: 'Publish at the perfect time' },
  { icon: BarChart2, label: 'Deep Analytics', desc: 'Track what performs best' },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (email && password.length >= 6) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!agreedToTerms) { toast.error('Please agree to the terms and conditions'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Account created! Welcome.');
    router.push('/dashboard');
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden netra-gradient-animated">
        {/* Noise texture */}
        <div className="absolute inset-0 netra-noise" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />

        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]"
        />

        {/* Dark overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] z-10" style={{
          background: 'linear-gradient(to top, rgba(3,0,20,0.95) 0%, rgba(3,0,20,0.6) 50%, transparent 100%)',
        }} />

        {/* Logo */}
        <div className="absolute top-8 left-10 z-20">
          <NetraLogo variant="white" />
        </div>

        {/* Content */}
        <div className="absolute bottom-16 left-10 right-10 z-20">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-display text-white mb-3"
          >
            Automate Your<br />Social Media,
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="text-section-title text-gradient-glow mb-6"
            style={{
              background: 'linear-gradient(135deg, #B3BAFC 0%, #E879F9 50%, #B3BAFC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Amplify Your Reach.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease }}
            className="flex flex-col gap-3 max-w-sm"
          >
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1, ease }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{feat.label}</p>
                    <p className="text-xs text-white/40">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Dot indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex gap-2 items-center mt-8"
          >
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-8 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 netra-pulse" />
          </motion.div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-5 left-10 z-20 text-white/15 text-xs tracking-wide">
          &copy; 2026 Netra AI &mdash; Social Media Automation
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="lg:hidden"><NetraLogo /></div>
          <div className="lg:flex-1" />
          <ThemeToggle />
        </div>

        {/* Center form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="w-full max-w-[400px]"
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-page-title text-foreground">
                  {mode === 'login' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-body-sm text-muted-foreground mt-2">
                  {mode === 'login' ? (
                    <>Don&apos;t have an account?{' '}
                      <button onClick={switchMode} className="text-primary hover:text-primary/80 font-semibold transition-colors cursor-pointer">
                        Create account
                      </button>
                    </>
                  ) : (
                    <>Already have an account?{' '}
                      <button onClick={switchMode} className="text-primary hover:text-primary/80 font-semibold transition-colors cursor-pointer">
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>

              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-5">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                      <Input id="firstName" type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11 rounded-xl border-border/80 bg-card focus:border-primary focus:ring-primary/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                      <Input id="lastName" type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11 rounded-xl border-border/80 bg-card focus:border-primary focus:ring-primary/20" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" required className="h-11 rounded-xl border-border/80 bg-card focus:border-primary focus:ring-primary/20" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    {mode === 'login' && (
                      <button type="button" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" required className="h-11 pr-10 rounded-xl border-border/80 bg-card focus:border-primary focus:ring-primary/20" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-4 h-4 rounded border-input accent-primary" />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <span className="text-primary hover:text-primary/80 font-medium cursor-pointer">Terms &amp; Conditions</span>
                    </span>
                  </label>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 mt-1 netra-btn-premium netra-btn-shimmer rounded-xl font-semibold gap-2 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign in' : 'Create account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-7">
                <div className="netra-divider" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground whitespace-nowrap">
                  {mode === 'login' ? 'Or sign in with' : 'Or register with'}
                </span>
              </div>

              {/* Google sign-in */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 gap-3 font-medium rounded-xl transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.42l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
