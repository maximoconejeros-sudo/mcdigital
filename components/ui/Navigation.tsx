"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { scrollState } from "@/lib/animation/scroll-store";
import styles from "./Navigation.module.css";

const LINKS = ["Servicios", "Capacidades", "Nosotros", "Contacto"];

/**
 * The nav's own color theme tracks which environment is currently on
 * screen (each act's onUpdate writes scrollState.navTheme) rather than a
 * fixed color + shadow trick — a fixed light color reads fine over the
 * black Hero but goes invisible over Expertise's warm white.
 *
 * Below 760px the four full-word links don't fit next to the wordmark
 * (they were wrapping and colliding with it), so `.links` hides and a
 * toggle opens a full-screen panel instead — the panel is theme-independent
 * (always the dark resting state) since it covers whatever act is beneath it.
 */
export default function Navigation({ play }: { play: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    let raf = 0;
    let last = "";
    const loop = () => {
      if (root.current && scrollState.navTheme !== last) {
        last = scrollState.navTheme;
        root.current.dataset.theme = last;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <nav
      ref={root}
      className={styles.nav}
      aria-label="Primary"
      data-theme="dark"
      data-menu-open={menuOpen ? "true" : undefined}
    >
      <a
        href="#top"
        className={styles.brand}
        data-cursor
        onClick={() => setMenuOpen(false)}
      >
        <span data-nav-item style={{ display: "inline-block" }}>
          <span className={styles.brandMC}>MC</span> DIGITAL®
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

      <button
        type="button"
        className={styles.menuToggle}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      <div className={styles.mobilePanel} data-open={menuOpen ? "true" : undefined}>
        <ul>
          {LINKS.map((label) => (
            <li key={label}>
              <a href={`#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
