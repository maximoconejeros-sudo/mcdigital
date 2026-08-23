"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A slow autonomous reflection traveling across the gold — the sculpture
 * should feel alive even when nobody is scrolling or moving the pointer.
 * A real moving point light (not a CSS gradient) so it actually plays
 * across the PBR metal: right edge of the C catches it first, it travels
 * through the M/C intersection, fades into the M, then the light goes
 * dark and the cycle holds before repeating — long enough that it never
 * reads as mechanical looping.
 */
const CYCLE = 11;
const HOLD = 4.5;

export default function LightSweep() {
  const light = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!light.current) return;
    const t = state.clock.elapsedTime % (CYCLE + HOLD);

    if (t > CYCLE) {
      light.current.intensity = 0;
      return;
    }

    const sweepT = t / CYCLE;
    const eased = THREE.MathUtils.smoothstep(sweepT, 0, 1);
    const x = THREE.MathUtils.lerp(2.7, -1.3, eased);
    light.current.position.set(x, 1.1 + eased * 0.4, 2.1);

    const fade = Math.sin(sweepT * Math.PI);
    light.current.intensity = Math.pow(fade, 1.6) * 3.4;
  });

  return (
    <pointLight ref={light} color="#fff2cf" distance={6.5} decay={2.2} />
  );
}
