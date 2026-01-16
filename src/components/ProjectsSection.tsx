import { useState, useEffect, useCallback, useMemo } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight, Grid3x3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "./ParticleBackground";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import TextReveal from "./TextReveal";
import { useIsMobile } from "@/hooks/use-mobile";

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

const gridContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: { opacity: 0 },
};

const gridItemVariants = {
  initial: { opacity: 0, scale: 0.9, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -30,
    transition: { duration: 0.3, ease: [0.4, 0, 0.6, 1] as const },
  },
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
  const isMobile = useIsMobile();

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
        <div className={`p-4 sm:p-6 ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
          <div
            className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[0.65rem] sm:text-xs font-cyber ${colors.text} bg-surface-darker/50 border ${colors.border} mb-1.5 sm:mb-2`}
            style={{ transform: "translateZ(30px)" }}
          >
            {project.category}
          </div>

          <h3
            className={`text-lg sm:text-xl font-bold ${colors.glow} mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform leading-tight`}
            style={{ transform: "translateZ(45px)" }}
          >
            {project.title}
          </h3>

          {!isMobile && (
            <p
              className="text-muted-foreground text-sm leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              {project.description}
            </p>
          )}

          <div className={`${isMobile ? 'mb-1.5' : 'mb-2'}`} style={{ transform: "translateZ(30px)" }}>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.features.map((feature) => (
                <span
                  key={feature}
                  className="text-[0.65rem] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`} style={{ transform: "translateZ(35px)" }}>
            {project.tech.map((tech) => (
              <span
                key={tech}
                className={`text-[0.65rem] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 ${colors.text} bg-surface-darker/30 rounded border ${colors.border}`}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-2 sm:gap-3" style={{ transform: "translateZ(45px)" }}>
            <Button
              size={isMobile ? "sm" : "sm"}
              variant="outline"
              className={`flex-1 ${colors.border} ${colors.text} hover:scale-105 ${colors.bg} hover:shadow-lg transition-all duration-300 text-xs sm:text-sm`}
              asChild
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github size={isMobile ? 14 : 16} className="mr-1.5 sm:mr-2" />
                Code
              </a>
            </Button>
            {project.live && (
              <Button
                size={isMobile ? "sm" : "sm"}
                className="flex-1 bg-gradient-primary hover:scale-105 hover:shadow-neon-cyan hover:brightness-110 transition-all duration-300 text-xs sm:text-sm"
                asChild
              >
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={isMobile ? 14 : 16} className="mr-1.5 sm:mr-2" />
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

const PROJECTS: Project[] = [
  {
    title: "Photography Portfolio",
    description: "A modern, minimalist photography portfolio application built with React, TypeScript and Vite. Features a dual-theme system (Monochrome/Vibrant), smooth animations, and a fully functional contact form with email integration.",
    tech: ["React", "Vite", "TypeScript", "Tailwind CSS", "Lucide React", "GSAP", "Lenis", "Nodemailer", "Vercel"],
    category: "Web Development",
    color: "purple",
    github: "https://github.com/Jairedddy/Photography-Portfolio",
    live: "https://jaireddyphotography.vercel.app/",
    features: ["React", "Vite", "Tailwind CSS", "TypeScript", "Lucide React", "GSAP", "Lenis", "Nodemailer", "Vercel"]
  },
  {
    title: "Noir Ink Tattoo Studio",
    description: "A sophisticated, monochrome tattoo studio and supply store featuring AI-powered design generation, comprehensive booking system, and educational resources.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Lucide React", "Pollinations.ai"],
    category: "Web Development",
    color: "green",
    github: "https://github.com/Jairedddy/Noir-Ink-Tattoo-Studio",
    live: "https://noir-ink.netlify.app/",
    features: ["Model compression", "Hardware optimization", "Cross-platform"]
  },
  {
    title: "Golden Barell Brewery",
    description: "Golden Barrel’'?Ts modern, responsive brewery website built with React and TypeScript. It features rich content sections, production’'?`ready animations, and polished UI components tailored for a premium brewery brand.",
    tech: ["React", "Vite", "Tailwind CSS", "Radix", "TanStack Query", "Lucide React"],
    category: "Web Development",
    color: "cyan",
    github: "https://github.com/Jairedddy/Golden-Barell-Brewery",
    live: "https://goldenbarell.netlify.app/",
    features: ["React", "Vite", "Tailwind CSS", "Radix", "TanStack Query", "Lucide React"]
  },
  {
    title: "Obsidian Eye",
    description: "Dystopian surveillance simulator that lets operators aythor cinematic reconnaissance prompts, trigger AI-generated 'drone' captures, adn explore the world state throuh interactive lore. The experene mixed a control-roomm UI, batch scan tooling, HUD overlays and persistent operatore settings to mumic an active roecon terminal.",
    tech: ["React", "Tailwind CSS", "lucide-react", "JSON and JS", "JSZip", "Pollinations.ai"],
    category: "Imaginative AI",
    color: "green",
    github: "https://github.com/Jairedddy/Obsidian-Eye",
    live: "https://obsidian-eye.netlify.app/",
    features: ["Cyber Punk Theme", "AI-Generated Imagery", "Interactive UI", "Responsive Design", "Lore Exploration", "Operator Tools"]
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

// Projects Section with Interactive Cards
const ProjectsSection = () => {
  const isMobile = useIsMobile();
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
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filterPulse, setFilterPulse] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api: UseEmblaCarouselType[1] | undefined) => {
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
  
  
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(PROJECTS.map((project) => project.category)));
    return ["All", ...uniqueCategories];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return PROJECTS;
    return PROJECTS.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = useCallback((category: string) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    setSelectedIndex(0);
    emblaApi?.scrollTo(0);
    setFilterPulse(Date.now());
  }, [activeCategory, emblaApi]);

  useEffect(() => {
    if (!filterPulse) return;
    setIsFiltering(true);
    const timeout = setTimeout(() => setIsFiltering(false), 450);
    return () => clearTimeout(timeout);
  }, [filterPulse]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    const nextIndex = Math.min(selectedIndex, Math.max(filteredProjects.length - 1, 0));
    if (nextIndex !== selectedIndex) {
      setSelectedIndex(nextIndex);
    }
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi, filteredProjects.length, selectedIndex]);

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
    <section id="projects" className="py-12 sm:py-20 relative min-h-screen">
      <ParticleBackground id="projects-particles" variant="projects" />
      
      {/* Animated Background Elements - Reduced for performance */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <TextReveal
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-black font-cyber text-glow-purple mb-4 sm:mb-6"
            revealDelay={80}
          >
            &lt; PROJECTS /&gt;
          </TextReveal>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Explore my latest AI innovations and machine learning solutions
          </p>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto rounded-full mt-4 sm:mt-6" />
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12"
        >
          <LayoutGroup id="project-category-filter">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2">
              {categories.map((category) => {
                const isActiveCategory = category === activeCategory;
                return (
                  <motion.button
                    key={category}
                    type="button"
                    layout="position"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleCategoryChange(category)}
                    disabled={isFiltering}
                    className={`relative px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-border/70 bg-card/60 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[0.6rem] sm:text-[0.65rem] font-semibold transition-all duration-300 ${
                      isActiveCategory ? "text-neon-purple" : "text-muted-foreground hover:text-foreground"
                    } ${isFiltering ? "cursor-wait" : ""}`}
                    aria-pressed={isActiveCategory}
                  >
                    {isActiveCategory && (
                      <motion.span
                        layoutId="projects-active-category"
                        className="absolute inset-0 rounded-full bg-glow-purple/20 border border-glow-purple/60 shadow-neon-purple"
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </motion.button>
                );
              })}
            </div>
          </LayoutGroup>
        </motion.div>

        {/* Projects Display - Carousel or Grid */}
        <motion.div layout className="relative">
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
                className="relative overflow-hidden px-4 sm:px-8 md:px-16"
              >
                {filteredProjects.length > 0 ? (
                  <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                    <div className="flex gap-4 sm:gap-6">
                      {filteredProjects.map((project, index) => {
                        const colors = getColorClasses(project.color);
                        const isActive = index === selectedIndex;

                        return (
                          <motion.div
                            key={project.title}
                            className={`flex-[0_0_90%] sm:flex-[0_0_85%] md:flex-[0_0_70%] lg:flex-[0_0_60%] min-w-0 px-1 sm:px-2 ${isActive ? "" : "cursor-pointer"}`}
                            animate={{
                              scale: isActive ? 1 : isMobile ? 0.92 : 0.88,
                              opacity: isActive ? 1 : isMobile ? 0.5 : 0.35,
                              zIndex: isActive ? 2 : 1,
                              filter: isActive ? "blur(0px)" : isMobile ? "blur(0.5px)" : "blur(1.5px)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 28,
                            }}
                            style={{ willChange: "transform" }}
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
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-12 sm:py-16"
                  >
                    <p className="text-muted-foreground text-xs sm:text-sm tracking-wider uppercase">
                      No projects in this category yet.
                    </p>
                  </motion.div>
                )}

                {/* Navigation Arrows */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className={`absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan hover:text-background hover:scale-110 transition-all duration-300 z-20 bg-card/90 ${
                    !canScrollPrev ? "opacity-30 cursor-not-allowed" : "opacity-100"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className={`absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan hover:text-background hover:scale-110 transition-all duration-300 z-20 bg-card/90 ${
                    !canScrollNext ? "opacity-30 cursor-not-allowed" : "opacity-100"
                  }`}
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>

                {/* Carousel Indicators */}
                {filteredProjects.length > 0 && (
                  <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                    {filteredProjects.map((_, index) => (
                      <button
                        key={`${activeCategory}-${index}`}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                          index === selectedIndex
                            ? "w-6 sm:w-8 bg-neon-cyan"
                            : "w-1.5 sm:w-2 bg-muted hover:bg-neon-cyan/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {filteredProjects.length > 0 ? (
                <motion.div
                  layout
                  variants={gridContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                >
                  <AnimatePresence mode="sync" initial={false}>
                    {filteredProjects.map((project) => {
                      const colors = getColorClasses(project.color);

                      return (
                        <motion.div
                          key={project.title}
                          layout
                          variants={gridItemVariants}
                          whileHover={{ y: -10 }}
                        >
                          <ProjectCard
                            project={project}
                            colors={colors}
                            isInteractive
                            className="h-full"
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-16 rounded-2xl border border-dashed border-border/60"
                >
                  <p className="text-muted-foreground text-sm tracking-widest uppercase">
                    Nothing to show for this category yet.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
          </AnimatePresence>

          <AnimatePresence>
            {isFiltering && (
              <motion.div
                key="filter-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] bg-background/70 backdrop-blur-md pointer-events-auto z-20"
              >
                <motion.span
                  className="h-12 w-12 rounded-full border-2 border-neon-cyan/20 border-t-neon-cyan mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
                  Recalibrating Grid
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toggle View Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              size={isMobile ? "default" : "lg"}
              variant="outline"
              onClick={() => setIsGridView(!isGridView)}
              className="border-glow-cyan text-neon-cyan hover:bg-glow-cyan hover:text-background transition-all duration-300 group text-sm sm:text-base"
            >
              {isGridView ? (
                <>
                  <LayoutGrid size={isMobile ? 18 : 20} className="mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline">Back to Carousel</span>
                  <span className="sm:hidden">Carousel</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">View All Projects</span>
                  <span className="sm:hidden">View All</span>
                  <Grid3x3 size={isMobile ? 18 : 20} className="ml-2 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>
            
            {isGridView && (
              <Button
                size={isMobile ? "default" : "lg"}
                variant="outline"
                asChild
                className="border-glow-purple text-neon-purple hover:bg-glow-purple hover:text-background transition-all duration-300 group text-sm sm:text-base"
              >
                <a className=""
                  href="https://github.com/Jairedddy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github size={isMobile ? 18 : 20} className="mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline">Take me to Github</span>
                  <span className="sm:hidden">Github</span>
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
