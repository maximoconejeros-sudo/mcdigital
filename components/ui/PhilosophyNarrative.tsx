"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PhilosophyNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Principle {
  a: string;
  b: string;
  label: string;
  copy: string;
}

const PRINCIPLES: Principle[] = [
  {
    a: "Fast.",
    b: "But never generic.",
    label: "Velocidad",
    copy: "Usamos las mismas herramientas de IA que ofrecemos a nuestros clientes — procesos más cortos sin bajar la calidad.",
  },
  {
    a: "Custom.",
    b: "Built around you.",
    label: "A medida",
    copy: "Cada proyecto se diseña desde cero, con la identidad, el tono y los objetivos específicos de tu negocio.",
  },
  {
    a: "Support.",
    b: "We stay after launch.",
    label: "Acompañamiento",
    copy: "No desaparecemos al entregar. Ajustamos, mejoramos y resolvemos dudas mientras tu negocio sigue creciendo.",
  },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);

interface Refs {
  root: HTMLDivElement | null;
  wordA: HTMLSpanElement | null;
  wordB: HTMLSpanElement | null;
  meta: HTMLDivElement | null;
}

function applyPrinciple(progress: number, [start, end]: [number, number], r: Refs) {
  const local = clamp01((progress - start) / (end - start));
  const enterEnd = 0.12;
  const flipStart = 0.42;
  const flipEnd = 0.58;
  const exitStart = 0.88;

  let aOpacity = 0;
  let aY = 24;
  if (local < enterEnd) {
    const t = smooth(local / enterEnd);
    aOpacity = t;
    aY = gsap.utils.interpolate(24, 0, t);
  } else if (local < flipStart) {
    aOpacity = 1;
    aY = 0;
  } else if (local < flipEnd) {
    const t = smooth((local - flipStart) / (flipEnd - flipStart));
    aOpacity = 1 - t;
    aY = gsap.utils.interpolate(0, -46, t);
  }

  let bOpacity = 0;
  let bY = 46;
  if (local >= flipStart && local < flipEnd) {
    const t = smooth((local - flipStart) / (flipEnd - flipStart));
    bOpacity = t;
    bY = gsap.utils.interpolate(46, 0, t);
  } else if (local >= flipEnd && local < exitStart) {
    bOpacity = 1;
    bY = 0;
  } else if (local >= exitStart) {
    const t = smooth((local - exitStart) / (1 - exitStart));
    bOpacity = 1 - t;
    bY = 0;
  }

  if (r.wordA) {
    r.wordA.style.opacity = String(aOpacity);
    r.wordA.style.transform = `translateY(${aY}px)`;
  }
  if (r.wordB) {
    r.wordB.style.opacity = String(bOpacity);
    r.wordB.style.transform = `translateY(${bY}px)`;
  }
  if (r.meta) r.meta.style.opacity = String(bOpacity);
}

/**
 * Act VI — the "why us" manifesto as a scroll-controlled editorial beat,
 * not three columns: each principle states itself (Fast.) then completes
 * itself (But never generic.) before the next arrives.
 */
export default function PhilosophyNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs[]>(
    PRINCIPLES.map(() => ({ root: null, wordA: null, wordB: null, meta: null }))
  );
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

        PRINCIPLES.forEach((_, i) => {
          const r = refs.current[i];
          if (!r) return;
          const start = i / PRINCIPLES.length;
          const end = (i + 1) / PRINCIPLES.length;
          applyPrinciple(self.progress, [start, end], r);
        });
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        {PRINCIPLES.map((p, i) => (
          <div
            key={p.a}
            ref={(el) => {
              refs.current[i].root = el;
            }}
            className={styles.principle}
          >
            <div className={styles.wordStack}>
              <span
                className={styles.word}
                style={{ opacity: 0 }}
                ref={(el) => {
                  refs.current[i].wordA = el;
                }}
              >
                {p.a}
              </span>
              <span
                className={`${styles.word} ${styles.wordB}`}
                style={{ opacity: 0 }}
                ref={(el) => {
                  refs.current[i].wordB = el;
                }}
              >
                {p.b}
              </span>
            </div>
            <div
              className={styles.meta}
              style={{ opacity: 0 }}
              ref={(el) => {
                refs.current[i].meta = el;
              }}
            >
              <span className={styles.label}>{p.label}</span>
              <p className={styles.copy}>{p.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
