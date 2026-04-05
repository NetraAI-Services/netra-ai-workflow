'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';
import { toast } from 'sonner';
import { HowToConnectModal } from './HowToConnectModal';
import type { PlatformId } from '@/types/content';

function PlatformsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { platforms, setPlatformConnected, setPlatformDisconnected } = useSettingsStore();
  const [loading, setLoading] = useState<PlatformId | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    const connected = searchParams.get('connected');
    const success = searchParams.get('success');

    if (error) {
      toast.error(`Connection failed: ${error}`);
    } else if (connected && success) {
      const platformId = connected as PlatformId;
      toast.success(`${platformId} connected successfully!`);
      setPlatformConnected(platformId, {
        handle: `@${platformId}_account`,
        accountId: `${platformId}_${Date.now()}`,
        tokenExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
    }

    if (error || connected || success) {
      router.replace('/settings/platforms');
    }
  }, [searchParams, router, setPlatformConnected]);

  async function connect(id: PlatformId) {
    setLoading(id);
    try {
      const userId = `user_${Date.now()}`;
      const res = await fetch(`/api/platforms/${id}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to initiate OAuth');
      }

      const { authUrl } = await res.json();
      if (!authUrl) throw new Error('No auth URL provided');
      window.location.href = authUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection failed';
      toast.error(message);
      setLoading(null);
    }
  }

  function disconnect(id: PlatformId) {
    setPlatformDisconnected(id);
    toast.success(`Disconnected from ${id}`);
  }

  return (
    <>
      <HowToConnectModal open={showHowTo} onOpenChange={setShowHowTo} />
      <div className="space-y-6">
        <div className="netra-card rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-card-title text-foreground font-heading">Connected Platforms</h2>
              <p className="text-sm text-muted-foreground mt-1">Connect your social accounts to enable direct publishing and analytics.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHowTo(true)}
              className="text-muted-foreground hover:text-primary h-8 w-8 p-0 flex-shrink-0 rounded-xl cursor-pointer transition-all duration-200 hover:bg-primary/10"
              title="How to connect"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-3">
            {PLATFORMS.map(({ id, label, color }) => {
              const conn = platforms[id];
              return (
                <div
                  key={id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-surface/50 dark:bg-surface/30 hover:border-primary/40 hover:bg-surface/70 dark:hover:bg-surface/50 transition-all duration-200 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${color}20` }}
                  >
                    <PlatformIcon platform={id} size={22} colored />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{label}</p>
                    {conn.connected ? (
                      <p className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {conn.handle || 'Connected'}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <XCircle className="w-3 h-3" /> Not connected
                      </p>
                    )}
                  </div>
                  {conn.connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnect(id)}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/60 rounded-xl cursor-pointer transition-all duration-200"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => connect(id)}
                      className="netra-btn-premium rounded-xl cursor-pointer text-xs transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                      disabled={loading === id}
                    >
                      {loading === id ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="netra-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground font-heading">OAuth Setup Required</p>
              <p className="text-xs text-muted-foreground mt-1">To enable real OAuth connections, add your platform app credentials to <code className="font-mono text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-lg">.env.local</code></p>
            </div>
          </div>
          <pre className="mt-4 p-4 rounded-xl bg-secondary/40 dark:bg-secondary/20 text-xs font-mono overflow-x-auto border border-border/40 text-muted-foreground">
{`INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...`}
          </pre>
        </div>
      </div>
    </>
  );
}

export default function PlatformsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Loading...</div>}>
      <PlatformsContent />
    </Suspense>
  );
}
