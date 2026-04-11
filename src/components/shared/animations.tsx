'use client';

import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ── Shared easings ────────────────────────────────────── */
const smoothEase = [0.25, 0.1, 0.25, 1] as const;
const decelerate = [0.32, 0.72, 0, 1] as const;

/* ── Client-only guard (prevents SSR hydration mismatches) ── */
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  return isClient;
}

/* ── Reduced motion hook ───────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ── 1. PageTransition ─────────────────────────────────── */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const isClient = useIsClient();
  const reduced = usePrefersReducedMotion();

  if (!isClient || reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 2. StaggerContainer + StaggerItem ─────────────────── */
export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.06,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  const isClient = useIsClient();
  const reduced = usePrefersReducedMotion();

  if (!isClient || reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const isClient = useIsClient();

  if (!isClient) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: smoothEase },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 3. AnimatedNumber ─────────────────────────────────── */
export function AnimatedNumber({
  value,
  className,
  formatFn,
  duration = 1.2,
}: {
  value: number;
  className?: string;
  formatFn?: (n: number) => string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      if (ref.current) {
        ref.current.textContent = formatFn ? formatFn(value) : String(value);
      }
      return;
    }
    const controls = animate(motionVal, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = formatFn
            ? formatFn(latest)
            : Math.round(latest).toLocaleString();
        }
      },
    });
    return () => controls.stop();
  }, [isInView, value, duration, formatFn, motionVal, reduced]);

  return (
    <span ref={ref} className={className}>
      {formatFn ? formatFn(0) : '0'}
    </span>
  );
}

/* ── 4. SlideIn ────────────────────────────────────────── */
const slideDirections = {
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  top: { x: 0, y: -16 },
  bottom: { x: 0, y: 16 },
} as const;

export function SlideIn({
  children,
  className,
  direction = 'bottom',
  delay = 0,
  duration = 0.4,
}: {
  children: ReactNode;
  className?: string;
  direction?: keyof typeof slideDirections;
  delay?: number;
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const offset = slideDirections[direction];
  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 5. ScaleOnHover ───────────────────────────────────── */
export function ScaleOnHover({
  children,
  className,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 6. FadeIn ─────────────────────────────────────────── */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-30px' });
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration, delay, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 7. AnimatePresenceWrapper (for conditional rendering) ── */
export function AnimatedPresence({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: decelerate }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
