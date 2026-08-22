"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  AI_HEADLINE,
  AI_EMPHASIS,
  AI_BODY,
  AI_STATUS,
  CAPABILITIES,
  CHAT_MESSAGES,
  SYSTEM_PANEL_LABEL,
  SYSTEM_PANEL_ROWS,
  CLOSING_HEADLINE,
  CLOSING_EMPHASIS,
} from "@/lib/content/intelligence";
import styles from "./IntelligenceNarrative.module.css";

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

interface MessageRefs {
  root: HTMLDivElement | null;
}

interface Refs {
  badge: HTMLDivElement | null;
  leftHeadline: HTMLHeadingElement | null;
  leftEmphasis: HTMLDivElement | null;
  leftBody: HTMLParagraphElement | null;
  capabilities: (HTMLSpanElement | null)[];
  capabilityLine: HTMLDivElement | null;
  phone: HTMLDivElement | null;
  messageList: HTMLDivElement | null;
  messages: MessageRefs[];
  typing: (HTMLDivElement | null)[];
  systemPanel: HTMLDivElement | null;
  systemRows: (HTMLDivElement | null)[];
  closingHeadline: HTMLHeadingElement | null;
  closingEmphasis: HTMLDivElement | null;
}

// each message's own reveal band [start, end]; typing indicators sit in
// the gap right before each MC AI reply
const MESSAGE_BANDS: [number, number][] = [
  [0.1, 0.15],
  [0.18, 0.24],
  [0.26, 0.3],
  [0.33, 0.4],
  [0.42, 0.46],
  [0.49, 0.55],
];
const TYPING_BANDS: [number, number][] = [
  [0.15, 0.18],
  [0.3, 0.33],
  [0.46, 0.49],
];
// which message reveal unlocks each of the first three capabilities on the
// left process line — a typing indicator precedes each of these MC AI
// replies. DERIVA has no chat message of its own — it activates with the
// system panel (lead handed off), so it's looked up separately below.
const CAPABILITY_AT_MESSAGE = [1, 3, 5];
const DERIVA_BAND_START = 0.58;

