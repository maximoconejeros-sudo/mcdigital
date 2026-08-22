"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CANVAS_CTA,
  CANVAS_NAV,
  CANVAS_WORDS,
  CLOSING_COPY,
} from "@/lib/content/expertise";
import styles from "./ExpertiseNarrative.module.css";

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

interface Refs {
  openPhrase: HTMLDivElement | null;
  cursorDot: HTMLDivElement | null;
  baseline: HTMLDivElement | null;
  words: (HTMLDivElement | null)[];
  gridLines: HTMLDivElement | null;
  navRow: HTMLDivElement | null;
  imagePanel: HTMLDivElement | null;
  closing: HTMLParagraphElement | null;
  cta: HTMLAnchorElement | null;
}

/**
 * Act II — "The Transformation." No numbered section, no browser-frame
 * mockup: the brief is explicit that the website IS the environment here,
 * typography and UI appearing directly in the world rather than inside a
 * card. Sequence: "Start with an idea" -> a literal empty canvas (cursor,
 * baseline, first word) -> that first word cycles Attention -> Interest
 * -> Action while the composition around it gets richer (grid, nav,
 * image), ending on the service's one line of explanation and a plain-text
 * CTA. This is the milestone's stopping point — Web Experiences, AI, and
 * everything after is a follow-up pass.
 */
export default function ExpertiseNarrative({ ready }: { ready: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    openPhrase: null,
    cursorDot: null,
    baseline: null,
    words: [null, null, null],
    gridLines: null,
    navRow: null,
    imagePanel: null,
    closing: null,
    cta: null,
  });
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      // "bottom top" (not "bottom bottom") so this act's active range runs
      // the full spacer height and hands off to the next act with no
      // viewport-tall dead zone in between — see ScrollNarrative.tsx.
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
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

        const openT = wordEnvelope(p, 0.02, 0.09, 0.12, 0.18);
        if (r.openPhrase) {
          r.openPhrase.style.opacity = String(openT);
          r.openPhrase.style.transform = `translateY(${(1 - openT) * 12}px)`;
        }

        const cursorT = wordEnvelope(p, 0.15, 0.2, 0.27, 0.32);
        if (r.cursorDot) r.cursorDot.style.opacity = String(cursorT);

        const baseT = bandIn(p, 0.19, 0.26);
        if (r.baseline) r.baseline.style.transform = `scaleX(${baseT})`;

        // Attention -> Interest -> Action, crossfading in the same spot
        const wordBands: [number, number, number, number][] = [
          [0.23, 0.3, 0.38, 0.44],
          [0.38, 0.44, 0.6, 0.66],
          [0.6, 0.66, 1, 1],
        ];
        wordBands.forEach(([inS, inE, outS, outE], i) => {
          const el = r.words[i];
          if (!el) return;
          const t =
            i === wordBands.length - 1
              ? bandIn(p, inS, inE)
              : wordEnvelope(p, inS, inE, outS, outE);
          el.style.opacity = String(t);
          el.style.transform = `scale(${0.94 + t * 0.06})`;
        });

        const gridT = bandIn(p, 0.28, 0.4);
        if (r.gridLines) r.gridLines.style.opacity = String(gridT * 0.5);

        const navT = bandIn(p, 0.32, 0.4);
        if (r.navRow) {
          r.navRow.style.opacity = String(navT);
          r.navRow.style.transform = `translateY(${(1 - navT) * -10}px)`;
        }

        const imageT = bandIn(p, 0.44, 0.58);
        if (r.imagePanel) {
          r.imagePanel.style.opacity = String(imageT);
          r.imagePanel.style.clipPath = `polygon(${100 - imageT * 42}% 0, 100% 0, 100% 100%, ${100 - imageT * 30}% 100%)`;
        }

        const closingT = bandIn(p, 0.78, 0.88);
        if (r.closing) {
          r.closing.style.opacity = String(closingT);
          r.closing.style.transform = `translateY(${(1 - closingT) * 10}px)`;
        }

        const ctaT = bandIn(p, 0.82, 0.92);
        if (r.cta) {
          r.cta.style.opacity = String(ctaT);
          r.cta.style.pointerEvents = ctaT > 0.5 ? "auto" : "none";
        }
      },
    });

    return () => st.kill();
  }, [ready]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div
          ref={(el) => {
            refs.current.openPhrase = el;
          }}
          className={styles.openPhrase}
          style={{ opacity: 0 }}
        >
          Start with
          <br />
          an idea.
        </div>

        <div
          ref={(el) => {
            refs.current.gridLines = el;
          }}
          className={styles.gridLines}
          style={{ opacity: 0 }}
        >
          <span />
          <span />
          <span />
        </div>

        <div
          ref={(el) => {
            refs.current.navRow = el;
          }}
          className={styles.navRow}
          style={{ opacity: 0 }}
        >
          {CANVAS_NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        <div className={styles.canvasStage}>
          <div
            ref={(el) => {
              refs.current.cursorDot = el;
            }}
            className={styles.cursorDot}
            style={{ opacity: 0 }}
          />

          <div className={styles.wordStack}>
            {CANVAS_WORDS.map((word, i) => (
              <div
                key={word}
                ref={(el) => {
                  refs.current.words[i] = el;
                }}
                className={styles.word}
                style={{ opacity: 0 }}
              >
                {word}
              </div>
            ))}
          </div>

          <div
            ref={(el) => {
              refs.current.baseline = el;
            }}
            className={styles.baseline}
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div
          ref={(el) => {
            refs.current.imagePanel = el;
          }}
          className={styles.imagePanel}
          style={{ opacity: 0 }}
        />

        <div className={styles.footer}>
          <p
            ref={(el) => {
              refs.current.closing = el;
            }}
            className={styles.closing}
            style={{ opacity: 0 }}
          >
            {CLOSING_COPY}
          </p>
          <a
            ref={(el) => {
              refs.current.cta = el;
            }}
            className={styles.cta}
            style={{ opacity: 0, pointerEvents: "none" }}
            data-cursor="Ver"
          >
            {CANVAS_CTA}
            <span className={styles.ctaArrow}>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
