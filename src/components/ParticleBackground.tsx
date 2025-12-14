import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  id?: string;
  variant?: 'hero' | 'skills' | 'projects' | 'contact' | 'about';
}

type VariantConfig = {
  count: number;
  gradient: string;
  colorClass: string;
  interactive?: boolean;
  particleRGBA?: string;
  accentRGBA?: string;
  pointerForce?: number;
  connectionDistance?: number;
  pointerTrailAttraction?: number;
  homeSpring?: number;
  drag?: number;
  pointerRadiusFactor?: number;
  pointerTrailLimit?: number;
  connectionCap?: number;
  maxDevicePixelRatio?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number;
  baseX: number;
  baseY: number;
};

type TrailPoint = { x: number; y: number; life: number };

const VARIANT_CONFIG: Record<string, VariantConfig> = {
  hero: {
    interactive: true,
    count: 50,
    gradient: 'from-neon-cyan/30 via-transparent to-neon-purple/30',
    colorClass: 'bg-neon-cyan',
    particleRGBA: '94, 234, 255',
    accentRGBA: '167, 139, 250',
    pointerForce: 0.35,
    connectionDistance: 150,
    pointerTrailAttraction: 0.06,
    homeSpring: 0.0035,
    drag: 0.88,
    pointerRadiusFactor: 0.5,
    pointerTrailLimit: 18,
    connectionCap: 12,
    maxDevicePixelRatio: 1.5,
  },
  skills: {
    count: 20,
    gradient: 'from-neon-green/5 via-transparent to-neon-cyan/5',
    colorClass: 'bg-neon-green',
  },
  projects: {
    count: 22,
    gradient: 'from-neon-purple/5 via-transparent to-neon-green/5',
    colorClass: 'bg-neon-purple',
  },
  contact: {
    count: 18,
    gradient: 'from-neon-cyan/5 via-transparent to-neon-purple/5',
    colorClass: 'bg-neon-cyan',
  },
  about: {
    count: 22,
    gradient: 'from-neon-cyan/5 via-transparent to-neon-green/5',
    colorClass: 'bg-neon-cyan',
  },
  default: {
    count: 25,
    gradient: 'from-neon-cyan/5 via-transparent to-neon-purple/5',
    colorClass: 'bg-neon-cyan',
  },
};

