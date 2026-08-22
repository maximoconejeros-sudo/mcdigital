"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./NumbersNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Moment {
  number: string;
  main: string;
  sub?: string;
  window: [number, number];
  closing?: boolean;
}

const MOMENTS: Moment[] = [
  {
    number: "24/7",
    main: "Agentes de IA",
    sub: "Siempre activos, respondiendo por tu negocio.",
    window: [0, 0.27],
  },
  {
    number: "100%",
    main: "Custom built.",
    sub: "Cada proyecto se diseña para tu negocio.",
    window: [0.27, 0.54],
  },
  {
    number: "0",
    main: "Generic templates.",
    sub: "Cero plantillas genéricas.",
    window: [0.54, 0.8],
  },
  {
    number: "We don't do generic.",
    main: "",
    window: [0.8, 1],
    closing: true,
  },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function momentStyle(progress: number, [start, end]: [number, number]) {
  const enterFrac = 0.22;
  const exitFrac = start === 0.8 ? 0 : 0.28; // the closing line simply holds
  const local = gsap.utils.clamp(0, 1, (progress - start) / (end - start));

  let opacity = 1;
  let scale = 1;
  let blur = 0;

  if (local < enterFrac) {
    const t = smooth(local / enterFrac);
    opacity = t;
    scale = gsap.utils.interpolate(0.72, 1, t);
  } else if (exitFrac > 0 && local > 1 - exitFrac) {
    const t = smooth((local - (1 - exitFrac)) / exitFrac);
    opacity = 1 - t;
    scale = gsap.utils.interpolate(1, 2.3, t);
    blur = t * 8;
  }

  return { opacity, scale, blur };
}

/**
 * Act IV — pure typography as the animation: three massive numbers that
 * scale up and dissolve past the viewport as the next one arrives, no
 * WebGL needed here (per the brief: "typography should be the animation").
 */
export default function NumbersNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const moments = useRef<(HTMLDivElement | null)[]>([]);
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
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }

        MOMENTS.forEach((m, i) => {
          const el = moments.current[i];
          if (!el) return;
          const { opacity, scale, blur } = momentStyle(
            self.progress,
            m.window
          );
          el.style.opacity = String(opacity);
          el.style.transform = `scale(${scale})`;
          el.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
        });
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        {MOMENTS.map((m, i) => (
          <div
            key={m.number}
            ref={(el) => {
              moments.current[i] = el;
            }}
            className={`${styles.moment} ${m.closing ? styles.closing : ""}`}
            style={{ opacity: 0 }}
          >
            <span className={styles.number}>{m.number}</span>
            {!m.closing && (
              <div className={styles.label}>
                <span className={styles.labelMain}>{m.main}</span>
                {m.sub && <span className={styles.labelSub}>{m.sub}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
