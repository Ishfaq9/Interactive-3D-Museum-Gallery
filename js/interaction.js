import * as THREE from "three";

function getPointer(event, domElement, mouse) {
  const rect = domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

export function setupPaintingInteraction({
  camera,
  renderer,
  paintings,
  texturePaths
}) {
  const domElement = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const textureLoader = new THREE.TextureLoader();
  const textureCache = new Map();
  let hovered = null;

  const setHover = (painting) => {
    if (hovered === painting) {
      return;
    }

    if (hovered?.userData?.group) {
      hovered.userData.group.scale.set(1, 1, 1);
    }

    hovered = painting || null;

    if (hovered?.userData?.group) {
      hovered.userData.group.scale.set(1.03, 1.03, 1.03);
    }

    domElement.style.cursor = hovered ? "pointer" : "default";
  };

  const loadTexture = (path, onLoad) => {
    if (textureCache.has(path)) {
      onLoad(textureCache.get(path));
      return;
    }

    textureLoader.load(
      path,
      (texture) => {
        textureCache.set(path, texture);
        onLoad(texture);
      },
      undefined,
      () => {
        // Missing texture: keep the fallback color material.
        onLoad(null);
      }
    );
  };

  const applyTexture = (painting, path) => {
    const material = painting.material;
    if (!material) {
      return;
    }

    // Texture replacement: swap the painting image on click.
    loadTexture(path, (texture) => {
      if (!texture) {
        return;
      }
      material.map = texture;
      material.needsUpdate = true;
    });
  };

  const onPointerMove = (event) => {
    // Raycasting: detect which painting the pointer is hovering.
    getPointer(event, domElement, mouse);
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(paintings, false);
    setHover(hits.length ? hits[0].object : null);
  };

  const onClick = (event) => {
    // Click detection: cycle through painting textures on selection.
    getPointer(event, domElement, mouse);
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(paintings, false);
    if (!hits.length) {
      return;
    }

    const painting = hits[0].object;
    const currentIndex = painting.userData.textureIndex ?? 0;
    const nextIndex = (currentIndex + 1) % texturePaths.length;
    painting.userData.textureIndex = nextIndex;

    applyTexture(painting, texturePaths[nextIndex]);
  };

  domElement.addEventListener("pointermove", onPointerMove);
  domElement.addEventListener("click", onClick);

  return () => {
    domElement.removeEventListener("pointermove", onPointerMove);
    domElement.removeEventListener("click", onClick);
    domElement.style.cursor = "default";
  };
}
