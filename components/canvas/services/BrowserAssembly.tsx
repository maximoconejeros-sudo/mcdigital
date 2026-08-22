"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial, createPanelMaterial } from "@/lib/webgl/materials";
import { ROOM_Z, roomEnvelope } from "@/lib/webgl/act2-layout";
import { scrollState } from "@/lib/animation/scroll-store";

interface Block {
  assembled: THREE.Vector3;
  scatter: THREE.Vector3;
  scatterRot: THREE.Euler;
  size: [number, number, number];
}

const BLOCKS: Block[] = [
  {
    assembled: new THREE.Vector3(0, 0.95, 0.05),
    scatter: new THREE.Vector3(-2.6, 2.4, 1.4),
    scatterRot: new THREE.Euler(0.4, 0.6, 0.3),
    size: [3.2, 0.1, 0.04],
  },
  {
    assembled: new THREE.Vector3(-0.75, 0.35, 0.05),
    scatter: new THREE.Vector3(2.8, 1.6, -1.8),
    scatterRot: new THREE.Euler(-0.3, 0.8, 0.5),
    size: [1.9, 0.26, 0.04],
  },
  {
    assembled: new THREE.Vector3(-0.75, 0.02, 0.05),
    scatter: new THREE.Vector3(-3, -1.8, 1.2),
    scatterRot: new THREE.Euler(0.6, -0.4, -0.3),
    size: [1.5, 0.12, 0.04],
  },
  {
    assembled: new THREE.Vector3(-0.86, -0.4, 0.05),
    scatter: new THREE.Vector3(2.4, -2.2, -1.4),
    scatterRot: new THREE.Euler(-0.5, -0.6, 0.4),
    size: [0.86, 0.24, 0.05],
  },
];

export default function BrowserAssembly() {
  const group = useRef<THREE.Group>(null);
  const blockRefs = useRef<(THREE.Mesh | null)[]>([]);
  const imageRef = useRef<THREE.Mesh>(null);
  const envRef = useRef(0);

  const gold = useMemo(() => createGoldMaterial(), []);
  const panel = useMemo(() => createPanelMaterial("#0a0b0e"), []);
  const screen = useMemo(() => createPanelMaterial("#141821"), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = roomEnvelope(scrollState.act2Progress, 0);
    envRef.current = THREE.MathUtils.damp(envRef.current, target, 2.4, delta);
    const env = envRef.current;

    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;

    BLOCKS.forEach((b, i) => {
      const mesh = blockRefs.current[i];
      if (!mesh) return;
      mesh.position.lerpVectors(b.scatter, b.assembled, env);
      mesh.rotation.set(
        b.scatterRot.x * (1 - env),
        b.scatterRot.y * (1 - env),
        b.scatterRot.z * (1 - env)
      );
      const mat = mesh.material as THREE.Material;
      mat.transparent = true;
      (mat as THREE.MeshPhysicalMaterial).opacity = 0.25 + env * 0.75;
    });

    if (imageRef.current) {
      const assembled = new THREE.Vector3(0.85, -0.12, 0.03);
      const scatter = new THREE.Vector3(3.4, 2.6, -2.2);
      imageRef.current.position.lerpVectors(scatter, assembled, env);
      const mat = imageRef.current.material as THREE.MeshPhysicalMaterial;
      mat.transparent = true;
      mat.opacity = 0.15 + env * 0.85;
    }
  });

  return (
    <group ref={group} position={[0, 0, ROOM_Z[0]]}>
      {/* gold bezel */}
      <mesh position={[0, 0, -0.03]} material={gold}>
        <boxGeometry args={[3.7, 2.32, 0.05]} />
      </mesh>
      {/* dark screen */}
      <mesh material={panel}>
        <boxGeometry args={[3.6, 2.2, 0.06]} />
      </mesh>

      {BLOCKS.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => {
            blockRefs.current[i] = el;
          }}
          material={gold}
        >
          <boxGeometry args={b.size} />
        </mesh>
      ))}

      <mesh ref={imageRef} material={screen}>
        <boxGeometry args={[1.3, 1.5, 0.04]} />
      </mesh>
    </group>
  );
}
