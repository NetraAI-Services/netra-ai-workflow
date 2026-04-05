'use client';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';

const SAFETY_LEVELS = [
  { value: 'low',    label: 'Low',    desc: 'Minimal filtering' },
  { value: 'medium', label: 'Medium', desc: 'Balanced (recommended)' },
  { value: 'high',   label: 'High',   desc: 'Strict filtering' },
] as const;

export default function CompliancePage() {
  const { compliance, updateCompliance } = useSettingsStore();
  const [newKeyword, setNewKeyword] = useState('');

  function addKeyword() {
    const kw = newKeyword.trim();
    if (!kw || compliance.restrictedKeywords.includes(kw)) return;
    updateCompliance({ restrictedKeywords: [...compliance.restrictedKeywords, kw] });
    setNewKeyword('');
  }

  function removeKeyword(kw: string) {
    updateCompliance({ restrictedKeywords: compliance.restrictedKeywords.filter((k) => k !== kw) });
  }

  return (
    <div className="space-y-6">
      <div className="netra-card rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-card-title text-foreground font-heading">Content Safety Level</h2>
          <p className="text-sm text-muted-foreground mt-1">Controls how strictly AI filters potentially sensitive content.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SAFETY_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => updateCompliance({ safetyLevel: level.value })}
              className={cn(
                'p-4 rounded-xl border text-left transition-all duration-200 group',
                compliance.safetyLevel === level.value
                  ? 'border-primary bg-primary/12 dark:bg-primary/15 text-primary shadow-lg shadow-primary/20'
                  : 'border-border/60 bg-surface/40 dark:bg-surface/30 text-muted-foreground hover:border-primary/40 hover:bg-surface/60'
              )}
            >
              <p className="font-semibold text-sm group-hover:text-foreground transition-colors">{level.label}</p>
              <p className="text-xs mt-1 opacity-70 group-hover:opacity-85 transition-opacity">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="netra-card rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-card-title text-foreground font-heading">Restricted Keywords</h2>
          <p className="text-sm text-muted-foreground mt-1">Words blocked from appearing in generated content.</p>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add a keyword..."
              className="flex-1 rounded-xl bg-surface/50 dark:bg-surface/30 border-border/60 hover:border-primary/40 focus:border-primary transition-colors"
            />
            <Button
              onClick={addKeyword}
              size="icon"
              variant="outline"
              className="rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {compliance.restrictedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {compliance.restrictedKeywords.map((kw) => (
                <span key={kw} className="flex items-center gap-2 bg-primary/15 text-primary text-xs px-3 py-1.5 rounded-xl font-medium border border-primary/30 group">
                  {kw}
                  <button
                    onClick={() => removeKeyword(kw)}
                    className="hover:text-destructive transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No restricted keywords added.</p>
          )}
        </div>
      </div>

      <div className="netra-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-card-title text-foreground font-heading">Safety Toggles</h2>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Block Explicit Content</Label>
              <p className="text-xs text-muted-foreground mt-1">Prevent any explicit imagery or language from being generated.</p>
            </div>
            <Switch
              checked={compliance.blockExplicitContent}
              onCheckedChange={(v) => updateCompliance({ blockExplicitContent: v })}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Require Ad Disclosure</Label>
              <p className="text-xs text-muted-foreground mt-1">Automatically append a disclosure tag to sponsored content.</p>
            </div>
            <Switch
              checked={compliance.requireDisclosure}
              onCheckedChange={(v) => updateCompliance({ requireDisclosure: v })}
            />
          </div>
          {compliance.requireDisclosure && (
            <div className="space-y-2.5 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Label htmlFor="disclosure-text" className="text-sm font-semibold">Disclosure Text</Label>
              <Input
                id="disclosure-text"
                value={compliance.disclosureText}
                onChange={(e) => updateCompliance({ disclosureText: e.target.value })}
                placeholder="#ad #sponsored"
                className="rounded-xl bg-surface/50 dark:bg-surface/30 border-primary/30 hover:border-primary/40 focus:border-primary transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={() => toast.success('Compliance settings saved')}
        className="netra-btn-premium netra-btn-shimmer rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
      >
        Save Settings
      </Button>
    </div>
  );
}
