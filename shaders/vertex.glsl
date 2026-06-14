// Uniforms
uniform float uTime;

// Attributes and varyings
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  // Pass UVs for subtle surface variation.
  vUv = uv;

  // World-space normal for simple lighting.
  vNormal = normalize(mat3(modelMatrix) * normal);

  // World position for lighting and view direction.
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  // Standard projection.
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
