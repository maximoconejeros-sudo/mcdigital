"use client";

/**
 * A fixed warm key light — previously orbited with the live pointer
 * position every frame. Per the rebuilt hero architecture, lighting must
 * be completely static (no per-frame mutation of any kind) so it can
 * never be a source of a visible discontinuity; only the camera moves
 * now. Position is the resting point the old pointer-orbit lerped
 * toward at a centered, still pointer.
 */
export default function PointerKeyLight() {
  return (
    <pointLight
      position={[1.6, 1.2, 2.4]}
      color="#f4dfa8"
      intensity={2.6}
      distance={7}
      decay={2}
    />
  );
}
