import * as THREE from "three";

export interface EcosystemNode {
  label: string;
  angleDeg: number;
}

export const NODES: EcosystemNode[] = [
  { label: "Website" },
  { label: "Landing page" },
  { label: "WhatsApp AI" },
  { label: "Automatización" },
  { label: "Leads" },
].map((n, i) => ({ ...n, angleDeg: i * 72 - 90 }));

export const NODE_RADIUS = 3.4;

export function nodePosition(angleDeg: number, out: THREE.Vector3) {
  const a = THREE.MathUtils.degToRad(angleDeg);
  out.set(
    Math.cos(a) * NODE_RADIUS,
    Math.sin(a * 2) * 0.55,
    Math.sin(a) * NODE_RADIUS
  );
  return out;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

const _pos = new THREE.Vector3();

/** Camera orbits the ecosystem core as Act III progress advances. */
export function sampleEcosystemCamera(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
) {
  const p = smooth(THREE.MathUtils.clamp(progress, 0, 1));
  const startDeg = -60;
  const sweepDeg = 230;
  const angle = THREE.MathUtils.degToRad(startDeg + p * sweepDeg);
  const radius = THREE.MathUtils.lerp(7.2, 6.2, p);
  const height = THREE.MathUtils.lerp(2.6, 1.1, Math.min(p * 1.6, 1));

  _pos.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
  outPos.copy(_pos);
  outLook.set(0, 0, 0);
}

/** Each connection line illuminates in sequence as progress advances. */
export function connectionActivation(progress: number, i: number) {
  const start = 0.12 + i * 0.11;
  return smooth(THREE.MathUtils.clamp((progress - start) / 0.18, 0, 1));
}
