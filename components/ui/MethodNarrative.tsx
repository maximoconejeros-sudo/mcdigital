"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  METHOD_INTRO_LABEL,
  METHOD_STATEMENT_SMALL,
  METHOD_STATEMENT_MAIN,
  METHOD_STATEMENT_EMPHASIS,
  METHOD_STEPS,
  DISCOVER_WORDS,
  HUMAN_MOMENT_LABEL,
  HUMAN_MOMENT_HEADLINE,
  HUMAN_MOMENT_COPY,
  HUMAN_MOMENT_IMAGE_SLOT,
} from "@/lib/content/method";
import styles from "./MethodNarrative.module.css";

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

// DISCOVER: where each keyword starts, scattered and tilted
const SCATTER = [
  { top: 10, left: 58, rotate: -6 },
  { top: 26, left: 80, rotate: 4 },
  { top: 52, left: 12, rotate: 5 },
  { top: 66, left: 68, rotate: -4 },
  { top: 6, left: 20, rotate: 3 },
  { top: 40, left: 44, rotate: -5 },
  { top: 78, left: 28, rotate: 6 },
  { top: 58, left: 88, rotate: -3 },
];
// DEFINE: the same words, settled into an organized vertical list
const GRID = DISCOVER_WORDS.map((_, i) => ({
  top: 10 + i * 10.5,
  left: 6,
  rotate: 0,
}));

// BUILD: four component blocks, each entering from a different edge
const BLOCK_FROM = [
  { x: 0, y: -60 },
  { x: 60, y: 0 },
  { x: -60, y: 0 },
  { x: 0, y: 60 },
];
const BLOCK_TO = [
  { top: 8, left: 8 },
  { top: 8, left: 54 },
  { top: 54, left: 8 },
  { top: 54, left: 54 },
];

// EVOLVE: small satellite dots that keep drifting once the system is "alive"
const DOTS = [
  { top: 4, left: 10 },
  { top: 92, left: 18 },
  { top: 14, left: 94 },
  { top: 86, left: 88 },
  { top: 50, left: 2 },
];

const BG_STOPS: { at: number; color: string }[] = [
  { at: 0.76, color: "#242422" },
  { at: 0.88, color: "#f4f1ea" },
];

function sampleBg(p: number): string {
  if (p <= BG_STOPS[0].at) return BG_STOPS[0].color;
  if (p >= BG_STOPS[1].at) return BG_STOPS[1].color;
  const t = smooth(
    clamp01((p - BG_STOPS[0].at) / (BG_STOPS[1].at - BG_STOPS[0].at))
  );
  return gsap.utils.interpolate(BG_STOPS[0].color, BG_STOPS[1].color, t);
}

// [stepStart, stepEnd] highlight window per rail item, matches the stage bands below
const STEP_BANDS: [number, number][] = [
  [0.1, 0.2],
  [0.2, 0.3],
  [0.3, 0.4],
  [0.4, 0.5],
  [0.5, 0.58],
  [0.58, 0.68],
  [0.68, 0.78],
];

interface Refs {
  introLabel: HTMLDivElement | null;
  introSmall: HTMLDivElement | null;
  introMain: HTMLDivElement | null;
  introEmphasis: HTMLDivElement | null;
  rail: HTMLDivElement | null;
  railItems: (HTMLSpanElement | null)[];
  stage: HTMLDivElement | null;
  words: (HTMLSpanElement | null)[];
  guideV: HTMLDivElement | null;
  guideH: HTMLDivElement | null;
  designPanel: HTMLDivElement | null;
  blocks: (HTMLDivElement | null)[];
  bubble: HTMLDivElement | null;
  dots: (HTMLDivElement | null)[];
  humanLabel: HTMLDivElement | null;
  humanHeadline: HTMLDivElement | null;
  humanCopy: HTMLParagraphElement | null;
  humanImage: HTMLDivElement | null;
}

