import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated 3D Sphere Component with mouse interaction
 * Creates a morphing, glowing sphere that follows mouse movement
 */
const AnimatedSphere = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the sphere
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      // Follow mouse position
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mousePosition.x * 2,
        0.1
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mousePosition.y * 2,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 0.8 : 0.6}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "#8b5cf6" : "#6d28d9"}
        roughness={0.1}
        metalness={0.9}
        emissive={hovered ? "#7c3aed" : "#5b21b6"}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

/**
 * Three.js Scene Component
 * Renders 3D background with interactive elements
 */
const ThreeScene = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for sphere interaction
  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[0, 0, 5]} intensity={0.6} color="#6d28d9" />
        
        <AnimatedSphere mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
