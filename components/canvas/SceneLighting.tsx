"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Cinematic studio rig for the gold MC monogram — soft brushed-metal
 * photography, not a hard jewelry-catalog specular hit. The environment
 * map is procedural (Lightformer planes baked into a small cubemap, no
 * external HDRI fetch); real scene lights add direct key/rim/fill on top.
 * Every Lightformer here is large relative to its distance from the
 * object, which is what actually softens a highlight — a small light far
 * away reads as a hot point no matter how you dim it, a large light reads
 * as a gradient.
 */
export default function SceneLighting() {
  return (
    <>
      <Environment resolution={512} frames={1}>
        <group rotation={[0, Math.PI / 2, 0]}>
          {/* broad soft key, upper-left — large and close enough that its
              highlight rolls off across the whole face instead of landing
              as a small bright disc */}
          <Lightformer
            form="rect"
            intensity={3.2}
            color="#fff3df"
            position={[1.4, 2.6, 2.2]}
            scale={[4, 3, 1]}
            target={[0, 0, 0]}
          />
          {/* frontal fill — keeps the silhouette legible and the shadow
              side a warm dark gold rather than crushed black */}
          <Lightformer
            form="rect"
            intensity={1.5}
            color="#f2dfb2"
            position={[0, 0.3, 5.2]}
            scale={[2.8, 2.8, 1]}
            target={[0, 0, 0]}
          />
          {/* broad warm fill from the left */}
          <Lightformer
            form="rect"
            intensity={1.3}
            color="#a88a5c"
            position={[-4, 0.5, 2.4]}
            scale={[2.6, 4.8, 1]}
            target={[0, 0, 0]}
          />
          {/* champagne rim from behind — a soft glancing edge, not a hard
              accent line */}
          <Lightformer
            form="rect"
            intensity={3.4}
            color="#cdb583"
            position={[0.6, 0.8, -4.5]}
            scale={[3, 3.6, 1]}
            target={[0, 0, 0]}
          />
          {/* second, gentler rim for a secondary edge glow */}
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#e7d9b8"
            position={[-2.2, -0.6, -2.4]}
            scale={[1, 2.8, 1]}
            target={[0, 0, 0]}
          />
          {/* low ground bounce, very dim */}
          <Lightformer
            form="rect"
            intensity={0.18}
            color="#3a2f1c"
            position={[0, -3, 1]}
            scale={[4, 3, 1]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </Environment>

      <directionalLight position={[2.6, 3.6, 2.2]} intensity={1} color="#fff3df" />
      <directionalLight position={[-2.5, 1, -3.5]} intensity={1.3} color="#c89b3c" />
      <ambientLight intensity={0.14} />
    </>
  );
}
