"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Wires Lenis smooth scrolling into GSAP's ticker + ScrollTrigger so a
 * single rAF loop drives both. Mount once at the app root.
 */
export function useLenis() {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: reduceMotion ? 0.1 : 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !reduceMotion,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({ markers: false });

    // Web font swaps (next/font's display:"swap") can land after
    // ScrollTrigger has already pinned pixel-based start/end positions,
    // shifting document height and desyncing every trigger below the
    // shifted content — refresh once fonts actually settle.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
