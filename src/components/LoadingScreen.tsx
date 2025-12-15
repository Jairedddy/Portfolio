import { useMemo } from "react";
import { motion } from "framer-motion";

type LoadingScreenProps = {
  progress: number;
};

type Particle = {
  size: number;
  distance: number;
  duration: number;
  delay: number;
};

const LoadingScreen = ({ progress }: LoadingScreenProps) => {
  const particles = useMemo<Particle[]>(() => {
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;
    const distanceBase = isSmallScreen ? 30 : 50;

    return Array.from({ length: 18 }).map((_, index) => ({
      size: 4 + Math.random() * 6,
      distance: distanceBase + Math.random() * (isSmallScreen ? 30 : 50),
      duration: 2.5 + Math.random() * 2,
      delay: index * 0.12,
    }));
  }, []);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white overflow-hidden px-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.15),_transparent_55%)]"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 w-full max-w-md text-center">
        <div className="relative mx-auto">
          <motion.div
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border border-white/20 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute inset-4 rounded-full border border-white/40 flex items-center justify-center overflow-hidden"
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neon-cyan/40 via-neon-purple/40 to-neon-green/30 blur-2xl"
                animate={{ scale: [1, 1.05, 1], rotate: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="font-black tracking-[0.4em] text-base sm:text-lg text-white relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                JR
              </motion.span>
            </motion.div>
          </motion.div>

          {particles.map((particle, index) => (
            <motion.span
              key={`particle-${index}`}
              className="absolute left-1/2 top-1/2 rounded-full bg-white/40 shadow-lg"
              style={{
                width: particle.size,
                height: particle.size,
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
                y: [0, -particle.distance, 0],
                x: [0, particle.distance / 2, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="space-y-2 w-full max-w-sm mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.5em] sm:tracking-[0.6em] text-white/60">
            Initializing Experience
          </p>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green"
              style={{ width: `${clampedProgress}%` }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-[0.7rem] sm:text-xs font-mono text-white/70">
            Loading {clampedProgress}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
