"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LANDING_SERVICE, MOCK_LANDING } from "@/lib/content/expertise";
import styles from "./ExpertiseNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);
const bandIn = (p: number, start: number, end: number) =>
  smooth(clamp01((p - start) / (end - start)));

interface Refs {
  openLabel: HTMLDivElement | null;
  openHeadline: HTMLHeadingElement | null;
  openSub: HTMLParagraphElement | null;
  serviceLabel: HTMLDivElement | null;
  mockFrame: HTMLDivElement | null;
  mockNav: HTMLDivElement | null;
  mockHeadline: HTMLDivElement | null;
  mockImage: HTMLDivElement | null;
  mockCta: HTMLAnchorElement | null;
}

/**
 * Act 02 — Expertise. No 3D objects: the brief is explicit that the
 * impact here comes from typography, layout, and a real interface
 * composition being watched into existence, not abstract geometry. This
 * builds only the opening beat ("WHAT WE CREATE") and the first service,
 * Landing Experiences — a landing-page mockup that assembles piece by
 * piece as the user scrolls, then settles full-bleed. Web Experiences and
 * AI Systems are a follow-up pass.
 */
export default function ExpertiseNarrative({ ready }: { ready: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    openLabel: null,
    openHeadline: null,
    openSub: null,
    serviceLabel: null,
    mockFrame: null,
    mockNav: null,
    mockHeadline: null,
    mockImage: null,
    mockCta: null,
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

        // opening: small label -> huge headline -> spanish subhead, then
        // the whole block recedes as the landing demo takes over
        const openIn = bandIn(p, 0.02, 0.1);
        const openOut = 1 - bandIn(p, 0.16, 0.24);
        const openT = Math.min(openIn, openOut);
        if (r.openLabel) r.openLabel.style.opacity = String(openIn * openOut);
        if (r.openHeadline) {
          r.openHeadline.style.opacity = String(openT);
          r.openHeadline.style.transform = `translateY(${(1 - openIn) * 24}px)`;
        }
        if (r.openSub) r.openSub.style.opacity = String(bandIn(p, 0.06, 0.14) * openOut);

        // landing service label
        const serviceT = bandIn(p, 0.22, 0.3);
        if (r.serviceLabel) {
          r.serviceLabel.style.opacity = String(serviceT);
          r.serviceLabel.style.transform = `translateX(${(1 - serviceT) * -16}px)`;
        }

        // the mock frame itself fades/scales in, then goes full-bleed at the end
        const frameIn = bandIn(p, 0.24, 0.34);
        const frameGrow = bandIn(p, 0.8, 0.96);
        if (r.mockFrame) {
          r.mockFrame.style.opacity = String(frameIn);
          const scale = 0.94 + frameIn * 0.06 + frameGrow * 0.14;
          r.mockFrame.style.transform = `scale(${scale})`;
        }

        const navT = bandIn(p, 0.34, 0.44);
        if (r.mockNav) r.mockNav.style.opacity = String(navT);

        const headlineT = bandIn(p, 0.44, 0.56);
        if (r.mockHeadline) {
          r.mockHeadline.style.opacity = String(headlineT);
          r.mockHeadline.style.transform = `translateY(${(1 - headlineT) * 14}px)`;
        }

        const imageT = bandIn(p, 0.56, 0.7);
        if (r.mockImage) {
          r.mockImage.style.opacity = String(imageT);
          r.mockImage.style.transform = `scale(${0.96 + imageT * 0.04}) translateZ(0)`;
        }

        const ctaT = bandIn(p, 0.7, 0.8);
        if (r.mockCta) {
          r.mockCta.style.opacity = String(ctaT);
          r.mockCta.style.transform = `translateY(${(1 - ctaT) * 10}px)`;
        }
      },
    });

    return () => st.kill();
  }, [ready]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div className={styles.opening}>
          <div
            ref={(el) => {
              refs.current.openLabel = el;
            }}
            className={styles.openLabel}
            style={{ opacity: 0 }}
          >
            02 / Expertise
          </div>
          <h2
            ref={(el) => {
              refs.current.openHeadline = el;
            }}
            className={styles.openHeadline}
            style={{ opacity: 0 }}
          >
            What
            <br />
            we create.
          </h2>
          <p
            ref={(el) => {
              refs.current.openSub = el;
            }}
            className={styles.openSub}
            style={{ opacity: 0 }}
          >
            Experiencias digitales diseñadas para convertir atención en
            crecimiento.
          </p>
        </div>

        <div className={styles.stage}>
          <div
            ref={(el) => {
              refs.current.serviceLabel = el;
            }}
            className={styles.serviceLabel}
            style={{ opacity: 0 }}
          >
            <span className={styles.serviceIndex}>{LANDING_SERVICE.index}</span>
            <span className={styles.serviceName}>{LANDING_SERVICE.label}</span>
            <p className={styles.serviceCopy}>{LANDING_SERVICE.spanish}</p>
          </div>

          <div
            ref={(el) => {
              refs.current.mockFrame = el;
            }}
            className={styles.mockFrame}
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => {
                refs.current.mockNav = el;
              }}
              className={styles.mockNav}
              style={{ opacity: 0 }}
            >
              <span className={styles.mockBrand}>{MOCK_LANDING.brand}</span>
              <div className={styles.mockNavLinks}>
                {MOCK_LANDING.nav.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>

            <div className={styles.mockBody}>
              <div
                ref={(el) => {
                  refs.current.mockHeadline = el;
                }}
                className={styles.mockHeadline}
                style={{ opacity: 0 }}
              >
                {MOCK_LANDING.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>

              <a
                ref={(el) => {
                  refs.current.mockCta = el;
                }}
                className={styles.mockCta}
                style={{ opacity: 0 }}
                tabIndex={-1}
                aria-hidden
              >
                {MOCK_LANDING.cta}
              </a>
            </div>

            <div
              ref={(el) => {
                refs.current.mockImage = el;
              }}
              className={styles.mockImage}
              style={{ opacity: 0 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
