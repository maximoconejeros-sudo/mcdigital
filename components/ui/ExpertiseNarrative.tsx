"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  CANVAS_CTA,
  CANVAS_NAV,
  CANVAS_WORDS,
  CLOSING_COPY,
  WEB_WORDS,
  WEB_COPY,
  WEB_NAV_EXTRA,
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

const WORD_STEP_LABELS = ["01 / ATENCIÓN", "02 / INTERÉS", "03 / ACCIÓN"];

interface Refs {
  cursorDot: HTMLDivElement | null;
  baseline: HTMLDivElement | null;
  words: (HTMLDivElement | null)[];
  stepLabels: (HTMLSpanElement | null)[];
  navRow: HTMLDivElement | null;
  imagePanel: HTMLDivElement | null;
  closing: HTMLParagraphElement | null;
  cta: HTMLAnchorElement | null;
  webWords: (HTMLDivElement | null)[];
  webCopy: HTMLParagraphElement | null;
  navExtra: (HTMLDivElement | null)[];
  panel2: HTMLDivElement | null;
}

/**
 * Act II — "The Transformation." No numbered section, no browser-frame
 * mockup: the impact comes from typography, layout and a real interface
 * composition being watched into existence directly in the viewport.
 *
 * Two beats share this one spacer: BUILD (Start with an idea -> a literal
 * empty canvas -> Attention/Interest/Action, demonstrating Landing Pages)
 * hands off into WEB EXPANSION (the single page becomes "a whole digital
 * world," navigation multiplying and the visual growing well past its
 * first shape, demonstrating Web Experiences) — one continuous
 * transformation rather than two stacked sections.
 */
