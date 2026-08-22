"use client";

/* eslint-disable react-hooks/immutability --
 * Same documented R3F pattern as CameraRig.tsx: imperatively driving the
 * three.js camera each frame outside React's render cycle. */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

/** Act IX's camera: a slow dolly-in as the monogram materializes, plus the
 * same weighted mouse parallax used throughout — no scripted path needed
 * for a closing, mostly-static hero frame. */
export default function FinalCameraRig({ reduced = false }: { reduced?: boolean }) {
  const { camera } = useThree();
  const z = useRef(7.4);

  useFrame((_, delta) => {
    const p = scrollState.act9Progress;
    const targetZ = THREE.MathUtils.lerp(7.4, reduced ? 7.2 : 6.9, THREE.MathUtils.smoothstep(p, 0.1, 0.65));
    z.current = THREE.MathUtils.damp(z.current, targetZ, 2.2, delta);

    const parallaxX = pointerState.x * 0.22;
    const parallaxY = -pointerState.y * 0.14;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, parallaxX, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, parallaxY, 2.4, delta);
    camera.position.z = z.current;
    // look slightly left of center so the (now right-shifted) monogram
    // reads as cropped off the right edge, not centered in frame
    camera.lookAt(0.55, -0.08, 0);
  });

  return null;
}
