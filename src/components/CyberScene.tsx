import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThemeMode } from '@/hooks/useThemeMode';

interface CyberSceneProps {
  className?: string;
}

// Cyberpunk Three.js Scene Component
const CYBER_VIBRANT = {
  fog: 0x0f0f23,
  clearColor: 0x0f0f23,
  ambient: 0x00ffff,
  light1: 0x00ffff,
  light2: 0xbd5bff,
  grid: 0x00ffff,
  cubeEven: 0x00ffff,
  cubeOdd: 0xbd5bff,
  emissiveEven: 0x004444,
  emissiveOdd: 0x440044,
  ring: 0x39ff14,
  ringEmissive: 0x002200,
};

const CYBER_MONO = {
  fog: 0x0d0d0d,
  clearColor: 0x0d0d0d,
  ambient: 0xd9d9d9,
  light1: 0xd9d9d9,
  light2: 0xa6a6a6,
  grid: 0xd9d9d9,
  cubeEven: 0xd9d9d9,
  cubeOdd: 0xa6a6a6,
  emissiveEven: 0x1a1a1a,
  emissiveOdd: 0x1a1a1a,
  ring: 0xb8b8b8,
  ringEmissive: 0x1a1a1a,
};

const CyberScene = ({ className = "" }: CyberSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();
  const { isMonochrome } = useThemeMode();

  useEffect(() => {
    if (!mountRef.current) return;

    const c = isMonochrome ? CYBER_MONO : CYBER_VIBRANT;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(c.fog, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(c.clearColor, 0.1);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(c.ambient, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(c.light1, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(c.light2, 1, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Cyberpunk Grid Floor
    const gridGeometry = new THREE.PlaneGeometry(40, 40, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: c.grid,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -5;
    scene.add(grid);

    // Floating Geometric Objects
    const objects: THREE.Mesh[] = [];
    
    // Create glowing cubes
    for (let i = 0; i < 8; i++) {
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? c.cubeEven : c.cubeOdd,
        transparent: true,
        opacity: 0.8,
        emissive: i % 2 === 0 ? c.emissiveEven : c.emissiveOdd
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      
      // Random positions
      cube.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      );
      
      // Random rotations
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      objects.push(cube);
      scene.add(cube);
    }

    // Create glowing rings
    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.TorusGeometry(2, 0.1, 8, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: c.ring,
        transparent: true,
        opacity: 0.7,
        emissive: c.ringEmissive
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      
      ring.position.set(
        (Math.random() - 0.5) * 15,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 15
      );
      
      objects.push(ring);
      scene.add(ring);
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate objects
      objects.forEach((obj, index) => {
        obj.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1);
        obj.rotation.y += 0.02 * (index % 2 === 0 ? -1 : 1);
        obj.rotation.z += 0.005;
        
        // Floating animation
        obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });

      // Animate lights
      pointLight1.intensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
      pointLight2.intensity = 0.5 + Math.cos(Date.now() * 0.003) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMonochrome]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default CyberScene;