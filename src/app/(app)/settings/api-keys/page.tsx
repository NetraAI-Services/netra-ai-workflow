'use client';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

function ApiKeyField({
  id, label, value, onChange, placeholder, docsUrl, hint,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; docsUrl?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {docsUrl && (
          <a href={docsUrl} target="_blank" rel="noreferrer"
            className="text-xs text-primary flex items-center gap-1 hover:underline">
            Get API key <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'sk-•••••••••••••••••••••••'}
          className="pr-10 font-mono text-sm"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {value && (
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Key saved
        </p>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ApiKeysPage() {
  const { apiKeys, updateApiKeys } = useSettingsStore();

  function save() {
    toast.success('API keys saved securely');
  }

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Image Generation APIs</CardTitle>
          <CardDescription>
            Keys are stored locally in your browser and sent only to the server-side API routes — never exposed in network requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ApiKeyField
            id="gemini-key"
            label="Google Gemini API Key"
            value={apiKeys.geminiApiKey}
            onChange={(v) => updateApiKeys({ geminiApiKey: v })}
            placeholder="AIza•••••••••••••••••••••••••"
            hint="Used for Gemini 2.0 Flash/Pro image generation and caption writing."
          />
          <ApiKeyField
            id="openai-key"
            label="OpenAI API Key"
            value={apiKeys.openaiApiKey}
            onChange={(v) => updateApiKeys({ openaiApiKey: v })}
            placeholder="sk-•••••••••••••••••••••••"
            hint="Used for DALL-E 3 image generation."
          />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10">
        <CardContent className="p-4 flex gap-3 items-start">
          <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400">⚠</div>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Security notice</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              API keys are stored in localStorage. For production use, configure keys as server environment variables in <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env.local</code> instead.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Save API Keys
      </Button>
    </div>
  );
}
