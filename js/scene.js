import * as THREE from "three";
import { createMuseumRoom } from "./museum.js";
import { createLighting } from "./lighting.js";
import { createStatueDisplay } from "./statue.js";
import { createPaintings } from "./paintings.js";

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0d0d0d");

  const { group: museumRoom, size: roomSize } = createMuseumRoom();
  scene.add(museumRoom);

  const { group: statueDisplay, statue, baseY, statueMaterial } = createStatueDisplay();
  scene.add(statueDisplay);

  const { group: paintingsGroup, paintings } = createPaintings();
  scene.add(paintingsGroup);

  const paintingAnchors = paintings
    .map((painting) => painting.userData.group)
    .filter(Boolean)
    .map((group) => ({
      position: group.position.clone(),
      rotation: group.rotation.clone()
    }));

  const {
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
  } = createLighting({
    focusPosition: statueDisplay.position,
    paintingAnchors
  });
  scene.add(
    ambientLight,
    hemisphereLight,
    directionalLight,
    lightTarget,
    spotLight,
    spotTarget,
    ...paintingLights,
    ...paintingTargets
  );
  if (spotHelper) {
    scene.add(spotHelper);
  }

  return {
    scene,
    statue,
    baseY,
    paintings,
    roomSize,
    updateSpotlight,
    statueMaterial,
    spotLight
  };
}
