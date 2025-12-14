import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import EasterEggs from "./components/EasterEggs";
import { EasterEggsProvider } from "./context/EasterEggsContext";

const queryClient = new QueryClient();

const MIN_LOADING_DURATION = 1500;
const FALLBACK_DURATION = 8000;

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let resolved = false;
    let completionTimer: ReturnType<typeof window.setTimeout> | undefined;
    let hideTimer: ReturnType<typeof window.setTimeout> | undefined;
    let fallbackTimer: ReturnType<typeof window.setTimeout> | undefined;
    const startTime = performance.now();

    const progressInterval = window.setInterval(() => {
      setProgress((prev) => {
        if (resolved || prev >= 90) return prev;
        const increment = 2 + Math.random() * 6;
        return Math.min(prev + increment, 90);
      });
    }, 180);

    const finalizeLoading = () => {
      if (resolved) return;
      resolved = true;
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(MIN_LOADING_DURATION - elapsed, 0);

      completionTimer = window.setTimeout(() => {
        window.clearInterval(progressInterval);
        setProgress(100);
        hideTimer = window.setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 450);
      }, remaining);
    };

    const handleLoad = () => finalizeLoading();

    if (document.readyState === "complete") {
      finalizeLoading();
    } else {
      window.addEventListener("load", handleLoad);
    }

    fallbackTimer = window.setTimeout(finalizeLoading, FALLBACK_DURATION);

    return () => {
      isMounted = false;
      window.removeEventListener("load", handleLoad);
      window.clearInterval(progressInterval);
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
      if (completionTimer) window.clearTimeout(completionTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <EasterEggsProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AnimatePresence>{isLoading && <LoadingScreen progress={progress} />}</AnimatePresence>
          <EasterEggs />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </EasterEggsProvider>
  );
};

export default App;
