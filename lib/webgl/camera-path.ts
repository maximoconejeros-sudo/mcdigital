import * as THREE from "three";

export interface CameraKeyframe {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

// Act I camera path — hero framing, dolly toward the sculpture, pass
// through its aperture, emerge into the bridge toward Scene 02.
export const CAMERA_PATH: CameraKeyframe[] = [
  { t: 0, pos: [0, 0, 6.4], look: [0, 0, 0], fov: 32 },
  { t: 0.2, pos: [0, 0, 5.7], look: [0, 0, 0], fov: 32 },
  { t: 0.45, pos: [0, -0.03, 3.0], look: [0, -0.05, 0], fov: 30 },
  { t: 0.65, pos: [0, -0.1, 1.05], look: [0, -0.16, 0], fov: 26.5 },
  { t: 0.76, pos: [0, -0.16, -0.05], look: [0, -0.16, -1.2], fov: 23 },
  { t: 0.88, pos: [0, -0.16, -1.7], look: [0, -0.14, -4.5], fov: 29 },
  { t: 1, pos: [0, -0.08, -3.3], look: [0, -0.04, -8], fov: 34 },
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
