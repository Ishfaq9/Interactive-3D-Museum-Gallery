import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadGLTF({ url, onLoad, onError }) {
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      onLoad(gltf);
    },
    undefined,
    (error) => {
      console.warn(`Failed to load model: ${url}`, error);
      if (onError) {
        onError(error);
      }
    }
  );
}
