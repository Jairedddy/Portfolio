const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_CONTRIBUTIONS_API =
  "https://github-contributions-api.jogruber.de/v4";
const DEFAULT_USERNAME = "Jairedddy";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

const isBrowser = typeof window !== "undefined";

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface RepoHighlight {
  name: string;
  stars: number;
  url: string;
  description: string | null;
  language: string | null;
}

interface GitHubStatsCore {
  username: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalCommits: number;
  contributions: ContributionDay[];
  topRepositories: RepoHighlight[];
  fetchedAt: string;
}

export interface GitHubStats extends GitHubStatsCore {
  fromCache: boolean;
  stale: boolean;
  rateLimited: boolean;
}

interface CacheRecord {
  timestamp: number;
  data: GitHubStatsCore;
}

interface FetchGitHubStatsOptions {
  username?: string;
  skipCache?: boolean;
}

interface GitHubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  description: string | null;
  html_url: string;
  language: string | null;
}

interface GitHubUserProfile {
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubAPIError extends Error {
  status?: number;
  rateLimited?: boolean;
}

const getCacheKey = (username: string) => `github-stats::${username}`;

const readCache = (username: string): CacheRecord | null => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(getCacheKey(username));
    if (!raw) return null;
    return JSON.parse(raw) as CacheRecord;
  } catch {
    return null;
  }
};

const writeCache = (username: string, data: GitHubStatsCore) => {
  if (!isBrowser) return;
  try {
    const payload: CacheRecord = {
      timestamp: Date.now(),
      data,
    };
    window.localStorage.setItem(getCacheKey(username), JSON.stringify(payload));
  } catch {
    // Fail silently if storage quota is exceeded
  }
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response
      .json()
      .catch(() => ({ message: response.statusText }));

    const error: GitHubAPIError = new Error(
      errorMessage?.message || "GitHub API request failed"
    );
    error.status = response.status;
    if (response.status === 403) {
      error.rateLimited = true;
    }
    throw error;
  }

  return response.json() as Promise<T>;
};

const fetchAllRepos = async (username: string): Promise<GitHubRepo[]> => {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  // Hard limit to 3 pages to avoid excessive requests
  while (page <= 3) {
    const batch = await fetchJson<GitHubRepo[]>(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    repos.push(...batch);
    if (batch.length < perPage) {
      break;
    }
    page += 1;
  }
  return repos;
};

const fetchContributions = async (
  username: string
): Promise<ContributionDay[]> => {
  try {
    const response = await fetch(`${GITHUB_CONTRIBUTIONS_API}/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch contribution graph");
    }
    const data = await response.json();
    return Array.isArray(data?.contributions) ? data.contributions : [];
  } catch {
    // Gracefully degrade if contribution service fails
    return [];
  }
};

const buildCoreStats = async (username: string): Promise<GitHubStatsCore> => {
  const [profile, repos, contributions] = await Promise.all([
    fetchJson<GitHubUserProfile>(`${GITHUB_API_BASE}/users/${username}`),
    fetchAllRepos(username),
    fetchContributions(username),
  ]);

  const totalStars = repos.reduce(
    (acc, repo) => acc + (repo.stargazers_count || 0),
    0
  );

  const topRepositories = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
    }));

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const recentContributions = contributions.filter((entry) => {
    const date = new Date(entry.date);
    return date >= oneYearAgo && date <= today;
  });

  const totalCommits = recentContributions.reduce(
    (acc, entry) => acc + (entry.count || 0),
    0
  );

  return {
    username,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    publicRepos: profile.public_repos ?? 0,
    totalStars,
    totalCommits,
    contributions: recentContributions,
    topRepositories,
    fetchedAt: new Date().toISOString(),
  };
};

export const fetchGitHubStats = async (
  options: FetchGitHubStatsOptions = {}
): Promise<GitHubStats> => {
  const username = options.username || DEFAULT_USERNAME;
  const cache = readCache(username);
  const cacheIsFresh =
    cache && Date.now() - cache.timestamp < CACHE_TTL ? true : false;

  if (cache && cacheIsFresh && !options.skipCache) {
    return {
      ...cache.data,
      fromCache: true,
      stale: false,
      rateLimited: false,
    };
  }

  try {
    const coreStats = await buildCoreStats(username);
    writeCache(username, coreStats);
    return {
      ...coreStats,
      fromCache: false,
      stale: false,
      rateLimited: false,
    };
  } catch (error) {
    const typedError = error as GitHubAPIError;
    if (cache) {
      return {
        ...cache.data,
        fromCache: true,
        stale: !cacheIsFresh,
        rateLimited: Boolean(typedError.rateLimited),
      };
    }
    throw typedError;
  }
};

export const getDefaultGitHubUsername = () => DEFAULT_USERNAME;
