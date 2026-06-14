import * as THREE from "three";

const ROOM_SIZE = {
  width: 12,
  height: 5,
  depth: 18
};

function createTexturedMaterial({ color, mapUrl, repeat, roughness, metalness }) {
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
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      if (repeat) {
        texture.repeat.set(repeat.x, repeat.y);
      }
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

function createPlane({ width, height, material, position, rotation }) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  mesh.receiveShadow = true;
  return mesh;
}

function createBench({ position, rotation, size = { width: 2.2, height: 0.35, depth: 0.7 } }) {
  const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
  const material = new THREE.MeshStandardMaterial({
    color: "#1e1b17",
    roughness: 0.7,
    metalness: 0.05
  });
  const bench = new THREE.Mesh(geometry, material);
  bench.position.set(position.x, position.y, position.z);
  bench.rotation.set(rotation.x, rotation.y, rotation.z);
  bench.castShadow = true;
  bench.receiveShadow = true;
  return bench;
}

function createTitleSign({ text, position, rotation }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "64px Georgia, serif";
    context.fillStyle = "#f7f3ea";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0, 0, 0, 0.35)";
    context.shadowBlur = 6;
    context.shadowOffsetY = 2;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });
  const geometry = new THREE.PlaneGeometry(3.3, 0.72);
  const sign = new THREE.Mesh(geometry, material);
  sign.position.set(position.x, position.y, position.z);
  sign.rotation.set(rotation.x, rotation.y, rotation.z);
  return sign;
}

function createColumn({ position }) {
  const geometry = new THREE.CylinderGeometry(0.18, 0.22, 3.6, 18);
  const material = new THREE.MeshStandardMaterial({
    color: "#1e1c1a",
    roughness: 0.8,
    metalness: 0.0
  });
  const column = new THREE.Mesh(geometry, material);
  column.position.set(position.x, position.y, position.z);
  column.castShadow = true;
  column.receiveShadow = true;
  return column;
}

function createCeilingSpot({ position }) {
  const geometry = new THREE.CylinderGeometry(0.14, 0.16, 0.18, 20);
  const material = new THREE.MeshStandardMaterial({
    color: "#2a2a2a",
    roughness: 0.6,
    metalness: 0.35
  });
  const fixture = new THREE.Mesh(geometry, material);
  fixture.position.set(position.x, position.y, position.z);
  fixture.castShadow = false;
  fixture.receiveShadow = false;
  return fixture;
}

export function createMuseumRoom() {
  const group = new THREE.Group();

  // Room creation: build a simple box-like hall with planes.
  const floorMaterial = createTexturedMaterial({
    color: "#3a3c3f",
    mapUrl: "/textures/floor.jpg",
    repeat: { x: 4, y: 6 },
    roughness: 0.55,
    metalness: 0.08
  });
  const wallMaterial = createTexturedMaterial({
    color: "#d8d1c4",
    mapUrl: "/textures/wall.jpg",
    repeat: { x: 4, y: 2 },
    roughness: 0.85,
    metalness: 0.02
  });
  const ceilingMaterial = createTexturedMaterial({
    color: "#e7e3dc",
    mapUrl: "/textures/ceiling.jpg",
    repeat: { x: 4, y: 6 },
    roughness: 0.9,
    metalness: 0.0
  });

  const floor = createPlane({
    width: ROOM_SIZE.width,
    height: ROOM_SIZE.depth,
    material: floorMaterial,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: -Math.PI / 2, y: 0, z: 0 }
  });

  const ceiling = createPlane({
    width: ROOM_SIZE.width,
    height: ROOM_SIZE.depth,
    material: ceilingMaterial,
    position: { x: 0, y: ROOM_SIZE.height, z: 0 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 }
  });

  const backWall = createPlane({
    width: ROOM_SIZE.width,
    height: ROOM_SIZE.height,
    material: wallMaterial,
    position: { x: 0, y: ROOM_SIZE.height / 2, z: -ROOM_SIZE.depth / 2 },
    rotation: { x: 0, y: 0, z: 0 }
  });

  const frontWall = createPlane({
    width: ROOM_SIZE.width,
    height: ROOM_SIZE.height,
    material: wallMaterial,
    position: { x: 0, y: ROOM_SIZE.height / 2, z: ROOM_SIZE.depth / 2 },
    rotation: { x: 0, y: Math.PI, z: 0 }
  });

  const leftWall = createPlane({
    width: ROOM_SIZE.depth,
    height: ROOM_SIZE.height,
    material: wallMaterial,
    position: { x: -ROOM_SIZE.width / 2, y: ROOM_SIZE.height / 2, z: 0 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 }
  });

  const rightWall = createPlane({
    width: ROOM_SIZE.depth,
    height: ROOM_SIZE.height,
    material: wallMaterial,
    position: { x: ROOM_SIZE.width / 2, y: ROOM_SIZE.height / 2, z: 0 },
    rotation: { x: 0, y: -Math.PI / 2, z: 0 }
  });

  const benchLeft = createBench({
    position: { x: -2.6, y: 0.17, z: 1.1 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 }
  });
  const benchRight = createBench({
    position: { x: 2.6, y: 0.18, z: -1.4 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    size: { width: 1.8, height: 0.32, depth: 0.6 }
  });
  const columnA = createColumn({ position: { x: -5.4, y: 1.8, z: -7.5 } });
  const columnB = createColumn({ position: { x: 5.4, y: 1.8, z: 7.5 } });
  const titleSign = createTitleSign({
    text: "Modern Art Museum",
    position: { x: 0, y: 4.15, z: -ROOM_SIZE.depth / 2 + 0.03 },
    rotation: { x: 0, y: 0, z: 0 }
  });
  const ceilingHeight = ROOM_SIZE.height - 0.08;
  const fixtures = [
    createCeilingSpot({ position: { x: 0, y: ceilingHeight, z: 0 } }),
    createCeilingSpot({ position: { x: -3.8, y: ceilingHeight, z: -8.6 } }),
    createCeilingSpot({ position: { x: 3.7, y: ceilingHeight, z: -8.6 } }),
    createCeilingSpot({ position: { x: -5.7, y: ceilingHeight, z: -3.2 } }),
    createCeilingSpot({ position: { x: 5.7, y: ceilingHeight, z: 3.2 } })
  ];

  // Shadows: surfaces receive soft shadows from lights.
  group.add(
    floor,
    ceiling,
    backWall,
    frontWall,
    leftWall,
    rightWall,
    benchLeft,
    benchRight,
    columnA,
    columnB,
    titleSign,
    ...fixtures
  );

  return { group, size: ROOM_SIZE };
}
