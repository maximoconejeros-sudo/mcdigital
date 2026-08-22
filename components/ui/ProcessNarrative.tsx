"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import { STATIONS, stationEnvelope } from "@/lib/webgl/act5-layout";
import styles from "./ProcessNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

interface StationRef {
  root: HTMLDivElement | null;
}

/**
 * Act V — the four-step process as a horizontal spatial journey (camera
 * travels along X as the user scrolls vertically) rather than the old
 * site's vertical timeline. Each station's copy is windowed off the same
 * progress value driving the 3D camera.
 */
export default function ProcessNarrative({
  ready,
  onActiveChange,
}: {
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const refs = useRef<StationRef[]>([]);
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          onActiveChange?.(self.isActive);
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }

        scrollState.act5Progress = self.progress;
        if (fill.current) fill.current.style.width = `${self.progress * 100}%`;

        refs.current.forEach((r, i) => {
          if (!r.root) return;
          // narrower than the 3D numerals' envelope — every station's DOM
          // copy shares the same bottom-left position, so two windows
          // overlapping here would visibly garble together, unlike the
          // huge background numerals where a brief crossfade reads fine
          const env = stationEnvelope(self.progress, i, 0.15);
          r.root.style.opacity = String(env);
          r.root.style.transform = `translateX(${(1 - env) * 40}px)`;
        });
      },
    });

    return () => st.kill();
  }, [ready, onActiveChange]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        {STATIONS.map((s, i) => (
          <div
            key={s.number}
            ref={(el) => {
              refs.current[i] = { root: el };
            }}
            className={styles.station}
            style={{ opacity: 0 }}
          >
            <span className={styles.index}>
              {s.number} / 0{STATIONS.length}
            </span>
            <h2 className={styles.title}>{s.title}</h2>
            <p className={styles.copy}>{s.copy}</p>
          </div>
        ))}
        <div className={styles.progressTrack}>
          <div ref={fill} className={styles.progressFill} />
        </div>
      </div>
    </>
  );
}
