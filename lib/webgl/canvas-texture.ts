import * as THREE from "three";

/** Renders a numeral onto an offscreen canvas and returns it as a texture
 * — a pragmatic way to get "real" 3D environmental typography (a textured
 * plane that lives in the scene, catches perspective, parallaxes with the
 * camera) without pulling in a three.js font loader for one-off numerals. */
export function createNumeralTexture(
  text: string,
  color = "#c89b3c"
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 640px 'Space Grotesk', sans-serif";
  ctx.fillText(text, size / 2, size / 2 + 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
