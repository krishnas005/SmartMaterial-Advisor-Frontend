// 'use client'; ensures that this component is rendered on the client side in Next.js (useful for interactive components)
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber'; // For 3D rendering
import { OrbitControls, useGLTF } from '@react-three/drei'; // For model loading and camera controls
import * as THREE from 'three'; // Core 3D library
import gsap from 'gsap'; // Animation library

// Component to render and animate the car model
const CarModelRenderer = ({ carModel, onPartSelect, setHoveredPart, setHoverPosition }) => {
  const carRef = useRef(); // Reference to the 3D car model

  useEffect(() => {
    // Rotate the car model smoothly when it first appears
    if (carRef.current) {
      gsap.fromTo(
        carRef.current.rotation,
        { y: Math.PI }, // Start rotation (180°)
        { y: 0, duration: 1.5, ease: 'power2.out' } // Animate to 0° over 1.5s
      );
    }
  }, []);

  return (
    <primitive ref={carRef} object={carModel.scene} scale={1.5} position={[0, -0.6, 0]}>
      <InteractiveCar
        carModel={carModel}
        setHoveredPart={setHoveredPart}
        setHoverPosition={setHoverPosition}
        onPartSelect={onPartSelect}
      />
    </primitive>
  );
};

// Handles user interactions like hover and click on the car model
const InteractiveCar = ({ carModel, setHoveredPart, setHoverPosition, onPartSelect }) => {
  const raycaster = useRef(new THREE.Raycaster()); // For detecting mouse interactions with the model
  const mouse = useRef(new THREE.Vector2()); // Tracks mouse position
  const { camera, gl } = useThree(); // Access the camera and renderer

  // Handle mouse hover over parts of the car model
  const handlePointerMove = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect(); // Get canvas size/position
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(carModel.scene.children, true);

    if (intersects.length > 0) {
      const hoveredPart = intersects[0].object;
      setHoveredPart(hoveredPart.name); // Show hovered part name

      const screenPosition = intersects[0].point.clone().project(camera);
      const x = (screenPosition.x * 0.5 + 0.5) * rect.width + rect.left;
      const y = (-screenPosition.y * 0.5 + 0.5) * rect.height + rect.top;
      setHoverPosition({ x, y }); // Update tooltip/hover position
    } else {
      setHoveredPart(null);
      setHoverPosition(null);
    }
  }, [camera, carModel.scene.children, setHoveredPart, setHoverPosition, gl]);

  // Handle clicks on parts of the car model
  const handlePointerClick = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(carModel.scene.children, true);

    if (intersects.length > 0) {
      const selectedPart = intersects[0].object;
      onPartSelect(selectedPart.name); // Select and highlight clicked part
    }
  }, [camera, carModel.scene.children, onPartSelect, gl]);

  // Attach event listeners for pointer interactions
  useEffect(() => {
    const domElement = gl.domElement;
    domElement.addEventListener('pointermove', handlePointerMove); // Hover detection
    domElement.addEventListener('pointerdown', handlePointerClick); // Click detection

    return () => {
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointerdown', handlePointerClick);
    };
  }, [gl.domElement, handlePointerMove, handlePointerClick]);

  return null;
};

// Main component to load and display the car model in a 3D canvas
const DynamicCarModel = ({ onPartSelect, setHoveredPart, setHoverPosition }) => {
  const [mounted, setMounted] = useState(false); // Ensures model loads only after component is mounted

  useEffect(() => {
    setMounted(true); // Set mounted to true when the component is ready
  }, []);

  const carModel = useGLTF('/newCarModel.glb'); // Load the 3D car model

  return mounted ? (
    <Canvas
      className="w-full h-full"
      camera={{ position: [-6, 3, 10], fov: 40, near: 0.01, far: 1000 }} // Camera settings
    >
      <OrbitControls
        enableZoom={true} // Enable zooming
        enablePan={false} // Disable panning
        minDistance={8} // Minimum zoom distance
        maxDistance={16} // Maximum zoom distance
      />
      <ambientLight intensity={0.5} /> {/* Soft general lighting */}
      <directionalLight position={[5, 5, 5]} intensity={1} /> {/* Directional light */}
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} /> {/* Focused spotlight */}

      <CarModelRenderer
        carModel={carModel}
        onPartSelect={onPartSelect}
        setHoveredPart={setHoveredPart}
        setHoverPosition={setHoverPosition}
      />
    </Canvas>
  ) : null; // Prevents rendering before the component is mounted
};

export default DynamicCarModel;
