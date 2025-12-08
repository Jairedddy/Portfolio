import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Zap, Users, Award } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const journeyRef = useRef<HTMLDivElement | null>(null);
  const lineProgressRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Stats data with animated counters
  const stats = [
    { icon: Code, label: "Projects Completed", value: 20, suffix: "+" },
    { icon: Zap, label: "Technologies Mastered", value: 25, suffix: "+" },
    { icon: Users, label: "Network", value: 500, suffix: "+" },
    { icon: Award, label: "Years Experience", value: 5, suffix: "+" },
  ];

  // Timeline data
  const timeline = [
    {
      year: "2024",
      title: "Associate Data Scientist, Full Stack Developer, Prompt Engineer and GenAI Expert",
      company: "Straive Pvt.Ltd",
      description: "Leading development of AI-powered web applications using React, Node.js, Flask, Fast API and machine learning APIs to craft solutions for clients. I also build applications that leverage LLMs and GenAI to cater to multiple MNC's use cases."
    },
    {
      year: "2024",
      title: "Associate Data Scientist, Full Stack Developer, Prompt Engineer and GenAI Expert",
      company: "Gramener Technology Solutions Pvt.Ltd",
      description: "Building AI-driven web applications with React and Node.Js leveraging machine learning APIs to deliver client solutions. I also handle data analysis, model training, and API integration."
    },
    {
      year: "2024",
      title: "Full Stack Developer and Prompt Engineer",
      company: "Freelance",
      description: "Build responsive, interactive interfaces for Saas platforms, Specialized in React, JavaScript, modern JavaScript libraries like Three.js, Ethers.js, D3.js etc."
    },
    {
      year: "2024",
      title: "Full Stack Developer",
      company: "Freelance",
      description: "Developed full-stack applications and gained expertise in JavaScript, Python, and database design."
    },
    {
      year: "2024",
      title: "Information Technology Graduate",
      company: "Vellore Institute of Technology",
      description: "Bachelor's degree in Information Technology with focus on web technologies, AI and software engineering."
    }
  ];

  // GSAP animations for stats counters
  useEffect(() => {
    if (!isInView || !statsRef.current) return;

    const statElements = statsRef.current.querySelectorAll('.stat-number');
    statElements.forEach((element, index) => {
      const finalValue = stats[index].value;
      gsap.fromTo(element,
        { textContent: 0 },
        {
          textContent: finalValue,
          duration: 2,
          delay: index * 0.2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function() {
            element.textContent = Math.ceil(this.targets()[0].textContent);
          }
        }
      );
    });
  }, [isInView, stats]);

  useEffect(() => {
    if (!journeyRef.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".journey-row");

      rows.forEach((row) => {
        const sideCard = row.querySelector(".journey-card");
        const dot = row.querySelector(".journey-dot");

        if (sideCard) {
          gsap.fromTo(
            sideCard,
            { opacity: 0, y: 80, rotateX: -10 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                end: "bottom 45%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0.6, boxShadow: "0 0 0 rgba(139, 92, 246, 0)" },
            {
              scale: 1,
              boxShadow: "0 0 35px rgba(139,92,246,0.5)",
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                end: "bottom 45%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      if (lineProgressRef.current) {
        gsap.fromTo(
          lineProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: journeyRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          },
        );
      }
    }, journeyRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="py-20 relative min-h-screen">
      {/* Background Layers */}
      <ParticleBackground id="about-particles" variant="about" />
      <div className="absolute inset-0 neon-grid opacity-20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-pulse performance-optimized"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/5 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10" ref={sectionRef}>
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <TextReveal
            as="h2"
            className="text-4xl md:text-5xl font-black font-orbitron mb-6 text-glow-cyan"
            revealDelay={80}
          >
            &lt; ABOUT /&gt;
          </TextReveal>
          <div className="w-24 h-1 mx-auto bg-gradient-primary rounded-full shadow-neon-purple"></div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
              <TextReveal
                as="h3"
                className="text-2xl font-orbitron font-bold mb-4 text-neon-purple"
                revealDelay={120}
                revealStagger={25}
              >
                BUilding Platforms for Businesses Since 2019
              </TextReveal>
              
              <div className="space-y-3 text-muted-foreground font-rajdhani text-base leading-relaxed">
                <p>
                I'm a full-stack developer with a passion for creating immersive digital experiences that push the boundaries of what's possible on the web. With immense experience, I specialize in modern JavaScript Frameworks, Creative Coding, and Performance Optimization and Aesthetic Website Design.
                </p>
                
                <p>
                My journey in tech started with a curiosity about how things work under the hood. Today, I combine technical expertise with creative vision to build applications that are not just functional, but truly engaging and memorable.
                </p>
                
                <p>
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, binge-watching movies, listening to music on blast volumes, playing some sport, or just staring out the window.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="bg-card p-4 rounded-xl text-center border border-border shadow-lg"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 250 }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-3 text-neon-purple" />
                  <div className="text-2xl font-orbitron font-bold text-glow-cyan mb-1">
                    <span className="stat-number">0</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-muted-foreground font-cyber text-xs">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          ref={journeyRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TextReveal
            as="h3"
            className="text-3xl font-orbitron font-bold text-center mb-8 text-neon-purple"
            revealDelay={100}
          >
            My Journey
          </TextReveal>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border/40 rounded-full overflow-hidden">
              <div
                ref={lineProgressRef}
                className="absolute inset-0 bg-gradient-to-b from-neon-purple via-neon-cyan to-neon-green origin-top scale-y-0"
              />
            </div>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={`${item.year}-${item.company}-${index}`}
                  className={`journey-row flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                    <div className="journey-card bg-card p-3 rounded-xl border border-border shadow-lg hover:border-neon-purple transition-colors">
                      <div className="text-lg font-cyber font-bold text-neon-purple mb-1">
                        {item.year}
                      </div>
                      <h4 className="text-base font-cyber font-bold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-neon-purple font-cyber font-semibold mb-1">
                        {item.company}
                      </p>
                      <p className="text-muted-foreground font-cyber text-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-2/12 flex justify-center">
                    <div className="journey-dot w-6 h-6 bg-neon-purple rounded-full shadow-neon-purple border-4 border-background"></div>
                  </div>

                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Cyber Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none z-15">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent animate-cyber-scan opacity-30"></div>
      </div>
    </section>
  );
};

export default AboutSection;
