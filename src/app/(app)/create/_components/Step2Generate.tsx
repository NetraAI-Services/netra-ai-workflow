'use client';
import { useState } from 'react';
import { useContentStore } from '@/store/useContentStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Sparkles, ImageIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';
import type { GeneratedCaption, GeneratedImage } from '@/types/content';

export function Step2Generate() {
  const {
    currentDraft, generationState,
    setWizardStep, setGeneratingCaption, setGeneratingImage,
    setCaptions, setImages, selectImage, setGenerationError, updateDraft,
  } = useContentStore();
  const { apiKeys } = useSettingsStore();
  const [imageProvider, setImageProvider] = useState<'gemini' | 'dalle'>('gemini');

  if (!currentDraft) return null;

  const { isGeneratingCaption, isGeneratingImage, captions, images, error } = generationState;

  async function generateCaptions() {
    if (!currentDraft) return;
    setGeneratingCaption(true);
    setGenerationError(null);
    try {
      const res = await fetch('/api/generate/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentDraft.topic,
          tone: currentDraft.tone,
          platforms: currentDraft.platforms,
          apiKey: apiKeys.geminiApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setCaptions(data.captions);
      updateDraft({ captions: data.captions });
    } catch (e: unknown) {
      setGenerationError(e instanceof Error ? e.message : 'Failed to generate captions');
    } finally {
      setGeneratingCaption(false);
    }
  }

  async function generateImages() {
    if (!currentDraft) return;
    setGeneratingImage(true);
    setGenerationError(null);
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentDraft.topic,
          provider: imageProvider,
          apiKey: imageProvider === 'gemini' ? apiKeys.geminiApiKey : apiKeys.openaiApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image generation failed');
      setImages(data.images);
      updateDraft({ images: data.images });
      // Auto-select first image if none selected yet
      if (data.images.length > 0) selectImage(data.images[0].id);
    } catch (e: unknown) {
      setGenerationError(e instanceof Error ? e.message : 'Failed to generate images');
    } finally {
      setGeneratingImage(false);
    }
  }

  const canProceed = captions.length > 0;

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Caption generation */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Captions
            </CardTitle>
            <Button
              size="sm"
              variant={captions.length ? 'outline' : 'default'}
              onClick={generateCaptions}
              disabled={isGeneratingCaption}
              className={cn(!captions.length && 'bg-primary hover:bg-primary/90 text-primary-foreground')}
            >
              {isGeneratingCaption ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Generating…</>
              ) : captions.length ? (
                <><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate</>
              ) : (
                'Generate Captions'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!captions.length && !isGeneratingCaption ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Click "Generate Captions" to create platform-specific captions.
            </div>
          ) : isGeneratingCaption ? (
            <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm">Writing captions with AI…</p>
            </div>
          ) : (
            <div className="space-y-3">
              {captions.map((cap) => (
                <div key={cap.id} className="p-3 rounded-lg bg-secondary/50 border border-border text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">{cap.platform}</span>
                    <span className="text-xs text-muted-foreground">{cap.charCount} chars</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{cap.text}</p>
                  {cap.hashtags.length > 0 && (
                    <p className="text-primary text-xs mt-1.5">{cap.hashtags.join(' ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image generation */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Images
            </CardTitle>
            <div className="flex items-center gap-2">
              <Tabs value={imageProvider} onValueChange={(v) => setImageProvider(v as 'gemini' | 'dalle')}>
                <TabsList className="h-7 text-xs">
                  <TabsTrigger value="gemini" className="text-xs px-2">Gemini</TabsTrigger>
                  <TabsTrigger value="dalle" className="text-xs px-2">DALL-E</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                size="sm"
                variant={images.length ? 'outline' : 'default'}
                onClick={generateImages}
                disabled={isGeneratingImage}
                className={cn(!images.length && 'bg-primary hover:bg-primary/90 text-primary-foreground')}
              >
                {isGeneratingImage ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Generating…</>
                ) : images.length ? (
                  <><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate</>
                ) : 'Generate Images'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!images.length && !isGeneratingImage ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Generate images using Gemini or DALL-E. Select a provider and click Generate.
            </div>
          ) : isGeneratingImage ? (
            <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm">Creating images with AI…</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => selectImage(img.id)}
                  className={cn(
                    'relative rounded-xl overflow-hidden border-2 transition-all aspect-square bg-secondary',
                    img.selected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                  )}
                >
                  <img src={img.url} alt="Generated" className="w-full h-full object-cover" />
                  {img.selected && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setWizardStep(1)}>Back</Button>
        <Button
          disabled={!canProceed}
          onClick={() => setWizardStep(3)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
        >
          Edit & Refine
        </Button>
      </div>
    </div>
  );
}
