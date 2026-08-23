import * as THREE from "three";

/** The signature champagne gold — shared by the monogram and every UI
 * accent across the scroll acts so the metal reads as one material.
 * Deliberately less saturated than a straight "gold" hex — brushed satin
 * metal, not a glossy chrome/plastic gold. A higher roughness and near-zero
 * clearcoat trade the earlier version's sharp faceted highlights for a
 * broad, soft gradient across each face; anisotropy adds the fine brushed
 * linear grain the reference shows on the C's curve, and the raised
 * envMapIntensity plus the brighter fill rig in SceneLighting keep the
 * shadow side a warm dark gold rather than crushed near-black. */
export function createGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#CDA75F"),
    metalness: 1,
    roughness: 0.32,
    envMapIntensity: 1.75,
    clearcoat: 0.1,
    clearcoatRoughness: 0.55,
    anisotropy: 0.5,
    anisotropyRotation: Math.PI / 2,
    sheen: 0.16,
    sheenColor: new THREE.Color("#F0D28C"),
    sheenRoughness: 0.4,
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
