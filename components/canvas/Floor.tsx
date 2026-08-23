"use client";

import * as THREE from "three";

/**
 * An extremely subtle dark floor beneath the monogram — not a mirror, just
 * enough of a low-roughness surface to catch the studio lightformers and
 * ground the object in a physical space rather than floating in flat
 * WebGL black. No real-time reflector / shadow map: at this scale the
 * material's own environment reflection reads as "grounded" cheaply,
 * without an extra render pass.
 */
export default function Floor() {
  return (
    <mesh position={[0, -1.55, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[4.2, 48]} />
      <meshStandardMaterial
        color={new THREE.Color("#050403")}
        metalness={0.55}
        roughness={0.42}
        envMapIntensity={0.7}
      />
    </mesh>
  );
}
