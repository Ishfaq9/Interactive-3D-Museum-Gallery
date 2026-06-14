import * as THREE from "three";
import { updateStatueShader } from "./shaders.js";

export function startAnimation({
  renderer,
  scene,
  camera,
  controls,
  statue,
  baseY,
  updateSpotlight,
  statueMaterial,
  spotLight
}) {
  const clock = new THREE.Clock();

  const tick = () => {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    if (statue) {
      // Animation logic: slow float and subtle rotation for a gallery feel.
      statue.position.y = baseY + Math.sin(elapsedTime * 0.8) * 0.05;
      statue.rotation.y += delta * 0.35;
    }

    if (updateSpotlight) {
      updateSpotlight(elapsedTime);
    }

    if (statueMaterial) {
      updateStatueShader({
        material: statueMaterial,
        elapsedTime,
        lightPosition: spotLight?.position
      });
    }

    controls.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
}
