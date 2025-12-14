import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionMeta = {
  id: string;
  label: string;
  accentClass: string;
};

const SECTIONS: SectionMeta[] = [
  { id: "home", label: "Home", accentClass: "text-neon-purple" },
  { id: "about", label: "About", accentClass: "text-neon-cyan" },
  { id: "skills", label: "Skills", accentClass: "text-neon-green" },
  { id: "projects", label: "Projects", accentClass: "text-neon-purple" },
  { id: "contact", label: "Contact", accentClass: "text-neon-cyan" },
];

const EDGE_OFFSET = 12;
const DEFAULT_POSITION = { x: EDGE_OFFSET, y: 100 };
const NAV_MARGIN = 10;

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionMeta>(SECTIONS[0]);
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    pointerId: null as number | null,
    offsetX: 0,
    offsetY: 0,
  });
  const progressRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userPositionRef = useRef(false);

  const clampPosition = (coords: { x: number; y: number }) => {
    const node = containerRef.current;
    const width = node?.offsetWidth ?? 0;
    const height = node?.offsetHeight ?? 0;
    const minX = EDGE_OFFSET;
    const minY = EDGE_OFFSET;
    const maxX = Math.max(EDGE_OFFSET, window.innerWidth - width - EDGE_OFFSET);
    const maxY = Math.max(EDGE_OFFSET, window.innerHeight - height - EDGE_OFFSET);

    return {
      x: Math.min(Math.max(coords.x, minX), maxX),
      y: Math.min(Math.max(coords.y, minY), maxY),
    };
  };

  const setCenteredPosition = () => {
    if (userPositionRef.current) return;
    const node = containerRef.current;
    if (!node) return;
    const navElement = document.querySelector("nav");
    if (!navElement) {
      // Fallback if nav not found yet
      const width = node.offsetWidth;
      const defaultCoords = {
        x: (window.innerWidth - width) / 2,
        y: DEFAULT_POSITION.y,
      };
      setPosition(clampPosition(defaultCoords));
      return;
    }
    const navRect = navElement.getBoundingClientRect();
    const navBottom = navRect.bottom;
    const width = node.offsetWidth;
    const defaultCoords = {
      x: (window.innerWidth - width) / 2,
      y: navBottom + NAV_MARGIN,
    };
    setPosition(clampPosition(defaultCoords));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const doc = document.documentElement;
      const totalScrollable = doc.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) {
        setScrollPercent(0);
        return;
      }
      const percent = (window.scrollY / totalScrollable) * 100;
      setScrollPercent(Math.min(Math.max(percent, 0), 100));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (userPositionRef.current) {
        setPosition((prev) => clampPosition(prev));
      } else {
        setCenteredPosition();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Wait for DOM to be ready, then set position
    const timer = setTimeout(() => {
      setCenteredPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== dragState.current.pointerId) return;
      const nextX = event.clientX - dragState.current.offsetX;
      const nextY = event.clientY - dragState.current.offsetY;

      setPosition(clampPosition({ x: nextX, y: nextY }));
    };

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== dragState.current.pointerId) return;
      dragState.current.pointerId = null;
      setIsDragging(false);
      containerRef.current?.releasePointerCapture(event.pointerId);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, {
      width: `${scrollPercent}%`,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [scrollPercent]);

  useEffect(() => {
    const triggers = SECTIONS.map((section) => {
      const element = document.getElementById(section.id);
      if (!element) return null;

      return ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section),
        onEnterBack: () => setActiveSection(section),
      });
    }).filter((trigger): trigger is ScrollTrigger => Boolean(trigger));

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!labelRef.current) return;
    gsap.fromTo(
      labelRef.current,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [activeSection]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    userPositionRef.current = true;
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    };
    setIsDragging(true);
    containerRef.current?.setPointerCapture(event.pointerId);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={`fixed z-[45] pointer-events-auto select-none transition-shadow touch-none ${
        isDragging ? "cursor-grabbing shadow-[0_0_30px_rgba(139,92,246,0.45)]" : "cursor-grab"
      }`}
      style={{ left: position.x, top: position.y }}
    >
      <div className="w-[min(90vw,420px)]">
        <div className="relative flex h-12 items-center overflow-hidden rounded-full border border-border bg-card shadow-lg transition-colors duration-300">
          <div className="relative flex-1 px-5">
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                ref={progressRef}
                className="h-2 rounded-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <div className="relative mr-6 flex items-center gap-3 text-[0.65rem] tracking-[0.35em] uppercase">
            <span
              ref={labelRef}
              className={`font-orbitron text-sm tracking-[0.25em] ${activeSection?.accentClass ?? "text-neon-cyan"}`}
            >
              {activeSection?.label}
            </span>
            <span className="font-cyber text-muted-foreground/80">
              {Math.round(scrollPercent)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgress;
