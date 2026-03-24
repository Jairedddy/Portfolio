import { createContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "vibrant" | "monochrome";

export type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
  isMonochrome: boolean;
};

const STORAGE_KEY = "portfolio-theme-mode";

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === "vibrant" || stored === "monochrome") return stored;
    } catch {}
    return "vibrant";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "vibrant" ? "monochrome" : "vibrant"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMonochrome: theme === "monochrome" }}>
      {children}
    </ThemeContext.Provider>
  );
};
