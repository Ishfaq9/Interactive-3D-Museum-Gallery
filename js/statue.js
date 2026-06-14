import * as THREE from "three";
import { createStatueShaderMaterial } from "./shaders.js";
import { loadGLTF } from "./loaders.js";

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

function createPedestal() {
  // Pedestal creation: simple cylinder base for the statue.
  const baseGeometry = new THREE.CylinderGeometry(0.9, 1.0, 0.5, 32);
  const baseMaterial = createTexturedMaterial({
    color: "#262626",
    mapUrl: "/textures/pedestal.jpg",
    roughness: 0.35,
    metalness: 0.08
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(0, 0.25, 0);
  base.castShadow = true;
  base.receiveShadow = true;

  const capGeometry = new THREE.CylinderGeometry(0.8, 0.88, 0.09, 32);
  const capMaterial = createTexturedMaterial({
    color: "#2e2e2e",
    mapUrl: "/textures/pedestal.jpg",
    roughness: 0.3,
    metalness: 0.1
  });
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.set(0, 0.52, 0);
  cap.castShadow = true;
  cap.receiveShadow = true;

  const group = new THREE.Group();
  group.add(base, cap);
  return group;
}

function createStatue({ statueMaterial }) {
  // GLTFLoader: load the real statue model and apply materials.
  const statueRoot = new THREE.Group();

  loadGLTF({
    url: "/models/statue.glb",
    onLoad: (gltf) => {
      const model = gltf.scene;

      // Model traversal: ensure shadows and apply shader material.
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = statueMaterial;
        }
      });

      // Scaling: fit the model within a target height for the pedestal.
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const targetSize = 1.45;
      const scale = targetSize / maxDim;
      model.scale.setScalar(scale);

      // Centering: move model to origin and lift it so it rests on the pedestal.
      box.setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);
      model.position.y -= box.min.y;

      statueRoot.add(model);
    },
    onError: () => {
      // Loading safety: keep scene running even if model is missing.
    }
  });

  return statueRoot;
}

export function createStatueDisplay() {
  const group = new THREE.Group();
  const pedestal = createPedestal();
  const statueMaterial = createStatueShaderMaterial({ color: "#d7d2c7" });
  const statue = createStatue({ statueMaterial });
  const baseY = 1.25; // Adjusted base height to ensure the statue sits well on the pedestal.
  statue.position.set(0, baseY, 0);

  group.add(pedestal, statue);

  return {
    group,
    statue,
    baseY,
    statueMaterial
  };
}