export default function ExpertiseNarrative({ ready }: { ready: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    cursorDot: null,
    baseline: null,
    words: [null, null, null],
    stepLabels: [null, null, null],
    navRow: null,
    imagePanel: null,
    closing: null,
    cta: null,
    webWords: [null, null],
    webCopy: null,
    navExtra: [null, null],
    panel2: null,
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

        // --- BUILD: no empty waiting screen — the composition (nav, cursor,
        // baseline, image panel) is already assembling from the very start,
        // so ATTENTION/INTEREST/ACTION arrives as the labeled centerpiece of
        // an already-active scene rather than the only thing on screen
        const cursorT = wordEnvelope(p, 0.02, 0.05, 0.36, 0.4);
        if (r.cursorDot) r.cursorDot.style.opacity = String(cursorT);

        const baseT = bandIn(p, 0.04, 0.08);
        if (r.baseline) r.baseline.style.transform = `scaleX(${baseT})`;

        const wordBands: [number, number, number, number][] = [
          [0.15, 0.19, 0.24, 0.28],
          [0.24, 0.28, 0.38, 0.42],
          [0.38, 0.42, 1, 1],
        ];
        wordBands.forEach(([inS, inE, outS, outE], i) => {
          const el = r.words[i];
          const t =
            i === wordBands.length - 1
              ? bandIn(p, inS, inE)
              : wordEnvelope(p, inS, inE, outS, outE);
          if (el) {
            el.style.opacity = String(t);
            el.style.transform = `scale(${0.94 + t * 0.06})`;
          }
          const label = r.stepLabels[i];
          if (label) label.style.opacity = String(t);
        });

        const navT = bandIn(p, 0.03, 0.08);
        if (r.navRow) {
          r.navRow.style.opacity = String(navT);
          r.navRow.style.transform = `translateY(${(1 - navT) * -10}px)`;
        }

        const imageT = bandIn(p, 0.08, 0.16);
        if (r.imagePanel) {
          r.imagePanel.style.opacity = String(imageT);
        }
        // the panel keeps growing through the web-expansion beat too — one
        // continuous shape, not a reset — so it's computed across the
        // whole 0.08-0.95 span rather than settling early
        const imageGrowT = bandIn(p, 0.08, 0.95);
        if (r.imagePanel) {
          r.imagePanel.style.clipPath = `polygon(${100 - imageGrowT * 62}% 0, 100% 0, 100% 100%, ${100 - imageGrowT * 46}% 100%)`;
        }

        const closingT = wordEnvelope(p, 0.4, 0.46, 0.58, 0.63);
        if (r.closing) {
          r.closing.style.opacity = String(closingT);
          r.closing.style.transform = `translateY(${(1 - closingT) * 10}px)`;
        }

        const ctaT = wordEnvelope(p, 0.42, 0.5, 0.58, 0.63);
        if (r.cta) {
          r.cta.style.opacity = String(ctaT);
          r.cta.style.pointerEvents = ctaT > 0.5 ? "auto" : "none";
        }

        // --- WEB EXPANSION: one page becomes a whole digital world
        const webWordBands: [number, number, number, number][] = [
          [0.6, 0.65, 0.73, 0.77],
          [0.73, 0.77, 1, 1],
        ];
        webWordBands.forEach(([inS, inE, outS, outE], i) => {
          const el = r.webWords[i];
          if (!el) return;
          const t =
            i === webWordBands.length - 1
              ? bandIn(p, inS, inE)
              : wordEnvelope(p, inS, inE, outS, outE);
          el.style.opacity = String(t);
          el.style.transform = `translateY(${(1 - t) * 16}px)`;
        });

        const webCopyT = bandIn(p, 0.78, 0.85);
        if (r.webCopy) {
          r.webCopy.style.opacity = String(webCopyT);
          r.webCopy.style.transform = `translateY(${(1 - webCopyT) * 10}px)`;
        }

        // navigation "duplicating" — extra rows entering at different
        // positions as the single page becomes a spatial site
        const navExtraBands: [number, number][] = [
          [0.64, 0.7],
          [0.7, 0.76],
        ];
        navExtraBands.forEach(([s, e], i) => {
          const el = r.navExtra[i];
          if (!el) return;
          const t = bandIn(p, s, e);
          el.style.opacity = String(t * 0.7);
          el.style.transform = `translateX(${(1 - t) * (i % 2 === 0 ? 16 : -16)}px)`;
        });

        const panel2T = bandIn(p, 0.66, 0.8);
        if (r.panel2) {
          r.panel2.style.opacity = String(panel2T * 0.8);
          r.panel2.style.transform = `scaleY(${panel2T})`;
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
            refs.current.navRow = el;
          }}
          className={styles.navRow}
          style={{ opacity: 0 }}
        >
          {CANVAS_NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {WEB_NAV_EXTRA.map((row, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current.navExtra[i] = el;
            }}
            className={styles.navRow}
            style={{
              opacity: 0,
              top: `calc(clamp(90px, 13vh, 150px) + ${40 + i * 40}px)`,
            }}
          >
            {row.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        ))}

        <div className={styles.canvasStage}>
          <div
            ref={(el) => {
              refs.current.cursorDot = el;
            }}
            className={styles.cursorDot}
            style={{ opacity: 0 }}
          />

          <div className={styles.wordStack}>
            <div className={styles.stepLabelStack}>
              {WORD_STEP_LABELS.map((label, i) => (
                <span
                  key={label}
                  ref={(el) => {
                    refs.current.stepLabels[i] = el;
                  }}
                  className={styles.stepLabel}
                  style={{ opacity: 0 }}
                >
                  {label}
                </span>
              ))}
            </div>
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

          <div className={styles.webWordStack}>
            {WEB_WORDS.map((word, i) => (
              <div
                key={word}
                ref={(el) => {
                  refs.current.webWords[i] = el;
                }}
                className={styles.webWord}
                style={{ opacity: 0 }}
              >
                {word}
              </div>
            ))}
          </div>

          <p
            ref={(el) => {
              refs.current.webCopy = el;
            }}
            className={styles.webCopy}
            style={{ opacity: 0 }}
          >
            {WEB_COPY}
          </p>
        </div>

        <div
          ref={(el) => {
            refs.current.imagePanel = el;
          }}
          className={styles.imagePanel}
          style={{ opacity: 0 }}
          data-asset="web-editorial-01"
        >
          <span className={styles.imageLabel}>Web Editorial — 01</span>
        </div>

        <div
          ref={(el) => {
            refs.current.panel2 = el;
          }}
          className={styles.panel2}
          style={{ opacity: 0, transform: "scaleY(0)" }}
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
