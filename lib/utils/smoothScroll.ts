"use client";

import type Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

type ScrollTarget = string | HTMLElement | number;

interface LenisWindow extends Window {
  __lenis?: Lenis;
}

export function getLenis(): Lenis | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as LenisWindow).__lenis;
}

export function stopLenis(): void {
  getLenis()?.stop();
}

export function startLenis(): void {
  getLenis()?.start();
}

export function smoothScrollTo(
  target: ScrollTarget,
  options?: { immediate?: boolean }
): void {
  if (typeof window === "undefined") return;

  const immediate = options?.immediate ?? prefersReducedMotion();
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(target, {
      immediate,
      duration: immediate ? 0 : 1.05,
    });
    return;
  }

  const behavior: ScrollBehavior = immediate ? "auto" : "smooth";

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }

  if (target === "#") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior });
}
