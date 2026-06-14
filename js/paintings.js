import * as THREE from "three";

function createTexturedMaterial({ color, mapUrl, roughness, metalness }) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });
  if (!mapUrl) {
    return material;
  }

  const loader = new THREE.TextureLoader();
  loader.load(
    mapUrl,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
    },
    undefined,
    () => {
      // Missing texture: keep the fallback color material.
    }
  );

  return material;
}

function createUnlitPaintingMaterial({ color, mapUrl }) {
  const material = new THREE.MeshBasicMaterial({
    color,
    toneMapped: false
  });
  if (!mapUrl) {
    return material;
  }

  const loader = new THREE.TextureLoader();
  loader.load(
    mapUrl,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
    },
    undefined,
    () => {
      // Missing texture: keep the fallback color material.
    }
  );

  return material;
}

export function createPainting({
  texturePath,
  position,
  rotation,
  size,
  frameDepth
}) {
  const group = new THREE.Group();
  const width = size.width;
  const height = size.height;
  const depth = frameDepth ?? 0.12;

  // Frame creation: a shallow box to add depth around the painting.
  const frameMaterial = createTexturedMaterial({
    color: "#332519",
    mapUrl: "/textures/frame.jpg",
    roughness: 0.55,
    metalness: 0.2
  });
  const frameGeometry = new THREE.BoxGeometry(width + 0.22, height + 0.22, depth);
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.castShadow = true;
  frame.receiveShadow = true;

  // Painting creation: a thin plane slightly in front of the frame.
  // Painting image: unlit material keeps colors bright and consistent.
  const paintingMaterial = createUnlitPaintingMaterial({
    color: "#5a5a5a",
    mapUrl: texturePath
  });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.z = depth / 2 + 0.01;
  painting.castShadow = true;
  painting.receiveShadow = true;

  group.add(frame, painting);
  group.position.set(position.x, position.y, position.z);
  group.rotation.set(rotation.x, rotation.y, rotation.z);
  group.userData.isPaintingGroup = true;
  group.userData.baseScale = 1;

  painting.userData.group = group;
  painting.userData.textureIndex = 0;

  return { group, painting, frame };
}

export function createPaintings() {
  const group = new THREE.Group();
  const paintings = [];
  const wallOffset = 0.03;

  // Positioning: distribute paintings across walls at gallery height.
  const paintingConfigs = [
    {
      texturePath: "/textures/painting1.jpg",
      position: { x: -3.8, y: 2.15, z: -8.98 + wallOffset },
      rotation: { x: 0, y: 0, z: 0 },
      size: { width: 2.3, height: 1.5 }
    },
    {
      texturePath: "/textures/painting2.jpg",
      position: { x: 3.7, y: 2.05, z: -8.98 + wallOffset },
      rotation: { x: 0, y: 0, z: 0 },
      size: { width: 2.1, height: 1.35 }
    },
    {
      texturePath: "/textures/painting3.jpg",
      position: { x: -5.98 + wallOffset, y: 2.15, z: -3.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      size: { width: 2.15, height: 1.45 }
    },
    {
      texturePath: "/textures/painting4.jpg",
      position: { x: 5.98 - wallOffset, y: 2.15, z: 3.2 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
      size: { width: 2.15, height: 1.45 }
    }
  ];

  paintingConfigs.forEach((config) => {
    const { group: paintingGroup, painting } = createPainting({
      texturePath: config.texturePath,
      position: config.position,
      rotation: config.rotation,
      size: config.size,
      frameDepth: 0.08
    });

    group.add(paintingGroup);
    paintings.push(painting);
  });

  return { group, paintings };
}
