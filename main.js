import "./style.css";
import { createScene } from "./js/scene.js";
import { createCamera } from "./js/camera.js";
import { createRenderer } from "./js/renderer.js";
import { createControls } from "./js/controls.js";
import { startAnimation } from "./js/animation.js";
import { getSizes, onResize } from "./js/utils.js";
import { setupPaintingInteraction } from "./js/interaction.js";

const container = document.querySelector("#app");
const sizes = getSizes();

const {
  scene,
  statue,
  baseY,
  paintings,
  roomSize,
  updateSpotlight,
  statueMaterial,
  spotLight
} = createScene();
const camera = createCamera(sizes);
const renderer = createRenderer(container, sizes);
const controls = createControls(camera, renderer, { bounds: roomSize });
const resetButton = document.querySelector("#reset-view");

if (resetButton) {
  resetButton.addEventListener("click", () => {
    controls.resetView();
  });
}

window.addEventListener("resize", () => {
  onResize({ camera, renderer });
});

setupPaintingInteraction({
  camera,
  renderer,
  paintings,
  texturePaths: [
    "/textures/painting1.jpg",
    "/textures/painting2.jpg",
    "/textures/painting3.jpg",
    "/textures/painting4.jpg"
  ]
});

startAnimation({
  renderer,
  scene,
  camera,
  controls,
  statue,
  baseY,
  updateSpotlight,
  statueMaterial,
  spotLight
});
