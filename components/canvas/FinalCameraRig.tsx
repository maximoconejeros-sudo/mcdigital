"use client";

/* eslint-disable react-hooks/immutability --
 * Same documented R3F pattern as CameraRig.tsx: imperatively driving the
 * three.js camera each frame outside React's render cycle. */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const BG_NEAR = new THREE.Color(0xeee5d3); // warm champagne, the CTA state
const BG_FAR = new THREE.Color(0xf7f3ea); // soft ivory/near-white, the brand shot

/** Act IX's camera: a slow dolly-in as the monogram materializes, plus the
 * same weighted mouse parallax used throughout. Once act9BrandT rises (the
 * closing brand moment), it pulls back further and straightens to look
 * dead-on at the now-recentering monogram instead of the cropped offset
 * framing the CTA content used, and the clear color drifts from champagne
 * toward near-white — no hard cut. */
export default function FinalCameraRig({ reduced = false }: { reduced?: boolean }) {
  const { camera, gl } = useThree();
  const z = useRef(7.4);
  const lookX = useRef(0.55);
  const bgColor = useRef(BG_NEAR.clone());

  useFrame((_, delta) => {
    const p = scrollState.act9Progress;
    const brandT = scrollState.act9BrandT;
    const baseTargetZ = THREE.MathUtils.lerp(7.4, reduced ? 7.2 : 6.9, THREE.MathUtils.smoothstep(p, 0.1, 0.65));
    const targetZ = THREE.MathUtils.lerp(baseTargetZ, reduced ? 8.8 : 9.4, brandT);
    z.current = THREE.MathUtils.damp(z.current, targetZ, 2.2, delta);

    const parallaxX = pointerState.x * 0.22 * (1 - brandT * 0.7);
    const parallaxY = -pointerState.y * 0.14 * (1 - brandT * 0.7);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, parallaxX, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, parallaxY, 2.4, delta);
    camera.position.z = z.current;

    const targetLookX = THREE.MathUtils.lerp(0.55, 0, brandT);
    lookX.current = THREE.MathUtils.damp(lookX.current, targetLookX, 2.2, delta);
    camera.lookAt(lookX.current, -0.08 * (1 - brandT), 0);

    bgColor.current.lerpColors(BG_NEAR, BG_FAR, brandT);
    gl.setClearColor(bgColor.current, 1);
  });

  return null;
}
