"use client";

import { useEffect, useRef } from "react";
import { createTimer } from "animejs";
import { prefersReducedMotion } from "@/lib/utils/motion";

interface UseCountUpOptions {
  target: number | null;
  active: boolean;
  duration?: number;
  suffix?: string;
  format?: (val: number) => string;
}

/**
 * Smoothly interpolates a numeric element's textContent from 0 to target using Anime.js createTimer.
 * Keeps SSR/initial text intact until triggered and skips animation under prefers-reduced-motion.
 */
export function useCountUpTimer({
  target,
  active,
  duration = 850,
  suffix = "",
  format,
}: UseCountUpOptions) {
  const ref = useRef<HTMLParagraphElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!active || target === null || hasRunRef.current) return;
    const el = ref.current;
    if (!el) return;

    const formatValue = (n: number) =>
      format ? format(n) : `${n.toLocaleString()}${suffix}`;

    if (prefersReducedMotion()) {
      hasRunRef.current = true;
      el.textContent = formatValue(target);
      return;
    }

    hasRunRef.current = true;
    el.textContent = formatValue(0);

    const timer = createTimer({
      duration,
      autoplay: true,
      onUpdate: (self) => {
        // Cubic ease-out for crisp deceleration
        const eased = 1 - Math.pow(1 - self.progress, 3);
        const current = Math.round(target * eased);
        el.textContent = formatValue(current);
      },
      onComplete: () => {
        el.textContent = formatValue(target);
      },
    });

    return () => {
      timer.cancel();
    };
  }, [active, target, duration, suffix, format]);

  return ref;
}
