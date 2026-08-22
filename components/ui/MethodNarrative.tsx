"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  PROCESS_INTRO_LABEL,
  PROCESS_HEADLINE,
  PROCESS_EMPHASIS,
  PROCESS_STAGES,
  DISCOVER_FRAGMENTS,
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

const STAGE_COUNT = PROCESS_STAGES.length;
const STAGE_SPAN = 0.68 / STAGE_COUNT;
const STAGE_START = 0.08;
// [inStart, inEnd, outStart, outEnd] per stage — each hands off to the next
const STAGE_BANDS: [number, number, number, number][] = PROCESS_STAGES.map((_, i) => {
  const s = STAGE_START + i * STAGE_SPAN;
  return [s, s + STAGE_SPAN * 0.25, s + STAGE_SPAN, s + STAGE_SPAN * 1.25];
});

// DISCOVER/DEFINE: three fragments scatter, then align onto one axis
const FRAG_SCATTER = [
  { top: 22, left: 62, rotate: -5 },
  { top: 55, left: 82, rotate: 4 },
  { top: 74, left: 58, rotate: -3 },
];
const FRAG_ALIGNED = [
  { top: 46, left: 60, rotate: 0 },
  { top: 46, left: 72, rotate: 0 },
  { top: 46, left: 84, rotate: 0 },
];

// DESIGN/BUILD: four interface elements assembling into a small card
const IFACE_FROM = [
  { x: -40, y: -30 },
  { x: 40, y: -20 },
  { x: -30, y: 30 },
  { x: 30, y: 30 },
];
const IFACE_TO = [
  { top: 12, left: 58 },
  { top: 12, left: 78 },
  { top: 30, left: 58 },
  { top: 55, left: 58 },
];

const DOTS = [
  { top: 10, left: 56 },
  { top: 85, left: 60 },
  { top: 20, left: 94 },
  { top: 80, left: 90 },
];

interface StageRefs {
  number: HTMLDivElement | null;
  name: HTMLDivElement | null;
  copy: HTMLParagraphElement | null;
}

interface Refs {
  introLabel: HTMLDivElement | null;
  introHeadline: HTMLDivElement | null;
  introEmphasis: HTMLDivElement | null;
  stages: StageRefs[];
  fragments: (HTMLSpanElement | null)[];
  ifaceEls: (HTMLDivElement | null)[];
  bubble: HTMLDivElement | null;
  dots: (HTMLDivElement | null)[];
  progressLine: HTMLDivElement | null;
  progressNums: (HTMLSpanElement | null)[];
  humanLabel: HTMLDivElement | null;
  humanHeadline: HTMLDivElement | null;
  humanCopy: HTMLParagraphElement | null;
  humanImage: HTMLDivElement | null;
}

/**
 * Act VI — "Process." Deleted entirely and rebuilt per V10: no left rail
 * list, no bordered floating-word square. A horizontal cinematic sequence
 * instead — one numbered stage (01 Descubrir -> 07 Evolucionar) dominates
 * the full viewport at a time, huge name + copy, with a small visual
 * behind it that's appropriate to that specific stage (fragments
 * gathering, aligning to an axis, an interface assembling, a chat
 * attaching, the whole thing launching, satellites drifting). A gold
 * progress line at the bottom tracks which stage is active. Closes on the
 * same human-moment beat as before — preserved, not part of what V10
 * flagged as broken.
 */
