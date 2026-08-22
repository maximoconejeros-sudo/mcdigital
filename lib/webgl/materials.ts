import * as THREE from "three";

/** The signature champagne gold — shared by the monogram and every UI
 * accent across the scroll acts so the metal reads as one material. */
export function createGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#C89B3C"),
    metalness: 1,
    roughness: 0.32,
    envMapIntensity: 2.1,
    clearcoat: 0.3,
    clearcoatRoughness: 0.28,
    sheen: 0.16,
    sheenColor: new THREE.Color("#ffe3ab"),
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
