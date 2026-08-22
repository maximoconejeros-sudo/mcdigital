"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMGeometries } from "@/lib/webgl/geometry";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const { bodyGeo, beamGeo } = useMemo(() => createMGeometries(), []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#131315"),
        metalness: 1,
        roughness: 0.13,
        envMapIntensity: 2.6,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
        iridescence: 0.14,
        iridescenceIOR: 1.25,
        iridescenceThicknessRange: [110, 380],
        sheen: 0.18,
        sheenColor: new THREE.Color("#c9a869"),
        sheenRoughness: 0.5,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // idle drift, always present, very slow
    const idleY = t * 0.045;

    // subtle scroll-driven turn — the sculpture opens toward the camera
    const scrollY = scrollState.progress * 0.5;

    // weighted mouse parallax, lerped — never attached raw to the cursor
    rotTarget.x = pointerState.y * 0.12;
    rotTarget.y = pointerState.x * 0.16;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      idleY + scrollY + rotTarget.y,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      rotTarget.x * 0.6,
      2.2,
      delta
    );
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh geometry={bodyGeo} material={material} castShadow receiveShadow />
      <mesh geometry={beamGeo} material={material} castShadow receiveShadow />
    </group>
  );
}
