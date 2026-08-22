"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQ_ITEMS } from "@/lib/content/faq";
import styles from "./FAQSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Act VIII — FAQ as an editorial black list, not a beige accordion: huge
 * left-side heading, questions on the right that shift and underline on
 * hover, answers reveal via a CSS grid-rows mask (smooth height without
 * measuring layout in JS).
 */
export default function FAQSection() {
  const section = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!section.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows.current,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: section.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className={styles.section} id="faq">
      <div className={styles.grid}>
        <div className={styles.intro}>
          <span className={`label ${styles.introLabel}`}>Preguntas</span>
          <h2 className={styles.introHeading}>
            Antes de
            <br />
            empezar.
          </h2>
        </div>

        <div className={styles.list}>
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.q}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                className={`${styles.item} ${open ? styles.itemOpen : ""}`}
                style={{ opacity: 0 }}
              >
                <button
                  type="button"
                  className={styles.trigger}
                  data-cursor
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span className={styles.triggerIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.triggerQuestion}>{item.q}</span>
                  <span className={styles.plus} aria-hidden>
                    +
                  </span>
                  <span className={styles.triggerLine} />
                </button>
                <div className={styles.answerWrap}>
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
