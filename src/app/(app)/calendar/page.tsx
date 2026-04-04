'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, format, addMonths, subMonths, isToday,
} from 'date-fns';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/shared/animations';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlatformId, Post } from '@/types/content';

const STATUS_DOT: Record<string, string> = {
  scheduled:        'bg-blue-500',
  published:        'bg-emerald-500',
  draft:            'bg-gray-400',
  failed:           'bg-red-500',
  pending_approval: 'bg-amber-500',
};

const STATUS_TEXT: Record<string, string> = {
  scheduled: 'text-blue-600 dark:text-blue-400',
  published: 'text-emerald-600 dark:text-emerald-400',
  draft:     'text-gray-500 dark:text-gray-400',
  failed:    'text-red-600 dark:text-red-400',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { posts } = useScheduleStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd     = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days       = eachDayOfInterval({ start: calStart, end: calEnd });

  function postsOnDay(day: Date): Post[] {
    return posts.filter((p) => {
      const d = p.scheduledAt || p.publishedAt || p.createdAt;
      return d && isSameDay(new Date(d), day);
    });
  }

  const selectedPosts = selectedDay ? postsOnDay(selectedDay) : [];

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-foreground">Calendar</h1>
          <p className="text-body-sm text-muted-foreground mt-1">View and manage your scheduled content.</p>
        </div>
        <Link href="/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 netra-btn-glow rounded-xl">
            <Sparkles className="w-4 h-4" /> New Post
          </Button>
        </Link>
      </div>

      <StaggerContainer className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <StaggerItem className="lg:col-span-2">
          <div className="netra-card rounded-2xl overflow-hidden">
            <div className="p-5">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-bold text-foreground tracking-wide">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-1.5">{d}</div>
                ))}
              </div>

              {/* Days - wrapped in AnimatePresence for month crossfade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={format(currentMonth, 'yyyy-MM')}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                  className="grid grid-cols-7 gap-px bg-border/50 rounded-xl overflow-hidden"
                >
                  {days.map((day) => {
                    const dayPosts = postsOnDay(day);
                    const inMonth = isSameMonth(day, currentMonth);
                    const selected = selectedDay && isSameDay(day, selectedDay);
                    const today = isToday(day);
                    const isEmpty = dayPosts.length === 0;

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDay(isSameDay(day, selectedDay!) ? null : day)}
                        className={cn(
                          'group bg-card min-h-[76px] p-2 text-left transition-all relative',
                          'hover:bg-accent/40',
                          !inMonth && 'opacity-30',
                          selected && 'bg-primary/10 dark:bg-primary/10',
                          today && !selected && 'ring-1 ring-inset ring-primary/60',
                          selected && 'ring-1 ring-inset ring-primary/50'
                        )}
                      >
                        <span className={cn(
                          'text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center',
                          today ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground'
                        )}>
                          {format(day, 'd')}
                        </span>
                        <div className="mt-1 flex flex-col gap-0.5">
                          {dayPosts.slice(0, 3).map((p) => (
                            <div key={p.id} className="flex items-center gap-1">
                              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', STATUS_DOT[p.status] || 'bg-gray-400')} />
                              <span className="text-[10px] text-muted-foreground truncate leading-none font-medium">
                                {p.draft.topic || 'Post'}
                              </span>
                            </div>
                          ))}
                          {dayPosts.length > 3 && (
                            <span className="text-[10px] text-primary font-semibold">+{dayPosts.length - 3} more</span>
                          )}
                        </div>

                        {/* Subtle "+" icon on hover for empty day cells */}
                        {isEmpty && inMonth && (
                          <span className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Plus className="w-3.5 h-3.5 text-muted-foreground/50" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </StaggerItem>

        {/* Day detail panel */}
        <StaggerItem>
          <div className="netra-card rounded-2xl h-full p-5">
            <AnimatePresence mode="wait">
              {selectedDay ? (
                <motion.div
                  key={selectedDay.toISOString()}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  <p className="font-bold text-foreground text-sm mb-4">
                    {format(selectedDay, 'EEEE, MMM d')}
                  </p>
                  {selectedPosts.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                        <CalendarIcon className="w-6 h-6 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm text-muted-foreground">No posts on this day.</p>
                      <Link href="/create">
                        <Button size="sm" variant="outline" className="mt-3 text-xs font-semibold rounded-xl">+ Create Post</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {selectedPosts.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.05, ease: [0.32, 0.72, 0, 1] }}
                          className="p-3 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            {post.draft.platforms.map((p) => (
                              <PlatformIcon key={p} platform={p as PlatformId} size={14} />
                            ))}
                            <span className={cn('ml-auto text-[11px] font-semibold capitalize', STATUS_TEXT[post.status] || 'text-muted-foreground')}>
                              {post.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground truncate">{post.draft.topic || 'Untitled'}</p>
                          {post.scheduledAt && (
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                              {format(new Date(post.scheduledAt), 'h:mm a')}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center py-14"
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground">Select a day to see posts.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
