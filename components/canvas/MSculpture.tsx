"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMCGeometries } from "@/lib/webgl/geometry";
import { createGoldMaterial } from "@/lib/webgl/materials";
import { pointerState, scrollState } from "@/lib/animation/scroll-store";

// Hero rebuild: the sculpture sits clearly right of the headline column,
// never behind it — pushing this through camera look-at alone hit sharply
// diminishing (then inverting) returns, so the object itself carries most
// of the shift in world space instead, which is linear and predictable.
//
// Every scroll-driven value below is a PURE function of scrollState.progress
// alone — smoothstep/lerp chains, no THREE.MathUtils.damp, no frame-to-frame
// carry-over. That's deliberate: a damped value's output depends on how much
// time has passed and what it happened to be last frame, which means the
// same scroll position can render slightly differently depending on how you
// got there — fine for a live pointer, not acceptable for "scroll down, then
// back up must reproduce the exact original frame." Only the mouse-parallax
// contribution (mouseYaw/mousePitch below) is damped, since that's tracking
// a live, continuously-changing input, not scroll history — it's summed on
// top of the deterministic scroll rotation, not blended into it.
//
// Choreography (mapped onto the hero's own visible-scroll window, roughly
// progress 0-0.32 before the DOM copy has fully exited):
//   0-15%   hero fully established, resting right-side position
//   15-70%  a restrained cinematic drift — a few degrees of turn, a hair
//           of rightward movement, scale nudging up by ~3.5% at most
//   70-100% eases back toward neutral, arriving there by progress 0.4 —
//           well ahead of the aperture dolly (in camera-path.ts, untouched
//           here), which assumes an axis-aligned, unscaled object
const HERO_OFFSET_BASE = 1.15;
const HERO_OFFSET_DRIFT = 0.3;
const HERO_TURN = THREE.MathUtils.degToRad(3);
const HERO_SCALE_MAX = 1.035;
const IDLE_SWAY_DEG = 0.5;

const B15 = 0.048;
const B45 = 0.144;
const B70 = 0.224;
const B100 = 0.32;

// The object's own "camera reveal" — mirrors CameraRig's load-in tween via
// the same shared scrollState.heroIntroT (0 at play-start, eased to 1 over
// ~2.6s), so the sculpture is discovered slightly larger, further right
// and turned away before settling heavy and deliberate into its resting
// frame, like a product reveal rather than a UI element popping in. This
// only ever runs once per page load — heroIntroT is a module-level value
// that CameraRig's mount effect resets to 0 exactly once, and Experience
// itself no longer unmounts/remounts during scrolling (see app/page.tsx),
// so this reveal can't accidentally replay.
const INTRO_SCALE_EXTRA = 0.1;
const INTRO_OFFSET_EXTRA = 0.9;
const INTRO_ROT_DEG = 4;

export default function MSculpture() {
  const group = useRef<THREE.Group>(null);
  const mouseYaw = useRef(0);
  const mousePitch = useRef(0);
  const { mGeo, cGeo } = useMemo(() => createMCGeometries(), []);
  const material = useMemo(() => createGoldMaterial(), []);

  // The floor reflection: a genuine mirrored duplicate of the letters
  // themselves (not a lit plane) — sharing the exact same gold material
  // so it reads as a warm amber echo of the shapes above it. Nested inside
  // the same group so it tracks every scroll-driven offset/rotation/scale
  // the resting letters get, and reflected across the letters' own true
  // bottom edge (read from the geometry's bounding box rather than a
  // guessed constant). Opacity kept low and a front-facing fade mask
  // dissolves it into the floor rather than reading as a second object.
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

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;
    const introT = scrollState.heroIntroT;

    // weighted mouse parallax — capped tight per the brief (rotY <=1.5deg,
    // rotX <=0.7deg). This is the one legitimately time-smoothed value
    // here: it tracks a live pointer, not scroll history, and is summed
    // onto the deterministic scroll rotation below rather than mixed
    // into a single damped blend.
    mouseYaw.current = THREE.MathUtils.damp(
      mouseYaw.current,
      pointerState.x * THREE.MathUtils.degToRad(1.5),
      4,
      delta
    );
    mousePitch.current = THREE.MathUtils.damp(
      mousePitch.current,
      pointerState.y * THREE.MathUtils.degToRad(0.7),
      4,
      delta
    );

    // a slow bounded oscillation, not a spin: a pure function of elapsed
    // time, reversing direction every few seconds rather than
    // accumulating, so the object never turns past its own idle range
    const idleSway = Math.sin(t * 0.12) * THREE.MathUtils.degToRad(IDLE_SWAY_DEG);

    // the camera dollies straight through the aperture on the object's
    // local Z axis later in the journey — settle rotation back to 0 heading
    // into that window so the hole stays lined up with the fixed camera
    // path instead of rotating a solid gold face into the lens.
    const settle = 1 - THREE.MathUtils.smoothstep(p, 0.52, 0.7);

    const turnIn = THREE.MathUtils.smoothstep(p, B15, B45);
    const turnReturn = 1 - THREE.MathUtils.smoothstep(p, B100, 0.4);
    const heroTurn = HERO_TURN * turnIn * turnReturn;
    const introRot = THREE.MathUtils.degToRad(-INTRO_ROT_DEG) * (1 - introT);

    group.current.rotation.y =
      (heroTurn + idleSway + mouseYaw.current + introRot) * settle;
    group.current.rotation.x = mousePitch.current * settle;

    // hero composition push — a small rightward drift as it turns, then
    // settles back to 0 by p=0.4 for the aperture dolly
    const driftT = THREE.MathUtils.smoothstep(p, B15, B70);
    const returnT = THREE.MathUtils.smoothstep(p, B100, 0.4);
    let targetOffset = THREE.MathUtils.lerp(
      HERO_OFFSET_BASE,
      HERO_OFFSET_BASE + HERO_OFFSET_DRIFT,
      driftT
    );
    targetOffset = THREE.MathUtils.lerp(targetOffset, 0, returnT);
    const introOffset = INTRO_OFFSET_EXTRA * (1 - introT);
    group.current.position.x = targetOffset + introOffset;

    // scale nudges up by ~3.5% at most as it leaves, then settles back to
    // 1 before the aperture dolly (which assumes a true-scale object)
    let targetScale = THREE.MathUtils.lerp(1, HERO_SCALE_MAX, driftT);
    targetScale = THREE.MathUtils.lerp(targetScale, 1, returnT);
    const introScale = THREE.MathUtils.lerp(1 + INTRO_SCALE_EXTRA, 1, introT);
    group.current.scale.setScalar(targetScale * introScale);
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
       * earlier attempts. A separate unlit gradient plane, placed just in
       * front, fades it to the background color going downward so it
       * dissolves like polished glass instead of reading as a second MC. */}
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