/**
 * Act VI — "Method." Replaces the old timeline/circles process section: the
 * seven steps (Discover -> Evolve) are not a list, they're one composition
 * that keeps physically transforming — keywords scatter then organize,
 * a layout assembles, component blocks lock into a grid, a conversation
 * connects into it, the whole thing launches to fill the frame, then small
 * elements keep drifting to signal ongoing evolution. Closes on a human
 * moment: the background warms from graphite to warm-white as the copy
 * turns from process to people.
 */
export default function MethodNarrative({ ready }: { ready: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    introLabel: null,
    introSmall: null,
    introMain: null,
    introEmphasis: null,
    rail: null,
    railItems: METHOD_STEPS.map(() => null),
    stage: null,
    words: DISCOVER_WORDS.map(() => null),
    guideV: null,
    guideH: null,
    designPanel: null,
    blocks: BLOCK_TO.map(() => null),
    bubble: null,
    dots: DOTS.map(() => null),
    humanLabel: null,
    humanHeadline: null,
    humanCopy: null,
    humanImage: null,
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
        const p = self.progress;
        const r = refs.current;

        scrollState.navTheme = p > 0.78 ? "light" : "graphite";

        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }

        if (layer.current) layer.current.style.background = sampleBg(p);

        // intro — three-part statement (small claim -> large statement ->
        // gold serif emphasis), staggered, so the section states its own
        // meaning before the construction sequence begins
        const introT = wordEnvelope(p, 0.0, 0.03, 0.08, 0.1);
        if (r.introLabel) r.introLabel.style.opacity = String(introT);
        const smallT = wordEnvelope(p, 0.0, 0.03, 0.08, 0.1);
        if (r.introSmall) {
          r.introSmall.style.opacity = String(smallT);
          r.introSmall.style.transform = `translateY(${(1 - smallT) * 14}px)`;
        }
        const mainT = wordEnvelope(p, 0.015, 0.045, 0.08, 0.1);
        if (r.introMain) {
          r.introMain.style.opacity = String(mainT);
          r.introMain.style.transform = `translateY(${(1 - mainT) * 16}px)`;
        }
        const emphT = wordEnvelope(p, 0.03, 0.06, 0.08, 0.1);
        if (r.introEmphasis) {
          r.introEmphasis.style.opacity = String(emphT);
          r.introEmphasis.style.transform = `translateY(${(1 - emphT) * 14}px)`;
        }

        // rail — visible from just after intro until the human moment
        const railT = wordEnvelope(p, 0.07, 0.11, 0.78, 0.82);
        if (r.rail) r.rail.style.opacity = String(railT);
        METHOD_STEPS.forEach((_, i) => {
          const el = r.railItems[i];
          if (!el) return;
          const [s, e] = STEP_BANDS[i];
          const active = bandIn(p, s, Math.min(s + 0.02, e));
          el.style.color = active > 0.5 || p > e ? "var(--color-champagne-gold)" : "var(--color-graphite-light)";
          el.style.opacity = String(0.55 + active * 0.45);
        });

        // stage — an invisible positioning area, not a visible card: no
        // border/fill of its own, just launches (scales) mid-way
        const stageT = wordEnvelope(p, 0.09, 0.13, 0.76, 0.8);
        if (r.stage) {
          r.stage.style.opacity = String(stageT);
          const launch = bandIn(p, 0.58, 0.68);
          const scale = 1 + launch * 0.55;
          r.stage.style.transform = `translateY(-50%) scale(${scale})`;
        }

        // DISCOVER -> DEFINE: words scatter in, then settle onto a grid
        const wordsInT = bandIn(p, 0.1, 0.14);
        const organizeT = bandIn(p, 0.2, 0.29);
        const wordsOutT = 1 - bandIn(p, 0.29, 0.33);
        DISCOVER_WORDS.forEach((_, i) => {
          const el = r.words[i];
          if (!el) return;
          const from = SCATTER[i];
          const to = GRID[i];
          const top = from.top + (to.top - from.top) * organizeT;
          const left = from.left + (to.left - from.left) * organizeT;
          const rotate = from.rotate * (1 - organizeT);
          el.style.top = `${top}%`;
          el.style.left = `${left}%`;
          el.style.transform = `rotate(${rotate}deg)`;
          el.style.opacity = String(wordsInT * wordsOutT);
        });

        // DEFINE: a vertical guide + horizontal baseline appear — the
        // "common grid" the scattered fragments are organizing onto,
        // standing in for the container this section used to be
        const guideT = wordEnvelope(p, 0.18, 0.24, 0.3, 0.35);
        if (r.guideV) {
          r.guideV.style.opacity = String(guideT * 0.6);
          r.guideV.style.transform = `scaleY(${guideT})`;
        }
        if (r.guideH) {
          r.guideH.style.opacity = String(guideT * 0.6);
          r.guideH.style.transform = `scaleX(${guideT})`;
        }

        // DESIGN: headline + image hierarchy crossfades in
        const designT = wordEnvelope(p, 0.3, 0.35, 0.39, 0.42);
        if (r.designPanel) {
          r.designPanel.style.opacity = String(designT);
          r.designPanel.style.transform = `scale(${0.94 + designT * 0.06})`;
        }

        // BUILD: four blocks slide in from their edges and lock into a grid
        const buildT = bandIn(p, 0.4, 0.49);
        const buildOutT = 1 - bandIn(p, 0.68, 0.74);
        BLOCK_TO.forEach((pos, i) => {
          const el = r.blocks[i];
          if (!el) return;
          const from = BLOCK_FROM[i];
          const dx = from.x * (1 - buildT);
          const dy = from.y * (1 - buildT);
          el.style.top = `${pos.top}%`;
          el.style.left = `${pos.left}%`;
          el.style.transform = `translate(${dx}%, ${dy}%)`;
          el.style.opacity = String(bandIn(p, 0.4, 0.44) * buildOutT);
        });

        // CONNECT: a conversation slides in and docks against the grid
        const connectT = wordEnvelope(p, 0.5, 0.56, 0.68, 0.73);
        if (r.bubble) {
          r.bubble.style.opacity = String(connectT);
          r.bubble.style.transform = `translateX(${(1 - connectT) * 12}%)`;
        }

        // EVOLVE: satellite dots keep gently drifting — never fully still
        const evolveT = wordEnvelope(p, 0.68, 0.72, 0.99, 1);
        DOTS.forEach((_, i) => {
          const el = r.dots[i];
          if (!el) return;
          const wobble = Math.sin(p * 40 + i * 1.7) * 3;
          el.style.opacity = String(evolveT);
          el.style.transform = `translate(${wobble}%, ${wobble * -0.6}%) scale(${0.8 + evolveT * 0.4})`;
        });

        // human moment
        const humanLabelT = wordEnvelope(p, 0.8, 0.85, 0.97, 1);
        if (r.humanLabel) r.humanLabel.style.opacity = String(humanLabelT);
        const humanHeadT = bandIn(p, 0.83, 0.9);
        if (r.humanHeadline) {
          r.humanHeadline.style.opacity = String(humanHeadT);
          r.humanHeadline.style.transform = `translateY(${(1 - humanHeadT) * 18}px)`;
        }
        const humanCopyT = bandIn(p, 0.87, 0.94);
        if (r.humanCopy) r.humanCopy.style.opacity = String(humanCopyT);
        const humanImageT = bandIn(p, 0.82, 0.92);
        if (r.humanImage) {
          r.humanImage.style.opacity = String(humanImageT);
          r.humanImage.style.clipPath = `inset(0 0 ${(1 - humanImageT) * 100}% 0)`;
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
            refs.current.introLabel = el;
          }}
          className={styles.introLabel}
          style={{ opacity: 0 }}
        >
          {METHOD_INTRO_LABEL}
        </div>
        <div className={styles.introBlock}>
          <div
            ref={(el) => {
              refs.current.introSmall = el;
            }}
            className={styles.introSmall}
            style={{ opacity: 0 }}
          >
            {METHOD_STATEMENT_SMALL}
          </div>
          <div
            ref={(el) => {
              refs.current.introMain = el;
            }}
            className={styles.introMain}
            style={{ opacity: 0 }}
          >
            {METHOD_STATEMENT_MAIN[0]}
            <br />
            {METHOD_STATEMENT_MAIN[1]}
          </div>
          <div
            ref={(el) => {
              refs.current.introEmphasis = el;
            }}
            className={styles.introEmphasis}
            style={{ opacity: 0 }}
          >
            {METHOD_STATEMENT_EMPHASIS}
          </div>
        </div>

        <div ref={(el) => { refs.current.rail = el; }} className={styles.rail} style={{ opacity: 0 }}>
          {METHOD_STEPS.map((step, i) => (
            <span
              key={step.key}
              ref={(el) => {
                refs.current.railItems[i] = el;
              }}
              className={styles.railItem}
            >
              {step.label}
            </span>
          ))}
        </div>

        <div
          ref={(el) => {
            refs.current.stage = el;
          }}
          className={styles.stage}
          style={{ opacity: 0 }}
        >
          <div
            ref={(el) => {
              refs.current.guideV = el;
            }}
            className={styles.guideV}
            aria-hidden
          />
          <div
            ref={(el) => {
              refs.current.guideH = el;
            }}
            className={styles.guideH}
            aria-hidden
          />
          {DISCOVER_WORDS.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                refs.current.words[i] = el;
              }}
              className={styles.word}
              style={{ opacity: 0 }}
            >
              {word}
            </span>
          ))}

          <div
            ref={(el) => {
              refs.current.designPanel = el;
            }}
            className={styles.designPanel}
            style={{ opacity: 0 }}
          >
            <div className={styles.designImage} />
            <div className={styles.designText}>
              <div className={styles.designBar} />
              <div className={styles.designBar} />
              <div className={styles.designBarShort} />
            </div>
          </div>

          {BLOCK_TO.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                refs.current.blocks[i] = el;
              }}
              className={styles.block}
              style={{ opacity: 0 }}
            />
          ))}

          <div
            ref={(el) => {
              refs.current.bubble = el;
            }}
            className={styles.bubble}
            style={{ opacity: 0 }}
          >
            <div className={styles.bubbleLine}>
              <span className={styles.bubbleWhoClient}>Cliente</span>
              <span className={styles.bubbleText}>Hola.</span>
            </div>
            <div className={styles.bubbleLine}>
              <span className={styles.bubbleWho}>MC AI</span>
              <span className={styles.bubbleText}>¿Cómo puedo ayudarte?</span>
            </div>
          </div>

          {DOTS.map((pos, i) => (
            <div
              key={i}
              ref={(el) => {
                refs.current.dots[i] = el;
              }}
              className={styles.dot}
              style={{ top: `${pos.top}%`, left: `${pos.left}%`, opacity: 0 }}
            />
          ))}
        </div>

        <div className={styles.human}>
          <div
            ref={(el) => {
              refs.current.humanImage = el;
            }}
            className={styles.humanImage}
            style={{ opacity: 0 }}
            data-asset={HUMAN_MOMENT_IMAGE_SLOT.replace(/\.\w+$/, "")}
          />
          <div className={styles.humanText}>
            <div
              ref={(el) => {
                refs.current.humanLabel = el;
              }}
              className={styles.humanLabel}
              style={{ opacity: 0 }}
            >
              {HUMAN_MOMENT_LABEL}
            </div>
            <div
              ref={(el) => {
                refs.current.humanHeadline = el;
              }}
              className={styles.humanHeadline}
              style={{ opacity: 0 }}
            >
              {HUMAN_MOMENT_HEADLINE[0]}
              <br />
              {HUMAN_MOMENT_HEADLINE[1]}
            </div>
            <p
              ref={(el) => {
                refs.current.humanCopy = el;
              }}
              className={styles.humanCopy}
              style={{ opacity: 0 }}
            >
              {HUMAN_MOMENT_COPY}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
