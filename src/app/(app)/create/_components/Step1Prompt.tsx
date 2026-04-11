'use client';
import { useRef } from 'react';
import { useContentStore } from '@/store/useContentStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useIdeasStore } from '@/store/useIdeasStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TONE_OPTIONS } from '@/lib/constants';
import { cn, generateId } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';

export function Step1Prompt() {
  const { currentDraft, updateDraft, setWizardStep, generationState, addReferenceImage, removeReferenceImage } = useContentStore();
  const { brand } = useSettingsStore();
  const { pillars } = useIdeasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentDraft) return null;

  const { referenceImages } = generationState;
  const canContinue = currentDraft.topic.trim().length > 0;

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - referenceImages.length;
    files.slice(0, remaining).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        addReferenceImage({
          id: generateId(),
          name: file.name,
          mimeType: file.type,
          base64: dataUrl.split(',')[1],
          dataUrl,
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    const fakeEvent = { target: { files, value: '' }, preventDefault: () => {} } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFiles(fakeEvent);
  }

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

      {/* Reference Images */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Reference Images <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <p className="text-xs text-muted-foreground mt-0.5">Upload inspiration images to guide the AI when generating captions and images.</p>
            </div>
            {referenceImages.length > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">{referenceImages.length}/4</span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFiles}
          />

          <div className="flex flex-wrap gap-2">
            {referenceImages.map((img) => (
              <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group flex-shrink-0">
                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeReferenceImage(img.id)}
                  className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}

            {referenceImages.length < 4 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center text-muted-foreground transition-all cursor-pointer gap-1"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-[9px] font-medium">Add</span>
              </button>
            )}
          </div>
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
