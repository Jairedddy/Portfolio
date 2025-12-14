import { useContext } from "react";
import { EasterEggsContext } from "@/context/EasterEggsContext";

const useEasterEggsContext = () => {
  const context = useContext(EasterEggsContext);
  if (!context) {
    throw new Error("useEasterEggsContext must be used within EasterEggsProvider");
  }
  return context;
};

export default useEasterEggsContext;
