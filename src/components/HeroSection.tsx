import { useEffect, useRef } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import ThreeScene from "./ThreeScene";
import { Button } from "@/components/ui/button";
import { animate, stagger } from "animejs";

// Hero Section with Animated Background
const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!heroRef.current || !nameRef.current) return;

    const animations: Array<ReturnType<typeof animate>> = [];

    animations.push(
      animate(nameRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.85, 1],
        duration: 900,
        easing: "easeOutExpo",
      })
    );

    if (titleRef.current) {
      animations.push(
        animate(titleRef.current, {
          opacity: [0, 1],
          translateX: [-80, 0],
          scale: [0.95, 1],
          duration: 900,
          easing: "easeOutExpo",
          delay: 400,
        })
      );
    }

    if (descRef.current) {
      animations.push(
        animate(descRef.current, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          easing: "easeOutExpo",
          delay: 800,
        })
      );
    }

    const buttons = buttonsRef.current?.querySelectorAll("button");
    if (buttons && buttons.length > 0) {
      animations.push(
        animate(Array.from(buttons), {
          opacity: [0, 1],
          translateY: [40, 0],
          scale: [0.9, 1],
          delay: stagger(120, { start: 1100 }),
          duration: 700,
          easing: "easeOutBack",
        })
      );
    }

    return () => {
      animations.forEach((anim) => anim.cancel());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(var(--background)), hsl(var(--dark-surface)))",
      }}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 neon-grid opacity-20 z-5"></div>
      <ParticleBackground id="hero-particles" variant="hero" />
      <ThreeScene />

      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        {/* Name */}
        <h1
          ref={nameRef}
          className="text-5xl md:text-7xl font-black font-cyber mb-6 text-glow-cyan opacity-0"
        >
          JAI REDDY
        </h1>

        {/* Title */}
        <h2
          ref={titleRef}
          className="text-2xl md:text-4xl font-bold text-neon-purple mb-8 text-glow-purple opacity-0"
        >
          Full Stack Developer & Creative Technologist
        </h2>

        {/* Description */}
        <p
          ref={descRef}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0"
        >
          Crafting immersive digital experiences with cutting-edge technologies. 
          Specializing in React, Node.js, and advanced web animations.
        </p>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="bg-gradient-secondary hover:shadow-neon-purple transition-all duration-300 text-lg px-8 py-4 h-auto opacity-0"
            onMouseEnter={(e) => {
              animate(e.currentTarget, {
                scale: [1, 1.05],
                duration: 200,
                easing: "easeOutQuad",
              });
            }}
            onMouseLeave={(e) => {
              animate(e.currentTarget, {
                scale: [1.05, 1],
                duration: 200,
                easing: "easeOutQuad",
              });
            }}
          >
            View My Work
          </Button>
          <Button
            onClick={scrollToContact}
            variant="outline"
            size="lg"
            className="border-border hover:border-neon-purple hover:bg-neon-purple hover:text-background transition-all duration-300 text-lg px-8 py-4 h-auto opacity-0"
            onMouseEnter={(e) => {
              animate(e.currentTarget, {
                scale: [1, 1.05],
                duration: 200,
                easing: "easeOutQuad",
              });
            }}
            onMouseLeave={(e) => {
              animate(e.currentTarget, {
                scale: [1.05, 1],
                duration: 200,
                easing: "easeOutQuad",
              });
            }}
          >
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
