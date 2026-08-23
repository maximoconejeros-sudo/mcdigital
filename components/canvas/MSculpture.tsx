"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createMCGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState } from "@/lib/animation/scroll-store";

// Rebuild: the MC sculpture is now a completely STATIC object. Every prior
// version of this file drove position/rotation/scale from scroll progress
// (plus a damped mouse-parallax term) inside a per-frame useFrame — that
// architecture is what was under suspicion for the hero's flicker/jump
// reports, so it has been removed entirely rather than patched again. There
// is no useFrame here at all: this component has nothing to mutate every
// frame, so it cannot be a source of a per-frame discontinuity.
//
// The fixed transform below is exactly the resting/settled pose the old
// scroll choreography converged on at rest (HERO_OFFSET_BASE=1.15,
// rotation=0, scale=1) — the composition the design was approved against —
// so removing the animation doesn't change what's on screen at any point
// a viewer actually looks at the hero. All remaining hero motion (the
// restrained cinematic drift previously carried by this object) now lives
// entirely in CameraRig, driven by the same single scroll-progress value.
const REST_POSITION_X = 1.15;

export default function MSculpture() {
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => createGoldMaterial(), []);

  // The floor reflection — a mirrored duplicate of the letters, reflected
  // across their own true bottom edge, sharing the same gold material.
  // Entirely static, same as everything else here: computed once via
  // useMemo, never touched by a useFrame, so it inherits none of the old
  // per-frame mutation this rebuild removed.
  const mirrorY = useMemo(() => {
    mGeo.computeBoundingBox();
    return mGeo.boundingBox ? mGeo.boundingBox.min.y * 2 : -1.87;
  }, [mGeo]);
  const reflectMaterial = useMemo(() => {
    const m = createGoldMaterial();
    m.transparent = true;
    m.opacity = 0.12;
    m.depthWrite = false;
    return m;
  }, []);
  const fadeMaterial = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    let map: THREE.CanvasTexture | undefined;
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, size);
      gradient.addColorStop(0, "rgba(5,5,5,0)");
      gradient.addColorStop(0.55, "rgba(5,5,5,0.7)");
      gradient.addColorStop(1, "rgba(5,5,5,1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, size);
      map = new THREE.CanvasTexture(canvas);
    }
    return new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      color: "#050505",
    });
  }, []);

  const handlePointerOver = () => {
    pointerState.overMC = true;
  };
  const handlePointerOut = () => {
    pointerState.overMC = false;
  };

  return (
    <group position={[REST_POSITION_X, 0, 0]}>
      <mesh
        geometry={mGeo}
        material={material}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      <mesh
        geometry={cGeo}
        material={material}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      <group position={[0, mirrorY, 0]} scale={[1, -1, 1]}>
        <mesh geometry={mGeo} material={reflectMaterial} />
        <mesh geometry={cGeo} material={reflectMaterial} />
      </group>
      <mesh position={[1.05, mirrorY - 0.55, 0.62]}>
        <planeGeometry args={[4.2, 1.9]} />
        <primitive object={fadeMaterial} attach="material" />
      </mesh>
    </group>
  );
}
