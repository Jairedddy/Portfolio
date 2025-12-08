import { useState, useEffect, useRef, type CSSProperties } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Music,
  Ghost,
  Coffee,
  MessageCircle,
  Instagram,
  TimerReset,
  Rocket,
  Workflow,
  Search,
  Code2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { animate, stagger } from "animejs";
import ParticleBackground from "./ParticleBackground";
import MessageSentAlert from "./MessageSentAlert";
import { skillCategories } from "@/data/skillCategories";

const techCategoryIds = ["web-dev", "backend", "ai-ml", "integration", "devops"];
const techCategories = skillCategories.filter((category) => techCategoryIds.includes(category.id));
const defaultTechCategoryId = techCategories[0]?.id ?? "";
const TECH_MARKER = "\n\nPreferred Tech Stack:";
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? "/api/contact";

const getColorClasses = (color: string) => {
  switch (color) {
    case "neon-cyan":
      return {
        border: "border-neon-cyan",
        bg: "bg-neon-cyan/10",
        text: "text-neon-cyan",
        scrollbar: "#00fff0",
      };
    case "neon-purple":
      return {
        border: "border-neon-purple",
        bg: "bg-neon-purple/10",
        text: "text-neon-purple",
        scrollbar: "#bd5bff",
      };
    case "neon-green":
      return {
        border: "border-neon-green",
        bg: "bg-neon-green/10",
        text: "text-neon-green",
        scrollbar: "#7cfb4c",
      };
    case "neon-orange":
      return {
        border: "border-orange-400",
        bg: "bg-orange-400/10",
        text: "text-orange-400",
        scrollbar: "#ffb347",
      };
    case "neon-pink":
      return {
        border: "border-pink-400",
        bg: "bg-pink-400/10",
        text: "text-pink-400",
        scrollbar: "#ff6ad5",
      };
    case "neon-red":
      return {
        border: "border-red-400",
        bg: "bg-red-400/10",
        text: "text-red-400",
        scrollbar: "#ff6a6a",
      };
    default:
      return {
        border: "border-neon-cyan",
        bg: "bg-neon-cyan/10",
        text: "text-neon-cyan",
        scrollbar: "#00fff0",
      };
  }
};

const buildTechBlock = (techs: string[]) => {
  if (!techs.length) return "";
  const list = techs.map((tech) => `• ${tech}`).join("\n");
  return `${TECH_MARKER}\n${list}`;
};

