'use client';
import { useContentStore } from '@/store/useContentStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useIdeasStore } from '@/store/useIdeasStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TONE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Step1Prompt() {
  const { currentDraft, updateDraft, setWizardStep } = useContentStore();
  const { brand } = useSettingsStore();
  const { pillars } = useIdeasStore();

  if (!currentDraft) return null;

  const canContinue = currentDraft.topic.trim().length > 0;

  return (
    <div className="space-y-5">
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic / Idea *</Label>
            <Textarea
              id="topic"
              value={currentDraft.topic}
              onChange={(e) => updateDraft({ topic: e.target.value })}
              placeholder="e.g. Announcing our new feature that helps teams save 2 hours a day..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateDraft({ tone: t.value })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm border transition-all',
                    currentDraft.tone === t.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {brand.tone !== currentDraft.tone && (
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => updateDraft({ tone: brand.tone })}
              >
                Reset to brand default ({brand.tone})
              </button>
            )}
          </div>

          {pillars.length > 0 && (
            <div className="space-y-2">
              <Label>Content Pillar (optional)</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateDraft({ pillarId: undefined })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm border transition-all',
                    !currentDraft.pillarId
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                  )}
                >
                  None
                </button>
                {pillars.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateDraft({ pillarId: p.id })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm border transition-all',
                      currentDraft.pillarId === p.id
                        ? 'text-white border-transparent'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                    )}
                    style={currentDraft.pillarId === p.id ? { background: p.color, borderColor: p.color } : {}}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setWizardStep(0)}>Back</Button>
        <Button
          disabled={!canContinue}
          onClick={() => setWizardStep(2)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
        >
          Generate Content
        </Button>
      </div>
    </div>
  );
}
