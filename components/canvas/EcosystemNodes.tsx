"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { createGoldMaterial } from "@/lib/webgl/materials";
import {
  NODES,
  connectionActivation,
  nodePosition,
} from "@/lib/webgl/act3-layout";
import { scrollState } from "@/lib/animation/scroll-store";

export default function EcosystemNodes() {
  const gold = useMemo(() => createGoldMaterial(), []);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Built imperatively (not JSX <line>) — that tag name collides with the
  // DOM's SVGLineElement in TS's JSX namespace inside an R3F tree.
  const lines = useMemo(
    () =>
      NODES.map(() => {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
          color: "#c89b3c",
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        return new THREE.Line(geometry, material);
      }),
    []
  );

  const positions = useMemo(() => {
    return NODES.map((n) => nodePosition(n.angleDeg, new THREE.Vector3()));
  }, []);

  useFrame((state) => {
    const p = scrollState.act3Progress;
    const t = state.clock.elapsedTime;

    positions.forEach((pos, i) => {
      const activation = connectionActivation(p, i);

      const node = nodeRefs.current[i];
      if (node) {
        node.position.copy(pos);
        node.position.y += Math.sin(t * 0.6 + i) * 0.06;
        node.scale.setScalar(0.7 + activation * 0.35);
        const mat = node.material as THREE.MeshPhysicalMaterial;
        mat.transparent = true;
        mat.opacity = 0.25 + activation * 0.75;
      }

      const line = lines[i];
      (line.material as THREE.LineBasicMaterial).opacity = activation * 0.6;
      line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), pos]);

      const label = labelRefs.current[i];
      if (label) label.style.opacity = String(activation);
    });
  });

  return (
    <>
      {NODES.map((n, i) => (
        <mesh
          key={n.label}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          material={gold}
        >
          <octahedronGeometry args={[0.22, 0]} />
          <Html center style={{ pointerEvents: "none" }}>
            <div
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#f4f2ec",
                whiteSpace: "nowrap",
                transform: "translateY(22px)",
                opacity: 0,
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              }}
            >
              {n.label}
            </div>
          </Html>
        </mesh>
      ))}

      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}
