import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, RefreshCcw, Rocket } from "lucide-react";
import { gsap } from "gsap";
import {
  ContributionDay,
  fetchGitHubStats,
  getDefaultGitHubUsername,
  GitHubStats as GitHubStatsPayload,
} from "../api/github";

type FetchState = "idle" | "loading" | "success" | "error";

const statConfig: Array<{
  key: keyof Pick<
    GitHubStatsPayload,
    "publicRepos" | "totalCommits"
  >;
  label: string;
}> = [
  { key: "publicRepos", label: "Repositories" },
  { key: "totalCommits", label: "Commits (12M)" },
];

const contributionLevelClass: Record<number, string> = {
  0: "bg-border/40",
  1: "bg-neon-cyan/20",
  2: "bg-neon-cyan/40",
  3: "bg-neon-cyan/70",
  4: "bg-neon-green/80",
};

const numberFormatter = new Intl.NumberFormat();
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" });
const dateRangeFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});
const dayLabels = ["Mon", "Wed", "Fri"];
const contributionLegend = [0, 1, 2, 3, 4];
const RECENT_CONTRIBUTION_DAYS = 90;

interface GitHubStatsProps {
  username?: string;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({
  username = getDefaultGitHubUsername(),
}) => {
  const [stats, setStats] = useState<GitHubStatsPayload | null>(null);
  const [status, setStatus] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const countersRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadStats = useCallback(
    async (skipCache = false) => {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const result = await fetchGitHubStats({ username, skipCache });
        if (!isMountedRef.current) return;
        setStats(result);
        setStatus("success");
      } catch (error) {
        if (!isMountedRef.current) return;
        setStatus("error");
        const message =
          (error as Error)?.message ||
          "Unable to load GitHub statistics right now.";
        setErrorMessage(message);
      }
    },
    [username]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!stats || !countersRef.current) return;
    const ctx = gsap.context(() => {
      const elements =
        countersRef.current?.querySelectorAll<HTMLElement>("[data-counter]");
      elements?.forEach((element) => {
        const targetValue = Number(element.dataset.counter || 0);
        gsap.fromTo(
          element,
          { textContent: 0 },
          {
            textContent: targetValue,
            duration: 1.6,
            ease: "power3.out",
            snap: { textContent: 1 },
            delay: Number(element.dataset.delay || 0),
            onComplete: () => {
              element.textContent = numberFormatter.format(targetValue);
            },
          }
        );
      });
    }, countersRef);

