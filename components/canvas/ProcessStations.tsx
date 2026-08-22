"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { createNumeralTexture } from "@/lib/webgl/canvas-texture";
import { STATIONS, STATION_X, stationEnvelope } from "@/lib/webgl/act5-layout";
import { scrollState } from "@/lib/animation/scroll-store";

export default function ProcessStations() {
  const numeralRefs = useRef<(THREE.Mesh | null)[]>([]);
  const markerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const gold = useMemo(() => createGoldMaterial(), []);

  const numeralMaterials = useMemo(
    () =>
      STATIONS.map(
        (s) =>
          new THREE.MeshBasicMaterial({
            map: createNumeralTexture(s.number),
            transparent: true,
            opacity: 0,
          })
      ),
    []
  );

  const railGeo = useMemo(() => {
    const points = STATION_X.map((x) => new THREE.Vector3(x, -1.4, -1.5));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  const rail = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: "#c89b3c",
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    return new THREE.Line(railGeo, material);
  }, [railGeo]);

  useFrame((state) => {
    const p = scrollState.act5Progress;
    const t = state.clock.elapsedTime;

    STATIONS.forEach((_, i) => {
      const env = stationEnvelope(p, i);

      const numeral = numeralRefs.current[i];
      if (numeral) {
        const mat = numeral.material as THREE.MeshBasicMaterial;
        mat.opacity = env * 0.85;
        numeral.position.y = -0.1 + (1 - env) * 0.4;
      }

      const marker = markerRefs.current[i];
      if (marker) {
        marker.scale.setScalar(0.6 + env * 0.5);
        marker.position.y = -1.4 + Math.sin(t * 0.7 + i) * 0.05;
        const mat = marker.material as THREE.MeshPhysicalMaterial;
        mat.transparent = true;
        mat.opacity = 0.35 + env * 0.65;
      }
    });
  });

  return (
    <>
      <primitive object={rail} />
      {STATIONS.map((s, i) => (
        <mesh
          key={s.number}
          ref={(el) => {
            numeralRefs.current[i] = el;
          }}
          position={[STATION_X[i], -0.1, -2.4]}
          material={numeralMaterials[i]}
        >
          <planeGeometry args={[6.2, 6.2]} />
        </mesh>
      ))}
      {STATIONS.map((s, i) => (
        <mesh
          key={`marker-${s.number}`}
          ref={(el) => {
            markerRefs.current[i] = el;
          }}
          position={[STATION_X[i], -1.4, -1.5]}
          material={gold}
        >
          <octahedronGeometry args={[0.16, 0]} />
        </mesh>
      ))}
    </>
  );
}
