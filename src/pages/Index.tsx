import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenis from "@/hooks/useLenis";
import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ProjectsSection from "@/components/ProjectsSection"
import SkillsSection from "@/components/SkillsSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const sectionColorStops: Record<string, { start: string; end: string }> = {
    home: { start: "276 83% 55%", end: "276 83% 55%" },
    about: { start: "189 100% 60%", end: "189 100% 60%" },
    skills: { start: "84 100% 55%", end: "189 100% 60%" },
    projects: { start: "276 83% 55%", end: "189 100% 60%" },
    contact: { start: "189 100% 60%", end: "276 83% 55%" },
};

const Index = () => {
    useLenis();
    useEffect(() => {
        // Initialize smooth scrolling and section animations
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            gsap.fromTo(section, 
                { 
                    opacity: 0.8,
                    y: 50 
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Parallax effect for background elements
        gsap.utils.toArray('.parallax-element').forEach((element) => {
            gsap.to(element as Element, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: element as Element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        const trackedSections = Object.entries(sectionColorStops)
            .map(([id, colors]) => {
                const element = document.getElementById(id);
                return element ? { element, colors } : null;
            })
            .filter((item): item is { element: HTMLElement; colors: { start: string; end: string } } => Boolean(item));

        if (!trackedSections.length) return;

        let lastStart = "";

        const updateScrollbar = () => {
            const midPoint = window.scrollY + window.innerHeight / 2;
            let closest = trackedSections[0];
            let smallestDistance = Infinity;

            trackedSections.forEach((section) => {
                const rect = section.element.getBoundingClientRect();
                const offsetTop = rect.top + window.scrollY;
                const center = offsetTop + rect.height / 2;
                const distance = Math.abs(midPoint - center);

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closest = section;
                }
            });

            if (closest && closest.colors.start !== lastStart) {
                root.style.setProperty("--scrollbar-start", closest.colors.start);
                root.style.setProperty("--scrollbar-end", closest.colors.end);
                lastStart = closest.colors.start;
            }
        };

        updateScrollbar();
        window.addEventListener("scroll", updateScrollbar, { passive: true });
        window.addEventListener("resize", updateScrollbar);

        return () => {
            window.removeEventListener("scroll", updateScrollbar);
            window.removeEventListener("resize", updateScrollbar);
        };
    }, []);

    return (
        <div className="relative bg-background text-foreground overflow-x-hidden min-h-screen">
            {/* Navigation */}
            <Navigation />
            
            {/* Main Content Sections */}
            <main className="relative">
                {/* Hero Section with particles and 3D elements */}
                <HeroSection />
                
                {/* About Section with timeline and stats */}
                <AboutSection />
                
                {/* Skills Section with interactive categories */}
                <SkillsSection />
                
                {/* Projects Section with filterable gallery */}
                <ProjectsSection />
                
                {/* Contact Section with animated form */}
                <ContactSection />
            </main>

            {/* Footer */}
            <Footer />
            
            {/* Global Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="parallax-element absolute top-1/4 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" />
                <div className="parallax-element absolute bottom-1/4 left-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="parallax-element absolute top-3/4 right-1/3 w-80 h-80 bg-neon-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
            </div>
            
            {/* Cyber scan lines effect */}
            <div className="fixed inset-0 pointer-events-none z-10 opacity-20 overflow-hidden">
                <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-cyber-scan" />
                <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent animate-cyber-scan" style={{ animationDelay: '3s' }} />
            </div>
        </div>
    );
};

export default Index;
