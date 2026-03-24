import { motion, AnimatePresence } from "framer-motion";
import { Palette, CircleOff } from "lucide-react";
import { useThemeMode } from "@/hooks/useThemeMode";

type ThemeToggleProps = {
  activeTheme?: {
    text: string;
    border: string;
    shadow: string;
  };
};

const ThemeToggle = ({ activeTheme }: ThemeToggleProps) => {
  const { theme, toggleTheme, isMonochrome } = useThemeMode();

  const borderClass = isMonochrome
    ? "border-white/25 hover:border-white/50"
    : activeTheme?.border
      ? `${activeTheme.border}/40 hover:${activeTheme.border}/70`
      : "border-neon-purple/40 hover:border-neon-purple/70";

  const textClass = isMonochrome
    ? "text-white/70 hover:text-white"
    : activeTheme?.text ?? "text-neon-purple";

  const shadowClass = isMonochrome
    ? ""
    : activeTheme?.shadow
      ? `hover:${activeTheme.shadow}`
      : "hover:shadow-neon-purple";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300 ${borderClass} ${textClass} ${shadowClass}`}
      aria-label={`Switch to ${isMonochrome ? "vibrant" : "monochrome"} theme`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isMonochrome ? <CircleOff size={14} /> : <Palette size={14} />}
        </motion.span>
      </AnimatePresence>
      <span className="text-[11px] font-medium uppercase tracking-[0.15em]">
        {isMonochrome ? "Mono" : "Vibrant"}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
