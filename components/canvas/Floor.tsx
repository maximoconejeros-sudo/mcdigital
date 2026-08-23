"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * A grounding glow beneath the monogram, not a literal physically-lit
 * mirror. Two earlier attempts at a real reflective floor (a plain
 * meshStandardMaterial plane, then drei's MeshReflectorMaterial) both
 * ended up reading as a flat lit "table" spanning the whole frame — a
 * standard forward-rendered material has no way to opt out of the scene's
 * own light rig per-object (three.js layers gate camera/raycast visibility,
 * not which lights reach which objects), so no amount of tuning the
 * material's own roughness/color/reflection-strength could stop the two
 * directional key lights from broadly lighting a large flat plane. A
 * meshBasicMaterial sidesteps that entirely — it ignores scene lights by
 * construction — painted with a soft procedural radial-gradient texture
 * that's already fully transparent at its own edges, so the plane's
 * geometric boundary is never visible, only a warm hint of light pooling
 * under the letters.
 */
function createGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(201, 157, 69, 0.4)");
  gradient.addColorStop(0.45, "rgba(120, 92, 40, 0.18)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function Floor() {
  const texture = useMemo(() => createGlowTexture(), []);
  if (!texture) return null;

  return (
    <mesh position={[1.3, -0.92, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.4, 2.6]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
}
