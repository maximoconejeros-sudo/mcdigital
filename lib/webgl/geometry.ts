import * as THREE from "three";
import {
  C_GLYPH_COMMANDS,
  C_GLYPH_WIDTH,
  M_GLYPH_COMMANDS,
  M_GLYPH_WIDTH,
  GLYPH_CAP_HEIGHT,
  type GlyphCommand,
} from "@/lib/webgl/mc-glyph-paths";

/** Replays a baked glyph command list (see mc-glyph-paths.ts) onto a
 * THREE.Shape — a direct one-to-one mapping from the font's own moveTo /
 * lineTo / cubic / quadratic / close commands, so the letterform is the
 * real typeface outline, not a hand-approximated silhouette. */
function buildGlyphShape(commands: GlyphCommand[]): THREE.Shape {
  const shape = new THREE.Shape();
  for (const c of commands) {
    switch (c.type) {
      case "M":
        shape.moveTo(c.x!, c.y!);
        break;
      case "L":
        shape.lineTo(c.x!, c.y!);
        break;
      case "Q":
        shape.quadraticCurveTo(c.x1!, c.y1!, c.x!, c.y!);
        break;
      case "C":
        shape.bezierCurveTo(c.x1!, c.y1!, c.x2!, c.y2!, c.x!, c.y!);
        break;
      case "Z":
        shape.closePath();
        break;
    }
  }
  return shape;
}

/**
 * The MC Digital signature object, rebuilt from the real serif reference:
 * an elegant serif M and serif C (Playfair Display Bold's actual glyph
 * outlines — see mc-glyph-paths.ts), extruded as premium metal rather than
 * an abstract architectural silhouette. The C overlaps the right portion
 * of the M, matching the reference monogram's proportions. Both letters
 * are centered as one composite so the whole group can be scaled/rotated
 * uniformly by callers.
 */
export function createMCGeometries() {
  const depth = 0.34;
  const bevelThickness = 0.024;
  const bevelSize = 0.022;

  const mShape = buildGlyphShape(M_GLYPH_COMMANDS);
  const mGeo = new THREE.ExtrudeGeometry(mShape, {
    depth,
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelSegments: 4,
    curveSegments: 10,
  });
  mGeo.translate(0, 0, -depth / 2);
  mGeo.computeVertexNormals();

  const cShape = buildGlyphShape(C_GLYPH_COMMANDS);
  const cGeo = new THREE.ExtrudeGeometry(cShape, {
    depth,
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelSegments: 4,
    curveSegments: 10,
  });
  cGeo.translate(0, 0, -depth / 2);
  cGeo.computeVertexNormals();

  // The C sits to the right of the M, its left arc overlapping into the
  // M's right leg — the overlap fraction is tuned against the reference
  // image, not a typesetting kern. A wider overlap buries the gap between
  // them; this leaves a real pocket of negative space near the top where
  // the C's inner curve clears the M's right serif, for the camera to
  // travel through.
  const overlap = 1.0;
  const cOffsetX = M_GLYPH_WIDTH - overlap;
  const totalWidth = Math.max(M_GLYPH_WIDTH, cOffsetX + C_GLYPH_WIDTH);
  const centerX = totalWidth / 2;

  mGeo.translate(-centerX, -GLYPH_CAP_HEIGHT / 2, 0);
  cGeo.translate(cOffsetX - centerX, -GLYPH_CAP_HEIGHT / 2, 0);

  // Two side-by-side letters read much wider than the old single-glyph
  // silhouette the camera path/framing was tuned for — scale the whole
  // composite down (about the origin, after centering) rather than
  // re-deriving every downstream distance.
  const fit = 0.78;
  mGeo.scale(fit, fit, fit);
  cGeo.scale(fit, fit, fit);

  return { mGeo, cGeo };
}

/** World-space center of the negative-space gap between the M and C the
 * camera dollies through during the Act I scroll sequence — sits in the
 * open pocket where the C's inner curve clears the M's right leg, roughly
 * two-thirds up the cap height. Tuned against the real render, not derived
 * analytically from the glyph paths. */
export const APERTURE_TARGET = new THREE.Vector3(0.27, 0.27, 0);
