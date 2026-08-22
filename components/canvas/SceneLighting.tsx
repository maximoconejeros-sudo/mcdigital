"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Cinematic studio rig. The environment map is procedural — built from
 * emissive Lightformer planes baked into a small cubemap — so reflections
 * exist with no external HDRI fetch. Real scene lights add direct
 * key / rim highlights on top so the sculpture can genuinely fall into
 * black rather than being lit evenly.
 */
export default function SceneLighting() {
  return (
    <>
      <Environment resolution={512} frames={1}>
        <group rotation={[0, Math.PI / 2, 0]}>
          {/* sharp overhead key — a hard specular streak, not a wash */}
          <Lightformer
            form="rect"
            intensity={9}
            color="#fff8ec"
            position={[1.8, 3.4, 1.6]}
            scale={[1.4, 0.5, 1]}
            target={[0, 0, 0]}
          />
          {/* broad soft fill so shadowed facets stay legible, not black */}
          <Lightformer
            form="rect"
            intensity={0.7}
            color="#aeb8cc"
            position={[-4, 0.5, 2.4]}
            scale={[2.5, 5, 1]}
            target={[0, 0, 0]}
          />
          {/* warm rim from behind — the accent glancing edge */}
          <Lightformer
            form="rect"
            intensity={5}
            color="#c9a869"
            position={[0.6, 0.8, -4.5]}
            scale={[2.4, 3.2, 1]}
            target={[0, 0, 0]}
          />
          {/* second, tighter rim for a crisp secondary highlight */}
          <Lightformer
            form="rect"
            intensity={3.5}
            color="#e7d9b8"
            position={[-2.2, -0.6, -2.4]}
            scale={[0.6, 2.4, 1]}
            target={[0, 0, 0]}
          />
          {/* low ground bounce, very dim */}
          <Lightformer
            form="rect"
            intensity={0.3}
            color="#2c2c2c"
            position={[0, -3, 1]}
            scale={[4, 3, 1]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </Environment>

      <directionalLight position={[2.6, 3.6, 2.2]} intensity={1.1} color="#fff8ec" />
      <directionalLight position={[-2.5, 1, -3.5]} intensity={1.6} color="#c9a869" />
      <ambientLight intensity={0.025} />
    </>
  );
}
