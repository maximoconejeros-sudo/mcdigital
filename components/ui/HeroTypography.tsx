"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./HeroTypography.module.css";

/**
 * Act I ("The Signal") copy — Spanish-primary per the V7 language system
 * (major creative statements in Spanish now; English stays only for
 * metadata like the eyebrow). A two-beat statement: a small ownable claim
 * appears first and holds, then recedes as the real headline takes over
 * in the same spot, mixing grotesk with a serif-italic emphasis phrase
 * for typographic rhythm rather than one uniform uppercase voice.
 * Everything sits front-layer (z-30, always in front of the transparent
 * canvas) — the aggressive crop already gives the object most of the
 * frame, so legibility matters more here than a depth trick.
 */
export default function HeroTypography({ play }: { play: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        smallRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }
      )
        .to(smallRef.current, { autoAlpha: 0, y: -10, duration: 0.6, ease: "power2.in" }, "+=0.9")
        .fromTo(
          `.${styles.mainLine} [data-line]`,
          { yPercent: 120, rotateX: 10 },
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.05,
            ease: "expo.out",
            stagger: 0.09,
          },
          "-=0.15"
        )
        .fromTo(
          `.${styles.spanishSub}, .${styles.eyebrow}, .${styles.bottomLeft} .label`,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          `.${styles.ctaRow}`,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          `.${styles.scrollHint}`,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, [play]);

  useEffect(() => {
    if (!play) return;
    // "ENTER" hint disappears permanently after the first real scroll —
    // no generic scroll-hint-that-lingers-forever
    let dismissed = false;
    const onScroll = () => {
      if (dismissed || window.scrollY < 4) return;
      dismissed = true;
      gsap.to(`.${styles.scrollHint}`, { autoAlpha: 0, duration: 0.5 });
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [play]);

  return (
    <div ref={rootRef} className={styles.front} data-hero-front>
      <div className={styles.topRow}>
        <p className={`label ${styles.eyebrow}`} style={{ opacity: 0 }}>
          Digital growth studio
        </p>
      </div>

      <div className={styles.statementBlock}>
        <div ref={smallRef} className={styles.smallStatement} style={{ opacity: 0 }}>
          Tu negocio
          <br />
          ya existe.
        </div>

        <h1 ref={mainRef} className={styles.mainLine} style={{ perspective: 700 }}>
          <span className="line-mask">
            <span data-line style={{ display: "inline-block" }}>
              Transformamos ideas
            </span>
          </span>
          <span className="line-mask">
            <span data-line style={{ display: "inline-block" }}>
              en experiencias digitales
            </span>
          </span>
          <span className="line-mask">
            <span data-line style={{ display: "inline-block" }}>
              <em className={styles.emphasis}>que hacen crecer</em> negocios.
            </span>
          </span>
        </h1>

        <p className={styles.spanishSub} style={{ opacity: 0 }}>
          Diseñamos experiencias web y sistemas inteligentes que convierten
          presencia digital en oportunidades reales.
        </p>

        <div className={styles.ctaRow} style={{ opacity: 0 }}>
          <a href="#servicios" className={styles.ctaSecondary} data-cursor>
            Hablemos ↗
          </a>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomLeft}>
          <p className="label" style={{ opacity: 0 }}>
            Santiago — Miami
          </p>
        </div>

        <a href="#servicios" className={styles.scrollHint} style={{ opacity: 0 }} data-cursor>
          <span className="label">Descubre cómo</span>
          <span className={styles.scrollArrow} aria-hidden>
            ↓
          </span>
        </a>
      </div>
    </div>
  );
}
