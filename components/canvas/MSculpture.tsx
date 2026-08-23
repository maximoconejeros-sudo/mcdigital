"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMCGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

// Hero rebuild: the sculpture sits clearly right of the headline column,
// never behind it — pushing this through camera look-at alone hit sharply
// diminishing (then inverting) returns, so the object itself carries most
// of the shift in world space instead, which is linear and predictable.
//
// Choreography (mapped onto the hero's own visible-scroll window, roughly
// progress 0-0.32 before the DOM copy has fully exited):
//   0-20%   static right-side rest position
//   20-50%  camera pulls back (CameraRig) while the MC drifts further right
//   50-75%  a single controlled 4-8deg turn — camera choreography, not a
//           spinning logo; never a continuous idle rotation
//   75-100% the MC keeps drifting right as the transition into Scene 02
//           begins
// Both the offset and the turn settle back to neutral by progress 0.4,
// well ahead of the aperture dolly, so that established bridge into Scene
// 02 is unaffected by any of this.
const HERO_OFFSET_BASE = 3.0;
const HERO_OFFSET_MID = 3.3;
const HERO_OFFSET_FAR = 3.6;
const HERO_TURN = THREE.MathUtils.degToRad(6);

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => createGoldMaterial(), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = scrollState.progress;

    // weighted mouse parallax only — capped at 2-3deg per the brief, lerped,
    // never attached raw to the cursor. No autonomous idle drift: the
    // object holds still unless scroll or the pointer moves it.
    rotTarget.x = pointerState.y * 0.035;
    rotTarget.y = pointerState.x * 0.045;

    // the camera dollies straight through the aperture on the object's
    // local Z axis later in the journey — settle rotation back to 0 heading
    // into that window so the hole stays lined up with the fixed camera
    // path instead of rotating a solid gold face into the lens.
    const settle = 1 - THREE.MathUtils.smoothstep(p, 0.52, 0.7);

    const turnIn = THREE.MathUtils.smoothstep(p, 0.16, 0.24);
    const turnOut = 1 - THREE.MathUtils.smoothstep(p, 0.32, 0.4);
    const heroTurn = HERO_TURN * turnIn * turnOut;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (heroTurn + rotTarget.y) * settle,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      rotTarget.x * 0.6 * settle,
      2.2,
      delta
    );

    // hero composition push — right from rest, drifts further right across
    // two bands as the camera pulls back and the scene prepares to hand
    // off, then settles back to 0 by p=0.4 for the aperture dolly
    const midT = THREE.MathUtils.smoothstep(p, 0.064, 0.16);
    const farT = THREE.MathUtils.smoothstep(p, 0.24, 0.32);
    let targetOffset = THREE.MathUtils.lerp(HERO_OFFSET_BASE, HERO_OFFSET_MID, midT);
    targetOffset = THREE.MathUtils.lerp(targetOffset, HERO_OFFSET_FAR, farT);
    const returnT = THREE.MathUtils.smoothstep(p, 0.32, 0.4);
    targetOffset = THREE.MathUtils.lerp(targetOffset, 0, returnT);

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetOffset,
      2.2,
      delta
    );
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh geometry={mGeo} material={material} castShadow receiveShadow />
      <mesh geometry={cGeo} material={material} castShadow receiveShadow />
    </group>
  );
}
