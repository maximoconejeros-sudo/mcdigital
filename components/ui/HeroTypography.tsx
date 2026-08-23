"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./HeroTypography.module.css";

const SECTION_INDEX = ["01", "02", "03", "04", "05", "06", "07", "08"];

/**
 * Act I ("The Signal") copy — rebuilt against HERO_REFERENCE.png. Left
 * territory only (max ~45vw): eyebrow, a six-beat headline with a
 * deliberate per-line color hierarchy (not one uniform uppercase voice),
 * body copy, a bordered primary CTA plus a secondary "ver manifiesto"
 * link. The right edge carries the reference's micro-detail system — a
 * vertical section index and a rotated "desplaza para explorar" — kept
 * extremely subtle so it rewards attention without competing with the
 * headline or the monogram. Everything sits front-layer (z-30, always in
 * front of the transparent canvas), left of the MC's own territory,
 * which starts around 55vw and is never touched by this layer.
 */
export default function HeroTypography({ play }: { play: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        `.${styles.eyebrow} span`,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 }
      )
        .fromTo(
          `.${styles.mainLine} [data-line]`,
          { yPercent: 120, rotateX: 10 },
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.3"
        )
        .fromTo(
          `.${styles.subtext}, .${styles.ctaRow}`,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out", stagger: 0.1 },
          "-=0.55"
        )
        .fromTo(
          `.${styles.indexMark}, .${styles.sideIndex}, .${styles.scrollHint}`,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.9, stagger: 0.08 },
          "-=0.4"
        );
    });

    return () => ctx.revert();
  }, [play]);

  useEffect(() => {
    if (!play) return;
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
      <div className={styles.statementBlock}>
        <div className={styles.eyebrow}>
          <span style={{ opacity: 0 }}>Digital growth studio</span>
          <span style={{ opacity: 0 }}>Santiago — Miami</span>
        </div>

        <h1 ref={mainRef} className={styles.mainLine} style={{ perspective: 700 }}>
          <span className={`line-mask ${styles.lineSmall}`}>
            <span data-line style={{ display: "inline-block" }}>
              Transformamos
            </span>
          </span>
          <span className={`line-mask ${styles.lineSmall}`}>
            <span data-line style={{ display: "inline-block" }}>
              ideas en
            </span>
          </span>
          <span className={`line-mask ${styles.lineBig}`}>
            <span data-line className={styles.wordGold} style={{ display: "inline-block" }}>
              experiencias
            </span>
          </span>
          <span className={`line-mask ${styles.lineBig}`}>
            <span data-line style={{ display: "inline-block" }}>
              digitales
            </span>
          </span>
          <span className={`line-mask ${styles.lineMed}`}>
            <span data-line className={styles.emphasis} style={{ display: "inline-block" }}>
              que hacen crecer
            </span>
          </span>
          <span className={`line-mask ${styles.lineBig}`}>
            <span data-line style={{ display: "inline-block" }}>
              negocios.
            </span>
          </span>
        </h1>

        <p className={styles.subtext} style={{ opacity: 0 }}>
          Diseñamos experiencias web y sistemas inteligentes que convierten
          presencia digital en oportunidades reales.
        </p>

        <div className={styles.ctaRow} style={{ opacity: 0 }}>
          <a href="#servicios" className={styles.ctaPrimary} data-cursor>
            <span>Descubre cómo</span>
            <span aria-hidden>↓</span>
          </a>
          <a href="#manifiesto" className={styles.ctaGhost} data-cursor>
            <span className={styles.playDot} aria-hidden>
              ▶
            </span>
            Ver manifiesto
          </a>
        </div>
      </div>

      <div className={styles.indexMark} style={{ opacity: 0 }}>
        <span className={styles.indexLine} aria-hidden />
        <span>01</span>
      </div>

      <div className={styles.sideIndex} style={{ opacity: 0 }} aria-hidden>
        {SECTION_INDEX.map((n, i) => (
          <span key={n} data-active={i === 0 ? "true" : undefined}>
            {n}
          </span>
        ))}
      </div>

      <a href="#servicios" className={styles.scrollHint} style={{ opacity: 0 }} data-cursor>
        <span className={styles.scrollHintText}>Desplaza para explorar</span>
      </a>
    </div>
  );
}
