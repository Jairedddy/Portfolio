import { CheckCircle2, Sparkles } from "lucide-react";

const MessageSentAlert = () => {
  return (
    <div className="flex items-start gap-4">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 border border-neon-cyan/40 shadow-neon-cyan/20">
        <CheckCircle2 className="h-5 w-5 text-neon-cyan" />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-neon-purple" />
      </div>
      <div className="space-y-1 text-left">
        <p className="text-sm font-semibold text-foreground tracking-[0.2em] uppercase">Message sent</p>
        <p className="text-sm text-muted-foreground">
          Thanks for reaching out. I&apos;ll respond with visual directions or a prototype link soon.
        </p>
      </div>
    </div>
  );
};

export default MessageSentAlert;
