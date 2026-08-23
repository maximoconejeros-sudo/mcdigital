"use client";

/* eslint-disable react-hooks/immutability --
 * useFrame runs in R3F's own render loop outside React's commit phase.
 * Imperatively mutating the three.js camera each frame (position, fov,
 * rotation) is the standard, documented R3F pattern for driving a
 * scroll-linked camera without triggering a React re-render.
 */

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCameraPath } from "@/lib/webgl/camera-path";
import { scrollState } from "@/lib/animation/scroll-store";

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

// Rebuild: ONE input (scrollState.progress, clamped 0..1) maps directly to
// ONE camera transform every frame via sampleCameraPath's own keyframe
// interpolation — nothing else touches the camera. No load-in tween, no
// mouse parallax, no time-based damping/lerp between frames: the same
// scroll position always produces the exact same camera position/look-at/
// fov, regardless of how it was reached or which direction the scroll came
// from. The previous version's macro-zoom load-in (an extreme close-up
// pulling back to the resting frame over ~2.6s) has been removed entirely
// — CAMERA_PATH's own t=0 keyframe is already the approved resting
// composition, so the very first rendered frame now matches it directly
// instead of a separate intermediate state.
export default function CameraRig({ reduced = false }: { reduced?: boolean }) {
  const { camera } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;

  useFrame(() => {
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1);
    let fov = sampleCameraPath(p, desiredPos, desiredLook);

    if (reduced) {
      // pull the camera back and widen the frame for narrow/mobile viewports
      desiredPos.sub(desiredLook).multiplyScalar(1.32).add(desiredLook);
      fov += 5;
    }

    camera.position.copy(desiredPos);

    if (Math.abs(perspective.fov - fov) > 0.001) {
      perspective.fov = fov;
      perspective.updateProjectionMatrix();
    }

    camera.lookAt(desiredLook);
  });

  return null;
}
