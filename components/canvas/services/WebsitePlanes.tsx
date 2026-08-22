"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial, createPanelMaterial } from "@/lib/webgl/materials";
import { ROOM_Z, roomEnvelope } from "@/lib/webgl/act2-layout";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

interface Canvas {
  pos: THREE.Vector3;
  size: [number, number];
  depthFactor: number;
}

const CANVASES: Canvas[] = [
  { pos: new THREE.Vector3(-2.4, 0.6, 1.6), size: [1.9, 1.3], depthFactor: 1 },
  { pos: new THREE.Vector3(0.4, 1.1, 0.4), size: [1.5, 2.0], depthFactor: 0.7 },
  { pos: new THREE.Vector3(2.5, -0.3, 1.1), size: [2.1, 1.4], depthFactor: 0.9 },
  { pos: new THREE.Vector3(-1.1, -1.2, -0.6), size: [1.7, 1.1], depthFactor: 1.2 },
  { pos: new THREE.Vector3(1.3, -1.4, 1.9), size: [1.3, 1.7], depthFactor: 0.6 },
];

export default function WebsitePlanes() {
  const group = useRef<THREE.Group>(null);
  const frames = useRef<(THREE.Group | null)[]>([]);
  const envRef = useRef(0);

  const gold = useMemo(() => createGoldMaterial(), []);
  const screen = useMemo(() => createPanelMaterial("#12151b"), []);

  useFrame((state, delta) => {
    const target = roomEnvelope(scrollState.act2Progress, 1);
    envRef.current = THREE.MathUtils.damp(envRef.current, target, 2, delta);
    const env = envRef.current;
    if (!group.current) return;

    group.current.visible = env > 0.01;

    frames.current.forEach((f, i) => {
      if (!f) return;
      const c = CANVASES[i];
      const enter = new THREE.Vector3(c.pos.x, c.pos.y, c.pos.z - 3.5);
      f.position.lerpVectors(enter, c.pos, env);
      f.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.08 +
        pointerState.x * 0.06 * c.depthFactor;
      f.rotation.x = pointerState.y * -0.05 * c.depthFactor;
      const mat = (f.children[1] as THREE.Mesh)
        ?.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = env;
      }
    });
  });

  return (
    <group ref={group} position={[0, 0, ROOM_Z[1]]}>
      {CANVASES.map((c, i) => (
        <group
          key={i}
          ref={(el) => {
            frames.current[i] = el;
          }}
        >
          <mesh material={gold} position={[0, 0, -0.02]}>
            <boxGeometry args={[c.size[0] + 0.06, c.size[1] + 0.06, 0.03]} />
          </mesh>
          <mesh material={screen}>
            <boxGeometry args={[c.size[0], c.size[1], 0.04]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
