'use client';
import { useState } from 'react';
import { useContentStore } from '@/store/useContentStore';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { PLATFORMS, CONTENT_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';
import type { PlatformId, ContentType } from '@/types/content';

export function Step0Platforms() {
  const { initDraft } = useContentStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [selectedType, setSelectedType] = useState<ContentType>('image_post');

  function toggle(id: PlatformId) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  const compatibleTypes = CONTENT_TYPES.filter((ct) =>
    selectedPlatforms.length === 0 || ct.platforms.some((p) => selectedPlatforms.includes(p))
  );

  function next() {
    if (!selectedPlatforms.length) return;
    initDraft(selectedPlatforms, selectedType);
  }

  return (
    <div className="space-y-5">
      <div className="netra-card p-6 space-y-4">
        <p className="text-sm font-bold text-foreground">Select Platforms</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLATFORMS.map(({ id, label }) => {
            const selected = selectedPlatforms.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={cn(
                  'relative flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all',
                  selected
                    ? 'border-primary bg-primary/8 dark:bg-primary/10 shadow-sm'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30'
                )}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <PlatformIcon platform={id} size={32} colored />
                <span className="text-xs font-semibold text-foreground">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="netra-card p-6 space-y-4">
        <p className="text-sm font-bold text-foreground">Content Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {compatibleTypes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={cn(
                'px-3 py-3 rounded-xl border text-sm font-semibold transition-all',
                selectedType === id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={next}
          disabled={!selectedPlatforms.length}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 gap-2 netra-btn-glow"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
