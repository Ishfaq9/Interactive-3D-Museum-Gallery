# Interactive 3D Virtual Museum

A stunning, immersive 3D virtual museum experience built with **Three.js** and **Vite**. This project features a gallery environment with interactive paintings, dynamic lighting, and custom shaders.

## 🚀 Features

- **Interactive Gallery:** Navigate through a realistic 3D museum environment.
- **Dynamic Lighting:** Real-time lighting and shadows for an immersive atmosphere.
- **Custom Shaders:** High-quality visual effects using GLSL.
- **Responsive Design:** Optimized for various screen sizes via Vite.
- **Smooth Animations:** Integrated camera and object animations.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_NEW_USERNAME/ThreeJS-Virtual-Museum.git
   cd ThreeJS-Virtual-Museum
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 💻 Running the Project

To start the development server:
```bash
npm run dev
```
Once the command runs, open the local URL provided (usually `http://localhost:5173`) in your browser.

## 🏗️ Project Structure

- `public/`: Static assets served at the root (Models, Textures).
- `js/`: Core logic (Scene, Camera, Lighting, Interaction, etc.).
- `shaders/`: GLSL vertex and fragment shaders.
- `main.js`: Entry point for the application.

## 🔨 Building for Production

To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.

## 📄 License

This project is open-source. Feel free to use and modify it for your own needs.