    return () => ctx.revert();
  }, [stats]);

  const {
    weeks: recentContributionWeeks,
    monthLabelMap,
    dateRange,
  } = useMemo(() => {
    if (!stats || !stats.contributions?.length) {
      return {
        weeks: [] as ContributionDay[][],
        monthLabelMap: new Map<number, string>(),
        dateRange: null as { start?: string; end?: string } | null,
      };
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RECENT_CONTRIBUTION_DAYS);
    cutoff.setHours(0, 0, 0, 0);

    let days = stats.contributions.filter((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= cutoff;
    });

    if (!days.length) {
      days = stats.contributions.slice(-RECENT_CONTRIBUTION_DAYS);
    }

    // Sort days by date to ensure proper order
    days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group into weeks (7 days per week)
    const weeks: ContributionDay[][] = [];
    const monthEntries: Array<[number, string]> = [];
    let previousMonth = "";

    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      if (week.length > 0) {
        weeks.push(week);
        
        // Get the month of the first day in the week
        const firstDayDate = new Date(week[0].date);
        const monthLabel = monthFormatter.format(firstDayDate);
        
        // Add month label when it changes
        if (monthLabel !== previousMonth) {
          monthEntries.push([weeks.length - 1, monthLabel]);
          previousMonth = monthLabel;
        }
      }
    }

    return {
      weeks,
      monthLabelMap: new Map(monthEntries),
      dateRange: { start: days[0]?.date, end: days[days.length - 1]?.date },
    };
  }, [stats]);

  const rangeLabel = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) return null;
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return `${dateRangeFormatter.format(startDate)} – ${dateRangeFormatter.format(endDate)}`;
  }, [dateRange]);

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`s-${index}`}
            className="h-20 rounded-xl border border-border/60 bg-surface-dark/60 animate-pulse"
          />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 h-48 rounded-2xl border border-border/60 bg-surface-dark/60 animate-pulse" />
        <div className="h-48 rounded-2xl border border-border/60 bg-surface-dark/60 animate-pulse" />
      </div>
    </div>
  );

  const renderError = () => (
    <div className="rounded-2xl border border-red-500/50 bg-red-500/5 p-6 text-center shadow-lg shadow-red-500/10">
      <p className="font-cyber text-lg text-red-200">{errorMessage}</p>
      <button
        onClick={() => loadStats(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-400/70 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );

  const metaChip = stats ? (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-widest ${
        stats.fromCache
          ? stats.stale
            ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
            : "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
          : "bg-neon-green/10 text-neon-green border border-neon-green/40"
      }`}
    >
      {stats.fromCache
        ? stats.stale
          ? "Stale cache"
          : "Cached"
        : "Live pull"}
    </span>
  ) : null;

  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neon-cyan/40 bg-gradient-to-br from-surface-dark/80 via-background/70 to-surface-darker/80 p-4 sm:p-6 shadow-neon-cyan/30 backdrop-blur-xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-cyan/15 via-transparent to-neon-green/10 blur-3xl" />
        <div className="absolute -top-12 right-0 h-32 w-32 animate-pulse rounded-full bg-neon-cyan/20 blur-2xl" />
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 sm:h-6 sm:w-6 text-neon-cyan flex-shrink-0" />
              <h3 className="text-2xl sm:text-3xl font-orbitron font-black text-glow-cyan">
                Live Stats
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {metaChip}
            <button
              onClick={() => loadStats(true)}
              disabled={status === "loading"}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-neon-cyan/40 px-3 sm:px-4 py-1.5 sm:py-2 font-cyber text-[0.65rem] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neon-cyan transition hover:-translate-y-0.5 hover:bg-neon-cyan/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {status === "loading" && renderSkeleton()}
        {status === "error" && renderError()}

        {stats && status === "success" && (
          <div className="space-y-6 sm:space-y-8">
            {stats.rateLimited && (
              <div className="rounded-lg sm:rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-2.5 sm:p-3 text-center text-[0.65rem] sm:text-xs font-semibold text-yellow-200">
                GitHub API rate limit reached. Showing{" "}
                {stats.stale ? "stale" : "cached"} data.
              </div>
            )}

            <div
              ref={countersRef}
              className="grid gap-3 sm:grid-cols-2"
              aria-live="polite"
            >
              {statConfig.map((stat, index) => (
                <div
                  key={stat.key}
                  className="group rounded-xl sm:rounded-2xl border border-border/60 bg-surface-dark/80 p-3 sm:p-4 shadow-lg shadow-black/20 transition hover:border-neon-cyan/40 hover:shadow-neon-cyan/30"
                >
                  <p className="text-[0.65rem] sm:text-xs font-cyber uppercase tracking-[0.25em] sm:tracking-[0.3em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-orbitron font-bold text-glow-cyan">
                    <span
                      data-counter={stats[stat.key]}
                      data-delay={index * 0.05}
                      data-testid={`counter-${stat.key}`}
                    >
                      {stats[stat.key].toLocaleString()}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-surface-dark/70 p-4 sm:p-5 backdrop-blur">
                <div className="flex items-center justify-between mb-3 sm:mb-0">
                  <p className="font-cyber text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    Contribution Heatmap
                  </p>
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-neon-cyan flex-shrink-0" />
                </div>

                {recentContributionWeeks.length ? (
                  <div className="mt-4 overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
                    <div className="min-w-[280px] sm:min-w-[320px]">
                      <div className="flex gap-2 sm:gap-4">
                        <div className="flex flex-col items-end gap-4 sm:gap-6 pt-6 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground flex-shrink-0">
                          {dayLabels.map((label) => (
                            <span key={label}>{label}</span>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="ml-1 flex gap-0.5 sm:gap-1 text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground overflow-x-auto">
                            {recentContributionWeeks.map((_, index) => (
                              <span key={`month-${index}`} className="w-3 sm:w-4 text-center flex-shrink-0">
                                {monthLabelMap.get(index) ?? ""}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 flex gap-0.5 sm:gap-1 overflow-x-auto">
                            {recentContributionWeeks.map((week, weekIndex) => (
                              <div key={`week-${weekIndex}`} className="flex w-3 sm:w-4 flex-col gap-0.5 sm:gap-1 flex-shrink-0">
                                {week.map((day) => (
                                  <span
                                    key={day.date}
                                    className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm transition ${contributionLevelClass[day.level] ?? "bg-border/40"}`}
                                    title={`${day.date}: ${day.count} contributions`}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-[0.6rem] sm:text-[0.65rem] text-muted-foreground">
                            <span>Less</span>
                            <div className="flex gap-0.5 sm:gap-1">
                              {contributionLegend.map((level) => (
                                <span
                                  key={`legend-${level}`}
                                  className={`h-2.5 w-4 sm:h-3 sm:w-5 rounded-sm ${contributionLevelClass[level] ?? "bg-border/40"}`}
                                />
                              ))}
                            </div>
                            <span>More</span>
                          </div>
                          {rangeLabel && (
                            <p className="mt-2 text-[0.65rem] sm:text-xs text-muted-foreground">
                              Activity window: {rangeLabel}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Contribution data is unavailable right now.
                  </p>
                )}
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-surface-dark/70 p-4 sm:p-5 backdrop-blur">
                <p className="font-cyber text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Signature Repositories
                </p>
                {stats.topRepositories.length ? (
                  <div className="mt-4 space-y-3 sm:space-y-4">
                    {stats.topRepositories.map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg sm:rounded-xl border border-border/60 bg-background/60 p-3 sm:p-4 transition hover:border-neon-cyan/40 hover:bg-background/80"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className="text-base sm:text-lg font-orbitron text-neon-cyan break-words">
                              {repo.name}
                            </p>
                            {repo.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {repo.description}
                              </p>
                            )}
                          </div>
                          <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 text-[0.65rem] sm:text-xs text-muted-foreground">
                          {repo.language && (
                            <span className="rounded-full border border-neon-cyan/30 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-neon-cyan">
                              {repo.language}
                            </span>
                          )}
                          <span className="font-cyber uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                            View repository
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
                    No public repositories to showcase right now.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[0.65rem] sm:text-xs text-muted-foreground">
              <span className="break-words">
                Last synced:{" "}
                {new Date(stats.fetchedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <span className="font-cyber uppercase tracking-[0.25em] sm:tracking-[0.3em] text-neon-cyan flex-shrink-0">
                @{stats.username}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default GitHubStats;
