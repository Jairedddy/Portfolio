import { AnimatePresence, motion } from "framer-motion";
import { Flame, Gamepad2, Globe, Shield, Sparkles, Star } from "lucide-react";
import { useMemo } from "react";
import useEasterEggsContext from "@/hooks/useEasterEggsContext";
import type { ActiveEasterEgg, EasterEggId } from "@/hooks/useEasterEggs";

const PARTICLE_COUNT = 18;

const EasterEggs = () => {
  const { activeEgg, discoveredCount, totalEggs, dismissActiveEgg } = useEasterEggsContext();

  const questContent = activeEgg
    ? questLayouts[activeEgg.id]?.({
        egg: activeEgg,
        discoveredCount,
        totalEggs,
        dismiss: dismissActiveEgg,
      })
    : null;

  return (
    <AnimatePresence>
      {activeEgg && (
        <motion.div
          key={activeEgg.triggeredAt}
          className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {questContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface QuestModalProps {
  egg: ActiveEasterEgg;
  discoveredCount: number;
  totalEggs: number;
  dismiss: () => void;
}

type QuestRenderer = (props: QuestModalProps) => JSX.Element;

const FeatureBadge = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {text}
  </div>
);

const QuestListBullet = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2">
    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-current" />
    <span>{text}</span>
  </div>
);

const questLayouts: Record<EasterEggId, QuestRenderer> = {
  logoOracle: ({ egg, discoveredCount, totalEggs, dismiss }) => (
    <motion.div
      className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-[32px] border border-neon-purple/50 bg-gradient-to-br from-[#120318] via-[#1d0a2a] to-[#07050c] px-8 py-7 text-left shadow-[0_0_70px_rgba(147,51,234,0.45)]"
      initial={{ scale: 0.9, opacity: 0, y: 25 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -25 }}
      onClick={dismiss}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3 text-neon-purple">
          <Sparkles size={20} />
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Neon Side Quest · 01</p>
        </div>
        <h2 className="font-cyber text-2xl text-white">{egg.label}</h2>
        <p className="mt-2 text-base text-neon-cyan/90">{egg.message}</p>
        <p className="mt-1 text-sm text-muted-foreground">{egg.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-muted-foreground/90">
          <FeatureBadge text="Crest override accepted" />
          <FeatureBadge text="Vice dispatch unlocked" />
        </div>

        <footer className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Chapters cleared {discoveredCount} / {totalEggs}
          </span>
          <button
            className="rounded-full border border-neon-purple/50 px-4 py-1 text-[11px] uppercase tracking-widest text-white/80 transition hover:bg-neon-purple/20"
            onClick={(event) => {
              event.stopPropagation();
              dismiss();
            }}
          >
            Continue story
          </button>
        </footer>
      </div>
      <PulseRing className="border-neon-purple/30" />
    </motion.div>
  ),
  viceLegend: ({ egg, discoveredCount, totalEggs, dismiss }) => (
    <motion.div
      className="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#070314]/90 px-10 py-8 text-left shadow-[0_0_55px_rgba(234,179,8,0.35)] backdrop-blur"
      initial={{ rotateX: -10, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      exit={{ rotateX: 5, opacity: 0 }}
      onClick={dismiss}
    >
      <div className="relative z-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3 text-amber-300">
            <Gamepad2 size={22} />
            <p className="text-xs uppercase tracking-[0.35em] text-amber-100/70">Vice Broadcast 02</p>
          </div>
          <h2 className="font-cyber text-3xl text-white">{egg.label}</h2>
          <p className="mt-3 text-lg text-amber-100/90">{egg.message}</p>
          <p className="mt-2 text-sm text-muted-foreground">{egg.description}</p>

          <ul className="mt-6 space-y-2 text-sm text-amber-100/80">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Synthwave radio cracked open.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Next clue patched through the Jade Palace consoles.
            </li>
          </ul>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Chapters cleared {discoveredCount} / {totalEggs}
            </span>
            <button
              className="rounded-full border border-amber-200/50 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-amber-50 transition hover:bg-amber-200/10"
              onClick={(event) => {
                event.stopPropagation();
                dismiss();
              }}
            >
              Dial next clue
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-[24px] border border-amber-200/30 bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-transparent blur-3xl" />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-amber-200/40 bg-black/40 text-amber-100">
            <span className="font-cyber text-sm uppercase tracking-[0.4em]">Vice</span>
          </div>
        </div>
      </div>
      <ParticleBurst seed={egg.triggeredAt} gradientClass="from-amber-300 via-pink-400 to-purple-500" />
    </motion.div>
  ),
  dragonShadow: ({ egg, discoveredCount, totalEggs, dismiss }) => (
    <motion.div
      className="pointer-events-auto relative w-full max-w-xl overflow-hidden rounded-[30px] border border-red-500/40 bg-gradient-to-b from-[#1f0303] via-[#2c0505] to-[#0a0202] px-9 py-8 text-left shadow-[0_0_60px_rgba(248,113,113,0.4)]"
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: -20 }}
      onClick={dismiss}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3 text-rose-300">
          <Flame size={22} />
          <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">Jade Dispatch 03</p>
        </div>
        <h2 className="font-cyber text-3xl text-white">{egg.label}</h2>
        <p className="mt-2 text-lg text-rose-100/90">{egg.message}</p>
        <p className="mt-1 text-sm text-muted-foreground">{egg.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <FeatureBadge text="Jade Palace archives synced" />
          <FeatureBadge text="Portal uplink warming" />
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Chapters cleared {discoveredCount} / {totalEggs}
          </span>
          <button
            className="rounded-full border border-rose-400/60 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-rose-100 transition hover:bg-rose-400/10"
            onClick={(event) => {
              event.stopPropagation();
              dismiss();
            }}
          >
            Summon portal cue
          </button>
        </div>
      </div>
      <AuroraGlow className="from-red-500/60 via-orange-500/40 to-yellow-500/40" />
    </motion.div>
  ),
  gothamSignal: ({ egg, discoveredCount, totalEggs, dismiss }) => (
    <motion.div
      className="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-[34px] border border-slate-400/40 bg-gradient-to-br from-[#020308] via-[#050b16] to-[#010203] px-10 py-9 text-left shadow-[0_0_70px_rgba(59,130,246,0.35)]"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={dismiss}
    >
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3 text-blue-300">
            <Shield size={22} />
            <p className="text-xs uppercase tracking-[0.35em] text-blue-100/70">Gotham Alert 04</p>
          </div>
          <h2 className="font-cyber text-3xl text-white">{egg.label}</h2>
          <p className="mt-2 text-lg text-blue-100/90">{egg.message}</p>
          <p className="mt-1 text-sm text-muted-foreground">{egg.description}</p>

          <div className="mt-6 space-y-2 text-sm text-blue-100/80">
            <QuestListBullet text="Bat-Signal recalibrated to your frequency." />
            <QuestListBullet text="Kryptonian archives preparing final echo." />
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Chapters cleared {discoveredCount} / {totalEggs}
            </span>
            <button
              className="rounded-full border border-blue-300/60 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-blue-100 transition hover:bg-blue-300/10"
              onClick={(event) => {
                event.stopPropagation();
                dismiss();
              }}
            >
              Ignite final beacon
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-[28px] border border-blue-300/30" />
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-blue-200/50 text-blue-100">
            <span className="font-cyber text-sm uppercase tracking-[0.45em]">Bat</span>
          </div>
        </div>
      </div>
      <ParticleBurst seed={egg.triggeredAt} gradientClass="from-blue-400 via-indigo-500 to-purple-600" />
    </motion.div>
  ),
  kryptonEcho: ({ egg, discoveredCount, totalEggs, dismiss }) => (
    <motion.div
      className="pointer-events-auto relative w-full max-w-xl overflow-hidden rounded-[36px] border border-emerald-200/50 bg-gradient-to-br from-[#01040c] via-[#031026] to-[#03050a] px-8 py-8 text-left shadow-[0_0_75px_rgba(52,211,153,0.35)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      onClick={dismiss}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3 text-emerald-300">
          <Globe size={22} />
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">Krypton Finale</p>
        </div>
        <h2 className="font-cyber text-3xl text-emerald-100">{egg.label}</h2>
        <p className="mt-2 text-lg text-emerald-50/90">{egg.message}</p>
        <p className="mt-1 text-sm text-muted-foreground">{egg.description}</p>

        <div className="mt-5 grid gap-3 text-sm text-emerald-100/80">
          <QuestListBullet text="Fortress crystals synced to neon archives." />
          <QuestListBullet text="Gotham + Krypton alliance filed in legend." />
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Chapters cleared {discoveredCount} / {totalEggs}
          </span>
          <button
            className="rounded-full border border-emerald-300/60 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-emerald-100 transition hover:bg-emerald-300/10"
            onClick={(event) => {
              event.stopPropagation();
              dismiss();
            }}
          >
            Seal chronicles
          </button>
        </div>
      </div>
      <Starfield seed={egg.triggeredAt} />
    </motion.div>
  ),
};

const ParticleBurst = ({ seed, gradientClass }: { seed: number; gradientClass?: string }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, index) => ({
        id: `${seed}-${index}`,
        delay: (index % 5) * 0.08,
        size: 6 + ((seed + index * 13) % 8),
      })),
    [seed],
  );

  return (
    <div className="pointer-events-none">
      {particles.map((particle, idx) => (
        <motion.span
          key={particle.id}
          className={`absolute left-1/2 top-1/2 block rounded-full bg-gradient-to-r ${
            gradientClass ?? "from-neon-purple via-neon-cyan to-neon-green"
          } shadow-[0_0_12px_rgba(125,211,252,0.6)]`}
          style={{ width: particle.size, height: particle.size }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0], x: ((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 10), y: -80 - idx * 4 }}
          transition={{ duration: 1.2, delay: particle.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const AuroraGlow = ({ className }: { className?: string }) => (
  <motion.div
    className={`pointer-events-none absolute inset-[-30%] -z-10 rounded-[40px] bg-gradient-to-r blur-3xl ${className ?? "from-neon-purple/40 via-neon-cyan/30 to-neon-green/40"}`}
    initial={{ opacity: 0.4, scale: 0.8 }}
    animate={{ opacity: [0.4, 0.8, 0.5], scale: [0.8, 1, 0.95] }}
    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
  />
);

const PulseRing = ({ className }: { className?: string }) => (
  <motion.div
    className={`pointer-events-none absolute inset-0 -z-10 rounded-[32px] border ${className ?? "border-neon-purple/40"}`}
    initial={{ opacity: 0.4, scale: 0.9 }}
    animate={{ opacity: [0.4, 0.9, 0.2], scale: [0.9, 1.1, 1] }}
    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Starfield = ({ seed }: { seed: number }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, index) => ({
        id: `${seed}-star-${index}`,
        left: ((seed + index * 73) % 100) + "%",
        top: ((seed + index * 41) % 100) + "%",
        size: 1 + ((seed + index * 11) % 3),
        delay: (index % 5) * 0.4,
      })),
    [seed],
  );

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-emerald-200/80 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: star.delay }}
        />
      ))}
    </div>
  );
};

export default EasterEggs;
