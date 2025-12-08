import { useState, useEffect, useCallback, useMemo } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight, Grid3x3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "./ParticleBackground";
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react";
import TextReveal from "./TextReveal";

type Project = {
  title: string;
  description: string;
  tech: string[];
  category: string;
  color: string;
  github: string;
  live?: string;
  features: string[];
};

type ColorClasses = {
  border: string;
  text: string;
  glow: string;
  shadow: string;
  bg: string;
};

// Lightweight tilt controller that maps pointer position to 3D transforms.
const useTiltCard = (enabled: boolean) => {
  const baseStyle = useMemo<CSSProperties>(() => ({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
    boxShadow: "0 25px 55px rgba(8, 17, 41, 0.45)",
  }), []);

  const [style, setStyle] = useState<CSSProperties>(baseStyle);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const shadowOffsetX = rotateY * -2.5;
    const shadowOffsetY = rotateX * -3;

    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px 45px rgba(3, 7, 18, 0.55), 0 15px 35px rgba(79, 209, 197, 0.2)`,
    });
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;
    setStyle(baseStyle);
  }, [enabled, baseStyle]);

  useEffect(() => {
    if (!enabled) {
      setStyle(baseStyle);
    }
  }, [enabled, baseStyle]);

  return {
    tiltStyle: enabled ? style : baseStyle,
    handleMouseMove: enabled ? handleMouseMove : undefined,
    handleMouseLeave: enabled ? handleMouseLeave : undefined,
  };
};

type ProjectCardProps = {
  project: Project;
  colors: ColorClasses;
  isInteractive: boolean;
  className?: string;
};

const ProjectCard = ({ project, colors, isInteractive, className = "" }: ProjectCardProps) => {
  const { tiltStyle, handleMouseMove, handleMouseLeave } = useTiltCard(isInteractive);

  return (
    <div className={className} style={{ perspective: "1200px" }}>
      <div
        className={`bg-card rounded-lg border border-border shadow-lg hover:${colors.border} transition-all duration-300 group h-full`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out, box-shadow 0.25s ease-out",
          ...tiltStyle,
        }}
      >
        <div className="p-6 space-y-4">
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-cyber ${colors.text} bg-surface-darker/50 border ${colors.border} mb-2`}
            style={{ transform: "translateZ(30px)" }}
          >
            {project.category}
          </div>

          <h3
            className={`text-xl font-bold ${colors.glow} mb-2 group-hover:scale-105 transition-transform`}
            style={{ transform: "translateZ(45px)" }}
          >
            {project.title}
          </h3>

          <p
            className="text-muted-foreground text-sm leading-relaxed"
            style={{ transform: "translateZ(20px)" }}
          >
            {project.description}
          </p>

          <div className="mb-2" style={{ transform: "translateZ(30px)" }}>
            <div className="flex flex-wrap gap-2">
              {project.features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4" style={{ transform: "translateZ(35px)" }}>
            {project.tech.map((tech) => (
              <span
                key={tech}
                className={`text-xs px-2 py-1 ${colors.text} bg-surface-darker/30 rounded border ${colors.border}`}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-3" style={{ transform: "translateZ(45px)" }}>
            <Button
              size="sm"
              variant="outline"
              className={`flex-1 ${colors.border} ${colors.text} hover:scale-105 ${colors.bg} hover:shadow-lg transition-all duration-300`}
              asChild
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} className="mr-2" />
                Code
              </a>
            </Button>
            {project.live && (
              <Button
                size="sm"
                className="flex-1 bg-gradient-primary hover:scale-105 hover:shadow-neon-cyan hover:brightness-110 transition-all duration-300"
                asChild
              >
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Projects Section with Interactive Cards
const ProjectsSection = () => {
  const [isGridView, setIsGridView] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: false,
      skipSnaps: false,
      dragFree: false,
    }
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api: EmblaCarouselType | undefined) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);
  const projects: Project[] = [
    {
      title: "Noir Ink Tattoo Studio",
      description: "A sophisticated, monochrome tattoo studio and supply store featuring AI-powered design generation, comprehensive booking system, and educational resources.",
      tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Lucide React", "Pollinations.ai"],
      category: "Web Development",
      color: "purple",
      github: "https://github.com/Jairedddy/Noir-Ink-Tattoo-Studio",
      live: "https://noir-ink.netlify.app/",
      features: ["Model compression", "Hardware optimization", "Cross-platform"]
    },
    {
      title: "Golden Barell Brewery",
      description: "Golden Barrelƒ?Ts modern, responsive brewery website built with React and TypeScript. It features rich content sections, productionƒ?`ready animations, and polished UI components tailored for a premium brewery brand.",
      tech: ["React", "Vite", "Tailwind CSS", "Radix", "TanStack Query", "Lucide React"],
      category: "Web Development",
      color: "cyan",
      github: "https://github.com/Jairedddy/Golden-Barell-Brewery",
      live: "https://goldenbarell.netlify.app/",
      features: ["React", "Vite", "Tailwind CSS", "Radix", "TanStack Query", "Lucide React"]
    },
    {
      title: "Code Nebula",
      description: "Interactive 3D visualization tool that transforms GitHub repositories into stunning 'galaxy' visualizations. It empowers developers to explore codebases in an immersive, three-dimensional space, facilitating a deeper understanding of code structure, dependencies, and inter-file relationships.",
      tech: ["React", "Vite", "Three.js", "D3-Force-3D", "Radix UI", "TanStack Query", "React Router", "Supabase", "Github API", "OpenAI API"],
      category: "Web Development",
      color: "purple",
      github: "https://github.com/Jairedddy/CodeNebula",
      live: "https://codenebulaa.netlify.app/",
      features: ["Cyber Punk Theme", "3D Visualization", "Interactive UI", "Responsive Design", "AI Integration", "Repository Insights"]
    },
    {
      title: "Spotify Dash-Bored",
      description: "A comprehensive, interactive dashboard for visualizing your Spotify listening data with beautiful, data-driven insights and analytics.",
      tech: ["Javascript", "React", "Tailwind CSS", "Spotify API"],
      category: "Web Development",
      color: "green",
      github: "https://github.com/Jairedddy/Spotify-Dashboard",
      live: "https://spotify-dashbored.netlify.app/",
      features: ["Spotify API", "Data Visualization", "Responsive Design"]
    },
    {
      title: "Amul Scraper",
      description: "A sophisticated automation tool designed to monitor product availability on the official Amul e-commerce platform (shop.amul.com). This solution eliminates the need for manual, repetitive stock checks by automating the entire process through intelligent browser automation.",
      tech: ["Python", "Selenium WebDriver", "Selenium Manager", "JSON", "ChromeDriver", "EdgeDriver", "FirefoxDriver"],
      category: "Automation",
      color: "cyan",
      github: "https://github.com/Jairedddy/Amul-Scraper",
      features: ["Multi-Browser Support", "Automatic Driver Management", "Product Management", "Intelligent Stock Detection", "Comprehensive Reporting", "Robust Error Handling"]
    },
    {
      title: "Instagram Follower Tracker",
      description: "Asophisticated automation tool designed to analyze your Instagram account and identify which accounts you follow that don't follow you back. This solution eliminates the need for manual checking by automating the entire process through intelligent browser automation.",
      tech: ["Python", "Selenium WebDriver", "Selenium Manager", "ChromeDriver", "EdgeDriver", "FirefoxDriver", ],
      category: "Automation",
      color: "purple",
      github: "https://github.com/Jairedddy/Instagram-Follower-Tracker",
      features: ["Secure Login", "Real-Time Input Detection", "Smart Extraction Algorithm", "Intelligent Error Handling", "Performance Optimization", "Multi-Browser Support"]
    }
  ];

  const getColorClasses = (color: string): ColorClasses => {
    switch (color) {
      case 'cyan':
        return {
          border: 'border-glow-cyan',
          text: 'text-neon-cyan',
          glow: 'text-glow-cyan',
          shadow: 'hover:shadow-neon-cyan',
          bg: 'hover:bg-glow-cyan'
        };
      case 'purple':
        return {
          border: 'border-glow-purple',
          text: 'text-neon-purple',
          glow: 'text-glow-purple',
          shadow: 'hover:shadow-neon-purple',
          bg: 'hover:bg-glow-purple'
        };
      case 'green':
        return {
          border: 'border-glow-green',
          text: 'text-neon-green',
          glow: 'text-glow-green',
          shadow: 'hover:shadow-neon-green',
          bg: 'hover:bg-glow-green'
        };
      default:
        return {
          border: 'border-glow-cyan',
          text: 'text-neon-cyan',
          glow: 'text-glow-cyan',
          shadow: 'hover:shadow-neon-cyan',
          bg: 'hover:bg-glow-cyan'
        };
    }
  };

  return (
    <section id="projects" className="py-20 relative min-h-screen">
      <ParticleBackground id="projects-particles" variant="projects" />
      
      {/* Animated Background Elements - Reduced for performance */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <TextReveal
            as="h2"
            className="text-4xl md:text-5xl font-black font-cyber text-glow-purple mb-6"
            revealDelay={80}
          >
            &lt; PROJECTS /&gt;
          </TextReveal>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore my latest AI innovations and machine learning solutions
          </p>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Projects Display - Carousel or Grid */}
        <AnimatePresence mode="wait">
          {!isGridView ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {/* Carousel Container */}
              <div 
                className="relative overflow-hidden px-8 md:px-16"
              >
                <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                  <div className="flex gap-6">
                    {projects.map((project, index) => {
                      const colors = getColorClasses(project.color);
                      const isActive = index === selectedIndex;

                      return (
                        <motion.div
                          key={project.title}
                          className={`flex-[0_0_85%] md:flex-[0_0_70%] lg:flex-[0_0_60%] min-w-0 px-2 transition-all duration-700 ease-out ${
                            isActive ? "scale-100 opacity-100 z-10" : "scale-[0.85] opacity-50 z-0 cursor-pointer"
                          }`}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          onClick={() => {
                            if (!isActive) {
                              emblaApi?.scrollTo(index);
                            }
                          }}
                        >
                          <ProjectCard
                            project={project}
                            colors={colors}
                            isInteractive={isActive}
                            className="h-full"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-border text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan hover:text-background hover:scale-110 transition-all duration-300 z-20 bg-card/90 ${
                    !canScrollPrev ? "opacity-30 cursor-not-allowed" : "opacity-100"
                  }`}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-border text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan hover:text-background hover:scale-110 transition-all duration-300 z-20 bg-card/90 ${
                    !canScrollNext ? "opacity-30 cursor-not-allowed" : "opacity-100"
                  }`}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => emblaApi?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === selectedIndex
                          ? "w-8 bg-neon-cyan"
                          : "w-2 bg-muted hover:bg-neon-cyan/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project, index) => {
                const colors = getColorClasses(project.color);
                
                return (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ y: -10 }}
                  >
                    <ProjectCard
                      project={project}
                      colors={colors}
                      isInteractive={true}
                      className="h-full"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle View Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsGridView(!isGridView)}
              className="border-glow-cyan text-neon-cyan hover:bg-glow-cyan hover:text-background transition-all duration-300 group"
            >
              {isGridView ? (
                <>
                  <LayoutGrid size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
                  Back to Carousel
                </>
              ) : (
                <>
                  View All Projects
                  <Grid3x3 size={20} className="ml-2 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>
            
            {isGridView && (
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-glow-purple text-neon-purple hover:bg-glow-purple hover:text-background transition-all duration-300 group"
              >
                <a className=""
                  href="https://github.com/Jairedddy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
                  Take me to Github
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