const ParticleBackground = ({
  id = 'tsparticles',
  variant = 'hero',
}: ParticleBackgroundProps) => {
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.default;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!config.interactive || typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const particles: Particle[] = [];
    const pointerTrail: TrailPoint[] = [];
    const pointer = { x: 0, y: 0, active: false };

    let bounds = { width: 0, height: 0 };
    let animationId = 0;
    let pointerRadius = 0;
    let isVisible = true;
    const maxDpr = config.maxDevicePixelRatio ?? 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const prev = { ...bounds };
      bounds = { width: rect.width, height: rect.height };
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      return prev;
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < config.count; i += 1) {
        const x = Math.random() * bounds.width;
        const y = Math.random() * bounds.height;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          ax: 0,
          ay: 0,
          size: 1 + Math.random() * 1.8,
          baseX: x,
          baseY: y,
        });
      }
    };

    updateCanvasSize();
    initParticles();
    pointerRadius =
      Math.max(bounds.width, bounds.height) *
      (config.pointerRadiusFactor ?? 0.42);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      pointer.active = inside;
      if (!inside) return;

      pointer.x = x;
      pointer.y = y;
      pointerTrail.push({ x, y, life: 1 });
      const limit = config.pointerTrailLimit ?? 24;
      if (pointerTrail.length > limit) pointerTrail.shift();
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    // Track pointer globally so the hero CTA remains clickable under the canvas overlay.
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    const decayTrail = () => {
      for (let i = pointerTrail.length - 1; i >= 0; i -= 1) {
        pointerTrail[i].life -= 0.025;
        if (pointerTrail[i].life <= 0) {
          pointerTrail.splice(i, 1);
        }
      }
    };

    const connectionDistance = config.connectionDistance ?? 140;
    const pointerForce = config.pointerForce ?? 0.15;
    const pointerTrailAttraction = config.pointerTrailAttraction ?? 0.045;
    const homeSpring = config.homeSpring ?? 0.0025;
    const drag = config.drag ?? 0.92;

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.ax += (Math.random() - 0.5) * 0.02;
        particle.ay += (Math.random() - 0.5) * 0.02;

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < pointerRadius) {
            const force = ((pointerRadius - dist) / pointerRadius) * pointerForce;
            particle.ax += (dx / dist) * force;
            particle.ay += (dy / dist) * force;
          }
        }

        pointerTrail.forEach((trail) => {
          if (trail.life <= 0) return;
          const dx = trail.x - particle.x;
          const dy = trail.y - particle.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < pointerRadius * 0.6) {
            const attraction = (trail.life * pointerTrailAttraction) / dist;
            particle.ax += dx * attraction;
            particle.ay += dy * attraction;
          }
        });

        const homeDx = particle.baseX - particle.x;
        const homeDy = particle.baseY - particle.y;
        particle.ax += homeDx * homeSpring;
        particle.ay += homeDy * homeSpring;

        particle.vx = (particle.vx + particle.ax) * drag;
        particle.vy = (particle.vy + particle.ay) * drag;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.ax = 0;
        particle.ay = 0;

        if (particle.x < -10) particle.x = bounds.width + 10;
        if (particle.x > bounds.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = bounds.height + 10;
        if (particle.y > bounds.height + 10) particle.y = -10;
      });
    };

    const drawConnections = () => {
      ctx.lineCap = 'round';
      const maxConnections = config.connectionCap ?? particles.length;
      for (let i = 0; i < particles.length; i += 1) {
        let drawn = 0;
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          if (Math.abs(dx) > connectionDistance) continue;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > connectionDistance) continue;
          const opacity = 1 - dist / connectionDistance;
          ctx.strokeStyle = `rgba(${config.particleRGBA}, ${opacity * 0.35})`;
          ctx.lineWidth = 0.8 * opacity;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          drawn += 1;
          if (drawn >= maxConnections) break;
        }
      }
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        const glowIntensity = 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${config.particleRGBA}, ${0.35 + glowIntensity * 0.5})`;
        ctx.shadowColor = `rgba(${config.accentRGBA ?? config.particleRGBA}, ${0.25 + glowIntensity * 0.4})`;
        ctx.shadowBlur = 12 * glowIntensity;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      if (!isVisible) return;
      ctx.clearRect(0, 0, bounds.width, bounds.height);
      decayTrail();
      updateParticles();
      drawConnections();
      drawParticles();
    };

    animate();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            const previous = { ...bounds };
            updateCanvasSize();
            pointerRadius =
              Math.max(bounds.width, bounds.height) *
              (config.pointerRadiusFactor ?? 0.42);
            const widthRatio = previous.width
              ? bounds.width / previous.width
              : 1;
            const heightRatio = previous.height
              ? bounds.height / previous.height
              : 1;
            particles.forEach((particle) => {
              particle.x *= widthRatio;
              particle.y *= heightRatio;
              particle.baseX *= widthRatio;
              particle.baseY *= heightRatio;
            });
          })
        : null;

    resizeObserver?.observe(container);

    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = !!entry?.isIntersecting;
            },
            { threshold: 0.1 },
          )
        : null;

    visibilityObserver?.observe(container);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (animationId) window.cancelAnimationFrame(animationId);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
    };
  }, [
    config.accentRGBA,
    config.connectionDistance,
    config.count,
    config.interactive,
    config.particleRGBA,
    config.pointerForce,
    config.pointerTrailAttraction,
    config.homeSpring,
    config.drag,
    config.pointerRadiusFactor,
    config.pointerTrailLimit,
    config.connectionCap,
    config.maxDevicePixelRatio,
    variant,
  ]);

  if (!config.interactive) {
    return (
      <div
        id={id}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        {[...Array(config.count)].map((_, index) => (
          <div
            key={`particle-${variant}-${index}`}
            className={`absolute w-1 h-1 ${config.colorClass} rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        ))}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient} animate-pulse`}
          style={{ animationDuration: '8s' }}
        />
      </div>
    );
  }

  return (
    <div
      id={id}
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-70 mix-blend-screen`}
      />
    </div>
  );
};

export default ParticleBackground;
