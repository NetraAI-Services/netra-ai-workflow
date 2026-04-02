'use client';
import { useContentStore } from '@/store/useContentStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import type { PlatformId } from '@/types/content';
import { truncate } from '@/lib/utils';

function InstagramMock({ caption, imageUrl, handle }: { caption: string; imageUrl?: string; handle: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden max-w-xs w-full shadow-sm">
      <div className="flex items-center gap-2 p-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600" />
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">{handle}</span>
      </div>
      <div className="bg-zinc-100 dark:bg-zinc-800 aspect-square flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-zinc-400">No image</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3">{caption}</p>
      </div>
    </div>
  );
}

function TwitterMock({ caption, handle }: { caption: string; handle: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 max-w-xs w-full shadow-sm">
      <div className="flex gap-2">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0">
          {handle.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{handle}</p>
          <p className="text-xs text-zinc-500">@{handle.toLowerCase().replace(/\s/g, '_')}</p>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-2">{truncate(caption, 280)}</p>
        </div>
      </div>
    </div>
  );
}

export function Step4Preview() {
  const { currentDraft, generationState, setWizardStep } = useContentStore();
  const { brand } = useSettingsStore();

  if (!currentDraft) return null;

  const { captions, images } = generationState;
  const selectedImage = images.find((i) => i.id === currentDraft.selectedImageId);
  const handle = brand.name || 'My Brand';

  return (
    <div className="space-y-5">
      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <p className="font-semibold text-foreground mb-4">Platform Previews</p>
          <div className="flex flex-wrap gap-6 justify-center">
            {currentDraft.platforms.map((platform) => {
              const cap = captions.find((c) => c.platform === platform);
              const text = cap?.text || currentDraft.topic || 'Your caption here…';

              return (
                <div key={platform} className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <PlatformIcon platform={platform as PlatformId} size={14} />
                    <span className="capitalize">{platform === 'twitter' ? 'X (Twitter)' : platform}</span>
                  </div>
                  {platform === 'instagram' || platform === 'tiktok' || platform === 'youtube' ? (
                    <InstagramMock caption={text} imageUrl={selectedImage?.url} handle={handle} />
                  ) : (
                    <TwitterMock caption={text} handle={handle} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setWizardStep(3)}>Back</Button>
        <Button onClick={() => setWizardStep(5)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
          Schedule / Publish
        </Button>
      </div>
    </div>
  );
}
