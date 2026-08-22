"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  WHY_OPEN_A,
  WHY_OPEN_B,
  MOMENTS,
  GROW_WORD,
} from "@/lib/content/why-it-matters";
import styles from "./WhyItMattersNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);
const bandIn = (p: number, start: number, end: number) =>
  smooth(clamp01((p - start) / (end - start)));
const wordEnvelope = (
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) => Math.min(bandIn(p, inStart, inEnd), 1 - bandIn(p, outStart, outEnd));

// a small deliberate offset per moment (not random — SSR-safe, and it's
// "chaos becoming structure" as it settles to 0, not literal randomness)
const MOMENT_OFFSET = [
  { x: 0, rotate: 0 },
  { x: -18, rotate: -2.4 },
  { x: 0, rotate: 0 },
];

interface MomentRefs {
  root: HTMLDivElement | null;
  bgWord: HTMLDivElement | null;
  word: HTMLDivElement | null;
  copy: HTMLParagraphElement | null;
  cta: HTMLAnchorElement | null;
  recap: HTMLSpanElement | null;
  counter: HTMLSpanElement | null;
}

interface Refs {
  openA: HTMLDivElement | null;
  openB: HTMLDivElement | null;
  moments: MomentRefs[];
  grow: HTMLDivElement | null;
}

const MOMENT_LABEL = ["01", "02", "03"];

const MOMENT_BANDS: [number, number, number, number][] = [
  [0.28, 0.36, 0.42, 0.46],
  [0.44, 0.52, 0.58, 0.62],
  [0.6, 0.68, 0.78, 0.82],
];

/**
 * Act V — "Why It Matters." No WHY MC DIGITAL columns, no benefit cards:
 * three moments state themselves one at a time — Be seen, Be understood,
 * Be chosen — each with its own visual behavior (a curtain-clip reveal, a
 * settle-from-offset "chaos becomes structure," a CTA appearing), then
 * recap into a single compressed word: Grow.
 */
export default function WhyItMattersNarrative({
  ready,
}: {
  ready: boolean;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    openA: null,
    openB: null,
    moments: MOMENTS.map(() => ({
      root: null,
      bgWord: null,
      word: null,
      copy: null,
      cta: null,
      recap: null,
      counter: null,
    })),
    grow: null,
  });
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        if (self.isActive) scrollState.navTheme = "light";
        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }

        const p = self.progress;
        const r = refs.current;

        const openAT = wordEnvelope(p, 0.02, 0.09, 0.12, 0.16);
        if (r.openA) {
          r.openA.style.opacity = String(openAT);
          r.openA.style.transform = `translateY(${(1 - openAT) * 14}px)`;
        }
        const openBT = wordEnvelope(p, 0.14, 0.2, 0.24, 0.28);
        if (r.openB) {
          r.openB.style.opacity = String(openBT);
          r.openB.style.transform = `translateY(${(1 - openBT) * 14}px)`;
        }

        MOMENTS.forEach((_, mi) => {
          const mr = r.moments[mi];
          if (!mr) return;
          const [inS, inE, outS, outE] = MOMENT_BANDS[mi];
          const t = wordEnvelope(p, inS, inE, outS, outE);
          const settle = bandIn(p, inS, inE);
          const off = MOMENT_OFFSET[mi];

          if (mr.root) mr.root.style.opacity = String(t);
          if (mr.word) {
            if (mi === 0) {
              mr.word.style.clipPath = `inset(0 ${(1 - settle) * 100}% 0 0)`;
            } else {
              mr.word.style.transform = `translateX(${off.x * (1 - settle)}px) rotate(${off.rotate * (1 - settle)}deg)`;
            }
          }
          // a huge, blurred, low-contrast echo of the same word fills the
          // background — depth + texture behind the crisp foreground word,
          // instead of empty warm-white (V8: oversized cropped typography)
          if (mr.bgWord) {
            mr.bgWord.style.opacity = String(t * 0.14);
            mr.bgWord.style.transform = `scale(${0.92 + settle * 0.1}) translateX(${(1 - settle) * -40}px)`;
          }
          if (mr.copy) mr.copy.style.opacity = String(bandIn(p, inS + 0.02, inE + 0.02));
          if (mr.cta && mi === 2) {
            const ctaT = bandIn(p, 0.68, 0.74);
            mr.cta.style.opacity = String(ctaT);
            mr.cta.style.pointerEvents = ctaT > 0.5 ? "auto" : "none";
          }
          // running counter, bottom-left — a second area of activity so the
          // viewport is never just one centered headline on blank warm-white
          if (mr.counter) mr.counter.style.opacity = String(t);

          // recap sliver — the moment's word shrinks into the vertical
          // stack just before GROW takes over
          const recapT = bandIn(p, 0.82, 0.88);
          if (mr.recap) mr.recap.style.opacity = String(recapT * t);
        });

        const growIn = bandIn(p, 0.86, 0.96);
        if (r.grow) {
          r.grow.style.opacity = String(growIn);
          r.grow.style.transform = `scale(${0.7 + growIn * 0.3})`;
        }
      },
    });

    return () => st.kill();
  }, [ready]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div className={styles.gridLines} aria-hidden>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.metaLabel}>Por qué importa</div>

        <div
          ref={(el) => {
            refs.current.openA = el;
          }}
          className={styles.openStatement}
          style={{ opacity: 0 }}
        >
          {WHY_OPEN_A[0]}
          <br />
          {WHY_OPEN_A[1]}
        </div>

        <div
          ref={(el) => {
            refs.current.openB = el;
          }}
          className={styles.openStatement}
          style={{ opacity: 0 }}
        >
          {WHY_OPEN_B[0]}
          <br />
          {WHY_OPEN_B[1]}
          <br />
          {WHY_OPEN_B[2]}
        </div>

        {MOMENTS.map((moment, mi) => (
          <div
            key={moment.word}
            ref={(el) => {
              refs.current.moments[mi].root = el;
            }}
            className={styles.moment}
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => {
                refs.current.moments[mi].bgWord = el;
              }}
              className={styles.bgWord}
              aria-hidden
              style={{ opacity: 0 }}
            >
              {moment.word}
            </div>
            <div
              ref={(el) => {
                refs.current.moments[mi].word = el;
              }}
              className={styles.momentWord}
            >
              {moment.word}
            </div>
            <p
              ref={(el) => {
                refs.current.moments[mi].copy = el;
              }}
              className={styles.momentCopy}
              style={{ opacity: 0 }}
            >
              {moment.copy}
            </p>
            {mi === 2 && (
              <a
                ref={(el) => {
                  refs.current.moments[mi].cta = el;
                }}
                href="#contacto"
                className={styles.momentCta}
                style={{ opacity: 0, pointerEvents: "none" }}
                data-cursor
              >
                Hablemos ↗
              </a>
            )}
            <span
              ref={(el) => {
                refs.current.moments[mi].counter = el;
              }}
              className={styles.momentCounter}
              style={{ opacity: 0 }}
            >
              {MOMENT_LABEL[mi]} / 03
            </span>
          </div>
        ))}

        <div className={styles.recapRow}>
          {MOMENTS.map((moment, mi) => (
            <span
              key={moment.word}
              ref={(el) => {
                refs.current.moments[mi].recap = el;
              }}
              className={styles.recapWord}
              style={{ opacity: 0 }}
            >
              {moment.word}
            </span>
          ))}
        </div>

        <div
          ref={(el) => {
            refs.current.grow = el;
          }}
          className={styles.grow}
          style={{ opacity: 0 }}
        >
          {GROW_WORD}
        </div>
      </div>
    </>
  );
}
