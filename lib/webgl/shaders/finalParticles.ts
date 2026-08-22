// Act IX variant of the particle shader: the same soft round point sprite,
// but with a `uConverge` uniform that radially contracts each particle's
// scattered position toward the monogram — the "particles form the MC
// monogram again" beat. Kept as its own shader (rather than adding the
// uniform to the shared particles.ts) so Act I's particle field can't be
// affected by anything built for this act.

export const finalParticlesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uConverge;

  attribute float aSeed;
  attribute float aSize;

  varying float vSeed;

  void main() {
    vSeed = aSeed;

    // radial contraction stops well short of a single point — collapsing
    // ~1400 additively-blended sprites onto the same screen pixel was
    // oversaturating into a blown-out white blob regardless of the
    // monogram's orientation, so this settles into a loose cloud instead
    vec3 pos = position * mix(1.0, 0.3, uConverge);
    float drift = uTime * (0.1 + aSeed * 0.08) * (1.0 - uConverge * 0.7);
    pos.x += sin(drift + aSeed * 30.0) * 0.05;
    pos.y += cos(drift * 0.8 + aSeed * 18.0) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeAttenuation = (1.0 / -mvPosition.z);
    gl_PointSize = uSize * aSize * uPixelRatio * sizeAttenuation * 260.0;
  }
`;

export const finalParticlesFragment = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha = pow(alpha, 1.8);

    vec3 color = mix(uColorB, uColorA, vSeed);
    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;
