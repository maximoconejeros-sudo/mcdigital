import * as THREE from "three";

/** World-space Z center of each of the three service "rooms". */
export const ROOM_Z = [0, -10, -20];

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Triangular envelope, 0→1→0, centered on room `i` of 3 as global Act II
 * progress sweeps 0..1 — drives each room's assemble/disassemble motion
 * and its DOM copy's opacity independently, off the same scroll value. */
export function roomEnvelope(progress: number, i: number, width = 0.4) {
  const center = i / 2;
  const d = Math.abs(progress - center);
  return smooth(THREE.MathUtils.clamp(1 - d / width, 0, 1));
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

/** Camera sits `standoff` in front of whichever room is most active. */
export function sampleServicesCamera(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
  standoff = 4.4
) {
  const r = THREE.MathUtils.clamp(progress, 0, 1) * (ROOM_Z.length - 1);
  const i = Math.min(Math.floor(r), ROOM_Z.length - 2);
  const localT = smooth(r - i);

  _pos.set(0, 0, THREE.MathUtils.lerp(ROOM_Z[i], ROOM_Z[i + 1], localT) + standoff);
  _look.set(0, 0, THREE.MathUtils.lerp(ROOM_Z[i], ROOM_Z[i + 1], localT));

  outPos.copy(_pos);
  outLook.copy(_look);
}
