import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls, Sparkles, Stars, useCursor } from "@react-three/drei";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "./ProjectsSection";

type Project3DShowcaseProps = {
  projects: Project[];
  onProjectFocus?: (project: Project) => void;
};

const CARD_RING_RADIUS = 6;

const NeonRing = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
    <ringGeometry args={[CARD_RING_RADIUS - 0.2, CARD_RING_RADIUS + 0.2, 128]} />
    <meshBasicMaterial color="#38bdf8" opacity={0.25} transparent />
  </mesh>
);

const NeonGrid = () => (
  <group rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
    <gridHelper args={[24, 24, "#38bdf8", "#0f172a"]} />
  </group>
);

type ShowcaseCardProps = {
  project: Project;
  index: number;
  total: number;
  activeIndex: number;
  onSelect: () => void;
  onInteract: () => void;
};

const ShowcaseCard = ({
  project,
  index,
  total,
  activeIndex,
  onSelect,
  onInteract,
}: ShowcaseCardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer");

  const angle = useMemo(() => {
    if (total === 0) return 0;
    return (index / total) * Math.PI * 2;
  }, [index, total]);

  useFrame((_, delta) => {
    if (!groupRef.current || !plateRef.current) return;
    groupRef.current.lookAt(0, 0.4, 0);

    const targetY = hovered || index === activeIndex ? 0.85 : 0.4;
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 4, delta);

    const targetScale = hovered || index === activeIndex ? 1.1 : 0.95;
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.y = groupRef.current.scale.x;
    groupRef.current.scale.z = groupRef.current.scale.x;

    const material = plateRef.current.material;
    if (material && material instanceof THREE.MeshStandardMaterial) {
      const targetEmissive = hovered || index === activeIndex ? 1.4 : 0.4;
      material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, targetEmissive, 4, delta);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        Math.cos(angle) * CARD_RING_RADIUS,
        0.4,
        Math.sin(angle) * CARD_RING_RADIUS,
      ]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onInteract();
        onSelect();
      }}
    >
      <Float speed={1.2} floatIntensity={0.45} rotationIntensity={0.15}>
        <mesh ref={plateRef} rotation={[-Math.PI / 10, 0, 0]}>
          <planeGeometry args={[2.8, 3.8, 16, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#38bdf8"
            emissiveIntensity={0.4}
            roughness={0.35}
            metalness={0.15}
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 10, 0, 0]}>
          <planeGeometry args={[2.82, 3.82, 1, 1]} />
          <meshBasicMaterial color="#38bdf8" wireframe opacity={0.4} transparent />
        </mesh>
        <Html
          transform
          occlude
          distanceFactor={8}
          position={[0, 0, 0.02]}
          style={{ pointerEvents: "none" }}
        >
          <div className="w-48 rounded-2xl border border-white/20 bg-background/80 p-3 text-left shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {project.category}
            </p>
            <p className="text-base font-semibold text-foreground">
              {project.title}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tech.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white/80">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
};

type CardsRingProps = {
  projects: Project[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onInteract: () => void;
};

const CardsRing = ({ projects, activeIndex, setActiveIndex, onInteract }: CardsRingProps) => {
  const ringRef = useRef<THREE.Group>(null);
  const angleStep = projects.length > 0 ? (Math.PI * 2) / projects.length : 0;

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    const targetRotation = -activeIndex * angleStep;
    ringRef.current.rotation.y = THREE.MathUtils.damp(
      ringRef.current.rotation.y,
      targetRotation,
      4.5,
      delta
    );
  });

  return (
    <group ref={ringRef}>
      {projects.map((project, index) => (
        <ShowcaseCard
          key={project.title}
          project={project}
          index={index}
          total={projects.length}
          activeIndex={activeIndex}
          onSelect={() => setActiveIndex(index)}
          onInteract={onInteract}
        />
      ))}
    </group>
  );
};

const EmptyState = () => (
  <div className="flex h-[500px] flex-col items-center justify-center rounded-[32px] border border-dashed border-border/50 bg-card/60 text-center">
    <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">3D Showcase</p>
    <p className="mt-2 max-w-md text-muted-foreground">
      Add a project to this category to bring it into the 3D orbit.
    </p>
  </div>
);

