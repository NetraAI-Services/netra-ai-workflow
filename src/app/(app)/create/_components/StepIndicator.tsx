'use client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="netra-card p-4 sm:p-5">
      <div className="flex items-center gap-0">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  done   ? 'bg-gradient-to-br from-primary to-netra-700 text-white shadow-sm' :
                  active ? 'ring-2 ring-primary/30 text-primary bg-primary/10 font-bold' :
                           'bg-muted text-muted-foreground'
                )}>
                  {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                </div>
                <span className={cn(
                  'text-[11px] font-semibold hidden sm:block',
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-[2px] mx-2 rounded-full mb-5 transition-colors',
                  done ? 'bg-gradient-to-r from-primary to-primary/60' : 'bg-border/60'
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
