"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/content/projects";
import styles from "./WorkNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);

// the "Selected work." title card owns a dedicated opening slice; the
// three projects share what's left so the card never overlaps a project
// (and never sits pinned in a corner colliding with the persistent nav)
const INTRO_END = 0.07;

interface Refs {
  panel: HTMLDivElement | null;
  meta: HTMLDivElement | null;
}

function applyProject(progress: number, [start, end]: [number, number], r: Refs) {
  const local = clamp01((progress - start) / (end - start));

  let scale = 0.5;
  let panelOpacity = 0;
  if (local < 0.14) {
    const t = smooth(local / 0.14);
    scale = gsap.utils.interpolate(0.5, 1, t);
    panelOpacity = t;
  } else if (local < 0.62) {
    const t = (local - 0.14) / (0.62 - 0.14);
    scale = gsap.utils.interpolate(1, 1.25, t);
    panelOpacity = 1;
  } else {
    const t = smooth((local - 0.62) / 0.38);
    scale = gsap.utils.interpolate(1.25, 2.0, t);
    panelOpacity = 1 - t;
  }

  const metaOpacity =
    local < 0.1
      ? 0
      : local < 0.2
      ? smooth((local - 0.1) / 0.1)
      : local < 0.55
      ? 1
      : local < 0.7
      ? 1 - smooth((local - 0.55) / 0.15)
      : 0;

  if (r.panel) {
    r.panel.style.transform = `scale(${scale})`;
    r.panel.style.opacity = String(panelOpacity);
  }
  if (r.meta) {
    r.meta.style.opacity = String(metaOpacity);
    r.meta.style.transform = `translateY(${(1 - metaOpacity) * 14}px)`;
  }
}

/**
 * Act VII — Selected Work. No grid, no cards: each project's panel begins
 * small, grows dramatically past frame while its meta reveals, then fades
 * as the next project emerges from behind at the same small starting
 * scale — the expand-and-hand-off interaction is the pitch.
 */
export default function WorkNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const actLabel = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs[]>(PROJECTS.map(() => ({ panel: null, meta: null })));
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

        if (actLabel.current) {
          const p = self.progress;
          const inT = smooth(clamp01(p / (INTRO_END * 0.4)));
          const outT = smooth(
            clamp01((p - INTRO_END * 0.6) / (INTRO_END * 0.4))
          );
          actLabel.current.style.opacity = String(inT * (1 - outT));
        }

        PROJECTS.forEach((_, i) => {
          const r = refs.current[i];
          if (!r) return;
          const span = (1 - INTRO_END) / PROJECTS.length;
          const start = INTRO_END + i * span;
          const end = INTRO_END + (i + 1) * span;
          applyProject(self.progress, [start, end], r);
        });
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div ref={actLabel} className={styles.actLabel}>
          <span className="label">Trabajo seleccionado</span>
          <span className={styles.big}>Selected work.</span>
        </div>

        {PROJECTS.map((p, i) => (
          <div key={p.number} className={styles.project}>
            <div
              className={styles.panel}
              style={{ opacity: 0, transform: "scale(0.5)" }}
              ref={(el) => {
                refs.current[i].panel = el;
              }}
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.client}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <span className={styles.panelMark}>MC</span>
                  <span className={styles.panelLabel}>Preview</span>
                </>
              )}
            </div>

            <div
              className={styles.meta}
              style={{ opacity: 0 }}
              ref={(el) => {
                refs.current[i].meta = el;
              }}
            >
              <span className={styles.metaIndex}>
                {p.number} / 0{PROJECTS.length}
              </span>
              <h3 className={styles.metaClient}>{p.client}</h3>
              <div className={styles.metaRow}>
                <span>{p.industry}</span>
                <span>{p.services}</span>
                <span>{p.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
