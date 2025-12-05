import { useCallback, useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 12;
const HIDE_DELAY = 1200;

const interactiveSelector =
  'a[href], button, [role="button"], input:not([type="hidden"]), textarea, select, [data-interactive="true"], [contenteditable="true"], [tabindex]:not([tabindex="-1"]), .interactive-cursor-target';

const isInteractiveElement = (element: HTMLElement | null) => {
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    if (current.matches(interactiveSelector)) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
};

const CursorTrail = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number>();
  const hideTimeoutRef = useRef<number>();
  const pointerRef = useRef({ x: 0, y: 0 });
  const positionsRef = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const visibilityRef = useRef(false);
  const interactiveRef = useRef(false);

  useEffect(() => {
    visibilityRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const shouldEnable = !coarseQuery.matches && !reduceMotionQuery.matches;
      setIsEnabled(shouldEnable);
      if (!shouldEnable) {
        setIsVisible(false);
      }
    };

    evaluate();

    const handleChange = () => evaluate();

    if (typeof coarseQuery.addEventListener === "function") {
      coarseQuery.addEventListener("change", handleChange);
    } else {
      coarseQuery.addListener(handleChange);
    }

    if (typeof reduceMotionQuery.addEventListener === "function") {
      reduceMotionQuery.addEventListener("change", handleChange);
    } else {
      reduceMotionQuery.addListener(handleChange);
    }

    return () => {
      if (typeof coarseQuery.removeEventListener === "function") {
        coarseQuery.removeEventListener("change", handleChange);
      } else {
        coarseQuery.removeListener(handleChange);
      }
      if (typeof reduceMotionQuery.removeEventListener === "function") {
        reduceMotionQuery.removeEventListener("change", handleChange);
      } else {
        reduceMotionQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;

    if (isEnabled) {
      body.classList.add("custom-cursor-hidden");
      return () => {
        body.classList.remove("custom-cursor-hidden");
      };
    }

    body.classList.remove("custom-cursor-hidden");
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled || typeof window === "undefined") return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const showCursor = () => {
      if (!visibilityRef.current) {
        setIsVisible(true);
      }
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, HIDE_DELAY);
    };

    const resetPositions = () => {
      pointerRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      positionsRef.current = Array.from({ length: TRAIL_COUNT }, () => ({
        x: pointerRef.current.x,
        y: pointerRef.current.y,
      }));
    };

    resetPositions();

    const handleMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;

      const target = event.target instanceof HTMLElement ? event.target : null;
      const interactive = isInteractiveElement(target);
      if (interactiveRef.current !== interactive) {
        interactiveRef.current = interactive;
        setIsInteractive(interactive);
      }

      showCursor();
    };

    const handleLeave = () => {
      setIsVisible(false);
      if (interactiveRef.current) {
        interactiveRef.current = false;
        setIsInteractive(false);
      }
    };

    const animateTrail = () => {
      const particles = particlesRef.current;
      const positions = positionsRef.current;
      let prevX = pointerRef.current.x;
      let prevY = pointerRef.current.y;

      particles.forEach((particle, index) => {
        if (!particle) return;
        const position = positions[index];
        position.x += (prevX - position.x) * Math.max(0.12, 0.3 - index * 0.015);
        position.y += (prevY - position.y) * Math.max(0.12, 0.3 - index * 0.015);

        const scale = Math.max(0.2, 1 - index * 0.08);
        const opacity = Math.max(0, 0.9 - index * 0.08);

        particle.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        particle.style.opacity = opacity.toString();

        prevX = position.x;
        prevY = position.y;
      });

      animationFrameRef.current = window.requestAnimationFrame(animateTrail);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    animationFrameRef.current = window.requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleMove);
      window.removeEventListener("pointerleave", handleLeave);

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isEnabled]);

  const setParticleRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      particlesRef.current[index] = node;
    },
    []
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      className={`cursor-layer pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${isInteractive ? "cursor-interactive" : ""}`}
      aria-hidden="true"
    >
      <div ref={cursorRef} className="cursor-dot" />
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <div
          key={`cursor-trail-${index}`}
          ref={setParticleRef(index)}
          className="cursor-trail"
        />
      ))}
    </div>
  );
};

export default CursorTrail;
