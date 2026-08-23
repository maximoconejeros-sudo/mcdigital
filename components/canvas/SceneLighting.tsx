"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Cinematic studio rig for the gold MC monogram — jewelry-photography
 * lighting, not gaming RGB. The environment map is procedural (Lightformer
 * planes baked into a small cubemap, no external HDRI fetch); real scene
 * lights add direct key/rim/fill on top so the sculpture always reads a
 * clear silhouette against black while still falling into shadow at its
 * edges.
 */
export default function SceneLighting() {
  return (
    <>
      <Environment resolution={512} frames={1}>
        <group rotation={[0, Math.PI / 2, 0]}>
          {/* sharp overhead key — a hard specular streak on the gold */}
          <Lightformer
            form="rect"
            intensity={9.5}
            color="#fff3df"
            position={[1.8, 3.4, 1.6]}
            scale={[1.1, 0.4, 1]}
            target={[0, 0, 0]}
          />
          {/* narrow frontal fill — just enough that the silhouette always
              reads, tightened so it no longer washes the shadow facets flat */}
          <Lightformer
            form="rect"
            intensity={0.32}
            color="#f2dfb2"
            position={[0, 0.3, 5.2]}
            scale={[1.6, 1.6, 1]}
            target={[0, 0, 0]}
          />
          {/* broad warm fill, dimmer and narrower than before — legible
              shadows, not flattened ones */}
          <Lightformer
            form="rect"
            intensity={0.4}
            color="#8a7148"
            position={[-4, 0.5, 2.4]}
            scale={[1.8, 4, 1]}
            target={[0, 0, 0]}
          />
          {/* champagne rim from behind — the accent glancing edge, tuned
              less saturated/orange than a straight gold hex */}
          <Lightformer
            form="rect"
            intensity={5.8}
            color="#cdb583"
            position={[0.6, 0.8, -4.5]}
            scale={[2.2, 3, 1]}
            target={[0, 0, 0]}
          />
          {/* second, tighter rim for a crisp secondary highlight */}
          <Lightformer
            form="rect"
            intensity={4.6}
            color="#e7d9b8"
            position={[-2.2, -0.6, -2.4]}
            scale={[0.5, 2.2, 1]}
            target={[0, 0, 0]}
          />
          {/* low ground bounce, very dim */}
          <Lightformer
            form="rect"
            intensity={0.22}
            color="#3a2f1c"
            position={[0, -3, 1]}
            scale={[4, 3, 1]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </Environment>

      <directionalLight position={[2.6, 3.6, 2.2]} intensity={1.35} color="#fff3df" />
      <directionalLight position={[-2.5, 1, -3.5]} intensity={1.9} color="#c89b3c" />
      <ambientLight intensity={0.035} />
    </>
  );
}
