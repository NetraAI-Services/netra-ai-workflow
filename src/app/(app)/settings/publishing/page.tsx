'use client';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PublishingSettingsPage() {
  const { publishing, updatePublishing } = useSettingsStore();

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Publishing Workflow</CardTitle>
          <CardDescription>Control how and when posts are published.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
            <div>
              <Label className="font-medium">Require Approval Before Publishing</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Posts wait for manual approval before going live.</p>
            </div>
            <Switch
              checked={publishing.requireApproval}
              onCheckedChange={(v) => updatePublishing({ requireApproval: v })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
            <div>
              <Label className="font-medium">Auto-Publish Scheduled Posts</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically publish at the scheduled time without intervention.</p>
            </div>
            <Switch
              checked={publishing.autoPublish}
              onCheckedChange={(v) => updatePublishing({ autoPublish: v })}
              disabled={publishing.requireApproval}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="schedule-time">Default Schedule Time</Label>
            <Input
              id="schedule-time"
              type="time"
              value={publishing.defaultScheduleTime}
              onChange={(e) => updatePublishing({ defaultScheduleTime: e.target.value })}
              className="w-36"
            />
            <p className="text-xs text-muted-foreground">
              Pre-filled time when scheduling a new post from the Create wizard.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notify on Publish</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Alert when a post is successfully published.</p>
            </div>
            <Switch
              checked={publishing.notifyOnPublish}
              onCheckedChange={(v) => updatePublishing({ notifyOnPublish: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Notify on Failure</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Alert when publishing fails so you can retry.</p>
            </div>
            <Switch
              checked={publishing.notifyOnFail}
              onCheckedChange={(v) => updatePublishing({ notifyOnFail: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => toast.success('Publishing settings saved')}
        className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Save Settings
      </Button>
    </div>
  );
}
