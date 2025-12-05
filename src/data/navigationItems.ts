import {
  Home,
  User,
  Code,
  FolderOpen,
  MessageCircle,
} from "lucide-react";

export const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

export const activeThemes: Record<
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

