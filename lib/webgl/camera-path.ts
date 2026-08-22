import * as THREE from "three";

export interface CameraKeyframe {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

// Act I camera path — hero framing, dolly toward the sculpture, thread
// the negative-space wedge inside the M's own V counter (APERTURE_TARGET,
// see geometry.ts — a real, generously open gap, unlike the ambiguous
// boundary between two overlapping separate letterforms), emerge into the
// bridge toward Scene 02. Position and look-at both drift laterally
// toward the target (x ~ -0.39, y ~ 0.51) as the camera gets close, so it
// approaches the wedge on-axis instead of swinging across the object at
// the last second.
export const CAMERA_PATH: CameraKeyframe[] = [
  // aggressive opening crop: look-at sits well right of the object's true
  // center (x=0), so the M dominates the left ~60% of frame and the C
  // spills past the right edge — not a centered logo shot. This bleeds
  // into the existing aperture-aligned framing by t=0.4 rather than
  // cutting to it.
  { t: 0, pos: [0.32, -0.05, 6.1], look: [0.85, 0.1, 0], fov: 30 },
  { t: 0.2, pos: [0.12, 0.02, 5.5], look: [0.32, 0.22, 0], fov: 30 },
  { t: 0.4, pos: [-0.22, 0.28, 3.3], look: [-0.3, 0.42, 0], fov: 28 },
  { t: 0.58, pos: [-0.34, 0.46, 1.4], look: [-0.39, 0.51, 0], fov: 22 },
  { t: 0.68, pos: [-0.38, 0.5, 0.35], look: [-0.39, 0.51, -1], fov: 18 },
  { t: 0.78, pos: [-0.38, 0.48, -1.2], look: [-0.35, 0.4, -4.5], fov: 26 },
  { t: 0.9, pos: [-0.2, 0.3, -2.6], look: [-0.1, 0.15, -7], fov: 32 },
  { t: 1, pos: [0, 0.1, -3.3], look: [0, 0.02, -8], fov: 34 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _la = new THREE.Vector3();
const _lb = new THREE.Vector3();

export function sampleCameraPath(
  p: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
): number {
  const path = CAMERA_PATH;
  const clamped = THREE.MathUtils.clamp(p, 0, 1);

  let i = 0;
  while (i < path.length - 2 && clamped > path[i + 1].t) i++;

  const kA = path[i];
  const kB = path[i + 1];
  const span = kB.t - kA.t || 1;
  const localT = smooth(THREE.MathUtils.clamp((clamped - kA.t) / span, 0, 1));

  _a.set(...kA.pos);
  _b.set(...kB.pos);
  outPos.lerpVectors(_a, _b, localT);

  _la.set(...kA.look);
  _lb.set(...kB.look);
  outLook.lerpVectors(_la, _lb, localT);

  return THREE.MathUtils.lerp(kA.fov, kB.fov, localT);
}
