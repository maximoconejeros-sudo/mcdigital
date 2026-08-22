"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMGeometries } from "@/lib/webgl/geometry";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const { bodyGeo, beamGeo, ringGeo } = useMemo(() => createMGeometries(), []);

  // Champagne / brushed gold — physically based so brightness and hue
  // variation come from lighting and reflection, not a flat fill color.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#C89B3C"),
        metalness: 1,
        roughness: 0.32,
        envMapIntensity: 2.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.28,
        sheen: 0.16,
        sheenColor: new THREE.Color("#ffe3ab"),
        sheenRoughness: 0.42,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    // idle drift, always present, very slow
    const idleY = t * 0.045;

    // subtle scroll-driven turn — the sculpture opens toward the camera
    const scrollY = p * 0.5;

    // weighted mouse parallax, lerped — never attached raw to the cursor
    rotTarget.x = pointerState.y * 0.12;
    rotTarget.y = pointerState.x * 0.16;

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
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh geometry={bodyGeo} material={material} castShadow receiveShadow />
      <mesh geometry={beamGeo} material={material} castShadow receiveShadow />
      <mesh geometry={ringGeo} material={material} castShadow receiveShadow />
    </group>
  );
}
