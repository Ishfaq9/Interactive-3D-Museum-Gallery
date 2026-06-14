import * as THREE from "three";

export function createLighting({
  focusPosition,
  paintingAnchors = [],
  enableSpotHelper = false
} = {}) {
  // Lighting: combine ambient fill with a directional key light.
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.32);

  // HemisphereLight: soft sky/ground balance for cleaner visibility.
  const hemisphereLight = new THREE.HemisphereLight(0xf2f2f2, 0x2a2a2a, 0.35);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
  directionalLight.position.set(2.8, 6.2, 3.2);
  directionalLight.castShadow = true;

  const lightTarget = new THREE.Object3D();
  lightTarget.position.copy(focusPosition || new THREE.Vector3(0, 1.4, 0));
  directionalLight.target = lightTarget;

  // Shadows: tighten the shadow camera for cleaner indoor shadows.
  directionalLight.shadow.mapSize.set(2048, 2048);
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 24;
  directionalLight.shadow.camera.left = -8;
  directionalLight.shadow.camera.right = 8;
  directionalLight.shadow.camera.top = 8;
  directionalLight.shadow.camera.bottom = -8;
  directionalLight.shadow.bias = -0.00025;
  directionalLight.shadow.normalBias = 0.02;

  // Spotlight setup: focused beam that sweeps across the statue.
  const spotLight = new THREE.SpotLight(0xffffff, 1.35, 18, Math.PI / 7, 0.55, 1.6);
  spotLight.castShadow = true;
  spotLight.position.set(0, 5.8, 5.6);

  const spotTarget = new THREE.Object3D();
  spotTarget.position.copy(focusPosition || new THREE.Vector3(0, 1.4, 0));
  spotLight.target = spotTarget;

  // Shadow configuration: higher quality map with soft edges.
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.shadow.bias = -0.00035;
  spotLight.shadow.normalBias = 0.025;
  spotLight.shadow.focus = 0.9;

  const spotHelper = enableSpotHelper ? new THREE.SpotLightHelper(spotLight) : null;

  // Painting lights: soft warm spots to lift painting visibility.
  const paintingLights = [];
  const paintingTargets = [];
  const paintingColor = new THREE.Color(0xffe8d6);

  paintingAnchors.forEach((anchor) => {
    const light = new THREE.SpotLight(paintingColor, 0.5, 6, Math.PI / 9, 0.75, 1.6);
    light.castShadow = false;

    const target = new THREE.Object3D();
    target.position.copy(anchor.position);
    light.target = target;

    const forward = new THREE.Vector3(0, 0, 1).applyEuler(anchor.rotation);
    const up = new THREE.Vector3(0, 1, 0);
    const lightPosition = anchor.position
      .clone()
      .add(up.multiplyScalar(0.85))
      .add(forward.multiplyScalar(0.35));

    // Painting light placement: wall-mounted spots above each artwork.
    light.position.copy(lightPosition);

    paintingLights.push(light);
    paintingTargets.push(target);
  });

  const updateSpotlight = (elapsedTime) => {
    // Animation math: orbit the light around the statue using sine/cosine.
    const radius = 4.6;
    const speed = 0.22;
    const height = 5.2;

    spotLight.position.x = Math.cos(elapsedTime * speed) * radius;
    spotLight.position.z = Math.sin(elapsedTime * speed) * radius;
    spotLight.position.y = height + Math.sin(elapsedTime * 0.35) * 0.18;

    // Target tracking: keep the beam centered on the statue base.
    spotTarget.position.copy(focusPosition || new THREE.Vector3(0, 1.4, 0));

    // Subtle pulsing for cinematic feel.
    spotLight.intensity = 1.35 + Math.sin(elapsedTime * 0.5) * 0.05;

    // Ambient realism: very subtle fill variation.
    ambientLight.intensity = 0.32 + Math.sin(elapsedTime * 0.25) * 0.015;

    if (spotHelper) {
      spotHelper.update();
    }
  };

  return {
    ambientLight,
    hemisphereLight,
    directionalLight,
    lightTarget,
    spotLight,
    spotTarget,
    spotHelper,
    paintingLights,
    paintingTargets,
    updateSpotlight
  };
}
