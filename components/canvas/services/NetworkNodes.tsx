"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM_Z, roomEnvelope } from "@/lib/webgl/act2-layout";
import { scrollState } from "@/lib/animation/scroll-store";

const NODE_COUNT = 26;

function buildNetwork() {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(
      new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(4.2),
        THREE.MathUtils.randFloatSpread(2.6),
        THREE.MathUtils.randFloatSpread(2.6)
      )
    );
  }

  // connect each node to its 2 nearest neighbours
  const linePositions: number[] = [];
  nodes.forEach((n, i) => {
    const distances = nodes
      .map((other, j) => ({ j, d: i === j ? Infinity : n.distanceTo(other) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    distances.forEach(({ j }) => {
      linePositions.push(n.x, n.y, n.z, nodes[j].x, nodes[j].y, nodes[j].z);
    });
  });

  const nodePositions = new Float32Array(nodes.length * 3);
  nodes.forEach((n, i) => n.toArray(nodePositions, i * 3));

  return { nodePositions, linePositions: new Float32Array(linePositions) };
}

export default function NetworkNodes() {
  const group = useRef<THREE.Group>(null);
  const nodeMat = useRef<THREE.PointsMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const envRef = useRef(0);

  const { nodePositions, linePositions } = useMemo(() => buildNetwork(), []);

  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    return g;
  }, [nodePositions]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  useFrame((state, delta) => {
    const target = roomEnvelope(scrollState.act2Progress, 2);
    envRef.current = THREE.MathUtils.damp(envRef.current, target, 2, delta);
    const env = envRef.current;

    if (group.current) {
      group.current.visible = env > 0.01;
      group.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
    if (nodeMat.current) nodeMat.current.opacity = env;
    if (lineMat.current) lineMat.current.opacity = env * 0.35;
  });

  return (
    <group ref={group} position={[0, 0, ROOM_Z[2]]}>
      <points geometry={nodeGeo}>
        <pointsMaterial
          ref={nodeMat}
          color="#f2dfb2"
          size={0.06}
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          ref={lineMat}
          color="#c89b3c"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
