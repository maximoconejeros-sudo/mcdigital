import * as THREE from "three";

/** The signature champagne gold — shared by the monogram and every UI
 * accent across the scroll acts so the metal reads as one material.
 * Deliberately less saturated than a straight "gold" hex — brushed
 * luxury metal, not orange metallic plastic. Base sits at the "champagne"
 * midpoint of the target tonal range; the spread from near-black shadow to
 * bright specular comes from the light rig (SceneLighting + LightSweep),
 * not from flattening the material itself. */
export function createGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#C99D45"),
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 2.3,
    clearcoat: 0.45,
    clearcoatRoughness: 0.14,
    sheen: 0.12,
    sheenColor: new THREE.Color("#F2D47D"),
    sheenRoughness: 0.34,
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
