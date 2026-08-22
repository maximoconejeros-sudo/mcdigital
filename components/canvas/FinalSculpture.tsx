"use client";

/* eslint-disable react-hooks/immutability --
 * Same documented R3F pattern as MSculpture.tsx / CameraRig.tsx:
 * imperatively mutating the material/group each frame inside useFrame,
 * outside React's render cycle. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMCGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

// rotation.y = 0 is the geometry's true front-facing pose (same convention
// MSculpture settles back to before Act I's aperture dolly) — the object's
// front face points straight down +Z at a camera sitting on that axis,
// which is exactly FinalCameraRig's framing. It only blows out white when
// the camera travels INTO the punched hole along that axis, which this
// scene's camera never does (it holds well back, z 6.9-7.4), so front-on
// is safe here. The monogram is allowed a visible turn on entrance but is
// non-negotiably required to resolve to that exact front-facing pose —
// this is the site's final brand shot.
const ENTRY_YAW = Math.PI * 0.22;

/**
 * Act IX's monogram — deliberately independent of scrollState.progress
 * (Act I's rotation clock, which would already be pinned at its settled
 * end value here). Turns elegantly into a front-facing rest pose and
 * materializes — scale and opacity both ease in — as the particle field
 * converges around it, driven by scrollState.act9Progress.
 */
export default function FinalSculpture() {
  const group = useRef<THREE.Group>(null);
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => {
    const mat = createGoldMaterial();
    mat.transparent = true;
    mat.opacity = 0;
    return mat;
  }, []);

  const scaleRef = useRef(0.5);
  const posRef = useRef(new THREE.Vector3(1.5, -0.15, -1.9));

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollState.act9Progress;
    const brandT = scrollState.act9BrandT;

    // resolves to exactly 0 well before the scene finishes revealing, then
    // holds — the visitor gets an elegant turn on the way in, never a
    // sideways or 3/4 monogram at rest
    const settle = THREE.MathUtils.smoothstep(p, 0.12, 0.5);
    const residual = 1 - settle;

    const idleY = ENTRY_YAW * residual + Math.sin(t * 0.11) * 0.03 * residual;
    // pointer parallax is real but capped small, and fades further as it
    // settles, so cursor movement can never rotate the final shot off-axis
    rotTarget.x = pointerState.y * 0.05 * (0.3 + residual * 0.7);
    rotTarget.y = pointerState.x * 0.06 * (0.3 + residual * 0.7);

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      idleY + rotTarget.y,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      rotTarget.x * 0.5,
      2.2,
      delta
    );
    // ramps up faster than the old black-background curve: against the
    // warm-white/champagne frame, a long stretch at partial opacity reads
    // as pale/washed-out gray instead of a glow, so it needs to reach a
    // solid, high opacity well before the copy finishes revealing
    const reveal = THREE.MathUtils.smoothstep(p, 0.1, 0.4);

    scaleRef.current = THREE.MathUtils.damp(
      scaleRef.current,
      THREE.MathUtils.lerp(0.5, 0.86, reveal),
      2.4,
      delta
    );
    group.current.scale.setScalar(scaleRef.current);
    material.opacity = THREE.MathUtils.damp(material.opacity, reveal * 0.96, 2.4, delta);

    // closing brand moment: drifts from its cropped, right-of-frame
    // position back to dead center as the camera pulls away — the final
    // brand shot, not a permanently off-center composition
    const targetX = THREE.MathUtils.lerp(1.5, 0, brandT);
    const targetY = THREE.MathUtils.lerp(-0.15, 0, brandT);
    posRef.current.x = THREE.MathUtils.damp(posRef.current.x, targetX, 2, delta);
    posRef.current.y = THREE.MathUtils.damp(posRef.current.y, targetY, 2, delta);
    group.current.position.x = posRef.current.x;
    group.current.position.y = posRef.current.y;
  });

  return (
    // pushed right and back — huge, cropped off the right edge, sitting in
    // background depth behind the copy rather than centered under it — the
    // JS above drifts it back to center for the closing brand moment
    <group ref={group} position={[1.5, -0.15, -1.9]}>
      <mesh geometry={mGeo} material={material} castShadow receiveShadow />
      <mesh geometry={cGeo} material={material} castShadow receiveShadow />
    </group>
  );
}
