'use client';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TONE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function BrandSettingsPage() {
  const { brand, updateBrand } = useSettingsStore();

  function save() {
    toast.success('Brand settings saved');
  }

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Brand Identity</CardTitle>
          <CardDescription>Define how your brand is represented in generated content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={brand.name}
                onChange={(e) => updateBrand({ name: e.target.value })}
                placeholder="My Brand"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target-audience">Target Audience</Label>
              <Input
                id="target-audience"
                value={brand.targetAudience}
                onChange={(e) => updateBrand({ targetAudience: e.target.value })}
                placeholder="e.g. Young professionals 25-35"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => updateBrand({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
                />
                <Input
                  id="primary-color"
                  value={brand.primaryColor}
                  onChange={(e) => updateBrand({ primaryColor: e.target.value })}
                  placeholder="#5B6CF6"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => updateBrand({ secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
                />
                <Input
                  id="secondary-color"
                  value={brand.secondaryColor}
                  onChange={(e) => updateBrand({ secondaryColor: e.target.value })}
                  placeholder="#8D97FA"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Voice Keywords</Label>
            <Input
              value={brand.voiceKeywords.join(', ')}
              onChange={(e) =>
                updateBrand({ voiceKeywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })
              }
              placeholder="innovative, bold, customer-first (comma separated)"
            />
            <p className="text-xs text-muted-foreground">Keywords used to shape AI-generated tone.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Tone of Voice</CardTitle>
          <CardDescription>Sets the default personality for AI-generated captions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => updateBrand({ tone: t.value as typeof brand.tone })}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm font-medium border transition-all',
                  brand.tone === t.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview chip */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Brand Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow"
            style={{ background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%)` }}
          >
            {brand.name.charAt(0).toUpperCase() || 'B'}
          </div>
          <div>
            <p className="font-semibold text-foreground">{brand.name || 'Brand Name'}</p>
            <p className="text-sm text-muted-foreground capitalize">{brand.tone} tone · {brand.targetAudience || 'No audience set'}</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Save Brand Settings
      </Button>
    </div>
  );
}
