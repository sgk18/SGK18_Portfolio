"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
    });

    const lenisWindow = window as Window & { __lenis?: Lenis };
    lenisWindow.__lenis = lenis;

    return () => {
      if (lenisWindow.__lenis === lenis) {
        delete lenisWindow.__lenis;
      }
      lenis.destroy();
    };
  }, []);

  return null;
}
