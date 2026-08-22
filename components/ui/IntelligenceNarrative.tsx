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
  whatsappSub: HTMLParagraphElement | null;
  headline: HTMLHeadingElement | null;
  sub: HTMLParagraphElement | null;
}

/**
 * Act III — "Intelligence." The digital environment becomes alive:
 * conversations exist as pure kinetic typography at different depths
 * (scale + blur, no chat-bubble UI, no WhatsApp green), each revealing
 * line by line as the user scrolls. One conversation carries the
 * WhatsApp-automation beat — a small label plus a message -> qualification
 * -> response -> action sequence rendered as plain words, not a flowchart.
 * Near the end everything recedes slightly (camera "leaving") while the
 * conversations keep animating behind — the business keeps working.
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

        const recedeT = bandIn(p, 0.85, 1);

        const convBands: [number, number][][] = [
          [
            [0.01, 0.07],
            [0.1, 0.16],
          ],
          [
            [0.22, 0.28],
            [0.3, 0.36],
          ],
          [
            [0.4, 0.46],
            [0.48, 0.54],
          ],
        ];
        CONVERSATIONS.forEach((conv, ci) => {
          const cr = r.conversations[ci];
          if (!cr) return;
          const bands = convBands[ci];
          let rootOpacity = 0;
          cr.lines.forEach((el, li) => {
            if (!el) return;
            const [s, e] = bands[li];
            const t = bandIn(p, s, e);
            el.style.opacity = String(t);
            el.style.transform = `translateY(${(1 - t) * 10}px)`;
            rootOpacity = Math.max(rootOpacity, t);
          });
          if (cr.label) cr.label.style.opacity = String(bandIn(p, bands[0][0], bands[0][1]));
          if (cr.root) {
            const scale = conv.style.scale * (1 - recedeT * 0.12);
            cr.root.style.transform = `scale(${scale})`;
            cr.root.style.opacity = String(rootOpacity * (1 - recedeT * 0.35));
          }
        });

        const stepStart = 0.56;
        const stepWidth = 0.035;
        WHATSAPP_STEPS.forEach((_, i) => {
          const el = r.steps[i];
          if (!el) return;
          const s = stepStart + i * stepWidth;
          const t = bandIn(p, s, s + stepWidth);
          el.style.opacity = String(t);
        });

        const whatsappSubT = bandIn(p, 0.7, 0.76);
        if (r.whatsappSub) {
          r.whatsappSub.style.opacity = String(whatsappSubT);
          r.whatsappSub.style.transform = `translateY(${(1 - whatsappSubT) * 10}px)`;
        }

        const headlineT = bandIn(p, 0.78, 0.88);
        if (r.headline) {
          r.headline.style.opacity = String(headlineT);
          r.headline.style.transform = `translateY(${(1 - headlineT) * 16}px)`;
        }

        const subT = bandIn(p, 0.84, 0.92);
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
                <span className={styles.stepArrow} aria-hidden>
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