const Project3DShowcase = ({ projects, onProjectFocus }: Project3DShowcaseProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const interactionTimeout = useRef<number>();

  useEffect(() => {
    setActiveIndex(0);
  }, [projects]);

  useEffect(() => {
    if (!autoRotate || projects.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [autoRotate, projects.length]);

  const handleInteract = useCallback(() => {
    setAutoRotate(false);
    window.clearTimeout(interactionTimeout.current);
    interactionTimeout.current = window.setTimeout(() => setAutoRotate(true), 8000);
  }, []);

  useEffect(() => () => window.clearTimeout(interactionTimeout.current), []);

  useEffect(() => {
    if (!projects[activeIndex]) return;
    onProjectFocus?.(projects[activeIndex]);
  }, [activeIndex, onProjectFocus, projects]);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      if (!projects.length) return;
      handleInteract();
      setActiveIndex((prev) => {
        if (direction === "prev") {
          return prev === 0 ? projects.length - 1 : prev - 1;
        }
        return (prev + 1) % projects.length;
      });
    },
    [handleInteract, projects.length]
  );

  const activeProject = projects[activeIndex];

  if (!projects.length) {
    return <EmptyState />;
  }

  return (
    <div className="relative min-h-[640px] w-full overflow-hidden rounded-[36px] border border-white/5 bg-gradient-to-br from-[#020617] via-[#030617] to-[#040014] shadow-[0_30px_120px_rgba(2,6,23,0.65)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent)]" />
      <Canvas
        camera={{ position: [0, 3.5, 11], fov: 45, near: 0.1, far: 60 }}
        dpr={[1, 1.75]}
        className="h-[520px]"
      >
        <color attach="background" args={["#010313"]} />
        <fog attach="fog" args={["#01020b", 14, 32]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 2]} intensity={1.4} color="#93c5fd" />
        <directionalLight position={[-5, 5, -2]} intensity={0.6} color="#22d3ee" />

        <Sparkles count={180} size={2} speed={0.4} opacity={0.3} scale={12} color="#67e8f9" />
        <Stars radius={60} depth={40} count={2000} factor={4} saturation={0} fade />

        <NeonGrid />
        <NeonRing />
        <CardsRing projects={projects} activeIndex={activeIndex} setActiveIndex={setActiveIndex} onInteract={handleInteract} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.12}
          autoRotate={false}
          enableZoom
          maxDistance={16}
          minDistance={8}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3.5}
          zoomSpeed={0.6}
          rotateSpeed={0.6}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-6 rounded-[28px] border border-white/5" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent backdrop-blur-[40px]" />

      <motion.div
        key={activeProject?.title}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 px-6 pb-8 pt-4 md:px-10"
      >
        {activeProject && (
          <div className="rounded-3xl border border-white/10 bg-card/80 p-6 shadow-[0_20px_60px_rgba(3,7,18,0.7)] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                  In Focus
                </p>
                <h3 className="text-2xl font-bold text-glow-cyan">{activeProject.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeProject.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-glow-cyan text-neon-cyan hover:bg-glow-cyan hover:text-background"
                  asChild
                >
                  <a href={activeProject.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
                {activeProject.live && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-neon-cyan to-neon-purple text-background shadow-neon-cyan transition hover:brightness-110"
                    asChild
                  >
                    <a href={activeProject.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Launch
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                  Mission Highlights
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeProject.features.slice(0, 4).map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/90"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                  Stack
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
        <div className="h-12 w-72 rounded-full bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent blur-3xl" />
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          size="icon"
          variant="outline"
          className="ml-4 h-12 w-12 rounded-full border-white/30 bg-black/40 text-white hover:border-neon-cyan hover:text-neon-cyan"
          onClick={() => navigate("prev")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          size="icon"
          variant="outline"
          className="mr-4 h-12 w-12 rounded-full border-white/30 bg-black/40 text-white hover:border-neon-cyan hover:text-neon-cyan"
          onClick={() => navigate("next")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70">
        <span>Auto Orbit</span>
        <button
          type="button"
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`relative h-6 w-10 rounded-full border border-white/20 p-0.5 transition ${autoRotate ? "bg-neon-cyan/30" : "bg-white/10"}`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-white transition ${autoRotate ? "translate-x-4" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Project3DShowcase;
