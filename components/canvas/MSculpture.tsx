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
// progress 0-0.32 before the DOM copy has fully exited), in quarters:
//   0-15%   hero remains mostly stable, resting right-side position
//   15-40%  the MC shifts further right and turns a controlled ~2deg —
//           camera choreography, not a spinning logo
//   40-70%  scale eases 1 -> 1.08 as it continues leaving toward the right
//   70-100% keeps drifting right into the Scene 02 handoff
// The offset, turn and scale all settle back to neutral by progress 0.4,
// well ahead of the aperture dolly, so that established bridge into Scene
// 02 (which assumes an axis-aligned, unscaled object) is unaffected.
const HERO_OFFSET_BASE = 1.55;
const HERO_OFFSET_MID = 1.85;
const HERO_OFFSET_FAR = 2.15;
const HERO_OFFSET_FAR2 = 2.35;
const HERO_TURN = THREE.MathUtils.degToRad(2);
const HERO_SCALE_MAX = 1.08;
const IDLE_SWAY_DEG = 0.6;

const B15 = 0.048;
const B40 = 0.128;
const B70 = 0.224;
const B100 = 0.32;

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => createGoldMaterial(), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;

    // weighted mouse parallax — capped at 2-3deg per the brief, lerped,
    // never attached raw to the cursor.
    rotTarget.x = pointerState.y * 0.035;
    rotTarget.y = pointerState.x * 0.045;

    // a slow bounded oscillation, not a spin: it reverses direction every
    // few seconds rather than accumulating, so the object never turns past
    // its own idle range on its own
    const idleSway = Math.sin(t * 0.12) * THREE.MathUtils.degToRad(IDLE_SWAY_DEG);

    // the camera dollies straight through the aperture on the object's
    // local Z axis later in the journey — settle rotation back to 0 heading
    // into that window so the hole stays lined up with the fixed camera
    // path instead of rotating a solid gold face into the lens.
    const settle = 1 - THREE.MathUtils.smoothstep(p, 0.52, 0.7);

    const turnIn = THREE.MathUtils.smoothstep(p, B15, B40);
    const turnReturn = 1 - THREE.MathUtils.smoothstep(p, B100, 0.4);
    const heroTurn = HERO_TURN * turnIn * turnReturn;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (heroTurn + idleSway + rotTarget.y) * settle,
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
    // three bands as it turns, scales and prepares to hand off, then
    // settles back to 0 by p=0.4 for the aperture dolly
    const midT = THREE.MathUtils.smoothstep(p, B15, B40);
    const farT = THREE.MathUtils.smoothstep(p, B40, B70);
    const far2T = THREE.MathUtils.smoothstep(p, B70, B100);
    let targetOffset = THREE.MathUtils.lerp(HERO_OFFSET_BASE, HERO_OFFSET_MID, midT);
    targetOffset = THREE.MathUtils.lerp(targetOffset, HERO_OFFSET_FAR, farT);
    targetOffset = THREE.MathUtils.lerp(targetOffset, HERO_OFFSET_FAR2, far2T);
    const returnT = THREE.MathUtils.smoothstep(p, B100, 0.4);
    targetOffset = THREE.MathUtils.lerp(targetOffset, 0, returnT);

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetOffset,
      2.2,
      delta
    );

    // scale eases up through the 40-70% band as it leaves, then settles
    // back to 1 before the aperture dolly (which assumes a true-scale object)
    const targetScale = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(1, HERO_SCALE_MAX, farT),
      1,
      returnT
    );
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, targetScale, 2.2, delta)
    );
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh geometry={mGeo} material={material} castShadow receiveShadow />
      <mesh geometry={cGeo} material={material} castShadow receiveShadow />
    </group>
  );
}
