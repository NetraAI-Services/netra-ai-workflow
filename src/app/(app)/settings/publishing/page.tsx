'use client';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PublishingSettingsPage() {
  const { publishing, updatePublishing } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div className="netra-card rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-card-title text-foreground font-heading">Publishing Workflow</h2>
          <p className="text-sm text-muted-foreground mt-1">Control how and when posts are published.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Require Approval Before Publishing</Label>
              <p className="text-xs text-muted-foreground mt-1">Posts wait for manual approval before going live.</p>
            </div>
            <Switch checked={publishing.requireApproval} onCheckedChange={(v) => updatePublishing({ requireApproval: v })} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Auto-Publish Scheduled Posts</Label>
              <p className="text-xs text-muted-foreground mt-1">Automatically publish at the scheduled time.</p>
            </div>
            <Switch checked={publishing.autoPublish} onCheckedChange={(v) => updatePublishing({ autoPublish: v })} disabled={publishing.requireApproval} />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="schedule-time" className="text-sm font-semibold">Default Schedule Time</Label>
            <Input
              id="schedule-time"
              type="time"
              value={publishing.defaultScheduleTime}
              onChange={(e) => updatePublishing({ defaultScheduleTime: e.target.value })}
              className="w-40 rounded-xl bg-surface/50 dark:bg-surface/30 border-border/60 hover:border-primary/40 focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">Pre-filled time when scheduling a new post.</p>
          </div>
        </div>
      </div>

      <div className="netra-card rounded-2xl p-6">
        <h2 className="text-card-title text-foreground font-heading mb-6">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Notify on Publish</Label>
              <p className="text-xs text-muted-foreground mt-1">Alert when a post is successfully published.</p>
            </div>
            <Switch checked={publishing.notifyOnPublish} onCheckedChange={(v) => updatePublishing({ notifyOnPublish: v })} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/40 hover:border-border/60 transition-all duration-200">
            <div>
              <Label className="font-semibold text-sm">Notify on Failure</Label>
              <p className="text-xs text-muted-foreground mt-1">Alert when publishing fails so you can retry.</p>
            </div>
            <Switch checked={publishing.notifyOnFail} onCheckedChange={(v) => updatePublishing({ notifyOnFail: v })} />
          </div>
        </div>
      </div>

      <Button onClick={() => toast.success('Publishing settings saved')} className="netra-btn-premium netra-btn-shimmer rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/30">
        Save Settings
      </Button>
    </div>
  );
}
