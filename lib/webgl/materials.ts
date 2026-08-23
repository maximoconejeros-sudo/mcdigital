import * as THREE from "three";

/** The signature champagne gold — shared by the monogram and every UI
 * accent across the scroll acts so the metal reads as one material.
 * Deliberately less saturated than a straight "gold" hex, and pulled
 * toward bronze rather than yellow — dark champagne gold, not bright
 * yellow/orange plastic. A higher roughness and near-zero clearcoat trade
 * a glossy chrome read for a broad, soft gradient across each face;
 * anisotropy adds the fine brushed linear grain visible on a curved edge.
 * The base sits deliberately dark — the object's own highlights (via the
 * light rig in SceneLighting, concentrated on edges/rims rather than
 * flooding the whole surface) are what carry the brightness, not the
 * material's resting color. */
export function createGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#8C6A3C"),
    metalness: 1,
    roughness: 0.34,
    envMapIntensity: 1.3,
    clearcoat: 0.1,
    clearcoatRoughness: 0.55,
    anisotropy: 0.5,
    anisotropyRotation: Math.PI / 2,
    sheen: 0.12,
    sheenColor: new THREE.Color("#D9B677"),
    sheenRoughness: 0.45,
  });
}

/** Dark glass panel — the "screen" surface behind gold-framed UI blocks. */
export function createPanelMaterial(color = "#0d0f13") {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.2,
    roughness: 0.35,
    envMapIntensity: 1.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
  });
}
