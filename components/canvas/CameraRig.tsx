"use client";

/* eslint-disable react-hooks/immutability --
 * useFrame runs in R3F's own render loop outside React's commit phase.
 * Imperatively mutating the three.js camera each frame (position, fov,
 * rotation) is the standard, documented R3F pattern for driving a
 * scroll/pointer-linked camera without triggering a React re-render.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCameraPath } from "@/lib/webgl/camera-path";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

export default function CameraRig({ reduced = false }: { reduced?: boolean }) {
  const { camera } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;

  const mouseYaw = useRef(0);
  const mousePitch = useRef(0);
  const fov = useRef(32);

  useFrame((_, delta) => {
    let targetFov = sampleCameraPath(
      scrollState.progress,
      desiredPos,
      desiredLook
    );

    if (reduced) {
      // pull the camera back and widen the frame for narrow/mobile viewports
      desiredPos.sub(desiredLook).multiplyScalar(1.32).add(desiredLook);
      targetFov += 5;
    }

    camera.position.lerp(desiredPos, 1 - Math.pow(0.001, delta));

    fov.current = THREE.MathUtils.damp(fov.current, targetFov, 3, delta);
    if (Math.abs(perspective.fov - fov.current) > 0.001) {
      perspective.fov = fov.current;
      perspective.updateProjectionMatrix();
    }

    camera.lookAt(desiredLook);

    // subtle weighted mouse parallax on top of the scroll-driven framing —
    // never attach rotation directly to raw pointer coordinates
    mouseYaw.current = THREE.MathUtils.damp(
      mouseYaw.current,
      THREE.MathUtils.degToRad(pointerState.x * 2.4),
      2.4,
      delta
    );
    mousePitch.current = THREE.MathUtils.damp(
      mousePitch.current,
      THREE.MathUtils.degToRad(pointerState.y * -1.6),
      2.4,
      delta
    );

    camera.rotation.y += mouseYaw.current;
    camera.rotation.x += mousePitch.current;
  });

  return null;
}
