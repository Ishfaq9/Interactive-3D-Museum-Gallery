# CSE444 Final Report - Modern Art Museum

## 1. Project Requirements
The goal is to build a modern 3D museum gallery using Three.js with modular scene architecture, realistic lighting and shadows, textured assets, interactive controls, animation, and custom GLSL shaders. The project must include a spotlighted centerpiece statue, paintings with texture swapping on click, keyboard and mouse interactions, and smooth rendering in a Vite-based setup.

## 2. Software Platform
- Three.js (ES modules)
- Vite (development/build tooling)
- JavaScript (vanilla)
- GLSL (custom vertex and fragment shaders)
- GLTFLoader (for the statue model)

## 3. Project Features
### 3.1 Models and Texture Mapping
- The museum room uses planes for floor, walls, and ceiling with repeatable textures and realistic roughness/metalness settings.
- The statue is loaded from a GLB model (models/statue.glb) and placed on a custom pedestal with a texture.
- Paintings use textured planes with separate framed geometry. Frames are lit materials, while the artwork uses an unlit material to preserve image brightness.

### 3.2 Key Interaction
- Keyboard movement uses W/A/S/D for forward, left, back, and right translation relative to the camera view direction.
- Arrow keys rotate the camera smoothly using OrbitControls methods (rotateLeft/rotateUp).
- Movement is frame-rate independent using delta time and bounded so the camera stays inside the museum.

### 3.3 Mouse Interaction
- Raycasting is used to detect painting meshes on hover and click.
- On hover, the cursor changes and a subtle scale-up effect is applied.
- On click, the painting texture cycles through four available images.

### 3.4 Animation
- The statue floats slightly up and down and rotates slowly using elapsed time.
- The main spotlight orbits the statue using sine/cosine motion for a cinematic sweep.
- All animations use a Three.js Clock for stable timing.

### 3.5 Lighting
- AmbientLight and HemisphereLight provide soft environmental fill.
- A DirectionalLight adds general room definition and shadows.
- A moving SpotLight focuses on the statue as the main dramatic light source.
- Additional small SpotLights lift painting visibility while keeping the room cinematic.

### 3.6 Custom Shaders
- The statue uses a custom ShaderMaterial with a vertex shader passing UVs and normals.
- The fragment shader adds animated shimmer and a marble-like glow using sin/cos time functions.
- Uniforms include uTime, uColor, and uLightPosition to control animation and lighting response.

### 3.7 Feature Table
| # | Features | Status |
|---|----------|--------|
| 1 | Modular scene architecture (room, lighting, statue, paintings) | Implemented |
| 2 | Texture mapping for floor, walls, ceiling, pedestal, paintings | Implemented |
| 3 | Keyboard movement + OrbitControls integration | Implemented |
| 4 | Mouse interaction with raycasting and texture cycling | Implemented |
| 5 | Custom GLSL shaders on the statue | Implemented |
| 6 | GLB model loading with GLTFLoader | Implemented |
| 7 | Animated spotlight orbit | Implemented |
| 8 | Painting spotlights and ceiling fixtures | Implemented |

## 4. Snapshots
- Add screenshots here showing the overall gallery, painting interaction, statue spotlight, and shader effect.

## 5. Contribution
- Specify the team members and their individual contributions here.
