"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

/**
 * Registers GSAP plugins once on the client.
 */
export function ensureGsapPlugins(): void {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
}

ensureGsapPlugins();

/**
 * Checks whether the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Crisp deceleration matching Neo-Brutalist design (no elastic bounce). */
export const NB_EASE = "power3.out";
export const NB_REVEAL_DURATION = 0.42;

export { gsap, ScrollTrigger, useGSAP };
