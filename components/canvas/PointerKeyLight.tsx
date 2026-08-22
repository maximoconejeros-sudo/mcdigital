"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointerState } from "@/lib/animation/scroll-store";

/**
 * The Signal act's actual mouse response: not the object rotating toward
 * the cursor, but a warm highlight sweeping across the gold as a small
 * key light orbits with the pointer — "light reacts more than object
 * rotates," per the brief. Damped, so it reads as a reflection drifting
 * rather than a spotlight snapping to the cursor.
 */
export default function PointerKeyLight() {
  const light = useRef<THREE.PointLight>(null);
  const pos = useRef(new THREE.Vector3(2, 1.6, 2.4));

  useFrame((_, delta) => {
    if (!light.current) return;
    const target = new THREE.Vector3(
      1.6 + pointerState.x * 1.4,
      1.2 + pointerState.y * -1,
      2.4
    );
    pos.current.lerp(target, 1 - Math.exp(-2.4 * delta));
    light.current.position.copy(pos.current);
  });

  return (
    <pointLight
      ref={light}
      color="#f4dfa8"
      intensity={2.6}
      distance={7}
      decay={2}
    />
  );
}
