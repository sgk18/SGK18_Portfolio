"use client";

import type Lenis from "lenis";

type ScrollTarget = string | HTMLElement | number;

export function smoothScrollTo(target: ScrollTarget) {
  if (typeof window === "undefined") return;

  const lenisWindow = window as Window & { __lenis?: Lenis };
  const lenis = lenisWindow.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.1 });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }

  const element = typeof target === "string" ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior: "smooth" });
}
