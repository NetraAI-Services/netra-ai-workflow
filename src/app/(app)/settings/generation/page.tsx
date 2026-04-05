'use client';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LENGTH_OPTIONS = [
  { value: 'short',  label: 'Short',  desc: '< 100 chars' },
  { value: 'medium', label: 'Medium', desc: '100–300 chars' },
  { value: 'long',   label: 'Long',   desc: '300+ chars' },
] as const;

const IMAGE_STYLES = ['photorealistic', 'illustration', 'minimalist', 'cinematic', 'flat design', 'watercolor'];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Indonesian', 'Japanese'];

export default function GenerationSettingsPage() {
  const { generation, updateGeneration } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div className="netra-card rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-card-title text-foreground font-heading">Caption Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Defaults applied to every AI-generated caption.</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Default Post Length</Label>
            <div className="grid grid-cols-3 gap-3">
              {LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateGeneration({ defaultPostLength: opt.value })}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer group',
                    generation.defaultPostLength === opt.value
                      ? 'border-primary bg-primary/12 dark:bg-primary/15 text-primary shadow-lg shadow-primary/20'
                      : 'border-border/60 bg-surface/40 dark:bg-surface/30 text-muted-foreground hover:border-primary/40 hover:bg-surface/60 dark:hover:bg-surface/45'
                  )}
                >
                  <p className="font-semibold text-sm group-hover:text-foreground transition-colors">{opt.label}</p>
                  <p className="text-xs mt-1 opacity-70 group-hover:opacity-85 transition-opacity">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="hashtag-count" className="text-sm font-semibold">Default Hashtag Count</Label>
            <Input
              id="hashtag-count"
              type="number"
              min={0}
              max={30}
              value={generation.defaultHashtagCount}
              onChange={(e) => updateGeneration({ defaultHashtagCount: Number(e.target.value) })}
              className="w-32 rounded-xl bg-surface/50 dark:bg-surface/30 border-border/60 hover:border-primary/40 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Language</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateGeneration({ language: lang })}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-sm border font-medium transition-all duration-200 cursor-pointer',
                    generation.language === lang
                      ? 'bg-primary/90 text-primary-foreground border-primary shadow-lg shadow-primary/30'
                      : 'bg-surface/40 dark:bg-surface/30 text-muted-foreground border-border/60 hover:border-primary/40 hover:bg-surface/60'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Include Emoji</Label>
              <p className="text-xs text-muted-foreground mt-1">Add relevant emoji to generated captions.</p>
            </div>
            <Switch checked={generation.includeEmoji} onCheckedChange={(v) => updateGeneration({ includeEmoji: v })} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Auto-generate Hashtags</Label>
              <p className="text-xs text-muted-foreground mt-1">Automatically suggest hashtags based on topic.</p>
            </div>
            <Switch checked={generation.autoGenerateHashtags} onCheckedChange={(v) => updateGeneration({ autoGenerateHashtags: v })} />
          </div>
        </div>
      </div>

      <div className="netra-card rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-card-title text-foreground font-heading">Image Style</h2>
          <p className="text-sm text-muted-foreground mt-1">Default visual style applied to AI image generation prompts.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {IMAGE_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => updateGeneration({ defaultImageStyle: style })}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm border capitalize font-medium transition-all duration-200 cursor-pointer',
                generation.defaultImageStyle === style
                  ? 'bg-primary/90 text-primary-foreground border-primary shadow-lg shadow-primary/30'
                  : 'bg-surface/40 dark:bg-surface/30 text-muted-foreground border-border/60 hover:border-primary/40 hover:bg-surface/60'
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={() => toast.success('Generation settings saved')} className="netra-btn-premium netra-btn-shimmer rounded-xl cursor-pointer">
        Save Settings
      </Button>
    </div>
  );
}
