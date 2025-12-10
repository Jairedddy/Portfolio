import { createContext, ReactNode } from "react";
import useEasterEggs from "@/hooks/useEasterEggs";

type EasterEggsContextValue = ReturnType<typeof useEasterEggs>;

const EasterEggsContext = createContext<EasterEggsContextValue | undefined>(undefined);

const EasterEggsProvider = ({ children }: { children: ReactNode }) => {
  const value = useEasterEggs();
  return <EasterEggsContext.Provider value={value}>{children}</EasterEggsContext.Provider>;
};

export { EasterEggsContext, EasterEggsProvider };
