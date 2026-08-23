"use client";

/* eslint-disable react-hooks/immutability --
 * useFrame runs in R3F's own render loop outside React's commit phase.
 * Imperatively mutating the three.js camera each frame (position, fov,
 * rotation) is the standard, documented R3F pattern for driving a
 * scroll/pointer-linked camera without triggering a React re-render.
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { sampleCameraPath } from "@/lib/webgl/camera-path";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const desiredPos = new THREE.Vector3();
const desiredLook = new THREE.Vector3();

// The cinematic load-in: an extreme macro close-up on the gold metal — at
// this distance and this narrow a field of view, it reads as reflection
// and shadow, not yet a recognizable monogram — that pulls back into the
// resting hero frame (CAMERA_PATH's own t=0 keyframe) as the typography
// stages in. Deliberately targets roughly where the object settles at
// rest rather than tracking its own still-animating entrance offset.
const MACRO_POS = new THREE.Vector3(0.5, 0.05, 1.15);
const MACRO_LOOK = new THREE.Vector3(0.55, 0.12, 0);
const MACRO_FOV = 15;

export default function CameraRig({
  reduced = false,
  play = true,
}: {
  reduced?: boolean;
  play?: boolean;
}) {
  const { camera } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;

  const mouseYaw = useRef(0);
  const mousePitch = useRef(0);
  const fov = useRef(32);

  useEffect(() => {
    if (!play) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const state = { v: 0 };
    scrollState.heroIntroT = 0;
    const tween = gsap.to(state, {
      v: 1,
      duration: reduceMotion ? 0.01 : 2.6,
      ease: "expo.inOut",
      onUpdate: () => {
        scrollState.heroIntroT = state.v;
      },
    });
    return () => {
      tween.kill();
      scrollState.heroIntroT = 1;
    };
  }, [play]);

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

    const introT = scrollState.heroIntroT;
    if (introT < 1) {
      // the load-in tween already supplies its own easing over ~2.6s — set
      // the blended frame directly rather than layering the scroll rig's
      // exponential smoothing on top, which would turn the authored pull-
      // back into an abrupt snap-then-catch-up instead of one continuous move
      desiredPos.lerpVectors(MACRO_POS, desiredPos, introT);
      desiredLook.lerpVectors(MACRO_LOOK, desiredLook, introT);
      targetFov = THREE.MathUtils.lerp(MACRO_FOV, targetFov, introT);
    }
    // Position and FOV are set directly from the path sample every frame —
    // no lerp/damp. CAMERA_PATH already supplies its own per-segment
    // easing (the smooth() ease in sampleCameraPath), so this doesn't
    // read as less cinematic; what it removes is a second, time-based
    // layer of smoothing whose output depends on elapsed frame time and
    // the previous frame's position, not scroll position alone. That
    // extra layer also had position lagging one frame behind the
    // look-at target (which was already unlagged below), a mismatch
    // that got more visible right at a scroll direction reversal.
    camera.position.copy(desiredPos);
    fov.current = targetFov;

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
