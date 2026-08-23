"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [moved, setMoved] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine || reduceMotion) return;

    // Feature detection needs `window`/matchMedia, unavailable during SSR
    // render — an effect-gated setState is the correct way to flip this on.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const raw = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...raw };
    let raf = 0;

    let hasMoved = false;
    const onMove = (e: PointerEvent) => {
      raw.x = e.clientX;
      raw.y = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        current.x = raw.x;
        current.y = raw.y;
        setMoved(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (target) {
        setHover(true);
        setLabel(target.dataset.cursor || "");
      }
    };
    const onOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (target) {
        setHover(false);
        setLabel("");
      }
    };

    const loop = () => {
      current.x += (raw.x - current.x) * 0.18;
      current.y += (raw.y - current.y) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      className={`${styles.cursor} ${moved ? styles.ready : ""} ${
        hover ? styles.hover : ""
      }`}
    >
      {label && label !== "true" && (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  );
}
