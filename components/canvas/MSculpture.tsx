"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMCGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

const rotTarget = new THREE.Vector2(0, 0);

// Hero rebuild: the sculpture sits clearly right of the headline column,
// never behind it — pushing this through camera look-at alone hit sharply
// diminishing (then inverting) returns, so the object itself carries most
// of the shift in world space instead, which is linear and predictable.
//
// Choreography (mapped onto the hero's own visible-scroll window, roughly
// progress 0-0.32 before the DOM copy has fully exited), in the art
// direction's own quarters:
//   0-20%   hero remains composed, resting right-side position
//   20-45%  MC eases toward the viewer (scale 1 -> 1.06) and shifts
//           further right, turning a controlled ~2deg — camera
//           choreography, not a spinning logo
//   45-70%  the "camera moves closer" beat: scale continues 1.06 -> 1.22
//   70-100% keeps drifting right, becoming a partially abstract gold
//           field that hands off into Scene 02
// The offset, turn and scale all settle back to neutral by progress 0.4,
// well ahead of the aperture dolly, so that established bridge into Scene
// 02 (which assumes an axis-aligned, unscaled object) is unaffected.
const HERO_OFFSET_BASE = 1.15;
const HERO_OFFSET_MID = 1.5;
const HERO_OFFSET_FAR = 1.85;
const HERO_OFFSET_FAR2 = 2.1;
const HERO_TURN = THREE.MathUtils.degToRad(2);
const HERO_SCALE_MID = 1.06;
const HERO_SCALE_MAX = 1.22;
const IDLE_SWAY_DEG = 0.6;

const B20 = 0.064;
const B45 = 0.144;
const B70 = 0.224;
const B100 = 0.32;

// The object's own "camera reveal" — mirrors CameraRig's load-in tween via
// the same shared scrollState.heroIntroT (0 at play-start, eased to 1 over
// ~2.6s), so the sculpture is discovered slightly larger, further right
// and turned away before settling heavy and deliberate into its resting
// frame, like a product reveal rather than a UI element popping in.
const INTRO_SCALE_EXTRA = 0.1;
const INTRO_OFFSET_EXTRA = 0.9;
const INTRO_ROT_DEG = 4;

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => createGoldMaterial(), []);

  // The floor reflection: a genuine mirrored duplicate of the letters
  // themselves (not a lit plane) — sharing the exact same gold material
  // so it reads as a warm amber echo of the shapes above it, per the
  // reference. Nested inside the same group so it tracks every scroll-
  // driven offset/rotation/scale the resting letters get, and reflected
  // across the letters' own true bottom edge (read from the geometry's
  // bounding box rather than a guessed constant).
  const mirrorY = useMemo(() => {
    mGeo.computeBoundingBox();
    return mGeo.boundingBox ? mGeo.boundingBox.min.y * 2 : -1.87;
  }, [mGeo]);
  const reflectMaterial = useMemo(() => {
    const m = createGoldMaterial();
    m.transparent = true;
    m.opacity = 0.3;
    m.depthWrite = false;
    return m;
  }, []);

  const handlePointerOver = () => {
    pointerState.overMC = true;
  };
  const handlePointerOut = () => {
    pointerState.overMC = false;
  };

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;
    const introT = scrollState.heroIntroT;

    // weighted mouse parallax — capped tight per the brief (rotY <=1.5deg,
    // rotX <=0.7deg), lerped, never attached raw to the cursor
    rotTarget.x = pointerState.y * THREE.MathUtils.degToRad(0.7);
    rotTarget.y = pointerState.x * THREE.MathUtils.degToRad(1.5);

    // a slow bounded oscillation, not a spin: it reverses direction every
    // few seconds rather than accumulating, so the object never turns past
    // its own idle range on its own
    const idleSway = Math.sin(t * 0.12) * THREE.MathUtils.degToRad(IDLE_SWAY_DEG);

    // the camera dollies straight through the aperture on the object's
    // local Z axis later in the journey — settle rotation back to 0 heading
    // into that window so the hole stays lined up with the fixed camera
    // path instead of rotating a solid gold face into the lens.
    const settle = 1 - THREE.MathUtils.smoothstep(p, 0.52, 0.7);

    const turnIn = THREE.MathUtils.smoothstep(p, B20, B45);
    const turnReturn = 1 - THREE.MathUtils.smoothstep(p, B100, 0.4);
    const heroTurn = HERO_TURN * turnIn * turnReturn;
    const introRot = THREE.MathUtils.degToRad(-INTRO_ROT_DEG) * (1 - introT);

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (heroTurn + idleSway + rotTarget.y + introRot) * settle,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      rotTarget.x * settle,
      2.2,
      delta
    );

    // hero composition push — right from rest, drifts further right across
    // three bands as it turns, scales and prepares to hand off, then
    // settles back to 0 by p=0.4 for the aperture dolly
    const midT = THREE.MathUtils.smoothstep(p, B20, B45);
    const farT = THREE.MathUtils.smoothstep(p, B45, B70);
    const far2T = THREE.MathUtils.smoothstep(p, B70, B100);
    let targetOffset = THREE.MathUtils.lerp(HERO_OFFSET_BASE, HERO_OFFSET_MID, midT);
    targetOffset = THREE.MathUtils.lerp(targetOffset, HERO_OFFSET_FAR, farT);
    targetOffset = THREE.MathUtils.lerp(targetOffset, HERO_OFFSET_FAR2, far2T);
    const returnT = THREE.MathUtils.smoothstep(p, B100, 0.4);
    targetOffset = THREE.MathUtils.lerp(targetOffset, 0, returnT);
    const introOffset = INTRO_OFFSET_EXTRA * (1 - introT);

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetOffset + introOffset,
      2.2,
      delta
    );

    // scale eases through 1 -> 1.06 -> 1.22 across the 20-70% window as it
    // leaves, then settles back to 1 before the aperture dolly (which
    // assumes a true-scale object)
    let targetScale = THREE.MathUtils.lerp(1, HERO_SCALE_MID, midT);
    targetScale = THREE.MathUtils.lerp(targetScale, HERO_SCALE_MAX, farT);
    targetScale = THREE.MathUtils.lerp(targetScale, 1, returnT);
    const introScale = THREE.MathUtils.lerp(1 + INTRO_SCALE_EXTRA, 1, introT);
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, targetScale * introScale, 2.2, delta)
    );
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
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

      {/* the floor reflection — an actual mirrored copy of the letters,
       * not a lit plane. Reflected across their own true bottom edge, so
       * it shares their exact (finite, letter-shaped) silhouette rather
       * than a full-width rectangle — that's what keeps it from ever
       * showing the hard "horizon line" a large flat floor plane did in
       * earlier attempts. */}
      <group position={[0, mirrorY, 0]} scale={[1, -1, 1]}>
        <mesh geometry={mGeo} material={reflectMaterial} />
        <mesh geometry={cGeo} material={reflectMaterial} />
      </group>
    </group>
  );
}
