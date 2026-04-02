'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIdeasStore } from '@/store/useIdeasStore';
import { useContentStore } from '@/store/useContentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { PlatformId } from '@/types/content';
import type { IdeaPriority } from '@/types/ideas';

const PRIORITY_STYLES: Record<IdeaPriority, string> = {
  low:    'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60 dark:bg-gray-900/40 dark:text-gray-400 dark:ring-gray-700/40',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/40',
  high:   'bg-red-50 text-red-700 ring-1 ring-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800/40',
};

export default function IdeasPage() {
  const router = useRouter();
  const { pillars, ideas, addIdea, deleteIdea, moveIdea, addPillar } = useIdeasStore();
  const { initDraft } = useContentStore();

  const [addIdeaOpen, setAddIdeaOpen] = useState(false);
  const [addPillarOpen, setAddPillarOpen] = useState(false);
  const [newPillarName, setNewPillarName] = useState('');
  const [draggedIdeaId, setDraggedIdeaId] = useState<string | null>(null);

  const [form, setForm] = useState({
    pillarId: pillars[0]?.id || '',
    title: '',
    description: '',
    platforms: [] as PlatformId[],
    priority: 'medium' as IdeaPriority,
    tags: '',
  });

  function submitIdea() {
    if (!form.title.trim()) return;
    addIdea({
      pillarId: form.pillarId,
      title: form.title,
      description: form.description,
      platforms: form.platforms,
      priority: form.priority,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setForm({ pillarId: pillars[0]?.id || '', title: '', description: '', platforms: [], priority: 'medium', tags: '' });
    setAddIdeaOpen(false);
  }

  function convertToPost(ideaId: string) {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    initDraft(idea.platforms.length ? idea.platforms : ['instagram'], 'image_post');
    router.push('/create');
  }

  function handleDrop(pillarId: string) {
    if (draggedIdeaId) {
      moveIdea(draggedIdeaId, pillarId);
      setDraggedIdeaId(null);
    }
  }

  return (
    <div className="space-y-6 netra-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Idea Bank</h1>
          <p className="text-muted-foreground text-sm mt-1">Organise content ideas by pillar. Drag to move between columns.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAddPillarOpen(true)} className="gap-1.5 text-xs font-semibold">
            <Plus className="w-3.5 h-3.5" /> Add Pillar
          </Button>
          <Button onClick={() => setAddIdeaOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold netra-btn-glow">
            <Lightbulb className="w-3.5 h-3.5" /> Add Idea
          </Button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        {pillars.map((pillar) => {
          const pillarIdeas = ideas.filter((i) => i.pillarId === pillar.id);
          return (
            <div
              key={pillar.id}
              className="flex-shrink-0 w-72"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(pillar.id)}
            >
              {/* Column header */}
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-white font-semibold text-sm shadow-sm"
                style={{ background: `linear-gradient(135deg, ${pillar.color}, ${pillar.color}dd)` }}
              >
                <span className="flex-1 truncate">{pillar.name}</span>
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full tabular-nums">
                  {pillarIdeas.length}
                </span>
              </div>

              {/* Cards */}
              <div className="bg-surface/80 dark:bg-surface rounded-b-xl min-h-[220px] p-2 flex flex-col gap-2 border border-border border-t-0">
                {pillarIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    draggable
                    onDragStart={() => setDraggedIdeaId(idea.id)}
                    className="netra-card netra-card-interactive p-3 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-semibold text-sm text-foreground leading-snug">{idea.title}</p>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 capitalize font-semibold', PRIORITY_STYLES[idea.priority])}>
                        {idea.priority}
                      </span>
                    </div>
                    {idea.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">{idea.description}</p>
                    )}
                    {idea.platforms.length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {idea.platforms.map((p) => <PlatformIcon key={p} platform={p} size={14} />)}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => convertToPost(idea.id)}
                        className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-semibold transition-colors"
                      >
                        <Sparkles className="w-3 h-3" /> Convert to Post <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="ml-auto p-1 rounded-md hover:bg-destructive/10 text-muted-foreground/30 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => { setForm((f) => ({ ...f, pillarId: pillar.id })); setAddIdeaOpen(true); }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-card transition-colors font-medium"
                >
                  <Plus className="w-3 h-3" /> Add idea
                </button>
              </div>
            </div>
          );
        })}

        {pillars.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-20 text-center">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="font-semibold text-foreground">No pillars yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add a content pillar to start organising your ideas.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Idea Dialog */}
      <Dialog open={addIdeaOpen} onOpenChange={setAddIdeaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Pillar</Label>
              <div className="flex flex-wrap gap-2">
                {pillars.map((p) => (
                  <button key={p.id} onClick={() => setForm((f) => ({ ...f, pillarId: p.id }))}
                    className={cn('px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
                      form.pillarId === p.id ? 'text-white border-transparent shadow-sm' : 'bg-card text-muted-foreground border-border')}
                    style={form.pillarId === p.id ? { background: p.color, borderColor: p.color } : {}}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="idea-title">Title *</Label>
              <Input id="idea-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Idea title..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="idea-desc">Description</Label>
              <Textarea id="idea-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="resize-none" placeholder="Optional details..." />
            </div>
            <div className="space-y-1.5">
              <Label>Platforms</Label>
              <div className="flex gap-2">
                {PLATFORMS.map(({ id }) => (
                  <button key={id} onClick={() => setForm((f) => ({ ...f, platforms: f.platforms.includes(id) ? f.platforms.filter((p) => p !== id) : [...f.platforms, id] }))}
                    className={cn('p-1.5 rounded-lg border transition-all', form.platforms.includes(id) ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-card')}>
                    <PlatformIcon platform={id} size={16} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as IdeaPriority[]).map((p) => (
                  <button key={p} onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all',
                      form.priority === p ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card text-muted-foreground border-border')}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddIdeaOpen(false)}>Cancel</Button>
            <Button onClick={submitIdea} disabled={!form.title.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground netra-btn-glow">Add Idea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Pillar Dialog */}
      <Dialog open={addPillarOpen} onOpenChange={setAddPillarOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Content Pillar</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pillar-name">Pillar Name</Label>
              <Input id="pillar-name" value={newPillarName} onChange={(e) => setNewPillarName(e.target.value)} placeholder="e.g. Product Updates" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPillarOpen(false)}>Cancel</Button>
            <Button onClick={() => { addPillar(newPillarName); setNewPillarName(''); setAddPillarOpen(false); }}
              disabled={!newPillarName.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground netra-btn-glow">
              Add Pillar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
