import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CyberSceneProps {
  className?: string;
}

// Cyberpunk Three.js Scene Component
const CyberScene = ({ className = "" }: CyberSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f0f23, 10, 50);
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
    renderer.setClearColor(0x0f0f23, 0.1);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xbd5bff, 1, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Cyberpunk Grid Floor
    const gridGeometry = new THREE.PlaneGeometry(40, 40, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
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
        color: i % 2 === 0 ? 0x00ffff : 0xbd5bff,
        transparent: true,
        opacity: 0.8,
        emissive: i % 2 === 0 ? 0x004444 : 0x440044
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
        color: 0x39ff14,
        transparent: true,
        opacity: 0.7,
        emissive: 0x002200
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
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default CyberScene;