// Uniforms
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uLightPosition;

// Varyings
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  // Animation math: subtle shimmer and marble-like variation.
  float shimmer = 0.06 * sin(uTime * 1.4 + vUv.y * 8.0 + vUv.x * 5.0);
  float marble = 0.05 * sin(vUv.y * 10.0 + uTime * 0.3) +
                 0.03 * sin(vUv.x * 16.0 - uTime * 0.2);

  vec3 baseColor = uColor + vec3(shimmer + marble);

  // Simple lighting: diffuse + soft ambient.
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightPosition - vWorldPosition);
  float diffuse = max(dot(normal, lightDir), 0.0);
  float ambient = 0.28;

  // Subtle glow using a fresnel-like edge highlight.
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);

  vec3 litColor = baseColor * (ambient + diffuse * 0.85);
  vec3 glow = vec3(0.35) * fresnel;

  gl_FragColor = vec4(clamp(litColor + glow, 0.0, 1.0), 1.0);
}
