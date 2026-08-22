"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import styles from "./ScrollNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns the ~320vh scroll length for Act I and maps scroll position to a
 * single 0..1 progress value (read by the WebGL camera rig every frame)
 * while scrubbing the DOM narrative — hero exit, the two supporting
 * lines, and the bridge into Scene 02 — on the same timeline so
 * everything stays perfectly in sync with the scrollbar.
 */
export default function ScrollNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const narrativeLayer = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLSpanElement>(null);
  const bridge = useRef<HTMLSpanElement>(null);
  const wasActive = useRef(true);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const ctx = gsap.context(() => {
      const heroFront = gsap.utils.toArray<HTMLElement>("[data-hero-front]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacer.current,
          start: "top top",
          // "bottom bottom" ends the active range one viewport height
          // early (at spacerHeight - viewportHeight) for an unpinned
          // scrub trigger, leaving a dead zone before the next act's own
          // "top top" trigger (at scrollY = spacerHeight) ever fires —
          // both layers sit hidden in that gap, exposing the raw
          // document background as a hard seam. "bottom top" ends
          // exactly at spacerHeight, handing off with zero gap.
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            scrollState.progress = self.progress;
            // matches FogController's color journey: still dark through
            // most of the crossing, warm white by the time the bridge
            // copy is readable
            scrollState.navTheme = self.progress > 0.85 ? "light" : "dark";
            if (self.isActive !== wasActive.current) {
              wasActive.current = self.isActive;
              onActiveChange?.(self.isActive);
              // the bridge copy's reveal has no matching exit tween — once
              // Act I is behind us (in either scroll direction), hide the
              // whole layer so it doesn't sit parked on top of Act II.
              if (narrativeLayer.current) {
                narrativeLayer.current.style.opacity = self.isActive ? "1" : "0";
                narrativeLayer.current.style.visibility = self.isActive
                  ? "visible"
                  : "hidden";
              }
            }
          },
        },
        defaults: { ease: "none" },
      });

      // --- hero exit: 0.10 -> 0.32, combined transform + clip, not opacity-only
      tl.to(
        heroFront,
        {
          yPercent: -22,
          scale: 1.1,
          rotateX: -6,
          filter: "blur(6px)",
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.in",
        },
        0.1
      );

      // --- mid copy: 0.44 -> 0.68
      if (mid.current) {
        tl.fromTo(
          mid.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.1, ease: "power2.out" },
          0.44
        ).to(
          mid.current,
          { clipPath: "inset(0 0 0 100%)", duration: 0.08, ease: "power2.in" },
          0.6
        );
      }

      // --- bridge copy: 0.86 -> 1.0
      if (bridge.current) {
        tl.fromTo(
          bridge.current,
          { clipPath: "inset(0 0 100% 0)", yPercent: 12 },
          {
            clipPath: "inset(0 0 0% 0)",
            yPercent: 0,
            duration: 0.14,
            ease: "power2.out",
          },
          0.86
        );
      }
    });

    return () => ctx.revert();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={narrativeLayer} className={styles.narrativeLayer}>
        <p className={styles.midCopy}>
          <span ref={mid}>We don&rsquo;t just build websites.</span>
        </p>
        <h2 className={styles.bridgeCopy}>
          <span ref={bridge}>
            We build
            <br />
            digital
            <br />
            experiences.
          </span>
        </h2>
      </div>
    </>
  );
}
