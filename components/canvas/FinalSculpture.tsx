"use client";

/* eslint-disable react-hooks/immutability --
 * Same documented R3F pattern as MSculpture.tsx / CameraRig.tsx:
 * imperatively mutating the material/group each frame inside useFrame,
 * outside React's render cycle. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

// The beam geometry is punched straight through on its local Z axis (the
// aperture Act I's camera dollies through) — rotation.y near 0 points that
// hole directly down the camera's sightline and straight into the key
// light, blowing the frame out white. A fixed yaw offset keeps the sway
// permanently off that axis instead of drifting through it like Act I's
// scroll-driven rotation (which has its own "settle" guard for the same
// reason) would if reused here unbounded.
const BASE_YAW = Math.PI * 0.32;

/**
 * Act IX's monogram — deliberately independent of scrollState.progress
 * (Act I's rotation clock, which would already be pinned at its settled
 * end value here). Sways gently around an off-axis base orientation and
 * materializes — scale and opacity both ease in — as the particle field
 * converges around it, driven by scrollState.act9Progress.
 */
export default function FinalSculpture() {
  const group = useRef<THREE.Group>(null);
  const { bodyGeo, beamGeo, ringGeo } = useMemo(() => createMGeometries(), []);
  const material = useMemo(() => {
    const mat = createGoldMaterial();
    mat.transparent = true;
    mat.opacity = 0;
    return mat;
  }, []);

  const scaleRef = useRef(0.46);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    const idleY = BASE_YAW + Math.sin(t * 0.11) * 0.16;
    rotTarget.x = pointerState.y * 0.1;
    rotTarget.y = pointerState.x * 0.14;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      idleY + rotTarget.y,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      rotTarget.x * 0.5,
      2.2,
      delta
    );

    const p = scrollState.act9Progress;
    const reveal = THREE.MathUtils.smoothstep(p, 0.15, 0.62);

    scaleRef.current = THREE.MathUtils.damp(
      scaleRef.current,
      THREE.MathUtils.lerp(0.46, 0.62, reveal),
      2.4,
      delta
    );
    group.current.scale.setScalar(scaleRef.current);
    // capped below full opacity — a soft backlit presence behind the copy,
    // not a solid gold wall competing with it
    material.opacity = THREE.MathUtils.damp(material.opacity, reveal * 0.78, 2.4, delta);
  });

  return (
    <group ref={group} position={[0, 0, -1.6]}>
      <mesh geometry={bodyGeo} material={material} castShadow receiveShadow />
      <mesh geometry={beamGeo} material={material} castShadow receiveShadow />
      <mesh geometry={ringGeo} material={material} castShadow receiveShadow />
    </group>
  );
}
