"use client";

/* eslint-disable react-hooks/immutability --
 * useFrame runs in R3F's render loop, not React's commit phase — mutating
 * scene graph objects here is the standard, performant R3F pattern.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/animation/scroll-store";

/** Environment darkens as the camera enters the aperture, per the brief. */
export default function FogController() {
  const { scene } = useThree();
  const density = useRef(0.05);

  useFrame((_, delta) => {
    const p = scrollState.progress;
    const target = p < 0.6 ? 0.045 : p < 0.9 ? 0.045 + (p - 0.6) * 0.55 : 0.21;

    density.current = THREE.MathUtils.damp(
      density.current,
      target,
      2,
      delta
    );

    if (scene.fog && "density" in scene.fog) {
      (scene.fog as THREE.FogExp2).density = density.current;
    }
  });

  return null;
}
