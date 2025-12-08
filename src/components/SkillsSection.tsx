import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import TextReveal from "./TextReveal";
import { skillCategories } from "@/data/skillCategories";
import { gsap } from "gsap";
import { useGradientTheme } from "@/hooks/useGradientTheme";
import SkillRadarChart from "./SkillRadarChart";

// Skills Section with Tabbed Interface and Neon Progress Indicators
const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState("web-dev");
  const sectionRef = useRef<HTMLElement | null>(null);
  useGradientTheme(sectionRef, "skills");


  const getColorClasses = (color: string) => {
    switch (color) {
      case 'neon-cyan':
        return {
          text: 'text-neon-cyan',
          glow: 'text-glow-cyan',
          border: 'border-neon-cyan',
          bg: 'bg-neon-cyan/10',
          progress: 'stroke-neon-cyan',
          progressBg: 'stroke-neon-cyan/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(79,209,197,0.45)]'
        };
      case 'neon-purple':
        return {
          text: 'text-neon-purple',
          glow: 'text-glow-purple',
          border: 'border-neon-purple',
          bg: 'bg-neon-purple/10',
          progress: 'stroke-neon-purple',
          progressBg: 'stroke-neon-purple/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(192,132,252,0.45)]'
        };
      case 'neon-green':
        return {
          text: 'text-neon-green',
          glow: 'text-glow-green',
          border: 'border-neon-green',
          bg: 'bg-neon-green/10',
          progress: 'stroke-neon-green',
          progressBg: 'stroke-neon-green/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(163,230,53,0.45)]'
        };
      case 'neon-orange':
        return {
          text: 'text-orange-400',
          glow: 'text-orange-400',
          border: 'border-orange-400',
          bg: 'bg-orange-400/10',
          progress: 'stroke-orange-400',
          progressBg: 'stroke-orange-400/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(251,146,60,0.45)]'
        };
      case 'neon-pink':
        return {
          text: 'text-pink-400',
          glow: 'text-pink-400',
          border: 'border-pink-400',
          bg: 'bg-pink-400/10',
          progress: 'stroke-pink-400',
          progressBg: 'stroke-pink-400/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(244,114,182,0.45)]'
        };
      case 'neon-red':
        return {
          text: 'text-red-400',
          glow: 'text-red-400',
          border: 'border-red-400',
          bg: 'bg-red-400/10',
          progress: 'stroke-red-400',
          progressBg: 'stroke-red-400/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(248,113,113,0.45)]'
        };
      case 'neon-yellow':
        return {
          text: 'text-yellow-400',
          glow: 'text-yellow-400',
          border: 'border-yellow-400',
          bg: 'bg-yellow-400/10',
          progress: 'stroke-yellow-400',
          progressBg: 'stroke-yellow-400/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.45)]'
        };
      default:
        return {
          text: 'text-neon-cyan',
          glow: 'text-glow-cyan',
          border: 'border-neon-cyan',
          bg: 'bg-neon-cyan/10',
          progress: 'stroke-neon-cyan',
          progressBg: 'stroke-neon-cyan/20',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(79,209,197,0.45)]'
        };
    }
  };

  // Neon Progress Ring Component
  const NeonProgressRing = ({
    skill,
    color,
    index,
  }: {
    skill: { name: string; level: number };
    color: string;
    index: number;
  }) => {
    const colors = getColorClasses(color);
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const finalDashOffset = circumference - (skill.level / 100) * circumference;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const progressRef = useRef<SVGCircleElement | null>(null);
    const labelRef = useRef<HTMLSpanElement | null>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
      const container = containerRef.current;
      const progressCircle = progressRef.current;
      const label = labelRef.current;
      if (!container || !progressCircle) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true;
              gsap.set(progressCircle, { strokeDashoffset: circumference });
              const tl = gsap.timeline({
                delay: index * 0.1,
                defaults: { ease: "power3.out" },
              });

              tl.fromTo(
                container,
                { opacity: 0, scale: 0.85, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6 }
              );

              tl.to(
                progressCircle,
                {
                  strokeDashoffset: finalDashOffset,
                  duration: 1.2,
                },
                "<"
              );

              if (label) {
                tl.fromTo(
                  label,
                  { opacity: 0, y: 6 },
                  { opacity: 1, y: 0, duration: 0.4 },
                  "-=0.4"
                );
              }

              observer.unobserve(container);
            }
          });
        },
        { threshold: 0.35 }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, [circumference, finalDashOffset, index]);

    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -6 }}
        className={`relative group cursor-pointer rounded-2xl border border-border bg-card/60 p-4 transition-all duration-300 ${colors.hoverShadow}`}
      >
        <div className="relative w-20 h-20 mx-auto mb-3">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            {/* Background Ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className={`${colors.progressBg} transition-colors duration-300`}
            />
            {/* Progress Ring */}
            <circle
              ref={progressRef}
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
              className={`${colors.progress} transition-colors duration-300`}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset: circumference }}
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span ref={labelRef} className={`text-sm font-bold ${colors.text} font-cyber`}>
              {skill.level}%
            </span>
          </div>
        </div>
        {/* Skill Name */}
        <div className="text-center">
          <span className={`text-sm font-medium ${colors.text} transition-colors duration-300 group-hover:${colors.glow}`}>
            {skill.name}
          </span>
        </div>
        {/* Glow Effect on Hover */}
        <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg}`} />
      </motion.div>
    );
  };

  return (
    <section ref={sectionRef} id="skills" className="py-12 relative min-h-screen flex items-center gradient-section">
      <ParticleBackground id="skills-particles" variant="skills" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-neon-green/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '5s' }}></div>
      </div>
      
      <div className="cyber-grid absolute inset-0 opacity-10 z-5" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full scale-90">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <TextReveal
            as="h2"
            className="text-3xl md:text-4xl font-black font-cyber text-glow-green mb-4"
            revealDelay={80}
          >
            &lt; SKILLS /&gt;
          </TextReveal>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive expertise across the full development stack
          </p>
          <div className="w-24 h-1 bg-gradient-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] items-start">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[400px]"
          >
            {skillCategories.map((category) => {
              if (category.id !== activeTab) return null;
              
              const colors = getColorClasses(category.color);
              
              return (
                <div key={category.id} className="space-y-6">
                  {/* Category Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center space-x-3 p-4 rounded-2xl ${colors.bg} ${colors.border} border`}>
                      <category.icon size={28} className={colors.text} />
                      <TextReveal
                        as="h3"
                        className={`text-2xl font-cyber font-bold ${colors.glow}`}
                        revealDelay={60}
                      >
                        {category.title}
                      </TextReveal>
                    </div>
                  </div>

                  {/* Skills Grid with Progress Rings */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {category.skills.map((skill, index) => (
                      <NeonProgressRing key={skill.name} skill={skill} color={category.color} index={index} />
                    ))}
                  </div>

                  {/* Category Description */}
                  <div className="text-center mt-8">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-lg max-w-3xl mx-auto">
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {category.id === "web-dev" && "Mastery of modern web technologies and frameworks for creating responsive, interactive applications with cutting-edge visual effects."}
                        {category.id === "design" && "Expertise in design tools and principles for creating intuitive user experiences and compelling visual designs that engage users."}
                        {category.id === "backend" && "Strong foundation in server-side development, database management, and API design for scalable, robust applications."}
                        {category.id === "ai-ml" && "Comprehensive knowledge of machine learning libraries, AI models, and data science tools for building intelligent applications."}
                        {category.id === "integration" && "Specialized skills in integrating AI capabilities into web applications for enhanced user experiences and automation."}
                        {category.id === "devops" && "Proficiency in deployment, security, and performance optimization for production-ready, secure applications."}
                        {category.id === "soft-skills" && "Essential professional skills for effective collaboration, communication, and successful project delivery."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <div className="order-first lg:order-none">
            <SkillRadarChart
              categories={skillCategories}
              activeCategoryId={activeTab}
              onCategoryChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
