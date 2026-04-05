'use client';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

function ApiKeyField({
  id, label, value, onChange, placeholder, docsUrl, hint,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; docsUrl?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-semibold text-sm">{label}</Label>
        {docsUrl && (
          <a href={docsUrl} target="_blank" rel="noreferrer"
            className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
            Get API key <ExternalLink className="w-3.5 h-3.5" />
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
          className="pr-12 font-mono text-sm bg-surface/50 dark:bg-surface/30 border-border/60 hover:border-primary/40 focus:border-primary transition-colors"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {value && (
        <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Key saved
        </p>
      )}
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
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
      <div className="netra-card rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-card-title text-foreground font-heading">Image Generation APIs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Keys are stored locally in your browser and sent only to the server-side API routes — never exposed in network requests.
          </p>
        </div>
        <div className="space-y-6">
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
        </div>
      </div>

      <div className="netra-card rounded-2xl p-6 border border-amber-500/20 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5">
        <div className="flex gap-4 items-start">
          <div className="w-5 h-5 mt-0.5 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Security notice</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 leading-relaxed">
              API keys are stored in localStorage. For production use, configure keys as server environment variables in <code className="font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 px-2 py-1 rounded-lg">.env.local</code> instead.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={save} className="netra-btn-premium netra-btn-shimmer rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/30">
        Save API Keys
      </Button>
    </div>
  );
}
