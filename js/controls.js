import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const DEFAULT_BOUNDS = {
  width: 12,
  depth: 18
};

export function createControls(camera, renderer, options = {}) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.target.set(0, 1.6, 0);
  const defaultPosition = camera.position.clone();
  const defaultTarget = controls.target.clone();
  controls.minPolarAngle = 0.7;
  controls.maxPolarAngle = 2.3;

  const movementSpeed = options.movementSpeed ?? 2.7;
  const rotationSpeed = options.rotationSpeed ?? 1.0;
  const bounds = options.bounds ?? DEFAULT_BOUNDS;
  const padding = options.padding ?? 0.6;

  const pressedKeys = new Set();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  const onKeyDown = (event) => {
    // Keyboard listeners: track movement and rotation keys.
    pressedKeys.add(event.code);
  };

  const onKeyUp = (event) => {
    pressedKeys.delete(event.code);
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  const applyMovement = (delta) => {
    // Movement vectors: walk on the XZ plane relative to the view direction.
    forward.subVectors(controls.target, camera.position);
    forward.y = 0;
    if (forward.lengthSq() > 0) {
      forward.normalize();
    }

    right.crossVectors(forward, up).normalize();

    const velocity = movementSpeed * delta;
    const move = new THREE.Vector3();

    if (pressedKeys.has("KeyW")) {
      move.add(forward);
    }
    if (pressedKeys.has("KeyS")) {
      move.sub(forward);
    }
    if (pressedKeys.has("KeyA")) {
      move.sub(right);
    }
    if (pressedKeys.has("KeyD")) {
      move.add(right);
    }

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(velocity);
      camera.position.add(move);
      controls.target.add(move);
    }

    // Movement boundaries: clamp the camera within the museum room.
    const minX = -bounds.width / 2 + padding;
    const maxX = bounds.width / 2 - padding;
    const minZ = -bounds.depth / 2 + padding;
    const maxZ = bounds.depth / 2 - padding;

    const clampedX = THREE.MathUtils.clamp(camera.position.x, minX, maxX);
    const clampedZ = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);
    const correction = new THREE.Vector3(
      clampedX - camera.position.x,
      0,
      clampedZ - camera.position.z
    );

    if (correction.lengthSq() > 0) {
      camera.position.add(correction);
      controls.target.add(correction);
    }
  };

  const applyRotation = (delta) => {
    // Camera rotation: use OrbitControls helpers for smooth turns.
    const rotateAmount = rotationSpeed * delta;

    if (pressedKeys.has("ArrowLeft")) {
      controls.rotateLeft(rotateAmount);
    }
    if (pressedKeys.has("ArrowRight")) {
      controls.rotateLeft(-rotateAmount);
    }
    if (pressedKeys.has("ArrowUp")) {
      controls.rotateUp(rotateAmount * 0.6);
    }
    if (pressedKeys.has("ArrowDown")) {
      controls.rotateUp(-rotateAmount * 0.6);
    }
  };

  const update = (delta) => {
    // Delta-time movement: keep motion smooth and frame-rate independent.
    applyMovement(delta);
    applyRotation(delta);
    controls.update();
  };

  const dispose = () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    controls.dispose();
  };

  const resetView = () => {
    camera.position.copy(defaultPosition);
    controls.target.copy(defaultTarget);
    controls.update();
  };

  return { update, dispose, controls, resetView };
}
