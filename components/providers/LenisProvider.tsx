"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/utils/motion";

export default function LenisProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      allowNestedScroll: true,
      smoothWheel: !reduced,
      lerp: reduced ? 1 : 0.11,
    });

    lenisRef.current = lenis;
    const lenisWindow = window as Window & { __lenis?: Lenis };
    lenisWindow.__lenis = lenis;

    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      lenis.options.smoothWheel = !e.matches;
      lenis.options.lerp = e.matches ? 1 : 0.11;
    };
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", handleMediaChange);

    return () => {
      mql.removeEventListener("change", handleMediaChange);
      gsap.ticker.remove(tick);
      lenis.off("scroll", handleScroll);
      if (lenisWindow.__lenis === lenis) {
        delete lenisWindow.__lenis;
      }
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // Reset scroll cleanly on route navigation (when there is no hash target) and refresh ScrollTrigger
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis && !window.location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  return null;
}