const stripTechBlock = (message: string) => {
  const index = message.indexOf(TECH_MARKER);
  if (index === -1) return message;
  return message.slice(0, index);
};

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [customTechs, setCustomTechs] = useState<string[]>([]);
  const [customTechInput, setCustomTechInput] = useState("");
  const [activeTechCategory, setActiveTechCategory] = useState(defaultTechCategoryId);
  const { toast } = useToast();

  useEffect(() => {
    if (!sectionRef.current) return;

    const animations: Array<ReturnType<typeof animate>> = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = Array.from(entry.target.querySelectorAll("[data-anime-card]"));
            const animationInstance = animate(cards, {
              opacity: [0, 1],
              translateY: [30, 0],
              delay: stagger(120),
              duration: 700,
              easing: "easeOutExpo",
            });
            animations.push(animationInstance);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      animations.forEach((anim) => anim.cancel());
    };
  }, []);

  const combinedTechs = [...selectedTechs, ...customTechs];
  const previewTechBlock = buildTechBlock(combinedTechs);

  const updateMessageWithTechs = (nextSelected: string[], nextCustom: string[]) => {
    setFormData((prev) => {
      const base = stripTechBlock(prev.message).replace(/\s+$/, "");
      const block = buildTechBlock([...nextSelected, ...nextCustom]);
      const message = block ? `${base}${block}` : base;
      return { ...prev, message };
    });
  };

  const handleMessageInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, message: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Failed to send message.");
      }

      toast({
        duration: 4500,
        className: "border border-neon-cyan/40 bg-surface-darker/90 text-foreground backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)]",
        description: <MessageSentAlert />,
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
      setSelectedTechs([]);
      setCustomTechs([]);
      setCustomTechInput("");
    } catch (error) {
      console.error("Contact form submission failed", error);
      toast({
        variant: "destructive",
        duration: 5000,
        className: "border border-red-500/40 bg-surface-darker/90 text-foreground backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)]",
        description: "Couldn't send your message right now. Please try again or email me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "jaishuk.reddy7@gmail.com",
      href: "mailto:jaishuk.reddy7@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 94901 65454",
      href: "tel:+919490165454"
    },
    {
      icon: MapPin,
      label: "Studio",
      value: "Hyderabad, India",
      href: null
    },
    {
      icon: MessageCircle,
      label: "Response",
      value: "< 24 hrs",
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/jai_redddy"
    },
    {
      icon: Music,
      label: "Spotify",
      href: "https://open.spotify.com/user/o54xv9yzm5yd68j8rjdbujx83?si=zLhZ8ytJR3yr96gaEEbHfA"
    },
    {
      icon: Ghost,
      label: "Snapchat",
      href: "https://snapchat.com/add/jai_reddy7"
    }
  ];

  const activeCategory =
    techCategories.find((category) => category.id === activeTechCategory) ?? techCategories[0];
  const activeSkills = activeCategory?.skills ?? [];
  const CategoryIcon = activeCategory?.icon;
  const activeColors = getColorClasses(activeCategory?.color ?? "neon-cyan");

  const processSteps = [
    {
      title: "Research",
      icon: Search,
      description: "Research user flows, constraints, and success signals before we touch code."
    },
    {
      title: "Develop",
      icon: TimerReset,
      description: "Rapid motion-first experiments to validate interactions and tooling choices."
    },
    {
      title: "Deploy",
      icon: Rocket,
      description: "Production build, polish, and launch with documentation and handoff."
    },
  ];

  const toggleTech = (value: string) => {
    setSelectedTechs((prev) => {
      const next = prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
      updateMessageWithTechs(next, customTechs);
      return next;
    });
  };

  const addCustomTech = () => {
    const trimmed = customTechInput.trim();
    if (!trimmed) return;
    if (combinedTechs.includes(trimmed)) {
      setCustomTechInput("");
      return;
    }
    setCustomTechs((prev) => {
      const next = [...prev, trimmed];
      updateMessageWithTechs(selectedTechs, next);
      return next;
    });
    setCustomTechInput("");
  };

  const removeCustomTech = (tech: string) => {
    setCustomTechs((prev) => {
      const next = prev.filter(item => item !== tech);
      updateMessageWithTechs(selectedTechs, next);
      return next;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(var(--background)), hsl(var(--dark-surface)))",
      }}
    >
      <ParticleBackground id="contact-particles" variant="contact" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-neon-purple/15 blur-[120px]" />
        <div className="absolute bottom-10 left-6 w-72 h-72 bg-neon-cyan/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black font-cyber text-glow-cyan mb-3">
            &lt; CONTACT /&gt;
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Minimal content, more visuals. Send a short brief and I will translate it into something tangible.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="space-y-6 flex flex-col">
            <div
              data-anime-card
              className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 opacity-45">
                <div className="absolute -top-8 right-0 w-48 h-48 bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 blur-[120px]" />
                <div className="absolute bottom-0 -left-8 w-40 h-40 bg-neon-green/25 blur-[110px]" />
              </div>

              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Direct line</p>
                  <h3 className="text-2xl md:text-3xl font-cyber font-semibold text-foreground mt-3">
                    I will reply with visuals, not paragraphs.
                  </h3>
                </div>

                <div className="space-y-3">
                  {contactInfo.map((item) => {
                    const content = (
                      <div className="rounded-2xl border border-border/70 bg-surface-darker/70 p-4 transition-colors hover:border-neon-cyan/60">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-card/60 border border-border/80">
                            <item.icon className="w-4 h-4 text-neon-cyan" />
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="text-sm font-semibold text-foreground mt-1 break-words">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <a key={item.label} href={item.href} className="focus-ring-cyber block">
                          {content}
                        </a>
                      );
                    }

                    return (
                      <div key={item.label}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              data-anime-card
              className="rounded-[28px] border border-border/70 bg-surface-darker/85 p-6 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-cyber text-glow-green">Elsewhere</h4>
                <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Social</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring-cyber flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 px-4 py-3 transition-all hover:border-neon-cyan"
                    data-cursor="interactive"
                  >
                    <social.icon className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm font-medium text-foreground">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div
              data-anime-card
              className="rounded-[28px] border border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/15 via-transparent to-neon-purple/15 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Fuel the build</p>
                  <p className="text-base text-foreground mt-2 max-w-sm">
                    If you enjoy the work, you can keep the caffeine supply flowing for the next visual experiment.
                  </p>
                </div>
                <a
                  href="https://buymeacoffee.com/jairedddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring-cyber inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-background shadow-neon-cyan transition-all duration-300 hover:brightness-110"
                  aria-label="Buy me a coffee"
                >
                  <Coffee className="h-4 w-4" />
                  Buy me a coffee
                </a>
              </div>
            </div>

            <div
              data-anime-card
              className="rounded-[28px] border border-border/70 bg-surface-darker/85 p-6 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-2xl border border-border/70 bg-card/70 p-2">
                  <Workflow className="h-4 w-4 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                    Process
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-8 right-8 top-9 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex flex-wrap gap-y-10 gap-x-4 justify-between">
                  {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.title}
                        className="group relative flex flex-col items-center text-center flex-1 min-w-[120px]"
                      >
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card/70 shadow-[0_0_30px_rgba(0,255,255,0.08)]">
                          <Icon className="h-5 w-5 text-neon-cyan" />
                          <div className="absolute -inset-1 rounded-full border border-neon-cyan/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                          {step.title}
                        </p>
                        <div className="pointer-events-none absolute top-[4.5rem] w-48 rounded-2xl border border-border/60 bg-background/95 p-3 text-xs text-muted-foreground opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-1">
                          {step.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div
              data-anime-card
              className="relative flex w-full flex-col overflow-hidden rounded-[32px] border border-border/60 bg-card/90 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 opacity-35">
                <div className="absolute -top-16 -right-12 w-60 h-60 bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 blur-[120px]" />
              </div>

              <div className="relative z-10 flex h-full flex-col gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Send message</p>
                  <h3 className="text-2xl md:text-3xl font-cyber font-semibold text-foreground mt-2">
                    Drop a quick brief.
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="flex h-full flex-col gap-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-surface-darker/80 border-border focus:border-neon-cyan"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-surface-darker/80 border-border focus:border-neon-cyan"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Subject *</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-2 bg-surface-darker/80 border-border focus:border-neon-cyan"
                    placeholder="e.g. Portfolio revamp"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => handleMessageInputChange(e.target.value)}
                    required
                    rows={5}
                    className="mt-2 bg-surface-darker/80 border-border focus:border-neon-cyan resize-none"
                    placeholder="What are we creating? Tools, inspiration, timeline..."
                  />
                </div>

                <div className="space-y-2 rounded-2xl border border-border/60 bg-surface-darker/70 p-4 flex flex-col overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      Technology suggestions
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {combinedTechs.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techCategories.map((category) => {
                      const Icon = category.icon;
                      const colors = getColorClasses(category.color);
                      const isActive = activeTechCategory === category.id;
                      return (
                        <button
                          type="button"
                          key={category.id}
                          onClick={() => setActiveTechCategory(category.id)}
                          className={`focus-ring-cyber flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tracking-[0.2em] transition-all ${
                            isActive
                              ? `${colors.border} ${colors.bg} ${colors.text}`
                              : "border-border text-muted-foreground hover:border-border/70"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {category.title}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className="min-h-0 max-h-64 overflow-y-auto pr-1 custom-scroll"
                    style={
                      {
                        scrollbarColor: `${activeColors.scrollbar} transparent`,
                        scrollbarWidth: "thin",
                        "--scrollbar-color": activeColors.scrollbar,
                      } as CSSProperties
                    }
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      {activeSkills.map((skill) => {
                        const isActive = selectedTechs.includes(skill.name);
                        return (
                          <button
                            type="button"
                            key={`${activeCategory?.id}-${skill.name}`}
                            onClick={() => toggleTech(skill.name)}
                            className={`focus-ring-cyber flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                              isActive
                                ? "border-neon-cyan/70 bg-neon-cyan/10 shadow-neon-cyan/20"
                                : "border-border hover:border-neon-cyan/40"
                            }`}
                          >
                            <div
                              className={`rounded-xl border border-border/70 bg-card/70 p-2 ${activeColors.text}`}
                            >
                              {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Tap to {isActive ? "remove" : "add"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={customTechInput}
                      onChange={(e) => setCustomTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomTech();
                        }
                      }}
                      placeholder="Add another tool (e.g. Prisma, Vite)"
                      className="bg-surface-darker border-border focus:border-neon-cyan"
                    />
                    <Button
                      type="button"
                      onClick={addCustomTech}
                      className="bg-gradient-primary text-background hover:shadow-neon-cyan"
                    >
                      Add
                    </Button>
                  </div>
                  {combinedTechs.length > 0 && (
                    <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                      <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                        {previewTechBlock.trim()}
                      </p>
                      {customTechs.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {customTechs.map((tech) => (
                            <button
                              type="button"
                              key={tech}
                              onClick={() => removeCustomTech(tech)}
                              className="focus-ring-cyber flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground hover:border-neon-cyan/60 hover:text-foreground"
                            >
                              {tech}
                              <span className="text-base leading-none">&times;</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex justify-end border-t border-border/60 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-gradient-primary hover:shadow-neon-cyan transition-all duration-300 text-base px-8 py-4 h-auto"
                    onMouseEnter={(e) => {
                      animate(e.currentTarget, {
                        scale: [1, 1.02],
                        duration: 200,
                        easing: "easeOutQuad",
                      });
                    }}
                    onMouseLeave={(e) => {
                      animate(e.currentTarget, {
                        scale: [1.02, 1],
                        duration: 200,
                        easing: "easeOutQuad",
                      });
                    }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