/**
 * Act III — "Intelligence." One premium WhatsApp-style chat experience —
 * not scattered floating conversations. Left: what the agent does, plus a
 * capability line (Responde/Califica/Agenda/Deriva) that lights up in sync
 * with the conversation on the right. The conversation builds message by
 * message with typing indicators between replies; a small system panel
 * (lead detected / intención / horario / estado) appears beside it once
 * qualified. At the end the phone shifts right and a closing statement
 * takes the vacated space — the phone stays visible, nothing scatters
 * behind the headline.
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
    leftHeadline: null,
    leftEmphasis: null,
    leftBody: null,
    capabilities: CAPABILITIES.map(() => null),
    capabilityLine: null,
    phone: null,
    messageList: null,
    messages: CHAT_MESSAGES.map(() => ({ root: null })),
    typing: TYPING_BANDS.map(() => null),
    systemPanel: null,
    systemRows: SYSTEM_PANEL_ROWS.map(() => null),
    closingHeadline: null,
    closingEmphasis: null,
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

        const exitT = bandIn(p, 0.68, 0.76);

        const badgeT = bandIn(p, 0.0, 0.04) * (1 - exitT);
        if (r.badge) r.badge.style.opacity = String(badgeT);

        const leftT = bandIn(p, 0.02, 0.08) * (1 - exitT);
        if (r.leftHeadline) {
          r.leftHeadline.style.opacity = String(leftT);
          r.leftHeadline.style.transform = `translateY(${(1 - leftT) * 16}px)`;
        }
        if (r.leftEmphasis) r.leftEmphasis.style.opacity = String(leftT);
        const bodyT = bandIn(p, 0.05, 0.1) * (1 - exitT);
        if (r.leftBody) r.leftBody.style.opacity = String(bodyT);

        const lineT = bandIn(p, 0.06, 0.1) * (1 - exitT);
        if (r.capabilityLine) r.capabilityLine.style.opacity = String(lineT);
        CAPABILITIES.forEach((_, i) => {
          const el = r.capabilities[i];
          if (!el) return;
          const msgIdx = CAPABILITY_AT_MESSAGE[i];
          const s = msgIdx !== undefined ? MESSAGE_BANDS[msgIdx][0] : DERIVA_BAND_START;
          const active = bandIn(p, s, s + 0.02);
          el.style.color = active > 0.5 || p > s ? "var(--color-champagne-gold)" : "var(--color-graphite-light)";
          el.style.opacity = String(0.55 + active * 0.45);
        });

        const phoneT = bandIn(p, 0.06, 0.11);
        // shifts right and settles slightly smaller for the closing beat
        const exitShift = exitT * 14;
        const exitScale = 1 - exitT * 0.08;
        if (r.phone) {
          r.phone.style.opacity = String(phoneT);
          r.phone.style.transform = `translateX(${exitShift}%) scale(${exitScale})`;
        }

        let visibleCount = 0;
        CHAT_MESSAGES.forEach((_, i) => {
          const mr = r.messages[i];
          const [s, e] = MESSAGE_BANDS[i];
          const t = bandIn(p, s, e);
          if (t > 0.5) visibleCount = i + 1;
          if (mr.root) {
            mr.root.style.opacity = String(t);
            mr.root.style.transform = `translateY(${(1 - t) * 10}px)`;
          }
        });
        // auto-scroll once more than 3 messages have accumulated —
        // approximates a real chat window scrolling to the latest message
        if (r.messageList) {
          const scrollSteps = Math.max(0, visibleCount - 3);
          r.messageList.style.transform = `translateY(${-scrollSteps * 74}px)`;
        }

        TYPING_BANDS.forEach(([s, e], i) => {
          const el = r.typing[i];
          if (!el) return;
          el.style.opacity = String(wordEnvelope(p, s, s + 0.01, e - 0.01, e));
        });

        const systemT = wordEnvelope(p, 0.56, 0.62, 0.68, 0.74);
        if (r.systemPanel) {
          r.systemPanel.style.opacity = String(systemT);
          r.systemPanel.style.transform = `translateX(${(1 - systemT) * 12}px)`;
        }
        SYSTEM_PANEL_ROWS.forEach((_, i) => {
          const el = r.systemRows[i];
          if (!el) return;
          el.style.opacity = String(wordEnvelope(p, 0.58 + i * 0.02, 0.62 + i * 0.02, 0.68, 0.74));
        });

        const closingT = bandIn(p, 0.78, 0.9);
        if (r.closingHeadline) {
          r.closingHeadline.style.opacity = String(closingT);
          r.closingHeadline.style.transform = `translateY(${(1 - closingT) * 20}px)`;
        }
        const closingEmphT = bandIn(p, 0.84, 0.94);
        if (r.closingEmphasis) r.closingEmphasis.style.opacity = String(closingEmphT);
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
          {AI_STATUS}
        </div>

        <div className={styles.left}>
          <h2
            ref={(el) => {
              refs.current.leftHeadline = el;
            }}
            className={styles.leftHeadline}
            style={{ opacity: 0 }}
          >
            {AI_HEADLINE[0]}
            <br />
            {AI_HEADLINE[1]}
          </h2>
          <div
            ref={(el) => {
              refs.current.leftEmphasis = el;
            }}
            className={styles.leftEmphasis}
            style={{ opacity: 0 }}
          >
            {AI_EMPHASIS}
          </div>
          <p
            ref={(el) => {
              refs.current.leftBody = el;
            }}
            className={styles.leftBody}
            style={{ opacity: 0 }}
          >
            {AI_BODY}
          </p>

          <div
            ref={(el) => {
              refs.current.capabilityLine = el;
            }}
            className={styles.capabilityLine}
            style={{ opacity: 0 }}
          >
            {CAPABILITIES.map((cap, i) => (
              <span key={cap} className={styles.capabilityGroup}>
                <span
                  ref={(el) => {
                    refs.current.capabilities[i] = el;
                  }}
                  className={styles.capability}
                >
                  {cap}
                </span>
                {i < CAPABILITIES.length - 1 && (
                  <span className={styles.capabilityArrow} aria-hidden>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.phoneOuter}>
        <div
          ref={(el) => {
            refs.current.phone = el;
          }}
          className={styles.phone}
          style={{ opacity: 0 }}
        >
          <div className={styles.phoneHeader}>
            <span className={styles.phoneHeaderName}>MC AI</span>
            <span className={styles.phoneHeaderStatus}>
              <span className={styles.badgeDot} /> disponible
            </span>
          </div>

          <div className={styles.phoneWindow}>
            <div
              ref={(el) => {
                refs.current.messageList = el;
              }}
              className={styles.messageList}
            >
              {CHAT_MESSAGES.map((msg, i) => {
                const typingIdx = CAPABILITY_AT_MESSAGE.indexOf(i);
                return (
                <div key={i} className={styles.messageSlot}>
                  {typingIdx >= 0 && (
                    <div
                      ref={(el) => {
                        refs.current.typing[typingIdx] = el;
                      }}
                      className={styles.typingIndicator}
                      style={{ opacity: 0 }}
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                  <div
                    ref={(el) => {
                      refs.current.messages[i].root = el;
                    }}
                    className={`${styles.message} ${msg.who === "MC AI" ? styles.messageAI : styles.messageClient}`}
                    style={{ opacity: 0 }}
                  >
                    {msg.lines.map((line, li) => (
                      <span key={li} className={styles.messageLine}>
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div
            ref={(el) => {
              refs.current.systemPanel = el;
            }}
            className={styles.systemPanel}
            style={{ opacity: 0 }}
          >
            <span className={styles.systemLabel}>{SYSTEM_PANEL_LABEL}</span>
            {SYSTEM_PANEL_ROWS.map(([key, value], i) => (
              <div
                key={key}
                ref={(el) => {
                  refs.current.systemRows[i] = el;
                }}
                className={styles.systemRow}
                style={{ opacity: 0 }}
              >
                <span className={styles.systemKey}>{key}</span>
                <span className={styles.systemValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className={styles.closing}>
          <h2
            ref={(el) => {
              refs.current.closingHeadline = el;
            }}
            className={styles.closingHeadline}
            style={{ opacity: 0 }}
          >
            {CLOSING_HEADLINE[0]}
            <br />
            {CLOSING_HEADLINE[1]}
          </h2>
          <div
            ref={(el) => {
              refs.current.closingEmphasis = el;
            }}
            className={styles.closingEmphasis}
            style={{ opacity: 0 }}
          >
            {CLOSING_EMPHASIS}
          </div>
        </div>
      </div>
    </>
  );
}
