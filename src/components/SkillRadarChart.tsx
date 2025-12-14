import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import type { SkillCategory } from "@/data/skillCategories";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { TooltipProps } from "recharts";

type SkillRadarChartProps = {
  categories: SkillCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

const neonPalette: Record<
  string,
  { stroke: string; fill: string; glow: string; grid: string; text: string }
> = {
  "neon-cyan": {
    stroke: "#00f5ff",
    fill: "rgba(0,245,255,0.45)",
    glow: "rgba(0,245,255,0.55)",
    grid: "rgba(0,245,255,0.18)",
    text: "text-neon-cyan",
  },
  "neon-purple": {
    stroke: "#c084fc",
    fill: "rgba(192,132,252,0.45)",
    glow: "rgba(192,132,252,0.55)",
    grid: "rgba(147,51,234,0.25)",
    text: "text-neon-purple",
  },
  "neon-green": {
    stroke: "#a3e635",
    fill: "rgba(163,230,53,0.45)",
    glow: "rgba(163,230,53,0.55)",
    grid: "rgba(163,230,53,0.25)",
    text: "text-neon-green",
  },
  "neon-orange": {
    stroke: "#fb923c",
    fill: "rgba(251,146,60,0.45)",
    glow: "rgba(251,146,60,0.55)",
    grid: "rgba(234,88,12,0.25)",
    text: "text-orange-400",
  },
  "neon-yellow": {
    stroke: "#facc15",
    fill: "rgba(250,204,21,0.45)",
    glow: "rgba(250,204,21,0.55)",
    grid: "rgba(234,179,8,0.25)",
    text: "text-yellow-400",
  },
  "neon-pink": {
    stroke: "#f472b6",
    fill: "rgba(244,114,182,0.45)",
    glow: "rgba(244,114,182,0.55)",
    grid: "rgba(236,72,153,0.25)",
    text: "text-pink-400",
  },
  "neon-red": {
    stroke: "#f87171",
    fill: "rgba(248,113,113,0.45)",
    glow: "rgba(248,113,113,0.55)",
    grid: "rgba(248,113,113,0.25)",
    text: "text-red-400",
  },
};

const defaultPalette = neonPalette["neon-cyan"];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-background/90 px-3 py-2 text-xs shadow-lg shadow-cyan-500/10 backdrop-blur">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">
        Proficiency: <span className="font-medium">{payload[0].value}%</span>
      </p>
    </div>
  );
};

const SkillRadarChart = ({
  categories,
  activeCategoryId,
  onCategoryChange,
}: SkillRadarChartProps) => {
  const activeCategory =
    useMemo(
      () => categories.find((category) => category.id === activeCategoryId),
      [categories, activeCategoryId]
    ) ?? categories[0];

  const palette = neonPalette[activeCategory.color] ?? defaultPalette;

  const chartData = useMemo(
    () =>
      activeCategory.skills.map((skill) => ({
        ...skill,
        fullMark: 100,
      })),
    [activeCategory]
  );

  const average = useMemo(
    () =>
      Math.round(
        chartData.reduce((acc, skill) => acc + skill.level, 0) /
          chartData.length
      ),
    [chartData]
  );

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-background/80 via-background/60 to-background/80 p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Radar Focus
            </p>
            <h3
              className={`font-cyber text-xl font-semibold ${
                palette.text ?? "text-neon-cyan"
              }`}
            >
              {activeCategory.title}
            </h3>
          </div>
          <div className="rounded-2xl border border-border/70 bg-black/30 px-4 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Average
            </p>
            <p className="text-2xl font-bold text-white">{average}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category.id === activeCategory.id;
            const buttonPalette = neonPalette[category.color] ?? defaultPalette;

            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "bg-black/60 text-white shadow-[0_0_25px_currentColor]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{
                  borderColor: isActive
                    ? buttonPalette.stroke
                    : "rgba(255,255,255,0.15)",
                  boxShadow: isActive
                    ? `0 0 18px ${buttonPalette.glow}`
                    : "none",
                }}
              >
                <category.icon size={12} />
                {category.title}
              </motion.button>
            );
          })}
        </div>

        <div className="relative h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.5 }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                >
                  <defs>
                    <radialGradient
                      id={`radarGradient-${activeCategory.id}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor={palette.fill} stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor={palette.fill}
                        stopOpacity={0.1}
                      />
                    </radialGradient>
                  </defs>
                  <PolarGrid
                    stroke={palette.grid}
                    strokeDasharray="2 6"
                    radialLines
                  />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{
                      fill: "#e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tickCount={5}
                    tick={false}
                    stroke="transparent"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar
                    name="Proficiency"
                    dataKey="level"
                    stroke={palette.stroke}
                    strokeWidth={2}
                    fill={`url(#radarGradient-${activeCategory.id})`}
                    fillOpacity={0.8}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillRadarChart;
