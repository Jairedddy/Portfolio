import React from 'react';

interface ParticleBackgroundProps {
  id?: string;
  variant?: 'hero' | 'skills' | 'projects' | 'contact' | 'about';
}

/**
 * Cyberpunk Particles Background Component
 * Creates an animated particle network with cyber aesthetic using CSS animations
 * Optimized for performance with reduced particle counts
 */
const ParticleBackground = ({ id = "tsparticles", variant = 'hero' }: ParticleBackgroundProps) => {
  const getParticleConfig = () => {
    switch (variant) {
      case 'hero':
        return {
          count: 25, // Reduced from 50
          color: 'bg-neon-cyan',
          gradient: 'from-neon-cyan/5 via-transparent to-neon-purple/5'
        };
      case 'skills':
        return {
          count: 20, // Reduced from 40
          color: 'bg-neon-green',
          gradient: 'from-neon-green/5 via-transparent to-neon-cyan/5'
        };
      case 'projects':
        return {
          count: 22, // Reduced from 45
          color: 'bg-neon-purple',
          gradient: 'from-neon-purple/5 via-transparent to-neon-green/5'
        };
      case 'contact':
        return {
          count: 18, // Reduced from 35
          color: 'bg-neon-cyan',
          gradient: 'from-neon-cyan/5 via-transparent to-neon-purple/5'
        };
      case 'about':
        return {
          count: 22,
          color: 'bg-neon-cyan',
          gradient: 'from-neon-cyan/5 via-transparent to-neon-green/5'
        };
      default:
        return {
          count: 25, // Reduced from 50
          color: 'bg-neon-cyan',
          gradient: 'from-neon-cyan/5 via-transparent to-neon-purple/5'
        };
    }
  };

  const config = getParticleConfig();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {[...Array(config.count)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 ${config.color} rounded-full animate-pulse`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`, // Reduced from 3s
            animationDuration: `${1.5 + Math.random() * 2}s` // Reduced from 2-5s
          }}
        />
      ))}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} animate-pulse`}
        style={{
          animationDuration: '8s' // Increased from 6s for smoother animation
        }}
      />

    </div>
  );
};

export default ParticleBackground;
