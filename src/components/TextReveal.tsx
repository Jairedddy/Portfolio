import { ComponentPropsWithoutRef, ElementType, ReactNode, useMemo } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";

type TextRevealBaseProps<T extends ElementType> = {
  as?: T;
  text?: string;
  children?: ReactNode;
  className?: string;
  revealDelay?: number;
  revealDuration?: number;
  revealStagger?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  translateY?: number;
};

type PolymorphicProps<T extends ElementType> = TextRevealBaseProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextRevealBaseProps<T> | "children">;

const splitCache = new Map<string, string[]>();

const getCharacters = (value: string) => {
  if (!splitCache.has(value)) {
    splitCache.set(value, value.split(""));
  }
  return splitCache.get(value)!;
};

export const TextReveal = <T extends ElementType = "span">({
  as,
  text,
  children,
  className,
  revealDelay,
  revealDuration,
  revealStagger,
  once,
  threshold,
  rootMargin,
  translateY,
  ...rest
}: PolymorphicProps<T>) => {
  const content = typeof text === "string" ? text : typeof children === "string" ? children : "";
  const Tag = (as || "span") as ElementType;

  const shouldAnimate = typeof content === "string" && content.length > 0;
  const characters = useMemo(() => (shouldAnimate ? getCharacters(content) : []), [content, shouldAnimate]);

  const { containerRef } = useTextReveal({
    delay: revealDelay,
    duration: revealDuration,
    stagger: revealStagger,
    once,
    threshold,
    rootMargin,
    translateY,
  });

  if (!shouldAnimate) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={content} {...rest}>
      <span ref={containerRef} aria-hidden="true" className="inline-flex flex-wrap">
        {characters.map((char, index) => {
          const isSpace = char === " ";
          return (
            <span
              key={`${char}-${index}`}
              data-text-reveal-char
              className="inline-block opacity-0 translate-y-2"
              style={isSpace ? { whiteSpace: "pre" } : undefined}
            >
              {isSpace ? " " : char}
            </span>
          );
        })}
      </span>
    </Tag>
  );
};

export default TextReveal;
