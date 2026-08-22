"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import { CONTACT } from "@/lib/content/contact";
import styles from "./FinalNarrative.module.css";

// only real, confirmed contact channels render here — see lib/content/contact.ts

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
  glow: HTMLDivElement | null;
  shadow: HTMLDivElement | null;
  brandName: HTMLDivElement | null;
  brandSub: HTMLDivElement | null;
  brandLocation: HTMLDivElement | null;
  brandServices: HTMLDivElement | null;
  goldLine: HTMLDivElement | null;
}

/**
 * Act VII — Contact, closing in three beats within one continuous scroll:
 * (1) the CTA content, gold lines reconstructing into the MC monogram huge
 * and cropped off the right edge (WebGL side, see FinalExperience/
 * FinalSculpture) — never a return to black, warm-white/champagne
 * throughout; (2) once that content clears, a closing brand moment — the
 * monogram drifts back to dead center as the camera pulls away and the
 * background warms further toward near-white, holding on MC DIGITAL® /
 * Digital growth studio / Santiago — Miami / Web · Landing Pages · AI &
 * Automation as the site's final brand shot; (3) a gold line grows from
 * center and the whole layer fades, handing off to the real footer that
 * follows in normal document flow right after this component's spacer —
 * this used to be the literal end of the page, which read as an abrupt
 * cut; it no longer is.
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
    glow: null,
    shadow: null,
    brandName: null,
    brandSub: null,
    brandLocation: null,
    brandServices: null,
    goldLine: null,
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
            layer.current.style.visibility = shouldShow ? "visible" : "hidden";
          }
        }

        const p = self.progress;
        scrollState.act9Progress = p;
        if (shouldShow) scrollState.navTheme = "light";
        const r = refs.current;

        // everything the CTA content does happens in the first ~40% of
        // this now-longer scroll, then clears completely before the brand
        // moment — contentOutT drives that clearing
        const contentOutT = bandIn(p, 0.4, 0.48);
        const contentMul = 1 - contentOutT;

        const labelT = bandIn(p, 0.02, 0.08) * contentMul;
        if (r.label) {
          r.label.style.opacity = String(labelT);
          r.label.style.transform = `translateY(${(1 - labelT) * 16}px)`;
        }

        const headlineT = bandIn(p, 0.06, 0.18) * contentMul;
        if (r.headline) {
          r.headline.style.opacity = String(headlineT);
          r.headline.style.transform = `translateY(${(1 - headlineT) * 30}px)`;
        }

        const subtextT = bandIn(p, 0.16, 0.22) * contentMul;
        if (r.subtext) {
          r.subtext.style.opacity = String(subtextT);
          r.subtext.style.transform = `translateY(${(1 - subtextT) * 16}px)`;
        }

        const ctaT = bandIn(p, 0.2, 0.28) * contentMul;
        if (r.cta) {
          r.cta.style.opacity = String(ctaT);
          r.cta.style.transform = `translateY(${(1 - ctaT) * 20}px) scale(${
            0.96 + ctaT * 0.04
          })`;
          r.cta.style.pointerEvents = ctaT > 0.5 ? "auto" : "none";
        }

        const contactT = bandIn(p, 0.27, 0.35) * contentMul;
        if (r.contactRow) {
          r.contactRow.style.opacity = String(contactT);
          r.contactRow.style.transform = `translateY(${(1 - contactT) * 16}px)`;
          r.contactRow.style.pointerEvents = contactT > 0.5 ? "auto" : "none";
        }

        // closing brand moment — the monogram (WebGL) drifts back to
        // center and the camera pulls back as this rises; consumed by
        // FinalSculpture/FinalCameraRig every frame
        const brandT = bandIn(p, 0.44, 0.56);
        scrollState.act9BrandT = brandT;

        // base translate(-50%,-50%) centers each on its own left/top anchor
        // (set in CSS) — included here too since this overwrites the whole
        // transform property every frame
        const glowShift = (1 - brandT) * 14;
        if (r.glow) r.glow.style.transform = `translate(-50%, -50%) translateX(${glowShift}%)`;
        if (r.shadow) r.shadow.style.transform = `translate(-50%, -50%) translateX(${glowShift}%)`;

        const finalFadeT = bandIn(p, 0.95, 1);
        const brandMul = 1 - finalFadeT;

        const brandNameT = bandIn(p, 0.5, 0.56) * brandMul;
        if (r.brandName) {
          r.brandName.style.opacity = String(brandNameT);
          r.brandName.style.transform = `translateY(${(1 - brandNameT) * 12}px)`;
        }
        const brandSubT = bandIn(p, 0.53, 0.59) * brandMul;
        if (r.brandSub) r.brandSub.style.opacity = String(brandSubT);
        const brandLocationT = bandIn(p, 0.56, 0.62) * brandMul;
        if (r.brandLocation) r.brandLocation.style.opacity = String(brandLocationT);
        const brandServicesT = bandIn(p, 0.59, 0.65) * brandMul;
        if (r.brandServices) r.brandServices.style.opacity = String(brandServicesT);

        // the gold line that hands off to the footer — grows from center,
        // then the whole layer fades to reveal the real footer beneath
        const goldLineT = bandIn(p, 0.88, 0.97);
        if (r.goldLine) {
          r.goldLine.style.opacity = String(goldLineT * brandMul);
          r.goldLine.style.transform = `translateX(-50%) scaleX(${goldLineT})`;
        }

        if (layer.current) layer.current.style.opacity = String(1 - finalFadeT);
        // the WebGL Canvas rendering the monogram lives in a separate fixed
        // div in page.tsx (z-20, not this z-35 DOM layer) — it polls this
        // for its own opacity so the 3D MC actually disappears too, not
        // just the text, once the footer should be showing through
        scrollState.act9FadeT = finalFadeT;
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} id="contact" />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        {/* replaces the old particle field per V9: a sophisticated, very
            subtle radial glow + soft contact shadow, not sparkles */}
        <div ref={(el) => { refs.current.glow = el; }} className={styles.glow} aria-hidden />
        <div ref={(el) => { refs.current.shadow = el; }} className={styles.shadow} aria-hidden />

        <div
          ref={(el) => {
            refs.current.label = el;
          }}
          className={styles.label}
          style={{ opacity: 0 }}
        >
          <span className="label">Tu próxima experiencia digital puede empezar aquí</span>
        </div>

        <h2
          ref={(el) => {
            refs.current.headline = el;
          }}
          className={styles.headline}
          style={{ opacity: 0 }}
        >
          Hagamos algo
          <br />
          inolvidable.
        </h2>

        <p
          ref={(el) => {
            refs.current.subtext = el;
          }}
          className={styles.subtext}
          style={{ opacity: 0 }}
        >
          Cuéntanos sobre tu proyecto. Te respondemos directamente, sin
          formularios eternos.
        </p>

        <a
          ref={(el) => {
            refs.current.cta = el;
          }}
          className={styles.cta}
          href={CONTACT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Escríbenos"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <span className={styles.ctaText}>
            <span className={styles.ctaBase} aria-hidden>
              HABLEMOS&nbsp;↗
            </span>
            <span className={styles.ctaGold}>HABLEMOS&nbsp;↗</span>
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
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
          >
            {CONTACT.instagramHandle}
          </a>
          <a href="#top" data-cursor>
            Volver arriba ↑
          </a>
        </div>

        {/* the closing brand moment — the site's final shot, held once the
            CTA content has cleared and the monogram has recentered */}
        <div className={styles.brandBlock}>
          <div
            ref={(el) => {
              refs.current.brandName = el;
            }}
            className={styles.brandName}
            style={{ opacity: 0 }}
          >
            MC DIGITAL®
          </div>
          <div
            ref={(el) => {
              refs.current.brandSub = el;
            }}
            className={styles.brandSub}
            style={{ opacity: 0 }}
          >
            Digital growth studio
          </div>
          <div
            ref={(el) => {
              refs.current.brandLocation = el;
            }}
            className={styles.brandLocation}
            style={{ opacity: 0 }}
          >
            Santiago — Miami
          </div>
          <div
            ref={(el) => {
              refs.current.brandServices = el;
            }}
            className={styles.brandServices}
            style={{ opacity: 0 }}
          >
            Web · Landing Pages · AI &amp; Automation
          </div>
        </div>

        <div
          ref={(el) => {
            refs.current.goldLine = el;
          }}
          className={styles.goldLine}
          aria-hidden
        />
      </div>
    </>
  );
}
