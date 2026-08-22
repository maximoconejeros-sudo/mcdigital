"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  CONVERSATIONS,
  WHATSAPP_STEPS,
  INTELLIGENCE_HEADLINE,
  INTELLIGENCE_EMPHASIS,
  INTELLIGENCE_SUB,
  WHATSAPP_SUB,
} from "@/lib/content/intelligence";
import styles from "./IntelligenceNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);
const bandIn = (p: number, start: number, end: number) =>
  smooth(clamp01((p - start) / (end - start)));

interface ConvRefs {
  root: HTMLDivElement | null;
  lines: (HTMLDivElement | null)[];
  label: HTMLSpanElement | null;
}

interface Refs {
  badge: HTMLDivElement | null;
  conversations: ConvRefs[];
  steps: (HTMLSpanElement | null)[];
  arrows: (HTMLSpanElement | null)[];
  whatsappSub: HTMLParagraphElement | null;
  headline: HTMLHeadingElement | null;
  sub: HTMLParagraphElement | null;
}

// each conversation gets its own dominance window [riseStart, riseEnd,
// recedeStart, recedeEnd] — sequential, not simultaneous: only one is ever
// at full scale/opacity/focus at a time. After its window it settles to a
// dim, blurred, smaller "background" state (never fully gone) rather than
// disappearing, until the final outward push clears the stage entirely.
const DOM_BANDS: [number, number, number, number][] = [
  [0.02, 0.08, 0.16, 0.22],
  [0.22, 0.28, 0.4, 0.46],
  [0.4, 0.46, 0.62, 0.68],
];
const LINE_BANDS: [number, number][][] = [
  [
    [0.02, 0.07],
    [0.1, 0.15],
  ],
  [
    [0.22, 0.27],
    [0.3, 0.35],
  ],
  [
    [0.4, 0.45],
    [0.48, 0.53],
  ],
];
// where each receded conversation drifts once the final push clears the
// stage for the headline — conv0 further upper-left, conv1 upper-right,
// conv2 lower-left, per V9's explicit exit directions
const OUTWARD = [
  { x: -70, y: -50 },
  { x: 70, y: -40 },
  { x: -50, y: 55 },
];
const RECEDE_FLOOR = 0.3;

/**
 * Act III — "Intelligence." The digital environment becomes alive: three
 * conversations take turns being the dominant, sharp, full-scale focus —
 * never simultaneously competing — each settling into a smaller, blurred,
 * dimmed "background" state (not gone) once its turn passes. A gold pulse
 * on each MC AI line stands in for "response sent" (no particles, no
 * network graphic). The WhatsApp automation flow (mensaje -> calificación
 * -> respuesta -> acción) appears attached to the third conversation as it
 * holds focus. Before the closing statement reveals, all three are pushed
 * further outward and dimmed well below reading contrast, so the headline
 * always has a completely clean zone — no text or conversation behind it.
 */
