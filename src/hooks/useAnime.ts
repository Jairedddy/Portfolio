import { useEffect, useRef } from 'react';
import { animate, stagger, type AnimationParams, type JSAnimation, type TargetsParam } from 'animejs';

interface UseAnimeOptions {
  targets: TargetsParam;
  animation?: 'fadeIn' | 'slideUp' | 'scale' | 'rotate' | 'custom';
  delay?: number;
  duration?: number;
  stagger?: number;
  easing?: string;
  onComplete?: () => void;
}

/**
 * Custom hook for anime.js animations
 * Provides sophisticated, minimalistic animations
 */
export const useAnime = (options: UseAnimeOptions): JSAnimation | null => {
  const { targets, animation = 'fadeIn', delay = 0, duration = 1000, stagger: staggerDelay, easing = 'easeOutExpo', onComplete } = options;
  const animationRef = useRef<JSAnimation | null>(null);

  useEffect(() => {
    const animationTargets = targets;
    let animationConfig: AnimationParams = {
      duration,
      delay: staggerDelay ? stagger(staggerDelay) : delay,
      easing,
      complete: onComplete,
    };

    switch (animation) {
      case 'fadeIn':
        animationConfig = {
          ...animationConfig,
          opacity: [0, 1],
          translateY: [20, 0],
        };
        break;
      case 'slideUp':
        animationConfig = {
          ...animationConfig,
          opacity: [0, 1],
          translateY: [50, 0],
        };
        break;
      case 'scale':
        animationConfig = {
          ...animationConfig,
          opacity: [0, 1],
          scale: [0.8, 1],
        };
        break;
      case 'rotate':
        animationConfig = {
          ...animationConfig,
          opacity: [0, 1],
          rotate: [-10, 0],
          scale: [0.9, 1],
        };
        break;
      default:
        break;
    }

    animationRef.current = animate(animationTargets, animationConfig);

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [targets, animation, delay, duration, staggerDelay, easing, onComplete]);

  return animationRef.current;
};

/**
 * Hook for scroll-triggered animations using Intersection Observer
 */
export const useAnimeOnScroll = (
  selector: string,
  options: {
    animation?: 'fadeIn' | 'slideUp' | 'scale';
    threshold?: number;
    stagger?: number;
  } = {}
) => {
  const { animation = 'fadeIn', threshold = 0.1, stagger: staggerDelay = 100 } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const children = element.querySelectorAll('[data-anime]');
            
            if (children.length > 0) {
              animate(Array.from(children), {
                opacity: [0, 1],
                translateY: animation === 'slideUp' ? [30, 0] : [0, 0],
                scale: animation === 'scale' ? [0.9, 1] : [1, 1],
                delay: stagger(staggerDelay),
                duration: 800,
                easing: 'easeOutExpo',
              });
            } else {
              // Animate the element itself
              animate(element, {
                opacity: [0, 1],
                translateY: animation === 'slideUp' ? [30, 0] : [0, 0],
                scale: animation === 'scale' ? [0.9, 1] : [1, 1],
                duration: 800,
                easing: 'easeOutExpo',
              });
            }
            
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector, animation, threshold, staggerDelay]);
};

