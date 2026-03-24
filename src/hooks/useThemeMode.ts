import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
};
