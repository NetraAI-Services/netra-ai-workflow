'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContentStore } from '@/store/useContentStore';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function Step5Schedule() {
  const router = useRouter();
  const { currentDraft, setWizardStep, saveDraft, clearCurrentDraft } = useContentStore();
  const { addPost } = useScheduleStore();
  const { publishing } = useSettingsStore();

  const today = format(new Date(), "yyyy-MM-dd");
  const [scheduleDate, setScheduleDate] = useState(today);
  const [scheduleTime, setScheduleTime] = useState(publishing.defaultScheduleTime);
  const [publishing_, setPublishing] = useState<'schedule' | 'draft'>('schedule');

  if (!currentDraft) return null;

  function handleSaveDraft() {
    saveDraft();
    addPost({ draft: currentDraft!, status: 'draft', createdAt: new Date().toISOString() } as Parameters<typeof addPost>[0]);
    toast.success('Saved as draft');
    clearCurrentDraft();
    router.push('/posts');
  }

  function handleSchedule() {
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    saveDraft();
    addPost({
      draft: currentDraft!,
      status: publishing.requireApproval ? 'pending_approval' : 'scheduled',
      scheduledAt,
      createdAt: new Date().toISOString(),
    } as Parameters<typeof addPost>[0]);
    toast.success(
      publishing.requireApproval
        ? 'Post submitted for approval'
        : `Post scheduled for ${format(new Date(scheduledAt), 'MMM d, h:mm a')}`
    );
    clearCurrentDraft();
    router.push('/calendar');
  }

  return (
    <div className="space-y-5">
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-5">
          <p className="font-semibold text-foreground">Schedule or Save</p>

          {/* Option selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPublishing('schedule')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                publishing_ === 'schedule'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <Calendar className={`w-5 h-5 mb-2 ${publishing_ === 'schedule' ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="font-medium text-sm text-foreground">Schedule</p>
              <p className="text-xs text-muted-foreground mt-0.5">Publish at a specific date and time</p>
            </button>
            <button
              onClick={() => setPublishing('draft')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                publishing_ === 'draft'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <Clock className={`w-5 h-5 mb-2 ${publishing_ === 'draft' ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="font-medium text-sm text-foreground">Save Draft</p>
              <p className="text-xs text-muted-foreground mt-0.5">Finish and publish later</p>
            </button>
          </div>

          {publishing_ === 'schedule' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="schedule-date">Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  min={today}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="schedule-time">Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {publishing.requireApproval && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
              Approval required — post will be submitted for review before publishing.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setWizardStep(4)}>Back</Button>
        <div className="flex gap-2">
          {publishing_ === 'draft' ? (
            <Button onClick={handleSaveDraft} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Clock className="w-4 h-4" /> Save Draft
            </Button>
          ) : (
            <Button onClick={handleSchedule} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6">
              <Send className="w-4 h-4" /> Schedule Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
