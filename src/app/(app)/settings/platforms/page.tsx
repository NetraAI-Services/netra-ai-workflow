'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

  // Check for OAuth callback messages
  useEffect(() => {
    const error = searchParams.get('error');
    const connected = searchParams.get('connected');
    const success = searchParams.get('success');

    if (error) {
      toast.error(`Connection failed: ${error}`);
    } else if (connected && success) {
      const platformId = connected as PlatformId;
      toast.success(`${platformId} connected successfully!`);
      // Update store to reflect connected state
      setPlatformConnected(platformId, {
        handle: `@${platformId}_account`,
        accountId: `${platformId}_${Date.now()}`,
        tokenExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days default
      });
    }

    // Clean up URL params
    if (error || connected || success) {
      router.replace('/settings/platforms');
    }
  }, [searchParams, router, setPlatformConnected]);

  async function connect(id: PlatformId) {
    setLoading(id);
    try {
      // Get a temporary user ID (in real app, this would come from auth context)
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
      if (!authUrl) {
        throw new Error('No auth URL provided');
      }

      // Redirect to platform OAuth page
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
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-base">Connected Platforms</CardTitle>
                <CardDescription>
                  Connect your social accounts to enable direct publishing and analytics.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHowTo(true)}
                className="text-muted-foreground hover:text-primary h-8 w-8 p-0 flex-shrink-0"
                title="How to connect"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
        <CardContent className="space-y-3">
          {PLATFORMS.map(({ id, label, color }) => {
            const conn = platforms[id];
            return (
              <div
                key={id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <PlatformIcon platform={id} size={22} colored />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{label}</p>
                  {conn.connected ? (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
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
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => connect(id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={loading === id}
                  >
                    {loading === id ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">OAuth Setup</p>
          To enable real OAuth connections, add your platform app credentials to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">.env.local</code>:
          <pre className="mt-2 p-3 rounded-lg bg-secondary text-xs font-mono overflow-x-auto">
{`INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...`}
          </pre>
        </CardContent>
      </Card>
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
