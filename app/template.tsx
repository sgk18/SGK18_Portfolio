"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, NB_EASE } from "@/lib/utils/motion";

/**
 * Architectural route entrance transition across App Router pages.
 * Keeps content visible by default and runs a fast non-blocking GSAP reveal.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (sweepRef.current) {
          gsap.fromTo(
            sweepRef.current,
            { scaleX: 1, opacity: 1 },
            {
              scaleX: 0,
              opacity: 0,
              duration: 0.34,
              ease: NB_EASE,
              transformOrigin: "right center",
            }
          );
        }

        if (containerRef.current) {
          gsap.fromTo(
            containerRef.current,
            { opacity: 0.65, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.28,
              ease: NB_EASE,
              clearProps: "transform,opacity",
            }
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (sweepRef.current) {
          gsap.set(sweepRef.current, { display: "none" });
        }
        if (containerRef.current) {
          gsap.fromTo(
            containerRef.current,
            { opacity: 0.85 },
            { opacity: 1, duration: 0.15, clearProps: "opacity" }
          );
        }
      });
    },
    { dependencies: [pathname] }
  );

  return (
    <>
      <div
        ref={sweepRef}
        aria-hidden="true"
        className="fixed top-16 left-0 right-0 h-[3px] bg-[#E3000F] z-[45] pointer-events-none origin-right opacity-0"
      />
      <div ref={containerRef}>{children}</div>
    </>
  );
}
