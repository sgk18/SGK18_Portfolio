"use client";

import { ReactNode, useRef } from "react";
import { gsap, useGSAP, NB_EASE, NB_REVEAL_DURATION } from "@/lib/utils/motion";

export default function ScrollReveal({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: NB_REVEAL_DURATION,
          ease: NB_EASE,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(el, {
          opacity: 0.75,
          duration: 0.18,
          clearProps: "opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{children}</div>;
}
