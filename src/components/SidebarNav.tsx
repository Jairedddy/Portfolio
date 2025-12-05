import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { activeThemes, navItems } from "@/data/navigationItems";

const SidebarNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollY = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-4 top-28 z-40"
    >
      <div
        className={`rounded-2xl border border-border/70 bg-card/90 p-3 shadow-2xl backdrop-blur transition-[width] duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs font-cyber uppercase tracking-[0.4em] text-muted-foreground">
              Menu
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded-full border border-border/60 bg-background/60 p-1 text-muted-foreground transition hover:text-foreground"
            aria-label="Toggle sidebar navigation"
          >
            <ChevronRight
              className={`size-4 transition-transform ${!isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const theme = activeThemes[item.id] ?? activeThemes.home;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group flex items-center rounded-xl px-3 py-2 transition-all duration-300 ${
                  isCollapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? `${theme.text} ${theme.border} border bg-white/5 ${theme.shadow}`
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                aria-label={item.label}
              >
                <Icon className="size-5" />
                {!isCollapsed && <span className="font-cyber text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
};

export default SidebarNav;

