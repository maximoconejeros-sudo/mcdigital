"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMCGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

// V10: the sculpture must sit clearly right of the headline column, not
// behind it — pushing this through camera look-at alone hit sharply
// diminishing (then inverting) returns, so the object itself carries most
// of the shift in world space instead, which is linear and predictable.
// It settles back to 0 well before the aperture dolly (t=0.4+) needs the
// object back on-axis with the fixed camera path.
const HERO_OFFSET_X = 3.0;

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => createGoldMaterial(), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    // Per the brief: "light reacts more than object rotates" — the object
    // itself stays close to still, with only a hint of idle drift and
    // scroll-driven turn (an order of magnitude softer than before);
    // PointerKeyLight carries the actual mouse response as a moving
    // highlight across the gold instead.
    const idleY = t * 0.012;
    const scrollY = p * 0.14;

    // weighted mouse parallax, lerped — never attached raw to the cursor
    rotTarget.x = pointerState.y * 0.035;
    rotTarget.y = pointerState.x * 0.045;

    // the camera dollies straight through the aperture on the object's
    // local Z axis — settle rotation back to 0 heading into that window so
    // the hole stays lined up with the fixed camera path instead of
    // rotating a solid gold face into the lens at point-blank range.
    const settle = 1 - THREE.MathUtils.smoothstep(p, 0.52, 0.7);

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (idleY + scrollY + rotTarget.y) * settle,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      rotTarget.x * 0.6 * settle,
      2.2,
      delta
    );

    // hero composition push — settles back to 0 by p=0.35, well ahead of
    // the aperture dolly, so the rest of the scroll sequence is unaffected
    const offsetSettle = THREE.MathUtils.smoothstep(p, 0.15, 0.35);
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      HERO_OFFSET_X * (1 - offsetSettle),
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
