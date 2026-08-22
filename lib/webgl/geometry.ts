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

// Shared composite layout — how the M and C are positioned/scaled relative
// to each other — used both when building the extruded meshes and when
// deriving APERTURE_TARGET, so the two can never drift out of sync.
const OVERLAP = 1.0;
const C_OFFSET_X = M_GLYPH_WIDTH - OVERLAP;
const TOTAL_WIDTH = Math.max(M_GLYPH_WIDTH, C_OFFSET_X + C_GLYPH_WIDTH);
const CENTER_X = TOTAL_WIDTH / 2;
const FIT = 0.78; // two side-by-side letters read wider than the old
// single-glyph silhouette the camera path/framing was tuned for

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
  // image, not a typesetting kern.
  mGeo.translate(-CENTER_X, -GLYPH_CAP_HEIGHT / 2, 0);
  cGeo.translate(C_OFFSET_X - CENTER_X, -GLYPH_CAP_HEIGHT / 2, 0);

  mGeo.scale(FIT, FIT, FIT);
  cGeo.scale(FIT, FIT, FIT);

  return { mGeo, cGeo };
}

/**
 * World-space center of the negative-space gap the camera dollies through
 * during the Act I scroll sequence. Rather than the ambiguous boundary
 * between the M and C (two separate overlapping volumes — hard to
 * guarantee real clearance through), this targets the M's own open V
 * counter: the wide wedge between its two inner diagonal strokes, well
 * clear of both letters' solid material. The vertex of that V sits at
 * roughly local (1.5, 0.64) in M_GLYPH_COMMANDS (pre-center, pre-scale);
 * this aims higher into the wedge where it's already wide open.
 */
const NOTCH_LOCAL = { x: 1.48, y: 1.85 };
export const APERTURE_TARGET = new THREE.Vector3(
  (NOTCH_LOCAL.x - CENTER_X) * FIT,
  (NOTCH_LOCAL.y - GLYPH_CAP_HEIGHT / 2) * FIT,
  0
);
