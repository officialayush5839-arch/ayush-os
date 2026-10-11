const crypto = require('crypto');
const https = require('https');
const cache = require('./cacheService');

class GitHubService {
  constructor() {
    this.targetUsername = process.env.GITHUB_TARGET_USERNAME || 'officialayush5839-arch';
    this.appId = process.env.GITHUB_APP_ID || null;
    this.appPrivateKey = process.env.GITHUB_APP_PRIVATE_KEY || null;
    this.clientId = process.env.GITHUB_CLIENT_ID || null;
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET || null;
    this.callbackUrl = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/github/callback';
    this.devPat = process.env.GITHUB_DEV_PAT || null;
  }

  // Generate GitHub App JWT for app-level API requests
  generateAppJwt() {
    if (!this.appId || !this.appPrivateKey) return null;
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,
      exp: now + (10 * 60), // 10 minutes max
      iss: this.appId
    };

    const header = { alg: 'RS256', typ: 'JWT' };
    const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${b64Header}.${b64Payload}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(this.appPrivateKey, 'base64url');

    return `${signatureInput}.${signature}`;
  }

  // Make an HTTPS request to api.github.com
  async request(path, options = {}) {
    const url = path.startsWith('http') ? path : `https://api.github.com${path}`;
    const headers = {
      'User-Agent': 'AYUSH-OS-Projects/5.5.0',
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers
    };

    // If an authorization token was explicitly provided, use it
    if (options.token) {
      headers['Authorization'] = `token ${options.token}`;
    } else if (options.jwt) {
      headers['Authorization'] = `Bearer ${options.jwt}`;
    } else if (this.devPat) {
      headers['Authorization'] = `token ${this.devPat}`;
    }

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const reqOptions = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers
      };

      const req = https.request(reqOptions, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          let data = null;
          try {
            data = JSON.parse(body);
          } catch (e) {
            data = body;
          }

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data
            });
          } else {
            const error = new Error(data && data.message ? data.message : `GitHub API error ${res.statusCode}`);
            error.status = res.statusCode;
            error.data = data;
            reject(error);
          }
        });
      });

      req.on('error', (err) => reject(err));
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  }

  // Check current connection and installation status
  async getStatus(sessionInstallationId = null) {
    const isAppConfigured = Boolean(this.appId && this.appPrivateKey);
    const hasClientOAuth = Boolean(this.clientId && this.clientSecret);
    
    // Check if we have an active installation token or valid installation session
    let connected = false;
    let privateAccess = false;
    let installation = null;

    if (sessionInstallationId) {
      try {
        const token = await this.getInstallationAccessToken(sessionInstallationId);
        if (token) {
          connected = true;
          privateAccess = true;
          installation = { id: sessionInstallationId };
        }
      } catch (err) {
        console.warn('[GitHubService] Session installation check failed:', err.message);
      }
    }

    return {
      connected,
      privateAccess,
      targetUsername: this.targetUsername,
      appConfigured: isAppConfigured,
      oauthConfigured: hasClientOAuth,
      clientId: this.clientId,
      appName: 'AYUSH.OS Projects'
    };
  }

  // Get installation access token for a given installation_id
  async getInstallationAccessToken(installationId) {
    const cacheKey = `gh_inst_token_${installationId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const jwt = this.generateAppJwt();
    if (!jwt) {
      throw new Error('GitHub App credentials (APP_ID / PRIVATE_KEY) not configured on server.');
    }

    const res = await this.request(`/app/installations/${installationId}/access_tokens`, {
      method: 'POST',
      jwt
    });

    const token = res.data.token;
    // Cache until token expires (usually 1 hour, we cache for 50 minutes)
    cache.set(cacheKey, token, 50 * 60 * 1000);
    return token;
  }

  // Fetch all repositories for an authenticated installation
  async fetchInstallationRepositories(installationId) {
    const token = await this.getInstallationAccessToken(installationId);
    let allRepos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await this.request(`/installation/repositories?per_page=100&page=${page}`, {
        token
      });
      const repos = res.data.repositories || [];
      allRepos.push(...repos);

      if (repos.length < 100 || allRepos.length >= (res.data.total_count || 0)) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allRepos;
  }

  // Fetch public repositories for target username with pagination
  async fetchPublicRepositories(username) {
    const target = username || this.targetUsername;
    const cacheKey = `gh_public_repos_${target}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let allRepos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const res = await this.request(`/users/${encodeURIComponent(target)}/repos?per_page=100&page=${page}&sort=updated&direction=desc`);
        const repos = Array.isArray(res.data) ? res.data : [];
        allRepos.push(...repos);
        if (repos.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      } catch (err) {
        console.error(`[GitHubService] Error fetching public repos for ${target} page ${page}:`, err.message);
        hasMore = false;
      }
    }

    // Cache for 5 minutes
    cache.set(cacheKey, allRepos, 5 * 60 * 1000);
    return allRepos;
  }

  // Get normalized project list
  async getProjects({ installationId = null } = {}) {
    const cacheKey = `normalized_projects_${installationId || 'public'}_${this.targetUsername}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let rawRepos = [];
    let authenticated = false;

    if (installationId) {
      try {
        rawRepos = await this.fetchInstallationRepositories(installationId);
        authenticated = true;
      } catch (err) {
        console.warn(`[GitHubService] Fallback to public repos due to installation error:`, err.message);
        rawRepos = await this.fetchPublicRepositories(this.targetUsername);
      }
    } else {
      rawRepos = await this.fetchPublicRepositories(this.targetUsername);
    }

    // Normalize repos according to specification
    const normalized = rawRepos.map(repo => this.normalizeRepository(repo));

    // Sort updated_at descending
    normalized.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    cache.set(cacheKey, normalized, 5 * 60 * 1000);
    return normalized;
  }

  // Normalize single repository object
  normalizeRepository(repo) {
    if (!repo) return null;
    return {
      id: String(repo.id),
      githubId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner ? repo.owner.login : this.targetUsername,
      description: repo.description || null,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url || null,
      visibility: repo.visibility || (repo.private ? 'private' : 'public'),
      isPrivate: Boolean(repo.private),
      defaultBranch: repo.default_branch || 'main',
      language: repo.language || null,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      stars: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0,
      forks: typeof repo.forks_count === 'number' ? repo.forks_count : 0,
      openIssues: typeof repo.open_issues_count === 'number' ? repo.open_issues_count : 0,
      createdAt: repo.created_at || null,
      updatedAt: repo.updated_at || null,
      pushedAt: repo.pushed_at || null,
      hasReadme: null, // lazily populated
      projectImage: `/api/projects/${repo.id}/image`,
      projectImageSource: 'auto'
    };
  }

  // Fetch README for a specific repository
  async getReadme(owner, repoName, { installationId = null } = {}) {
    const cacheKey = `readme_${owner}_${repoName}_${installationId || 'public'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let token = null;
    if (installationId) {
      try {
        token = await this.getInstallationAccessToken(installationId);
      } catch (err) {
        console.warn(`[GitHubService] Cannot get installation token for README:`, err.message);
      }
    }

    try {
      // 1. Fetch JSON metadata + base64 markdown
      const res = await this.request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/readme`, {
        token
      });

      const readmeData = res.data;
      let rawMarkdown = '';
      if (readmeData.encoding === 'base64' && readmeData.content) {
        rawMarkdown = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      } else {
        rawMarkdown = readmeData.content || '';
      }

      // 2. Fetch GitHub official rendered HTML
      let htmlContent = '';
      try {
        const htmlRes = await this.request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/readme`, {
          token,
          headers: { 'Accept': 'application/vnd.github.v3.html' }
        });
        htmlContent = typeof htmlRes.data === 'string' ? htmlRes.data : '';
      } catch (e) {
        console.warn(`[GitHubService] Could not fetch official GitHub HTML for ${owner}/${repoName}:`, e.message);
      }

      // Fetch default branch if not in response
      const defaultBranch = readmeData.default_branch || 'main';

      // Parse and resolve relative image paths in markdown
      const resolvedMarkdown = this.resolveRelativeMarkdownAssets(
        rawMarkdown,
        owner,
        repoName,
        defaultBranch,
        token !== null // whether private proxy is needed
      );

      const result = {
        repository: {
          owner,
          name: repoName,
          defaultBranch
        },
        readme: {
          path: readmeData.path || 'README.md',
          content: resolvedMarkdown,
          rawContent: rawMarkdown,
          htmlContent: htmlContent,
          sha: readmeData.sha,
          htmlUrl: readmeData.html_url,
          downloadUrl: readmeData.download_url
        }
      };

      cache.set(cacheKey, result, 15 * 60 * 1000);
      return result;
    } catch (err) {
      if (err.status === 404) {
        return {
          repository: { owner, name: repoName },
          readme: null,
          error: 'README_NOT_FOUND',
          message: 'This repository does not currently contain a readable README.md.'
        };
      }
      throw err;
    }
  }

  // Resolves relative images in Markdown to raw GitHub URLs or private API proxy endpoints
  resolveRelativeMarkdownAssets(markdown, owner, repo, defaultBranch, isPrivate = false) {
    if (!markdown) return '';

    // Regex for markdown images: ![alt](url)
    const mdImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    return markdown.replace(mdImageRegex, (match, alt, url) => {
      const trimmedUrl = url.trim().split(' ')[0].replace(/^["']|["']$/g, '');
      
      // If already absolute HTTP(S) link or data URI, keep as is
      if (/^(https?:|\/\/|data:)/i.test(trimmedUrl)) {
        return match;
      }

      // Clean relative path (e.g. ./assets/demo.png -> assets/demo.png)
      const cleanPath = trimmedUrl.replace(/^\.?\//, '');

      if (isPrivate) {
        // Route through authenticated backend file proxy
        const proxyUrl = `/api/projects/file?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(cleanPath)}`;
        return `![${alt}](${proxyUrl})`;
      } else {
        // Direct raw GitHub user content URL
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanPath}`;
        return `![${alt}](${rawUrl})`;
      }
    });
  }

  // Fetch raw file from repository (for private asset proxying)
  async getRepositoryFile(owner, repo, filePath, { installationId = null } = {}) {
    let token = null;
    if (installationId) {
      try {
        token = await this.getInstallationAccessToken(installationId);
      } catch (err) {
        console.warn(`[GitHubService] Cannot get installation token for file ${filePath}:`, err.message);
      }
    }

    const cleanPath = filePath.replace(/^\.?\//, '');
    const res = await this.request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${cleanPath}`, {
      token
    });

    if (res.data && res.data.content && res.data.encoding === 'base64') {
      return {
        content: Buffer.from(res.data.content, 'base64'),
        contentType: this.guessContentType(cleanPath)
      };
    }

    throw new Error('Unsupported file encoding or format');
  }

  guessContentType(filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    const map = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      webp: 'image/webp',
      json: 'application/json',
      txt: 'text/plain',
      pdf: 'application/pdf'
    };
    return map[ext] || 'application/octet-stream';
  }
}

module.exports = new GitHubService();
