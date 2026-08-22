"use client";

/* eslint-disable react-hooks/immutability --
 * useFrame runs in R3F's render loop, not React's commit phase — mutating
 * the three.js camera each frame is the standard, documented R3F pattern.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleServicesCamera } from "@/lib/webgl/act2-layout";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

export default function ServicesCameraRig() {
  const { camera } = useThree();
  const mouseYaw = useRef(0);
  const mousePitch = useRef(0);

  useFrame((_, delta) => {
    sampleServicesCamera(scrollState.act2Progress, desiredPos, desiredLook);
    camera.position.lerp(desiredPos, 1 - Math.pow(0.0015, delta));
    camera.lookAt(desiredLook);

    mouseYaw.current = THREE.MathUtils.damp(
      mouseYaw.current,
      THREE.MathUtils.degToRad(pointerState.x * 2.2),
      2.4,
      delta
    );
    mousePitch.current = THREE.MathUtils.damp(
      mousePitch.current,
      THREE.MathUtils.degToRad(pointerState.y * -1.4),
      2.4,
      delta
    );
    camera.rotation.y += mouseYaw.current;
    camera.rotation.x += mousePitch.current;
  });

  return null;
}
