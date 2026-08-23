import * as THREE from "three";

/** The signature champagne gold — shared by the monogram and every UI
 * accent across the scroll acts so the metal reads as one material.
 * Deliberately less saturated than a straight "gold" hex — brushed satin
 * metal, not a glossy chrome/plastic gold. A higher roughness and near-zero
 * clearcoat trade the earlier version's sharp faceted highlights for a
 * broad, soft gradient across each face — the reference's brushed-nameplate
 * read, where the shading rolls off gently instead of snapping between
 * near-black shadow and a blown-out hot spot. */
export function createGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#C9A257"),
    metalness: 1,
    roughness: 0.4,
    envMapIntensity: 1.35,
    clearcoat: 0.06,
    clearcoatRoughness: 0.7,
    sheen: 0.12,
    sheenColor: new THREE.Color("#EBC77E"),
    sheenRoughness: 0.55,
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
