"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/animation/scroll-store";
import {
  LAB_INTRO_LABEL,
  LAB_HEADLINE,
  LAB_SUB,
  LAB_WORLDS,
} from "@/lib/content/lab";
import styles from "./DigitalLabNarrative.module.css";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t);
const bandIn = (p: number, start: number, end: number) =>
  smooth(clamp01((p - start) / (end - start)));
const wordEnvelope = (
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) => Math.min(bandIn(p, inStart, inEnd), 1 - bandIn(p, outStart, outEnd));

// background color stops the world panels crossfade between — the opening
// warm-white bleeds into each world's own color, ending held on Precision
const BG_STOPS: { at: number; color: string }[] = [
  { at: 0.16, color: "#f4f1ea" },
  { at: 0.32, color: LAB_WORLDS[0].bg },
  { at: 0.52, color: LAB_WORLDS[1].bg },
  { at: 0.74, color: LAB_WORLDS[2].bg },
];

function sampleBg(p: number): string {
  if (p <= BG_STOPS[0].at) return BG_STOPS[0].color;
  for (let i = 0; i < BG_STOPS.length - 1; i++) {
    const a = BG_STOPS[i];
    const b = BG_STOPS[i + 1];
    if (p <= b.at) {
      const t = smooth(clamp01((p - a.at) / (b.at - a.at)));
      return gsap.utils.interpolate(a.color, b.color, t);
    }
  }
  return BG_STOPS[BG_STOPS.length - 1].color;
}

interface WorldRefs {
  root: HTMLDivElement | null;
  name: HTMLHeadingElement | null;
  label: HTMLSpanElement | null;
  tagline: HTMLParagraphElement | null;
  image: HTMLDivElement | null;
}

interface Refs {
  bg: HTMLDivElement | null;
  introLabel: HTMLDivElement | null;
  introHeadline: HTMLDivElement | null;
  introSub: HTMLParagraphElement | null;
  worlds: WorldRefs[];
}

// each world's own active envelope [inStart, inEnd, outStart, outEnd] — the
// outgoing world's exit band finishes just before the next world's entry
// band becomes prominent (rather than sharing the identical range), so the
// two names spend only a brief sliver overlapping instead of crossfading
// fully on top of each other. The last world has no exit, it settles as
// the resting frame.
const WORLD_BANDS: [number, number, number, number][] = [
  [0.22, 0.3, 0.4, 0.46],
  [0.43, 0.5, 0.6, 0.66],
  [0.63, 0.7, 1, 1],
];

/**
 * Act IV — "Digital Lab." Replaces the deleted fake portfolio: instead of
 * showing past (invented) projects, the site demonstrates that MC Digital
 * doesn't use one template per client — the whole viewport's color,
 * typography mood and motion personality transform across three visual
 * worlds (Luxury / Energy / Precision), each a design language, not a
 * project. Image slots are tasteful gradient placeholders standing in for
 * real photography — see the asset report delivered alongside this build,
 * not printed on the page itself.
 */
export default function DigitalLabNarrative({ ready }: { ready: boolean }) {
  const spacer = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const refs = useRef<Refs>({
    bg: null,
    introLabel: null,
    introHeadline: null,
    introSub: null,
    worlds: LAB_WORLDS.map(() => ({
      root: null,
      name: null,
      label: null,
      tagline: null,
      image: null,
    })),
  });
  const wasActive = useRef(false);

  useEffect(() => {
    if (!ready || !spacer.current) return;

    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        const r = refs.current;

        // Precision (the last world) is a light background — nav should
        // read graphite+gold there, but dark+gold everywhere earlier
        scrollState.navTheme = p > 0.6 ? "light" : "graphite";

        if (self.isActive !== wasActive.current) {
          wasActive.current = self.isActive;
          if (layer.current) {
            layer.current.style.opacity = self.isActive ? "1" : "0";
            layer.current.style.visibility = self.isActive
              ? "visible"
              : "hidden";
          }
        }

        if (r.bg) r.bg.style.background = sampleBg(p);

        const introT = wordEnvelope(p, 0.02, 0.1, 0.16, 0.2);
        if (r.introLabel) r.introLabel.style.opacity = String(introT);
        if (r.introHeadline) {
          r.introHeadline.style.opacity = String(introT);
          r.introHeadline.style.transform = `translateY(${(1 - introT) * 14}px)`;
        }
        if (r.introSub) r.introSub.style.opacity = String(introT);

        LAB_WORLDS.forEach((world, wi) => {
          const wr = r.worlds[wi];
          if (!wr) return;
          const [inS, inE, outS, outE] = WORLD_BANDS[wi];
          const enterT = bandIn(p, inS, inE);
          const exitT = wi === LAB_WORLDS.length - 1 ? 0 : bandIn(p, outS, outE);
          const t = Math.min(enterT, 1 - exitT);
          const color = wi === 2 ? "var(--color-graphite-dark)" : world.fg;
          if (wr.root) wr.root.style.opacity = String(t);
          if (wr.name) {
            // enters rising from below, exits continuing to rise and out —
            // a directional wipe instead of a static crossfade, so the
            // outgoing and incoming world names are never sitting on the
            // same line at once even mid-transition (V8: no text collisions)
            const offsetY = (1 - enterT) * 60 - exitT * 80;
            wr.name.style.transform = `translateY(${offsetY}px)`;
            wr.name.style.color = color;
          }
          if (wr.label) wr.label.style.color = world.accent;
          if (wr.tagline) wr.tagline.style.color = color;
          if (wr.image) {
            wr.image.style.transform = `scale(${0.92 + t * 0.08})`;
          }
        });
      },
    });

    return () => st.kill();
  }, [ready]);

  return (
    <>
      <div ref={spacer} className={styles.spacer} />
      <div ref={layer} className={styles.layer} style={{ opacity: 0 }}>
        <div ref={(el) => { refs.current.bg = el; }} className={styles.bg} />

        <div className={styles.intro}>
          <div
            ref={(el) => {
              refs.current.introLabel = el;
            }}
            className={styles.introLabel}
            style={{ opacity: 0 }}
          >
            {LAB_INTRO_LABEL}
          </div>
          <div
            ref={(el) => {
              refs.current.introHeadline = el;
            }}
            className={styles.introHeadline}
            style={{ opacity: 0 }}
          >
            {LAB_HEADLINE[0]}
            <br />
            {LAB_HEADLINE[1]}
          </div>
          <p
            ref={(el) => {
              refs.current.introSub = el;
            }}
            className={styles.introSub}
            style={{ opacity: 0 }}
          >
            {LAB_SUB}
          </p>
        </div>

        {LAB_WORLDS.map((world, wi) => (
          <div
            key={world.name}
            ref={(el) => {
              refs.current.worlds[wi].root = el;
            }}
            className={styles.world}
            style={{ opacity: 0 }}
          >
            <div className={styles.worldText}>
              <span
                ref={(el) => {
                  refs.current.worlds[wi].label = el;
                }}
                className={styles.worldLabel}
              >
                {world.label}
              </span>
              <h2
                ref={(el) => {
                  refs.current.worlds[wi].name = el;
                }}
                className={styles.worldName}
              >
                {world.name}
              </h2>
              <p
                ref={(el) => {
                  refs.current.worlds[wi].tagline = el;
                }}
                className={styles.worldTagline}
              >
                {world.tagline}
              </p>
            </div>
            <div
              ref={(el) => {
                refs.current.worlds[wi].image = el;
              }}
              className={styles.worldImage}
              style={{ background: world.gradient }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
