"use client";

import { useEffect, useRef } from "react";
import { scrollState } from "@/lib/animation/scroll-store";
import styles from "./HeroBackdrop.module.css";

/**
 * Sits behind the Hero's transparent canvas (z-15, canvas is z-20) so
 * flat black never reads as truly flat: a soft off-center radial glow, a
 * faint architectural gold line, and a subtle grain give the opening frame
 * depth before the MC/particles ever render. Every later act's own layer
 * is opaque and z-20+, so this stays safely hidden behind them — except at
 * the very end, where the Act IX Canvas and DOM layer both fade out for
 * the footer handoff (act9FadeT). Being position:fixed, this would
 * otherwise paint above that normal-flow footer regardless of its low
 * z-index, so it polls the same fade value and disappears with them.
 */
export default function HeroBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      if (root.current && scrollState.act9FadeT !== last) {
        last = scrollState.act9FadeT;
        root.current.style.opacity = String(1 - last);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={root} className={styles.backdrop} aria-hidden>
      <span className={styles.line} />
    </div>
  );
}
