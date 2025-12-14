import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

interface UseTextRevealOptions {
  /**
   * Intersection observer threshold – how much of the element must be visible.
   */
  threshold?: number;
  /**
   * Root margin for the intersection observer.
   */
  rootMargin?: string;
  /**
   * Animate only once.
   */
  once?: boolean;
  /**
   * Base delay applied before the animation starts (ms).
   */
  delay?: number;
  /**
   * Duration of each character animation (ms).
   */
  duration?: number;
  /**
   * Delay between characters (ms).
   */
  stagger?: number;
  /**
   * Starting translateY offset for the reveal effect.
   */
  translateY?: number;
  /**
   * Anime.js easing string.
   */
  easing?: string;
  /**
   * Opacity range for the animation.
   */
  opacity?: [number, number];
}

export const useTextReveal = (options: UseTextRevealOptions = {}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  const {
    threshold = 0.35,
    rootMargin = "0px",
    once = true,
    delay = 0,
    duration = 700,
    stagger: staggerDelay = 30,
    translateY = 12,
    easing = "easeOutQuad",
    opacity = [0, 1],
  } = options;
  const [opacityFrom, opacityTo] = opacity;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined") return;

    const characterElements = node.querySelectorAll<HTMLElement>("[data-text-reveal-char]");
    if (characterElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setVisibleImmediately = () => {
      characterElements.forEach((char) => {
        char.style.opacity = "1";
        char.style.transform = "none";
        char.style.willChange = "";
      });
    };

    const playAnimation = () => {
      if (prefersReducedMotion) {
        setVisibleImmediately();
        return;
      }

      animate(characterElements, {
        opacity: [opacityFrom, opacityTo],
        translateY: [translateY, 0],
        delay: stagger(staggerDelay, { start: delay }),
        duration,
        easing,
        begin: () => {
          characterElements.forEach((char) => {
            char.style.willChange = "transform, opacity";
          });
        },
        complete: () => {
          characterElements.forEach((char) => {
            char.style.willChange = "";
          });
        },
      });

      hasAnimatedRef.current = true;
    };

    if (once && hasAnimatedRef.current) {
      setVisibleImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playAnimation();
            if (once) observer.unobserve(entry.target);
          } else if (!once && !prefersReducedMotion) {
            characterElements.forEach((char) => {
              char.style.opacity = opacityFrom.toString();
              char.style.transform = `translateY(${translateY}px)`;
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay, duration, staggerDelay, translateY, easing, opacityFrom, opacityTo]);

  return { containerRef };
};

export type UseTextRevealReturn = ReturnType<typeof useTextReveal>;
