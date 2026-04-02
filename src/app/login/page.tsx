'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NetraLogo } from '@/components/shared/NetraLogo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, BarChart2, Calendar, Zap } from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Content', desc: 'Generate captions and images with Gemini & DALL-E' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Plan and auto-publish across all platforms' },
  { icon: BarChart2, title: 'Deep Analytics', desc: 'Track performance with unified dashboards' },
  { icon: Zap, title: 'Workflow Automation', desc: 'From idea to published post in minutes' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
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

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[55%] relative netra-gradient-hero overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-indigo-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-extrabold">
              N
            </div>
            <span className="text-white/90 text-lg font-semibold tracking-tight">Netra AI</span>
          </div>

          {/* Hero content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Your social media,
              <br />
              <span className="text-white/80">powered by AI.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-10">
              Create, schedule, and analyze content across Instagram, TikTok, YouTube, and X — all from one intelligent workflow.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.08]">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-white/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{f.title}</p>
                      <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/30 text-xs">
            &copy; 2026 Netra AI &mdash; Social Media Automation
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="lg:hidden">
            <NetraLogo />
          </div>
          <div className="lg:flex-1" />
          <ThemeToggle />
        </div>

        {/* Center form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[380px] netra-fade-in">
            <div className="mb-8">
              <div
                className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center text-white text-xl font-extrabold netra-btn-glow lg:hidden"
                style={{ background: 'linear-gradient(135deg, #5B6CF6 0%, #3340B2 100%)' }}
              >
                N
              </div>
              <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground text-sm mt-1.5">
                Sign in to your Netra AI workspace
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button type="button" className="text-xs text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 mt-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold netra-btn-glow"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </Button>
            </form>

            <div className="netra-divider my-6" />

            <p className="text-center text-xs text-muted-foreground">
              Demo mode &mdash; enter any email with 6+ character password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
