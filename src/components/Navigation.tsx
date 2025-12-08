import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, Download, Home, User, Code, FolderOpen, MessageCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Navigation Component with Smooth Scroll
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollPercent, setScrollPercent] = useState(0);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  const activeThemes: Record<
    string,
    {
      text: string;
      hoverText: string;
      border: string;
      shadow: string;
      buttonBg: string;
      buttonHover: string;
    }
  > = {
    home: {
      text: "text-neon-purple",
      hoverText: "hover:text-neon-purple/80",
      border: "border-neon-purple",
      shadow: "shadow-neon-purple",
      buttonBg: "bg-gradient-secondary text-background",
      buttonHover: "hover:shadow-neon-purple",
    },
    about: {
      text: "text-neon-cyan",
      hoverText: "hover:text-neon-cyan/80",
      border: "border-neon-cyan",
      shadow: "shadow-neon-cyan",
      buttonBg: "bg-gradient-primary text-background",
      buttonHover: "hover:shadow-neon-cyan",
    },
    skills: {
      text: "text-neon-green",
      hoverText: "hover:text-neon-green",
      border: "border-neon-green",
      shadow: "shadow-neon-green",
      buttonBg: "bg-neon-green text-gray-900",
      buttonHover: "hover:shadow-neon-green",
    },
    projects: {
      text: "text-neon-purple",
      hoverText: "hover:text-neon-purple/80",
      border: "border-neon-purple",
      shadow: "shadow-neon-purple",
      buttonBg: "bg-gradient-secondary text-background",
      buttonHover: "hover:shadow-neon-purple",
    },
    contact: {
      text: "text-neon-cyan",
      hoverText: "hover:text-neon-cyan/80",
      border: "border-neon-cyan",
      shadow: "shadow-neon-cyan",
      buttonBg: "bg-gradient-primary text-background",
      buttonHover: "hover:shadow-neon-cyan",
    },
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/Jairedddy", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/jaishuk-reddy-671777217", label: "LinkedIn" },
  ];
  const resumePath = "/Jai-Reddy-Resume-20251205.pdf";
  const currentTheme = activeThemes[activeSection] ?? activeThemes.home;

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  // Track scroll percentage
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

  // Animate progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, {
      width: `${scrollPercent}%`,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [scrollPercent]);

  // Track active section on scroll using GSAP ScrollTrigger
  useEffect(() => {
    const triggers = navItems.map((item) => {
      const element = document.getElementById(item.id);
      if (!element) return null;

      return ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(item.id),
        onEnterBack: () => setActiveSection(item.id),
      });
    }).filter((trigger) => trigger !== null);

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, []);


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 py-2"
    >
      <div className="container mx-auto px-6">
        <div className={`bg-card rounded-2xl py-2 border border-border shadow-lg transition-all duration-300 ${
          activeSection !== "home" ? "bg-card/95" : ""
        }`}>
          <div className="flex items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="font-cyber text-xl font-bold text-neon-purple cursor-pointer ml-4"
                onClick={() => scrollToSection("home")}
              >
                JR
              </motion.div>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const theme = activeThemes[item.id] ?? activeThemes.home;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      isActive
                        ? `${theme.text} ${theme.border} border ${theme.shadow}`
                        : "text-muted-foreground hover:text-neon-purple"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Scroll Progress Bar - Between Nav Items and Social Icons */}
            <div className="hidden lg:flex items-center mx-4">
              <div className="flex items-center gap-3 min-w-[150px] max-w-[200px]">
                {/* Progress Bar */}
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    ref={progressRef}
                    className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    style={{ width: "0%" }}
                  />
                </div>
                {/* Percentage */}
                <span className="font-cyber text-muted-foreground/70 text-xs">
                  {Math.round(scrollPercent)}%
                </span>
              </div>
            </div>

            {/* Right Section: Social Icons + Resume Button + Mobile Menu */}
            <div className="flex items-center space-x-6 mr-4">
              {/* Social Icons */}
              <div className="hidden md:flex items-center space-x-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${currentTheme.text} ${currentTheme.hoverText} transition-all duration-300 p-2 rounded-lg`}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>

              {/* Resume Download Button */}
              <motion.a
                href={resumePath}
                download="Jai Reddy.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
              >
                <Download size={16} />
                <span>Resume</span>
              </motion.a>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-neon-purple p-2"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-surface-dark rounded-lg m-4 border border-neon-purple"
            >
              {/* Social Links in Mobile Menu */}
              <div className="flex justify-center space-x-4 p-4 border-b border-border">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${currentTheme.text} ${currentTheme.hoverText} transition-all duration-300 p-2 rounded-lg`}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const theme = activeThemes[item.id] ?? activeThemes.home;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-3 w-full text-left px-4 py-3 border-b border-border last:border-b-0 transition-colors ${
                      isActive
                        ? `${theme.text} bg-muted`
                        : "text-muted-foreground hover:text-neon-purple hover:bg-muted/50"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Resume Button in Mobile Menu */}
              <div className="p-4 border-t border-border">
                <a
                  href={resumePath}
                  download="Jai Reddy.pdf"
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Download size={16} />
                  <span>Resume</span>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
