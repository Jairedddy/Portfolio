import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type EasterEggId = "logoOracle" | "viceLegend" | "dragonShadow" | "gothamSignal" | "kryptonEcho";

type EasterEggEffect = "particles" | "aurora" | "pulse";

interface EasterEggConfig {
  id: EasterEggId;
  label: string;
  message: string;
  description: string;
  effect: EasterEggEffect;
}

interface ActiveEasterEgg extends EasterEggConfig {
  triggeredAt: number;
}

type DiscoveryState = Record<EasterEggId, boolean>;

const STORY_ORDER: EasterEggId[] = ["logoOracle", "viceLegend", "dragonShadow", "gothamSignal", "kryptonEcho"];

const SECRET_WORDS: Partial<Record<EasterEggId, string>> = {
  viceLegend: "vercetti",
  dragonShadow: "tailung",
  gothamSignal: "wayne",
  kryptonEcho: "krypton",
};

const HINTS: Record<EasterEggId, string> = {
  logoOracle: "Chapter 1 • Tap the JR crest five times to rouse the Neon Oracle.",
  viceLegend: "Chapter 2 • Vice City dispatch: type Tommy's last name to tune in.",
  dragonShadow: "Chapter 3 • Jade Palace whispers: recall the snow leopard villain.",
  gothamSignal: "Chapter 4 • Gotham signal: type the knight’s surname to light the sky.",
  kryptonEcho: "Finale • Krypton echo: type the planet Clark calls home.",
};

const COMPLETION_HINT = "Saga complete • Vercetti, Tai Lung, Wayne, and Krypton all logged.";

const EGG_CONFIG: Record<EasterEggId, EasterEggConfig> = {
  logoOracle: {
    id: "logoOracle",
    label: "Chapter 1 · Neon Knock",
    message: "You woke the JR crest! It whispers about a Vice City legend next.",
    description: "Five eager taps kicked off the hidden storyline.",
    effect: "pulse",
  },
  viceLegend: {
    id: "viceLegend",
    label: "Chapter 2 · Vice Legend",
    message: "Tommy Vercetti would approve of your recall.",
    description: "Typing his surname cracked open the next clue.",
    effect: "particles",
  },
  dragonShadow: {
    id: "dragonShadow",
    label: "Chapter 3 · Dragon Shadow",
    message: "Tai Lung nods (reluctantly). Your Kung Fu trivia is lethal.",
    description: "Remembering the snow leopard sealed the Jade Palace stanza.",
    effect: "aurora",
  },
  gothamSignal: {
    id: "gothamSignal",
    label: "Chapter 4 · Gotham Signal",
    message: "The Bat-Signal flares. Gotham knows you by name now.",
    description: "Typing Wayne charged the skyline spotlight.",
    effect: "particles",
  },
  kryptonEcho: {
    id: "kryptonEcho",
    label: "Finale · Krypton Echo",
    message: "Krypton hums again. The House of El honors you.",
    description: "Invoking the lost planet closes the saga with cosmic light.",
    effect: "pulse",
  },
};

const INITIAL_DISCOVERY: DiscoveryState = {
  logoOracle: false,
  viceLegend: false,
  dragonShadow: false,
  gothamSignal: false,
  kryptonEcho: false,
};

export const useEasterEggs = () => {
  const [discovered, setDiscovered] = useState<DiscoveryState>({ ...INITIAL_DISCOVERY });
  const [activeEgg, setActiveEgg] = useState<ActiveEasterEgg | null>(null);

  const logoClickRef = useRef({ count: 0, last: 0 });
  const typedBufferRef = useRef("");

  const totalEggs = STORY_ORDER.length;
  const discoveredCount = useMemo(() => STORY_ORDER.filter((id) => discovered[id]).length, [discovered]);

  const nextEgg = useMemo(() => STORY_ORDER.find((id) => !discovered[id]) ?? null, [discovered]);
  const hint = useMemo(() => {
    if (!nextEgg) return COMPLETION_HINT;
    return HINTS[nextEgg];
  }, [nextEgg]);

  const maxSecretLength = useMemo(() => {
    const words = Object.values(SECRET_WORDS).filter((word): word is string => Boolean(word));
    if (!words.length) return 0;
    return words.reduce((max, word) => (word.length > max ? word.length : max), 0);
  }, []);

  const prerequisitesMet = useCallback(
    (id: EasterEggId) => {
      const index = STORY_ORDER.indexOf(id);
      if (index <= 0) return true;
      return STORY_ORDER.slice(0, index).every((prevId) => discovered[prevId]);
    },
    [discovered],
  );

  const triggerEgg = useCallback(
    (id: EasterEggId) => {
      if (!prerequisitesMet(id)) return;
      const config = EGG_CONFIG[id];
      setActiveEgg({ ...config, triggeredAt: Date.now() });
      setDiscovered((prev) => {
        if (prev[id]) return prev;
        return { ...prev, [id]: true };
      });
    },
    [prerequisitesMet],
  );

  const dismissActiveEgg = useCallback(() => {
    setActiveEgg(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const normalizedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      const isFormField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.getAttribute("contenteditable") === "true";

      if (!isFormField && /^[a-z]$/.test(normalizedKey)) {
        const limit = maxSecretLength || 12;
        typedBufferRef.current = (typedBufferRef.current + normalizedKey).slice(-limit);

        for (const eggId of STORY_ORDER) {
          const secret = SECRET_WORDS[eggId];
          if (!secret) continue;
          if (discovered[eggId]) continue;
          if (!prerequisitesMet(eggId)) continue;
          if (typedBufferRef.current.endsWith(secret)) {
            typedBufferRef.current = "";
            triggerEgg(eggId);
            break;
          }
        }
      } else if (normalizedKey === "Escape") {
        typedBufferRef.current = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [discovered, maxSecretLength, prerequisitesMet, triggerEgg]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleClick = (event: MouseEvent) => {
      if (!prerequisitesMet("logoOracle") || discovered.logoOracle) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) return;
      const logoTarget = target.closest("[data-easter-logo]");
      if (!logoTarget) return;

      const now = Date.now();
      if (now - logoClickRef.current.last > 1500) {
        logoClickRef.current.count = 0;
      }
      logoClickRef.current.count += 1;
      logoClickRef.current.last = now;

      if (logoClickRef.current.count >= 5) {
        logoClickRef.current.count = 0;
        triggerEgg("logoOracle");
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [discovered.logoOracle, prerequisitesMet, triggerEgg]);

  return {
    activeEgg,
    discovered,
    discoveredCount,
    totalEggs,
    hint,
    dismissActiveEgg,
  };
};

export type { ActiveEasterEgg, EasterEggEffect, EasterEggId };

export default useEasterEggs;
