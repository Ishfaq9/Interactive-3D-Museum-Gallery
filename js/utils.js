export function getSizes() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function onResize({ camera, renderer }) {
  const sizes = getSizes();
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