export default function MethodNarrative({ ready }: { ready: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    introLabel: null,
    introHeadline: null,
    introEmphasis: null,
    stages: PROCESS_STAGES.map(() => ({ number: null, name: null, copy: null })),
    fragments: DISCOVER_FRAGMENTS.map(() => null),
    ifaceEls: IFACE_TO.map(() => null),
    bubble: null,
    dots: DOTS.map(() => null),
    progressLine: null,
    progressNums: PROCESS_STAGES.map(() => null),
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

        scrollState.navTheme = p > 0.9 ? "light" : "graphite";

        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }

        // intro
        const introT = wordEnvelope(p, 0.0, 0.03, 0.07, STAGE_START);
        if (r.introLabel) r.introLabel.style.opacity = String(introT);
        if (r.introHeadline) {
          r.introHeadline.style.opacity = String(introT);
          r.introHeadline.style.transform = `translateY(${(1 - introT) * 16}px)`;
        }
        if (r.introEmphasis) r.introEmphasis.style.opacity = String(introT);

        // progress line — one continuous gold fill, active number gold
        const progressT = wordEnvelope(p, 0.05, STAGE_START, 0.86, 0.9);
        if (r.progressLine) {
          r.progressLine.style.opacity = String(progressT);
          const fillT = clamp01((p - STAGE_START) / (0.86 - STAGE_START));
          r.progressLine.style.setProperty("--fill", String(fillT));
        }
        PROCESS_STAGES.forEach((_, i) => {
          const el = r.progressNums[i];
          if (!el) return;
          const [s] = STAGE_BANDS[i];
          const active = bandIn(p, s, s + 0.02);
          el.style.color = active > 0.5 || p > s ? "var(--color-champagne-gold)" : "var(--color-graphite-light)";
        });

        // each stage: number/name/copy envelope
        PROCESS_STAGES.forEach((_, i) => {
          const sr = r.stages[i];
          const [inS, inE, outS, outE] = STAGE_BANDS[i];
          const t = wordEnvelope(p, inS, inE, outS, outE);
          if (sr.number) sr.number.style.opacity = String(t * 0.08);
          if (sr.name) {
            sr.name.style.opacity = String(t);
            sr.name.style.transform = `translateY(${(1 - t) * 16}px)`;
          }
          if (sr.copy) sr.copy.style.opacity = String(t);
        });

        // DISCOVER(0) -> DEFINE(1): fragments scatter in, then align
        const discoverT = bandIn(p, STAGE_BANDS[0][0], STAGE_BANDS[0][1]);
        const defineT = bandIn(p, STAGE_BANDS[1][0], STAGE_BANDS[1][0] + STAGE_SPAN * 0.6);
        const fragOutT = 1 - bandIn(p, STAGE_BANDS[1][2], STAGE_BANDS[1][3]);
        DISCOVER_FRAGMENTS.forEach((_, i) => {
          const el = r.fragments[i];
          if (!el) return;
          const from = FRAG_SCATTER[i];
          const to = FRAG_ALIGNED[i];
          const top = from.top + (to.top - from.top) * defineT;
          const left = from.left + (to.left - from.left) * defineT;
          const rotate = from.rotate * (1 - defineT);
          el.style.top = `${top}%`;
          el.style.left = `${left}%`;
          el.style.transform = `rotate(${rotate}deg)`;
          el.style.opacity = String(discoverT * fragOutT);
        });

        // DESIGN(2)/BUILD(3): interface elements assemble
        const designT = bandIn(p, STAGE_BANDS[2][0], STAGE_BANDS[2][1]);
        const buildT = bandIn(p, STAGE_BANDS[3][0], STAGE_BANDS[3][0] + STAGE_SPAN * 0.6);
        const ifaceOutT = 1 - bandIn(p, 0.86, 0.9);
        IFACE_TO.forEach((pos, i) => {
          const el = r.ifaceEls[i];
          if (!el) return;
          const from = IFACE_FROM[i];
          const dx = from.x * (1 - buildT);
          const dy = from.y * (1 - buildT);
          el.style.top = `${pos.top}%`;
          el.style.left = `${pos.left}%`;
          el.style.transform = `translate(${dx}%, ${dy}%)`;
          el.style.opacity = String(designT * ifaceOutT);
        });

        // CONNECT(4): chat bubble attaches
        const connectT = bandIn(p, STAGE_BANDS[4][0], STAGE_BANDS[4][1]) * ifaceOutT;
        if (r.bubble) {
          r.bubble.style.opacity = String(connectT);
          r.bubble.style.transform = `translateX(${(1 - connectT) * 10}%)`;
        }

        // LAUNCH(5): the assembled interface pulses/glows
        const launchT = bandIn(p, STAGE_BANDS[5][0], STAGE_BANDS[5][0] + STAGE_SPAN * 0.6);
        IFACE_TO.forEach((_, i) => {
          const el = r.ifaceEls[i];
          if (!el || launchT <= 0) return;
          el.style.filter = `drop-shadow(0 0 ${launchT * 14}px rgba(225,196,122,${launchT * 0.5}))`;
        });

        // EVOLVE(6): satellites drift
        const evolveT = bandIn(p, STAGE_BANDS[6][0], STAGE_BANDS[6][0] + STAGE_SPAN * 0.6) * ifaceOutT;
        DOTS.forEach((_, i) => {
          const el = r.dots[i];
          if (!el) return;
          const wobble = Math.sin(p * 50 + i * 1.8) * 4;
          el.style.opacity = String(evolveT);
          el.style.transform = `translate(${wobble}%, ${wobble * -0.6}%)`;
        });

        // human moment
        const humanLabelT = wordEnvelope(p, 0.88, 0.92, 0.98, 1);
        if (r.humanLabel) r.humanLabel.style.opacity = String(humanLabelT);
        const humanHeadT = bandIn(p, 0.9, 0.95);
        if (r.humanHeadline) {
          r.humanHeadline.style.opacity = String(humanHeadT);
          r.humanHeadline.style.transform = `translateY(${(1 - humanHeadT) * 18}px)`;
        }
        const humanCopyT = bandIn(p, 0.93, 0.98);
        if (r.humanCopy) r.humanCopy.style.opacity = String(humanCopyT);
        const humanImageT = bandIn(p, 0.89, 0.96);
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
        <div ref={(el) => { refs.current.introLabel = el; }} className={styles.introLabel} style={{ opacity: 0 }}>
          {PROCESS_INTRO_LABEL}
        </div>
        <div className={styles.introBlock}>
          <div ref={(el) => { refs.current.introHeadline = el; }} className={styles.introHeadline} style={{ opacity: 0 }}>
            {PROCESS_HEADLINE[0]}
            <br />
            {PROCESS_HEADLINE[1]}
          </div>
          <div ref={(el) => { refs.current.introEmphasis = el; }} className={styles.introEmphasis} style={{ opacity: 0 }}>
            {PROCESS_EMPHASIS}
          </div>
        </div>

        {PROCESS_STAGES.map((stage, i) => (
          <div key={stage.key} className={styles.stage}>
            <div
              ref={(el) => {
                refs.current.stages[i].number = el;
              }}
              className={styles.stageNumber}
            >
              {stage.number}
            </div>
            <div
              ref={(el) => {
                refs.current.stages[i].name = el;
              }}
              className={styles.stageName}
              style={{ opacity: 0 }}
            >
              {stage.name}.
            </div>
            <p
              ref={(el) => {
                refs.current.stages[i].copy = el;
              }}
              className={styles.stageCopy}
              style={{ opacity: 0 }}
            >
              {stage.copy}
            </p>
          </div>
        ))}

        <div className={styles.visual}>
          {DISCOVER_FRAGMENTS.map((frag, i) => (
            <span
              key={frag}
              ref={(el) => {
                refs.current.fragments[i] = el;
              }}
              className={styles.fragment}
              style={{ opacity: 0 }}
            >
              {frag}
            </span>
          ))}

          {IFACE_TO.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                refs.current.ifaceEls[i] = el;
              }}
              className={i === 0 ? styles.ifaceImage : i === 3 ? styles.ifaceBarShort : styles.ifaceBar}
              style={{ opacity: 0 }}
            />
          ))}

          <div ref={(el) => { refs.current.bubble = el; }} className={styles.bubble} style={{ opacity: 0 }}>
            <span className={styles.bubbleWho}>MC AI</span>
            <span className={styles.bubbleText}>Conectado.</span>
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

        <div ref={(el) => { refs.current.progressLine = el; }} className={styles.progressRow} style={{ opacity: 0 }}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
          <div className={styles.progressNums}>
            {PROCESS_STAGES.map((stage, i) => (
              <span
                key={stage.key}
                ref={(el) => {
                  refs.current.progressNums[i] = el;
                }}
                className={styles.progressNum}
              >
                {stage.number}
              </span>
            ))}
          </div>
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
            <div ref={(el) => { refs.current.humanLabel = el; }} className={styles.humanLabel} style={{ opacity: 0 }}>
              {HUMAN_MOMENT_LABEL}
            </div>
            <div ref={(el) => { refs.current.humanHeadline = el; }} className={styles.humanHeadline} style={{ opacity: 0 }}>
              {HUMAN_MOMENT_HEADLINE[0]}
              <br />
              {HUMAN_MOMENT_HEADLINE[1]}
            </div>
            <p ref={(el) => { refs.current.humanCopy = el; }} className={styles.humanCopy} style={{ opacity: 0 }}>
              {HUMAN_MOMENT_COPY}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
