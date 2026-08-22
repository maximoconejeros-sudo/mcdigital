"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./HeroTypography.module.css";

/**
 * Act I ("The Signal") copy. A two-beat statement rather than a generic
 * three-line agency hero: a small, ownable claim appears first and holds,
 * then recedes as the real headline takes over in the same spot — "We
 * make it impossible to ignore," with the emotional word set in the
 * serif voice the MC's own letterforms are built from. Everything sits
 * front-layer (z-30, always in front of the transparent canvas) rather
 * than split behind/in-front of the sculpture — the aggressive crop
 * already gives the object most of the frame, so legibility of this
 * particular line matters more than a depth trick here.
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
          Your business
          <br />
          already exists.
        </div>

        <h1 ref={mainRef} className={styles.mainLine} style={{ perspective: 700 }}>
          <span className="line-mask">
            <span data-line style={{ display: "inline-block" }}>
              We make it
            </span>
          </span>
          <span className="line-mask">
            <span data-line style={{ display: "inline-block" }}>
              <em className={styles.emphasis}>impossible</em>
            </span>
          </span>
          <span className="line-mask">
            <span data-line style={{ display: "inline-block" }}>
              to ignore.
            </span>
          </span>
        </h1>

        <p className={styles.spanishSub} style={{ opacity: 0 }}>
          Experiencias web, sistemas digitales e IA diseñados alrededor de tu
          negocio.
        </p>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomLeft}>
          <p className="label" style={{ opacity: 0 }}>
            Santiago — Miami
          </p>
        </div>

        <div className={styles.scrollHint} style={{ opacity: 0 }}>
          <span className="label">Enter</span>
          <span className={styles.scrollArrow} aria-hidden>
            ↓
          </span>
        </div>
      </div>
    </div>
  );
}
