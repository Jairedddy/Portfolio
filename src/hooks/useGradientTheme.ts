import { useLayoutEffect, useContext } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeContext } from "@/context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

type ThemeColors = {
  start: string;
  end: string;
};

const FALLBACK_COLORS: ThemeColors = {
  start: "hsl(228 70% 8%)",
  end: "hsl(258 60% 18%)",
};

const MONO_FALLBACK: ThemeColors = {
  start: "hsl(0 0% 8%)",
  end: "hsl(0 0% 12%)",
};

const readThemeColors = (theme: string): ThemeColors => {
  if (typeof window === "undefined") {
    return FALLBACK_COLORS;
  }

  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const baseStart = styles.getPropertyValue("--gradient-start").trim() || FALLBACK_COLORS.start;
  const baseEnd = styles.getPropertyValue("--gradient-end").trim() || FALLBACK_COLORS.end;

  const themeStart =
    styles.getPropertyValue(`--gradient-${theme}-start`).trim() || baseStart || FALLBACK_COLORS.start;
  const themeEnd =
    styles.getPropertyValue(`--gradient-${theme}-end`).trim() || baseEnd || FALLBACK_COLORS.end;

  return { start: themeStart, end: themeEnd };
};

export const useGradientTheme = (ref: RefObject<HTMLElement | null>, theme: string) => {
  const themeCtx = useContext(ThemeContext);
  const isMono = themeCtx?.isMonochrome ?? false;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const root = document.documentElement;

    if (isMono) {
      // In monochrome, set uniform grey gradients and skip scroll animation
      gsap.to(root, {
        "--gradient-start": MONO_FALLBACK.start,
        "--gradient-end": MONO_FALLBACK.end,
        duration: 0.5,
        ease: "power2.out",
      });
      return undefined;
    }

    const animateToTheme = () => {
      const { start, end } = readThemeColors(theme);
      gsap.to(root, {
        "--gradient-start": start,
        "--gradient-end": end,
        duration: 2,
        ease: "power2.out",
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top center",
      end: "bottom center",
      onEnter: animateToTheme,
      onEnterBack: animateToTheme,
    });

    return () => {
      trigger.kill();
    };
  }, [ref, theme, isMono]);
};
