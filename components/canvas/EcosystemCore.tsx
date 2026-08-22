"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { createGoldMaterial } from "@/lib/webgl/materials";

export default function EcosystemCore() {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.85, 1), []);
  const material = useMemo(() => createGoldMaterial(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.12;
    mesh.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    const pulse = 1 + Math.sin(t * 1.1) * 0.03;
    mesh.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={mesh} geometry={geo} material={material} castShadow>
      <Html center style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#c89b3c",
            whiteSpace: "nowrap",
            transform: "translateY(46px)",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          Tu negocio
        </div>
      </Html>
    </mesh>
  );
}
