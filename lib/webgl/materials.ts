import * as THREE from "three";

/** The signature champagne gold — shared by the monogram and every UI
 * accent across the scroll acts so the metal reads as one material.
 * Deliberately less saturated than a straight "gold" hex — brushed
 * luxury metal, not orange metallic plastic. */
export function createGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#B69A5C"),
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.7,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    sheen: 0.06,
    sheenColor: new THREE.Color("#f4e8ce"),
    sheenRoughness: 0.42,
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
