import { NextRequest } from 'next/server';

interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
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

// In-memory cache (30 min TTL)
let cache: { data: unknown; expiresAt: number } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

const GITHUB_USERNAME = 'sgk18';
const GH_HEADERS: HeadersInit = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function fetchGitHub<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers: GH_HEADERS });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

export async function GET(_req: NextRequest) {
  // Return cached data if fresh
  if (cache && Date.now() < cache.expiresAt) {
    return Response.json(cache.data);
  }

  try {
    const [user, repos] = await Promise.all([
      fetchGitHub<GitHubUser>(`/users/${GITHUB_USERNAME}`),
      fetchGitHub<GitHubRepo[]>(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
    ]);

    const ownRepos = repos.filter((r) => !r.fork);

    // Aggregate languages across repos
    const langMap: GitHubLangStats = {};
    const langFetches = ownRepos.slice(0, 20).map(async (repo) => {
      try {
        const langs = await fetchGitHub<GitHubLangStats>(`/repos/${GITHUB_USERNAME}/${repo.name}/languages`);
        for (const [lang, bytes] of Object.entries(langs)) {
          langMap[lang] = (langMap[lang] || 0) + bytes;
        }
      } catch {
        // skip on error
      }
    });
    await Promise.all(langFetches);

    const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
    const languageBreakdown = Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([lang, bytes]) => ({
        name: lang,
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
        topics: r.topics,
        updatedAt: r.updated_at,
      }));

    const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);

    const data = {
      username: user.login,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      languageBreakdown,
      topRepos,
    };

    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    return Response.json(data);
  } catch (err) {
    console.error('GitHub API route error:', err);
    return Response.json({ error: 'Failed to fetch GitHub data.' }, { status: 500 });
  }
}
