import * as THREE from "three";

export function createCamera(sizes) {
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0, 1.6, 6.5);
  return camera;
}
