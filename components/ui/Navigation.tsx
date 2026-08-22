"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Navigation.module.css";

const LINKS = ["Work", "Expertise", "Contact"];

export default function Navigation({ play }: { play: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!play || !root.current) return;
    const targets = root.current.querySelectorAll("[data-nav-item]");
    gsap.fromTo(
      targets,
      { yPercent: 130 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
      }
    );
  }, [play]);

  return (
    <nav ref={root} className={styles.nav} aria-label="Primary">
      <a href="#top" className={styles.brand} data-cursor>
        <span data-nav-item style={{ display: "inline-block" }}>
          MDIGITAL®
        </span>
      </a>
      <ul className={styles.links}>
        {LINKS.map((label) => (
          <li key={label} className={styles.link}>
            <a
              href={`#${label.toLowerCase()}`}
              data-cursor
              style={{ display: "block" }}
            >
              <span data-nav-item style={{ display: "inline-block" }}>
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
