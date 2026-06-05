import { NextRequest } from 'next/server';

interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

interface GitHubLangStats {
  [language: string]: number;
}

export interface GitHubData {
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  languageBreakdown: { name: string; percentage: number; bytes: number }[];
  topRepos: {
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
    language: string | null;
    topics: string[];
    updatedAt: string;
  }[];
  recentRepos: {
    name: string;
    url: string;
    language: string | null;
    updatedAt: string;
  }[];
}

// In-memory cache (30 min TTL) — module-level so it survives across requests
let cache: { data: GitHubData; expiresAt: number } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

const GITHUB_USERNAME = 'sgk18';

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGitHub<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: getHeaders(),
    next: { revalidate: 0 }, // Do not cache at the Next.js layer — we handle caching ourselves
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function GET(_req: NextRequest) {
  // Return cached data if still fresh
  if (cache && Date.now() < cache.expiresAt) {
    return Response.json(cache.data);
  }

  try {
    const [user, repos] = await Promise.all([
      fetchGitHub<GitHubUser>(`/users/${GITHUB_USERNAME}`),
      fetchGitHub<GitHubRepo[]>(
        `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`
      ),
    ]);

    const ownRepos = repos.filter((r) => !r.fork);

    // Aggregate languages from top 20 repos by stars (to stay within rate limits)
    const reposForLangs = [...ownRepos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20);

    const langMap: GitHubLangStats = {};
    await Promise.all(
      reposForLangs.map(async (repo) => {
        try {
          const langs = await fetchGitHub<GitHubLangStats>(
            `/repos/${GITHUB_USERNAME}/${repo.name}/languages`
          );
          for (const [lang, bytes] of Object.entries(langs)) {
            langMap[lang] = (langMap[lang] || 0) + bytes;
          }
        } catch {
          // skip repos that fail (e.g. empty repos)
        }
      })
    );

    const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
    const languageBreakdown = Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
      }));

    // Top repos by stars
    const topRepos = ownRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        topics: r.topics ?? [],
        updatedAt: r.updated_at,
      }));

    // 5 most recently updated repos
    const recentRepos = ownRepos.slice(0, 5).map((r) => ({
      name: r.name,
      url: r.html_url,
      language: r.language,
      updatedAt: r.updated_at,
    }));

    const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks = ownRepos.reduce((s, r) => s + r.forks_count, 0);

    const data: GitHubData = {
      username: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
      languageBreakdown,
      topRepos,
      recentRepos,
    };

    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    return Response.json(data);
  } catch (err) {
    console.error('[GitHub API]', err);

    // Return stale cache if available rather than failing
    if (cache) {
      return Response.json(cache.data);
    }

    return Response.json(
      { error: 'Failed to fetch GitHub data. Please try again later.' },
      { status: 503 }
    );
  }
}
