export const particlesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute float aSeed;
  attribute float aSize;

  varying float vSeed;

  void main() {
    vSeed = aSeed;

    vec3 pos = position;
    float drift = uTime * (0.15 + aSeed * 0.1);
    pos.x += sin(drift + aSeed * 30.0) * 0.05;
    pos.y += cos(drift * 0.8 + aSeed * 18.0) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeAttenuation = (1.0 / -mvPosition.z);
    gl_PointSize = uSize * aSize * uPixelRatio * sizeAttenuation * 260.0;
  }
`;

export const particlesFragment = /* glsl */ `
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
