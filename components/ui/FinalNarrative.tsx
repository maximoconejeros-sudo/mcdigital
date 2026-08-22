"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import { CONTACT } from "@/lib/content/contact";
import styles from "./FinalNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);
const bandIn = (p: number, start: number, end: number) =>
  smooth(clamp01((p - start) / (end - start)));

interface Refs {
  label: HTMLDivElement | null;
  headline: HTMLHeadingElement | null;
  subtext: HTMLParagraphElement | null;
  cta: HTMLAnchorElement | null;
  contactRow: HTMLDivElement | null;
}

/**
 * Act IX — the final CTA. Darkness returns, the particle field converges
 * back into the monogram (WebGL side, see FinalExperience), and the copy
 * stacks in on top of it in the same continuous-progress envelope style as
 * every earlier act. Being the last section, its layer is never re-hidden
 * once revealed — there's no next act for it to hand off to, so it just
 * holds as the page's resting frame.
 */
export default function FinalNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    label: null,
    headline: null,
    subtext: null,
    cta: null,
    contactRow: null,
  });
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        // sticky "entered" state: being the last act, reaching its end is
        // just the bottom of the page, not a handoff to hide for — so both
        // the DOM layer and the WebGL Canvas (mounted via onActiveChange)
        // stay up once we've arrived (self.isActive going false right at
        // "end" must not tear them down), and only come back down if the
        // user scrolls back up above the very start of the section.
        const shouldShow = self.isActive || self.progress > 0;
        if (shouldShow !== wasActive.current) {
          wasActive.current = shouldShow;
          onActiveChange?.(shouldShow);
          if (layer.current) {
            layer.current.style.opacity = shouldShow ? "1" : "0";
            layer.current.style.visibility = shouldShow ? "visible" : "hidden";
          }
        }

        const p = self.progress;
        scrollState.act9Progress = p;
        const r = refs.current;

        const labelT = bandIn(p, 0.04, 0.14);
        if (r.label) {
          r.label.style.opacity = String(labelT);
          r.label.style.transform = `translateY(${(1 - labelT) * 16}px)`;
        }

        const headlineT = bandIn(p, 0.12, 0.34);
        if (r.headline) {
          r.headline.style.opacity = String(headlineT);
          r.headline.style.transform = `translateY(${(1 - headlineT) * 30}px)`;
        }

        const subtextT = bandIn(p, 0.3, 0.42);
        if (r.subtext) {
          r.subtext.style.opacity = String(subtextT);
          r.subtext.style.transform = `translateY(${(1 - subtextT) * 16}px)`;
        }

        const ctaT = bandIn(p, 0.4, 0.56);
        if (r.cta) {
          r.cta.style.opacity = String(ctaT);
          r.cta.style.transform = `translateY(${(1 - ctaT) * 20}px) scale(${
            0.96 + ctaT * 0.04
          })`;
          r.cta.style.pointerEvents = ctaT > 0.5 ? "auto" : "none";
        }

        const contactT = bandIn(p, 0.54, 0.7);
        if (r.contactRow) {
          r.contactRow.style.opacity = String(contactT);
          r.contactRow.style.transform = `translateY(${(1 - contactT) * 16}px)`;
          r.contactRow.style.pointerEvents = contactT > 0.5 ? "auto" : "none";
        }
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} id="contact" />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div
          ref={(el) => {
            refs.current.label = el;
          }}
          className={styles.label}
          style={{ opacity: 0 }}
        >
          <span className="label">Let&rsquo;s build.</span>
        </div>

        <h2
          ref={(el) => {
            refs.current.headline = el;
          }}
          className={styles.headline}
          style={{ opacity: 0 }}
        >
          Make your business
          <br />
          work smarter.
        </h2>

        <p
          ref={(el) => {
            refs.current.subtext = el;
          }}
          className={styles.subtext}
          style={{ opacity: 0 }}
        >
          ¿Listo para llevar tu negocio al siguiente nivel?
        </p>

        <a
          ref={(el) => {
            refs.current.cta = el;
          }}
          className={styles.cta}
          href={CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Escríbenos"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <span className={styles.ctaText}>
            <span className={styles.ctaBase} aria-hidden>
              ESCRÍBENOS&nbsp;↗
            </span>
            <span className={styles.ctaGold}>ESCRÍBENOS&nbsp;↗</span>
          </span>
        </a>

        <div
          ref={(el) => {
            refs.current.contactRow = el;
          }}
          className={styles.contactRow}
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
          >
            WhatsApp
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
          >
            {CONTACT.instagramHandle}
          </a>
          <a href={`mailto:${CONTACT.email}`} data-cursor>
            {CONTACT.email}
          </a>
        </div>
      </div>
    </>
  );
}
