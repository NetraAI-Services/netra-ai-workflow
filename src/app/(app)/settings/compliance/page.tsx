'use client';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Plus } from 'lucide-react';
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
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Content Safety Level</CardTitle>
          <CardDescription>Controls how strictly AI filters potentially sensitive content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {SAFETY_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => updateCompliance({ safetyLevel: level.value })}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all',
                  compliance.safetyLevel === level.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                )}
              >
                <p className="font-medium text-sm">{level.label}</p>
                <p className="text-xs mt-0.5">{level.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Restricted Keywords</CardTitle>
          <CardDescription>Words blocked from appearing in generated content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add a keyword..."
              className="flex-1"
            />
            <Button onClick={addKeyword} size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {compliance.restrictedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {compliance.restrictedKeywords.map((kw) => (
                <span key={kw} className="flex items-center gap-1 bg-secondary text-foreground text-xs px-2.5 py-1.5 rounded-lg">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-destructive ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No restricted keywords added.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Safety Toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Block Explicit Content</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Prevent any explicit imagery or language from being generated.</p>
            </div>
            <Switch
              checked={compliance.blockExplicitContent}
              onCheckedChange={(v) => updateCompliance({ blockExplicitContent: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Ad Disclosure</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically append a disclosure tag to sponsored content.</p>
            </div>
            <Switch
              checked={compliance.requireDisclosure}
              onCheckedChange={(v) => updateCompliance({ requireDisclosure: v })}
            />
          </div>
          {compliance.requireDisclosure && (
            <div className="space-y-1.5">
              <Label htmlFor="disclosure-text">Disclosure Text</Label>
              <Input
                id="disclosure-text"
                value={compliance.disclosureText}
                onChange={(e) => updateCompliance({ disclosureText: e.target.value })}
                placeholder="#ad #sponsored"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={() => toast.success('Compliance settings saved')}
        className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Save Settings
      </Button>
    </div>
  );
}
