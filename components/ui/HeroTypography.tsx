"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrollState } from "@/lib/animation/scroll-store";
import styles from "./HeroTypography.module.css";

const SECTION_INDEX = ["01", "02", "03", "04", "05", "06", "07", "08"];

// Mirrors MSculpture's own hero-window band fractions (20/45/70% of the
// ~0.32 visible-scroll window) so the headline's own scroll exit stays in
// lockstep with the sculpture's scale/offset choreography.
const B20 = 0.064;
const B45 = 0.144;
const B70 = 0.224;

// index into the six [data-line] rows in DOM order: Transformamos, ideas
// en, EXPERIENCIAS, digitales, que hacen crecer, negocios. — weighted so
// EXPERIENCIAS is the last headline element to disappear, per the brief.
const EXIT_WEIGHTS = [0, 0.15, 1, 0.35, 0.55, 0.75];

function smoothstep(x: number, edge0: number, edge1: number) {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

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
          `.${styles.sideIndex}, .${styles.scrollHint}`,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.9, stagger: 0.08 },
          "-=0.4"
        );
    });

    return () => ctx.revert();
  }, [play]);

  // The scroll transformation: the statement column drifts up very
  // slightly as the sculpture starts moving (20-45%), then each headline
  // row masks itself out (45-70%) — staggered so EXPERIENCIAS is the last
  // one standing, matching how long the sculpture keeps its own resting
  // scale before it starts leaving. Reads scrollState.progress directly
  // (same source MSculpture uses) rather than a second ScrollTrigger.
  useEffect(() => {
    if (!play || !rootRef.current || !mainRef.current) return;
    const statement = rootRef.current.querySelector<HTMLElement>(
      `.${styles.statementBlock}`
    );
    const lines = Array.from(
      mainRef.current.querySelectorAll<HTMLElement>(".line-mask")
    );

    let raf = 0;
    const loop = () => {
      const p = scrollState.progress;
      const shiftT = smoothstep(p, B20, B45);

      if (statement) {
        statement.style.transform = `translateY(${(-shiftT * 2).toFixed(3)}vh)`;
      }

      lines.forEach((el, i) => {
        const w = EXIT_WEIGHTS[i] ?? 0.5;
        const start = B45 + w * (B70 - B45) * 0.55;
        const end = Math.min(B70, start + (B70 - B45) * 0.45);
        const localT = smoothstep(p, start, end);
        el.style.transform = `translateY(${(-localT * 110).toFixed(2)}%)`;
        el.style.opacity = String(1 - localT);
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
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
          <span className={`line-mask ${styles.lineBig} ${styles.lineBigLead}`}>
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
            Descubre cómo <span aria-hidden>↓</span>
          </a>
          <a href="#manifiesto" className={styles.ctaGhost} data-cursor>
            <span className={styles.playRing} aria-hidden>
              <span className={styles.playIcon} />
            </span>
            Ver manifiesto
          </a>
        </div>

        <div className={styles.indexMark} aria-hidden>
          <span className={styles.indexLine} />
          01
        </div>
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
