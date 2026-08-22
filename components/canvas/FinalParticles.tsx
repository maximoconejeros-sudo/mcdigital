"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  finalParticlesFragment,
  finalParticlesVertex,
} from "@/lib/webgl/shaders/finalParticles";
import { scrollState } from "@/lib/animation/scroll-store";

/**
 * Act IX's particle field — scattered wide across the dark, then radially
 * contracted toward the monogram as the user scrolls ("particles from
 * previous scenes slowly appear... they begin converging"). Opacity and
 * convergence both track scrollState.act9Progress, set by FinalNarrative.
 */
export default function FinalParticles({ count = 1400 }: { count?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const opacityRef = useRef(0);
  const convergeRef = useRef(0);

  /* eslint-disable react-hooks/purity */
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 2.4;
      const z = THREE.MathUtils.randFloatSpread(5);

      positions[i * 3 + 0] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -0.16 + Math.sin(angle) * radius * 0.6;
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
      uSize: { value: 0.6 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uConverge: { value: 0 },
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

    const p = scrollState.act9Progress;
    const targetOpacity = p < 0.05 ? 0 : p < 0.7 ? 0.4 : 0.4 - (p - 0.7) / 0.3 * 0.25;
    const targetConverge = THREE.MathUtils.clamp((p - 0.05) / 0.55, 0, 1);

    opacityRef.current = THREE.MathUtils.damp(
      opacityRef.current,
      THREE.MathUtils.clamp(targetOpacity, 0, 1),
      3,
      delta
    );
    convergeRef.current = THREE.MathUtils.damp(
      convergeRef.current,
      targetConverge,
      2.2,
      delta
    );

    material.current.uniforms.uOpacity.value = opacityRef.current;
    material.current.uniforms.uConverge.value = convergeRef.current;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={finalParticlesVertex}
        fragmentShader={finalParticlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