export default function IntelligenceNarrative({
  ready,
}: {
  ready: boolean;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    badge: null,
    conversations: CONVERSATIONS.map(() => ({
      root: null,
      lines: [null, null],
      label: null,
    })),
    steps: WHATSAPP_STEPS.map(() => null),
    arrows: WHATSAPP_STEPS.map(() => null),
    whatsappSub: null,
    headline: null,
    sub: null,
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
        if (self.isActive) scrollState.navTheme = "graphite";
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

        const badgeT = bandIn(p, 0.0, 0.04);
        if (r.badge) r.badge.style.opacity = String(badgeT);

        // final outward push — clears the whole stage before the headline,
        // per V9: no conversation may still be legible behind the statement
        const pushT = bandIn(p, 0.72, 0.8);
        const endRecedeT = bandIn(p, 0.85, 1);

        CONVERSATIONS.forEach((conv, ci) => {
          const cr = r.conversations[ci];
          if (!cr) return;
          const [inS, inE, outS, outE] = DOM_BANDS[ci];
          const lineBands = LINE_BANDS[ci];

          const rise = bandIn(p, inS, inE);
          const fall = bandIn(p, outS, outE);
          // 1 while this conversation holds focus, settling to a dim
          // RECEDE_FLOOR afterward rather than vanishing
          const opacity = rise * (1 - fall * (1 - RECEDE_FLOOR)) * (1 - pushT * 0.5) * (1 - endRecedeT * 0.4);
          // 1 only during this conversation's own dominant hold — drives
          // sharpness/scale so exactly one conversation is ever in focus
          const dominance = rise * (1 - fall);

          cr.lines.forEach((el, li) => {
            if (!el) return;
            const [s, e] = lineBands[li];
            const t = bandIn(p, s, e);
            el.style.opacity = String(t);
            el.style.transform = `translateY(${(1 - t) * 10}px)`;
          });
          if (cr.label) cr.label.style.opacity = String(bandIn(p, lineBands[0][0], lineBands[0][1]));

          if (cr.root) {
            const scale = gsap.utils.interpolate(conv.style.scale, 1, dominance) * (1 - endRecedeT * 0.1);
            const blur = conv.style.blur * (1 - dominance);
            const drift = -22 * fall; // settles slightly left/back once its turn passes
            const outX = OUTWARD[ci].x * pushT;
            const outY = OUTWARD[ci].y * pushT;
            cr.root.style.transform = `translate(${drift + outX}px, ${outY}px) scale(${scale})`;
            cr.root.style.filter = blur > 0.01 ? `blur(${blur}px)` : "none";
            cr.root.style.opacity = String(opacity);
          }
        });

        // the process flow is attached to conversation 3 (WhatsApp) as it
        // holds focus — each arrow only appears once both steps around it
        // are visible, so it always reads as a real connected sequence
        const stepStart = 0.56;
        const stepWidth = 0.03;
        WHATSAPP_STEPS.forEach((_, i) => {
          const el = r.steps[i];
          const s = stepStart + i * stepWidth;
          const t = bandIn(p, s, s + stepWidth);
          if (el) el.style.opacity = String(t);
          const arrow = r.arrows[i];
          if (arrow) {
            const next = bandIn(p, s + stepWidth, s + stepWidth * 2);
            arrow.style.opacity = String(Math.min(t, next + 0.15));
          }
        });

        const whatsappSubT = bandIn(p, 0.68, 0.74);
        if (r.whatsappSub) {
          r.whatsappSub.style.opacity = String(whatsappSubT * (1 - pushT));
          r.whatsappSub.style.transform = `translateY(${(1 - whatsappSubT) * 10}px)`;
        }

        const headlineT = bandIn(p, 0.8, 0.9);
        if (r.headline) {
          r.headline.style.opacity = String(headlineT);
          r.headline.style.transform = `translateY(${(1 - headlineT) * 16}px)`;
        }

        const subT = bandIn(p, 0.86, 0.93);
        if (r.sub) {
          r.sub.style.opacity = String(subT);
          r.sub.style.transform = `translateY(${(1 - subT) * 10}px)`;
        }
      },
    });

    return () => st.kill();
  }, [ready]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div className={styles.bgGrid} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.bgWord} aria-hidden>
          Conecta
        </div>

        <div ref={(el) => { refs.current.badge = el; }} className={styles.badge} style={{ opacity: 0 }}>
          <span className={styles.badgeDot} />
          Active / 24H
        </div>

        {CONVERSATIONS.map((conv, ci) => (
          <div
            key={ci}
            ref={(el) => {
              refs.current.conversations[ci].root = el;
            }}
            className={styles.conversation}
            style={{
              top: conv.style.top,
              bottom: conv.style.bottom,
              left: conv.style.left,
              right: conv.style.right,
              filter: conv.style.blur ? `blur(${conv.style.blur}px)` : undefined,
              opacity: 0,
            }}
          >
            {conv.whatsapp && (
              <span
                ref={(el) => {
                  refs.current.conversations[ci].label = el;
                }}
                className={styles.whatsappLabel}
                style={{ opacity: 0 }}
              >
                WhatsApp
              </span>
            )}
            {conv.lines.map((line, li) => (
              <div
                key={li}
                ref={(el) => {
                  refs.current.conversations[ci].lines[li] = el;
                }}
                className={`${styles.line} ${line.who === "MC AI" ? styles.lineAI : styles.lineClient}`}
                style={{ opacity: 0 }}
              >
                <span className={styles.who}>{line.who}</span>
                <span className={styles.text}>{line.text}</span>
              </div>
            ))}
          </div>
        ))}

        <div className={styles.stepsRow}>
          {WHATSAPP_STEPS.map((step, i) => (
            <span key={step} className={styles.stepGroup}>
              <span
                ref={(el) => {
                  refs.current.steps[i] = el;
                }}
                className={styles.step}
                style={{ opacity: 0 }}
              >
                {step}
              </span>
              {i < WHATSAPP_STEPS.length - 1 && (
                <span
                  ref={(el) => {
                    refs.current.arrows[i] = el;
                  }}
                  className={styles.stepArrow}
                  style={{ opacity: 0 }}
                  aria-hidden
                >
                  →
                </span>
              )}
            </span>
          ))}
        </div>

        <p
          ref={(el) => {
            refs.current.whatsappSub = el;
          }}
          className={styles.whatsappSub}
          style={{ opacity: 0 }}
        >
          {WHATSAPP_SUB}
        </p>

        <div className={styles.footer}>
          <h2
            ref={(el) => {
              refs.current.headline = el;
            }}
            className={styles.headline}
            style={{ opacity: 0 }}
          >
            {INTELLIGENCE_HEADLINE[0]}
            <br />
            {INTELLIGENCE_HEADLINE[1]}{" "}
            <em className={styles.emphasis}>{INTELLIGENCE_EMPHASIS}</em>
          </h2>
          <p
            ref={(el) => {
              refs.current.sub = el;
            }}
            className={styles.sub}
            style={{ opacity: 0 }}
          >
            {INTELLIGENCE_SUB}
          </p>
        </div>
      </div>
    </>
  );
}
