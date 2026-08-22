"use client";

/* eslint-disable react-hooks/immutability --
 * useFrame runs in R3F's render loop, not React's commit phase — mutating
 * scene graph objects here is the standard, performant R3F pattern.
 */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/animation/scroll-store";

// The brief's color journey: BLACK -> GRAPHITE -> SILVER -> WARM WHITE,
// resolving across the back half of Act I so it's fully warm white by the
// time the camera emerges into the Expertise handoff. Density still darkens
// through the aperture crossing itself (unchanged from before) — the hue
// shift trails slightly behind that so the "traveling through the gold"
// beat still reads as passing through something solid before the world
// brightens on the other side.
const STOPS: { at: number; color: THREE.Color }[] = [
  { at: 0.55, color: new THREE.Color("#090909") },
  { at: 0.68, color: new THREE.Color("#242422") },
  { at: 0.85, color: new THREE.Color("#d8d8d4") },
  { at: 1.0, color: new THREE.Color("#f4f1ea") },
];

const tmpColor = new THREE.Color();

function sampleJourney(p: number, out: THREE.Color) {
  if (p <= STOPS[0].at) {
    out.copy(STOPS[0].color);
    return;
  }
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (p <= b.at) {
      const t = (p - a.at) / (b.at - a.at || 1);
      out.copy(a.color).lerp(b.color, THREE.MathUtils.smoothstep(t, 0, 1));
      return;
    }
  }
  out.copy(STOPS[STOPS.length - 1].color);
}

/** Environment darkens as the camera enters the aperture, then the whole
 * scene's fog + background shift from black through graphite and silver
 * into warm white as it emerges — the handoff into the Expertise act. */
export default function FogController() {
  const { scene } = useThree();
  const density = useRef(0.05);
  const bg = useMemo(() => new THREE.Color("#090909"), []);

  useFrame((_, delta) => {
    const p = scrollState.progress;
    const target = p < 0.6 ? 0.045 : p < 0.9 ? 0.045 + (p - 0.6) * 0.55 : 0.21;

    density.current = THREE.MathUtils.damp(
      density.current,
      target,
      2,
      delta
    );

    sampleJourney(p, tmpColor);
    bg.lerp(tmpColor, 1 - Math.exp(-3 * delta));

    if (scene.fog && "density" in scene.fog) {
      (scene.fog as THREE.FogExp2).density = density.current;
      (scene.fog as THREE.FogExp2).color.copy(bg);
    }
    if (!scene.background || !(scene.background instanceof THREE.Color)) {
      scene.background = bg;
    }
  });

  return null;
}
