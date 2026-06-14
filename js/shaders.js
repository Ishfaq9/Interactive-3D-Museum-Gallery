import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "../shaders/fragment.glsl?raw";

export function createStatueShaderMaterial({ color = "#d7d2c7" } = {}) {
  // Uniforms: time for animation, color for tint, light position for shading.
  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uLightPosition: { value: new THREE.Vector3(0, 5, 5) }
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  });
}

export function updateStatueShader({ material, elapsedTime, lightPosition }) {
  if (!material?.uniforms) {
    return;
  }

  material.uniforms.uTime.value = elapsedTime;
  if (lightPosition) {
    material.uniforms.uLightPosition.value.copy(lightPosition);
  }
}
