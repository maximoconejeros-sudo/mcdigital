import * as THREE from "three";

function roundedRectPath(
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number
): THREE.Path {
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const x1 = cx + w / 2;
  const y1 = cy + h / 2;
  const p = new THREE.Path();
  p.moveTo(x0 + r, y0);
  p.lineTo(x1 - r, y0);
  p.quadraticCurveTo(x1, y0, x1, y0 + r);
  p.lineTo(x1, y1 - r);
  p.quadraticCurveTo(x1, y1, x1 - r, y1);
  p.lineTo(x0 + r, y1);
  p.quadraticCurveTo(x0, y1, x0, y1 - r);
  p.lineTo(x0, y0 + r);
  p.quadraticCurveTo(x0, y0, x0 + r, y0);
  p.closePath();
  return p;
}

/**
 * The MDigital signature object: an abstract sculptural interpretation of
 * "M" — two monolithic legs joined by a chevron crossing, bridged at
 * mid-height by a gate beam punched with a real through-hole. The hole is
 * the aperture the camera dollies through during the Act I scroll sequence.
 */
export function createMGeometries() {
  const body = new THREE.Shape();
  body.moveTo(-1.05, -1.2);
  body.lineTo(-1.05, 1.2);
  body.lineTo(-0.6, 1.2);
  body.lineTo(0, 0.7);
  body.lineTo(0.6, 1.2);
  body.lineTo(1.05, 1.2);
  body.lineTo(1.05, -1.2);
  body.lineTo(-1.05, -1.2);
  body.closePath();

  const bodyDepth = 0.56;
  const bodyGeo = new THREE.ExtrudeGeometry(body, {
    depth: bodyDepth,
    bevelEnabled: true,
    bevelThickness: 0.026,
    bevelSize: 0.026,
    bevelSegments: 4,
    curveSegments: 6,
  });
  bodyGeo.translate(0, 0, -bodyDepth / 2);
  bodyGeo.computeVertexNormals();

  const beamOuter = new THREE.Shape();
  const bw = 2.14;
  const bh = 0.6;
  beamOuter.moveTo(-bw / 2, -bh / 2);
  beamOuter.lineTo(bw / 2, -bh / 2);
  beamOuter.lineTo(bw / 2, bh / 2);
  beamOuter.lineTo(-bw / 2, bh / 2);
  beamOuter.closePath();
  beamOuter.holes.push(roundedRectPath(0, 0, 0.86, 0.4, 0.07));

  const beamDepth = 0.62;
  const beamGeo = new THREE.ExtrudeGeometry(beamOuter, {
    depth: beamDepth,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.022,
    bevelSegments: 3,
    curveSegments: 6,
  });
  beamGeo.translate(0, -0.16, -beamDepth / 2);
  beamGeo.computeVertexNormals();

  return { bodyGeo, beamGeo };
}

/** World-space center of the aperture the camera flies through. */
export const APERTURE_TARGET = new THREE.Vector3(0, -0.16, 0);
