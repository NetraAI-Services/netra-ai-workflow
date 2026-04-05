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
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-card-title text-foreground font-heading">Connected Platforms</h2>
              <p className="text-sm text-muted-foreground mt-1">Connect your social accounts to enable direct publishing and analytics.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHowTo(true)}
              className="text-muted-foreground hover:text-primary h-8 w-8 p-0 flex-shrink-0 rounded-xl cursor-pointer"
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
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/60 dark:border-border/40 bg-surface/30 dark:bg-surface/20 hover:border-primary/25 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <PlatformIcon platform={id} size={22} colored />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{label}</p>
                    {conn.connected ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
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
                      className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive rounded-xl cursor-pointer"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => connect(id)}
                      className="netra-btn-premium rounded-xl cursor-pointer text-xs"
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

        <div className="netra-card rounded-2xl p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1.5 font-heading">OAuth Setup</p>
          To enable real OAuth connections, add your platform app credentials to <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-lg">.env.local</code>:
          <pre className="mt-2 p-3 rounded-xl bg-secondary/80 dark:bg-secondary/50 text-xs font-mono overflow-x-auto border border-border/50">
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
