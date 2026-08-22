"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import styles from "./EcosystemNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Act III — the connected ecosystem. Mostly silent while the camera orbits
 * the core and its five nodes light up one by one (all in WebGL/Html
 * labels); the DOM layer only carries the closing payoff line.
 */
export default function EcosystemNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const payoff = useRef<HTMLSpanElement>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          onActiveChange?.(self.isActive);
          // the payoff line has no exit tween — hide the layer once Act
          // III is behind us so it doesn't sit parked over Act IV.
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }
        scrollState.act3Progress = self.progress;
        if (payoff.current) {
          const t = gsap.utils.clamp(0, 1, (self.progress - 0.74) / 0.16);
          payoff.current.style.clipPath = `inset(0 0 ${(1 - t) * 100}% 0)`;
          payoff.current.style.transform = `translateY(${(1 - t) * 14}px)`;
        }
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer}>
        <div className={styles.payoff}>
          <span>
            <span ref={payoff} style={{ clipPath: "inset(0 0 100% 0)" }}>
              Everything.
              <br />
              Connected.
            </span>
          </span>
          <p className={styles.copy}>
            No creamos piezas sueltas. Diseñamos un sistema digital donde
            cada parte trabaja junto a las demás.
          </p>
        </div>
      </div>
    </>
  );
}
