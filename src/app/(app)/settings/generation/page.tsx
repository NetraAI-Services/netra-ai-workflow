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
        <div className="mb-5">
          <h2 className="text-card-title text-foreground font-heading">Caption Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Defaults applied to every AI-generated caption.</p>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Default Post Length</Label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateGeneration({ defaultPostLength: opt.value })}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                    generation.defaultPostLength === opt.value
                      ? 'border-primary bg-primary/8 dark:bg-primary/12 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-75">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hashtag-count">Default Hashtag Count</Label>
            <Input id="hashtag-count" type="number" min={0} max={30} value={generation.defaultHashtagCount} onChange={(e) => updateGeneration({ defaultHashtagCount: Number(e.target.value) })} className="w-28 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateGeneration({ language: lang })}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-sm border transition-all duration-200 cursor-pointer',
                    generation.language === lang
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface/50 dark:bg-surface/30">
            <div>
              <Label>Include Emoji</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Add relevant emoji to generated captions.</p>
            </div>
            <Switch checked={generation.includeEmoji} onCheckedChange={(v) => updateGeneration({ includeEmoji: v })} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface/50 dark:bg-surface/30">
            <div>
              <Label>Auto-generate Hashtags</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically suggest hashtags based on topic.</p>
            </div>
            <Switch checked={generation.autoGenerateHashtags} onCheckedChange={(v) => updateGeneration({ autoGenerateHashtags: v })} />
          </div>
        </div>
      </div>

      <div className="netra-card rounded-2xl p-6">
        <div className="mb-4">
          <h2 className="text-card-title text-foreground font-heading">Image Style</h2>
          <p className="text-sm text-muted-foreground mt-1">Default visual style applied to AI image generation prompts.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {IMAGE_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => updateGeneration({ defaultImageStyle: style })}
              className={cn(
                'px-3 py-1.5 rounded-xl text-sm border capitalize transition-all duration-200 cursor-pointer',
                generation.defaultImageStyle === style
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40'
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
