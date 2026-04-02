'use client';
import { useContentStore } from '@/store/useContentStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CHAR_LIMITS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { PlatformId } from '@/types/content';

export function Step3Edit() {
  const { currentDraft, generationState, updateDraft, setWizardStep } = useContentStore();

  if (!currentDraft) return null;
  const { captions } = generationState;

  function updateCaption(id: string, text: string) {
    const updated = captions.map((c) =>
      c.id === id ? { ...c, text, charCount: text.length } : c
    );
    updateDraft({ captions: updated });
  }

  return (
    <div className="space-y-5">
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <p className="font-semibold text-foreground">Edit Captions</p>
          {captions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No captions generated. Go back to generate.
            </p>
          ) : (
            captions.map((cap) => {
              const limit = CHAR_LIMITS[cap.platform as PlatformId] ?? 2200;
              const over = cap.charCount > limit;
              return (
                <div key={cap.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {cap.platform}
                    </span>
                    <span className={cn('text-xs font-mono', over ? 'text-destructive' : 'text-muted-foreground')}>
                      {cap.charCount} / {limit}
                    </span>
                  </div>
                  <Textarea
                    value={cap.text}
                    onChange={(e) => updateCaption(cap.id, e.target.value)}
                    rows={4}
                    className={cn('resize-none text-sm', over && 'border-destructive')}
                  />
                  {cap.hashtags.length > 0 && (
                    <p className="text-xs text-primary">{cap.hashtags.join(' ')}</p>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Selected image preview */}
      {currentDraft.selectedImageId && (
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <p className="font-semibold text-foreground mb-3">Selected Image</p>
            {(() => {
              const img = generationState.images.find((i) => i.id === currentDraft.selectedImageId);
              return img ? (
                <div className="flex gap-4 items-start">
                  <img src={img.url} alt="Selected" className="w-32 h-32 rounded-xl object-cover border border-border" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Provider: {img.provider}</p>
                    <p className="line-clamp-3">{img.prompt}</p>
                    <button
                      className="text-primary hover:underline mt-2"
                      onClick={() => setWizardStep(2)}
                    >
                      Change image
                    </button>
                  </div>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setWizardStep(2)}>Back</Button>
        <Button onClick={() => setWizardStep(4)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
          Preview
        </Button>
      </div>
    </div>
  );
}
