"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./HeroTypography.module.css";

/**
 * Two DOM layers straddling the transparent WebGL canvas (z-index 10 vs
 * 30) so the sculpture reads as physically between typography — "DIGITAL"
 * sits behind it, the supporting lines sit in front.
 */
export default function HeroTypography({ play }: { play: boolean }) {
  const behindRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        behindRef.current,
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 0.94, scale: 1, duration: 1.6, ease: "power3.out" }
      )
        .fromTo(
          `.${styles.headlineTop} [data-line]`,
          { yPercent: 120, rotateX: 12 },
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=1.2"
        )
        .fromTo(
          `.${styles.headlineBottom} [data-line]`,
          { yPercent: 120, rotateX: 12 },
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.9"
        )
        .fromTo(
          [`.${styles.eyebrow}`, `.${styles.bottomLeft} .label`],
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          `.${styles.scrollHint}`,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          `.${styles.scrollLine}`,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.2, ease: "power2.out", repeat: -1, yoyo: true },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, [play]);

  return (
    <>
      <div ref={behindRef} className={styles.behind} style={{ opacity: 0 }}>
        <span className={styles.centerWord} data-hero-behind>
          Digital
        </span>
      </div>

      <div ref={frontRef} className={styles.front}>
        <div className={styles.topRow}>
          <h1
            className={styles.headlineTop}
            data-hero-front
            style={{ perspective: 600 }}
          >
            <span className="line-mask">
              <span data-line style={{ display: "inline-block" }}>
                We create
              </span>
            </span>
          </h1>
          <p
            className={`label ${styles.eyebrow}`}
            data-hero-front
            style={{ opacity: 0 }}
          >
            Digital growth agency
          </p>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft} data-hero-front>
            <p className="label" style={{ opacity: 0 }}>
              Web / AI / Digital systems
            </p>
            <p className="label" style={{ opacity: 0 }}>
              Santiago — Miami
            </p>
          </div>
          <h1
            className={styles.headlineBottom}
            data-hero-front
            style={{ perspective: 600 }}
          >
            <span className="line-mask">
              <span data-line style={{ display: "inline-block" }}>
                Experiences.
              </span>
            </span>
          </h1>
        </div>

        <div className={styles.scrollHint} data-hero-front>
          <span className="label">Scroll</span>
          <span className={styles.scrollLine} style={{ transform: "scaleY(0)" }} />
        </div>
      </div>
    </>
  );
}
