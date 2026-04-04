'use client';
import { motion } from 'framer-motion';
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
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative',
                  done   ? 'bg-gradient-to-br from-primary to-netra-700 text-white shadow-sm' :
                  active ? 'text-primary bg-primary/10 font-bold' :
                           'bg-muted text-muted-foreground'
                )}>
                  {active && (
                    <motion.span
                      layoutId="step-ring"
                      className="absolute inset-0 rounded-full ring-2 ring-primary/30"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  {done ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </motion.span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={cn(
                  'text-[11px] font-semibold hidden sm:block transition-colors duration-200',
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 rounded-full mb-5 bg-border/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
