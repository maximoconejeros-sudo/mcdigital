"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  particlesFragment,
  particlesVertex,
} from "@/lib/webgl/shaders/particles";
import { scrollState } from "@/lib/animation/scroll-store";

export default function Particles({ count = 1800 }: { count?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const opacityRef = useRef(0);

  // One-time scatter for static particle geometry — intentionally
  // non-deterministic (Math.random), recomputed only when `count` changes.
  /* eslint-disable react-hooks/purity */
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.4;
      const z = THREE.MathUtils.randFloatSpread(6.4);

      positions[i * 3 + 0] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -0.16 + Math.sin(angle) * radius * 0.62;
      positions[i * 3 + 2] = z;

      seeds[i] = Math.random();
      sizes[i] = 0.4 + Math.random() * 1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);
  /* eslint-enable react-hooks/purity */

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 1 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColorA: { value: new THREE.Color("#c9a869") },
      uColorB: { value: new THREE.Color("#f4f2ec") },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );

    // particles are near-invisible outside the through-the-aperture phase
    const p = scrollState.progress;
    const target =
      p < 0.55 ? 0 : p < 0.66 ? (p - 0.55) / 0.11 : p < 0.9 ? 1 : 1 - (p - 0.9) / 0.1 * 0.4;

    opacityRef.current = THREE.MathUtils.damp(
      opacityRef.current,
      THREE.MathUtils.clamp(target, 0, 1),
      3,
      delta
    );
    material.current.uniforms.uOpacity.value = opacityRef.current;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
