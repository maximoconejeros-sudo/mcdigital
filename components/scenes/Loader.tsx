"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Loader.module.css";

// This phase has no heavy external assets (the sculpture and environment
// are procedural), so drei's useProgress resolves near-instantly and isn't
// a meaningful signal — the deliberate simulated count is what gives the
// preloader its cinematic pacing. Swap in useProgress once real assets
// (textures, fonts, GLTFs) are added, merging it in as a floor, not a cap.
export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [display, setDisplay] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const counted = useRef({ v: 0 });
  const finished = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tween = gsap.to(counted.current, {
      v: 100,
      duration: reduceMotion ? 0.4 : 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.min(100, Math.round(counted.current.v));
        setDisplay(val);
        if (fill.current) fill.current.style.width = `${val}%`;
      },
      onComplete: () => {
        if (finished.current) return;
        finished.current = true;
        gsap.delayedCall(reduceMotion ? 0.05 : 0.45, reveal);
      },
    });

    function reveal() {
      if (!root.current) {
        onComplete();
        return;
      }
      gsap
        .timeline({ onComplete })
        .to(root.current.querySelectorAll(`.${styles.mark}, .${styles.pct}`), {
          opacity: 0,
          y: -8,
          duration: 0.4,
          ease: "power2.in",
        })
        .to(
          root.current,
          {
            scaleY: 0,
            duration: reduceMotion ? 0.2 : 1.05,
            ease: "expo.inOut",
          },
          "-=0.15"
        );
    }

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root} className={styles.overlay}>
      <div className={styles.mark}>
        <span>MDIGITAL®</span>
      </div>
      <div className={styles.barTrack}>
        <div ref={fill} className={styles.barFill} />
      </div>
      <div className={styles.pct}>{display}</div>
    </div>
  );
}
