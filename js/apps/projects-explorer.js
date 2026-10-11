/**
 * AYUSH.OS — Projects App (Dynamic GitHub Source of Truth)
 * Interactive OS-style File Explorer & README Viewer
 */
window.ProjectsExplorerApp = {
  state: {
    view: 'explorer', // 'explorer' | 'readme'
    projects: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedFilter: 'all',
    activeProject: null,
    readmeData: null,
    readmeLoading: false,
    readmeError: null,
    githubStatus: {
      connected: false,
      privateAccess: false,
      targetUsername: 'officialayush5839-arch'
    }
  },

  async init(container) {
    this.container = container;
    this.bindEvents();
    await this.fetchGitHubStatus();
    await this.fetchProjects();
  },

  bindEvents() {
    if (!this.container) return;

    // Delegated click handler
    this.container.addEventListener('click', (e) => {
      // Connect GitHub button
      const connectBtn = e.target.closest('[data-action="connect-github"]');
      if (connectBtn) {
        e.preventDefault();
        this.openConnectFlow();
        return;
      }

      // Disconnect GitHub button
      const disconnectBtn = e.target.closest('[data-action="disconnect-github"]');
      if (disconnectBtn) {
        e.preventDefault();
        this.disconnectGitHub();
        return;
      }

      // Refresh button
      const refreshBtn = e.target.closest('[data-action="refresh-projects"]');
      if (refreshBtn) {
        e.preventDefault();
        this.refreshProjects();
        return;
      }

      // Back to explorer button
      const backBtn = e.target.closest('[data-action="back-to-explorer"]');
      if (backBtn) {
        e.preventDefault();
        this.state.view = 'explorer';
        this.state.activeProject = null;
        this.state.readmeData = null;
        this.state.readmeError = null;
        this.render();
        return;
      }

      // Filter chips
      const chipBtn = e.target.closest('[data-filter]');
      if (chipBtn) {
        e.preventDefault();
        this.state.selectedFilter = chipBtn.dataset.filter;
        this.render();
        return;
      }

      // Project card click -> open README
      const projectCard = e.target.closest('[data-project-id]');
      if (projectCard && !e.target.closest('a[target="_blank"]')) {
        e.preventDefault();
        const projectId = projectCard.dataset.projectId;
        const project = this.state.projects.find(p => p.id === projectId || p.name === projectId);
        if (project) {
          this.openProjectReadme(project);
        }
      }
    });

    // Delegated input handler for search
    this.container.addEventListener('input', (e) => {
      if (e.target.matches('[data-projects-search]')) {
        this.state.searchQuery = e.target.value.toLowerCase().trim();
        this.renderExplorerGrid();
      }
    });
  },

  async fetchGitHubStatus() {
    try {
      const res = await fetch('/api/github/status');
      if (res.ok) {
        const data = await res.json();
        this.state.githubStatus = data;
      }
    } catch (err) {
      console.warn('[ProjectsApp] Could not fetch GitHub status:', err.message);
    }
  },

  async fetchProjects() {
    this.state.loading = true;
    this.state.error = null;
    this.render();

    // 1. Primary: Query Express server endpoint if available
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          this.state.projects = data.projects;
          this.state.loading = false;
          this.render();
          return;
        }
      }
    } catch {
      // Server endpoint not reachable (static host)
    }

    // 2. Secondary: Direct GitHub Public API (Works 24/7 on static hosts like GitHub Pages)
    try {
      const ghRes = await fetch('https://api.github.com/users/officialayush5839-arch/repos?sort=pushed&direction=desc&per_page=100');
      if (ghRes.ok) {
        const repos = await ghRes.json();
        if (Array.isArray(repos) && repos.length > 0) {
          this.state.projects = repos.map(r => ({
            id: String(r.id),
            githubId: r.id,
            name: r.name,
            fullName: r.full_name,
            owner: r.owner ? r.owner.login : 'officialayush5839-arch',
            description: r.description,
            htmlUrl: r.html_url,
            cloneUrl: r.clone_url,
            visibility: r.visibility || (r.private ? 'private' : 'public'),
            isPrivate: Boolean(r.private),
            defaultBranch: r.default_branch || 'main',
            language: r.language,
            topics: r.topics || [],
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            openIssues: r.open_issues_count || 0,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            pushedAt: r.pushed_at,
            projectImage: `assets/projects/${r.name.toLowerCase()}.png`
          }));
          this.state.loading = false;
          this.render();
          return;
        }
      }
    } catch (ghErr) {
      console.warn('[ProjectsApp] Direct GitHub fetch failed:', ghErr.message);
    }

    // 3. Tertiary: Fallback to ownerProfile canonical project registry
    if (window.ownerProfile && Array.isArray(window.ownerProfile.projects) && window.ownerProfile.projects.length > 0) {
      this.state.projects = window.ownerProfile.projects.map(p => ({
        id: p.id,
        name: p.title || p.name,
        fullName: `officialayush5839-arch/${p.name || p.title}`,
        owner: 'officialayush5839-arch',
        description: p.description || p.tagline,
        htmlUrl: p.repo || `https://github.com/officialayush5839-arch/${p.title}`,
        cloneUrl: (p.repo || `https://github.com/officialayush5839-arch/${p.title}`) + '.git',
        visibility: 'public',
        isPrivate: false,
        defaultBranch: 'main',
        language: (p.tech && p.tech[0]) || 'Python',
        topics: p.tech || [],
        stars: 0,
        forks: 0,
        openIssues: 0,
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: '2026-08-30T00:00:00Z',
        pushedAt: '2026-08-30T00:00:00Z'
      }));
      this.state.loading = false;
      this.render();
      return;
    }

    this.state.loading = false;
    this.state.error = 'Unable to retrieve repository data.';
    this.render();
  },

  async refreshProjects() {
    this.state.loading = true;
    this.render();
    try {
      await fetch('/api/projects/refresh', { method: 'POST' });
      await this.fetchGitHubStatus();
    } catch {
      // Non-server fallback
    }
    await this.fetchProjects();
  },

  async openProjectReadme(project) {
    this.state.view = 'readme';
    this.state.activeProject = project;
    this.state.readmeLoading = true;
    this.state.readmeError = null;
    this.state.readmeData = null;
    this.render();

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}/readme`);
      if (res.ok) {
        const data = await res.json();
        if (data.readme) {
          this.state.readmeData = data.readme;
          this.state.readmeLoading = false;
          this.render();
          return;
        }
      }
    } catch {
      // Server route unavailable
    }

    // Direct GitHub README fallback
    try {
      const owner = project.owner || 'officialayush5839-arch';
      const repo = project.name;
      const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        if (ghData.content) {
          const cleanBase64 = ghData.content.replace(/\s/g, '');
          const binaryStr = atob(cleanBase64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const decoded = new TextDecoder('utf-8').decode(bytes);
          this.state.readmeData = decoded;
          this.state.readmeLoading = false;
          this.render();
          return;
        }
      }
    } catch (e) {
      console.warn('[ProjectsApp] Direct README fetch failed:', e.message);
    }

    this.state.readmeLoading = false;
    this.state.readmeError = 'This repository does not currently contain a readable README.md.';
    this.render();
  },

  openConnectFlow() {
    window.location.href = '/api/github/auth';
  },

  async disconnectGitHub() {
    try {
      await fetch('/api/github/disconnect', { method: 'POST' });
      await this.fetchGitHubStatus();
      await this.fetchProjects();
    } catch (err) {
      console.error('[ProjectsApp] Disconnect error:', err);
    }
  },

  getFilteredProjects() {
    let list = this.state.projects;

    // Filter by category chip
    const filter = this.state.selectedFilter;
    if (filter === 'public') {
      list = list.filter(p => !p.isPrivate);
    } else if (filter === 'private') {
      list = list.filter(p => p.isPrivate);
    } else if (filter === 'python') {
      list = list.filter(p => (p.language || '').toLowerCase() === 'python');
    } else if (filter === 'typescript') {
      list = list.filter(p => (p.language || '').toLowerCase() === 'typescript');
    } else if (filter === 'aiml') {
      list = list.filter(p => {
        const text = `${p.name} ${p.description || ''} ${(p.topics || []).join(' ')}`.toLowerCase();
        return text.includes('ai') || text.includes('nlp') || text.includes('vision') || text.includes('anomaly') || text.includes('emotion');
      });
    }

    // Filter by search query
    const q = this.state.searchQuery;
    if (q) {
      list = list.filter(p => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const lang = (p.language || '').toLowerCase();
        const topics = (p.topics || []).join(' ').toLowerCase();
        return name.includes(q) || desc.includes(q) || lang.includes(q) || topics.includes(q);
      });
    }

    return list;
  },

  render() {
    if (!this.container) return;

    if (this.state.view === 'readme' && this.state.activeProject) {
      this.container.innerHTML = this.renderReadmeView();
    } else {
      this.container.innerHTML = this.renderExplorerView();
    }
  },

  renderExplorerView() {
    const isConnected = this.state.githubStatus.connected;
    const isPrivateEnabled = this.state.githubStatus.privateAccess;
    const statusLabel = isPrivateEnabled ? 'PRIVATE ACCESS ENABLED' : (isConnected ? 'CONNECTED' : 'PUBLIC REPO MODE');
    const statusDotClass = isConnected ? 'connected' : 'disconnected';

    return `
      <div class="projects-explorer-app">
        <!-- Top Toolbar -->
        <header class="projects-os-toolbar">
          <div class="projects-breadcrumb">
            <span class="bc-btn"><img src="./assets/icons-v4/projects.png" width="14" height="14" alt="" /> PROJECTS</span>
            <span class="bc-sep">/</span>
            <span class="bc-current">REPOSITORY EXPLORER</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="gh-status-indicator" title="GitHub API connection status">
              <span class="gh-status-dot ${statusDotClass}"></span>
              <span>${statusLabel}</span>
            </div>

            ${!isConnected ? `
              <button class="gh-action-btn" data-action="connect-github" type="button" title="Authorize GitHub App to view private repositories">
                [ + CONNECT GITHUB ]
              </button>
            ` : `
              <button class="gh-action-btn" data-action="disconnect-github" type="button" title="Disconnect and clear authorization session">
                [ DISCONNECT ]
              </button>
            `}

            <button class="gh-action-btn" data-action="refresh-projects" type="button" title="Refresh repositories from GitHub">
              [ ⟳ REFRESH ]
            </button>
          </div>
        </header>

        <!-- Search & Filter Bar -->
        <section class="projects-filter-bar">
          <div class="projects-search-box">
            <span>🔍</span>
            <input
              type="search"
              class="projects-search-input"
              data-projects-search
              placeholder="SEARCH REPOSITORIES..."
              value="${this.escapeAttr(this.state.searchQuery)}"
              autocomplete="off"
            />
          </div>

          <div class="projects-chips">
            <button class="chip-btn ${this.state.selectedFilter === 'all' ? 'active' : ''}" data-filter="all" type="button">ALL (${this.state.projects.length})</button>
            <button class="chip-btn ${this.state.selectedFilter === 'aiml' ? 'active' : ''}" data-filter="aiml" type="button">AI/ML</button>
            <button class="chip-btn ${this.state.selectedFilter === 'python' ? 'active' : ''}" data-filter="python" type="button">PYTHON</button>
            <button class="chip-btn ${this.state.selectedFilter === 'typescript' ? 'active' : ''}" data-filter="typescript" type="button">TYPESCRIPT</button>
            <button class="chip-btn ${this.state.selectedFilter === 'public' ? 'active' : ''}" data-filter="public" type="button">PUBLIC</button>
            <button class="chip-btn ${this.state.selectedFilter === 'private' ? 'active' : ''}" data-filter="private" type="button">PRIVATE</button>
          </div>
        </section>

        <!-- Main Body Area -->
        <div class="projects-scroll-area" id="projectsScrollArea">
          ${this.renderExplorerBody()}
        </div>
      </div>
    `;
  },

  renderExplorerBody() {
    if (this.state.loading) {
      return `
        <div class="projects-loading-state">
          <div class="projects-loading-icon">📁</div>
          <div class="projects-loading-title">PROJECTS.EXE — READING GITHUB REPOSITORIES</div>
          <div class="projects-loading-sub">Connecting to GitHub API · Fetching metadata &amp; visual covers...</div>
          <div class="projects-progress-track">
            <div class="projects-progress-fill"></div>
          </div>
        </div>
      `;
    }

    if (this.state.error) {
      return `
        <div class="projects-error-box">
          <h4>GITHUB CONNECTION ERROR</h4>
          <p>${this.escapeHtml(this.state.error)}</p>
          <button class="gh-action-btn" data-action="refresh-projects" type="button">[ RETRY CONNECTION ]</button>
        </div>
      `;
    }

    const filtered = this.getFilteredProjects();

    if (filtered.length === 0) {
      if (this.state.selectedFilter === 'private' && !this.state.githubStatus.privateAccess) {
        return `
          <div class="gh-connect-modal">
            <h3>PROJECT FILE SYSTEM</h3>
            <p style="font-weight: 700; color: var(--wine, #851c3d);">Private repository access requires explicit GitHub App authorization.</p>
            <p>Connect your GitHub account to load your private repositories and enterprise case files.</p>
            <button class="gh-connect-btn" data-action="connect-github" type="button">
              [ 🐙 AUTHORIZE GITHUB ACCESS ]
            </button>
            <p style="font-size: 10px; margin-top: 14px; opacity: 0.7;">
              Public repositories can be inspected anytime without private access.
            </p>
          </div>
        `;
      }

      return `
        <div class="projects-empty-box">
          <h4>PROJECT DIRECTORY EMPTY</h4>
          <p>No accessible repositories matched the selected filters.</p>
          <button class="gh-action-btn" data-filter="all" type="button">[ RESET FILTERS ]</button>
        </div>
      `;
    }

    return `
      <div class="projects-dynamic-grid">
        ${filtered.map(p => this.renderProjectCard(p)).join('')}
      </div>
    `;
  },

  renderProjectCard(p) {
    const isPrivate = p.isPrivate;
    const badgeClass = isPrivate ? 'badge-private' : 'badge-public';
    const badgeLabel = isPrivate ? 'PRIVATE' : 'PUBLIC';
    const lang = p.language || 'Software';
    const dateStr = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return `
      <article class="project-os-card" data-project-id="${this.escapeAttr(p.id)}" tabindex="0" role="button" aria-label="Open project ${this.escapeAttr(p.name)}">
        <div class="project-card-cover">
          <img src="/api/projects/${encodeURIComponent(p.id)}/image" alt="Project artwork for ${this.escapeAttr(p.name)}" loading="lazy" />
          <div class="project-card-badges">
            <span class="badge-tag ${badgeClass}">${badgeLabel}</span>
          </div>
        </div>

        <div class="project-card-info">
          <h3 class="project-card-name">${this.escapeHtml(p.name)}</h3>
          <p class="project-card-desc">${this.escapeHtml(p.description || 'No description provided.')}</p>

          <div class="project-card-footer">
            <div class="project-tech-meta">
              <span><i class="tech-dot"></i> ${this.escapeHtml(lang)}</span>
              ${dateStr ? `<span>${this.escapeHtml(dateStr)}</span>` : ''}
            </div>
            <span class="project-open-hint">INSPECT README ↘</span>
          </div>
        </div>
      </article>
    `;
  },

  renderReadmeView() {
    const project = this.state.activeProject;
    const isPrivate = project.isPrivate;
    const lang = project.language || 'Language unavailable';

    return `
      <div class="projects-explorer-app">
        <!-- Top Toolbar -->
        <header class="projects-os-toolbar">
          <div class="projects-breadcrumb">
            <button class="bc-btn" data-action="back-to-explorer" type="button">← PROJECTS</button>
            <span class="bc-sep">/</span>
            <span class="bc-current">${this.escapeHtml(project.name)}</span>
            <span class="bc-sep">/</span>
            <span>README.MD</span>
          </div>

          <div style="display: flex; gap: 8px;">
            <a class="gh-action-btn" href="${this.escapeAttr(project.htmlUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
              [ ↗ OPEN GITHUB ]
            </a>
            <button class="gh-action-btn" data-action="back-to-explorer" type="button">
              [ ✕ CLOSE ]
            </button>
          </div>
        </header>

        <!-- README Viewer Scroll Area -->
        <div class="readme-viewer-panel">
          <section class="readme-header-banner">
            <div class="readme-title-group">
              <h2>${this.escapeHtml(project.name)}</h2>
              <p>${this.escapeHtml(project.description || 'No repository description.')}</p>
              <div class="readme-meta-pills">
                <span class="meta-pill">VISIBILITY: ${isPrivate ? 'PRIVATE' : 'PUBLIC'}</span>
                <span class="meta-pill">PRIMARY: ${this.escapeHtml(lang)}</span>
                ${project.stars > 0 ? `<span class="meta-pill">★ ${project.stars}</span>` : ''}
                ${project.forks > 0 ? `<span class="meta-pill">⑂ ${project.forks}</span>` : ''}
                ${project.defaultBranch ? `<span class="meta-pill">BRANCH: ${this.escapeHtml(project.defaultBranch)}</span>` : ''}
              </div>
            </div>

            <div class="readme-actions">
              <a class="gh-action-btn" href="${this.escapeAttr(project.htmlUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                [ REPOSITORY URL ↗ ]
              </a>
            </div>
          </section>

          <div class="readme-scroll-body">
            ${this.renderReadmeContent()}
          </div>
        </div>
      </div>
    `;
  },

  renderReadmeContent() {
    if (this.state.readmeLoading) {
      return `
        <div class="projects-loading-state">
          <div class="projects-loading-icon">📄</div>
          <div class="projects-loading-title">FETCHING README.MD FROM GITHUB...</div>
          <div class="projects-loading-sub">Retrieving authentic markdown from ${this.escapeHtml(this.state.activeProject.fullName)}</div>
          <div class="projects-progress-track"><div class="projects-progress-fill"></div></div>
        </div>
      `;
    }

    if (this.state.readmeError) {
      return `
        <div class="projects-error-box">
          <h4>README NOT AVAILABLE</h4>
          <p>${this.escapeHtml(this.state.readmeError)}</p>
          <div style="display: flex; justify-content: center; gap: 8px;">
            <a class="gh-action-btn" href="${this.escapeAttr(this.state.activeProject.htmlUrl)}" target="_blank" rel="noopener noreferrer">
              [ VIEW ON GITHUB ↗ ]
            </a>
            <button class="gh-action-btn" data-action="back-to-explorer" type="button">
              [ BACK TO PROJECTS ]
            </button>
          </div>
        </div>
      `;
    }

    if (this.state.readmeData) {
      // Priority 1: GitHub's official native rendered HTML
      if (this.state.readmeData.htmlContent) {
        // Sanitize any malicious script tags while preserving GitHub's rich badges, tables, and markup
        const cleanOfficialHtml = window.SafeMarkdown
          ? window.SafeMarkdown.sanitizeHtml(this.state.readmeData.htmlContent)
          : this.state.readmeData.htmlContent;
        return `<div class="markdown-body github-rendered-entry">${cleanOfficialHtml}</div>`;
      }

      // Priority 2: High-fidelity client-side Markdown rendering
      if (this.state.readmeData.content) {
        const renderedHtml = window.SafeMarkdown
          ? window.SafeMarkdown.render(this.state.readmeData.content)
          : `<pre>${this.escapeHtml(this.state.readmeData.content)}</pre>`;
        return `<div class="markdown-body">${renderedHtml}</div>`;
      }
    }

    return `<p>README content empty.</p>`;
  },

  renderExplorerGrid() {
    const area = this.container.querySelector('#projectsScrollArea');
    if (area) {
      area.innerHTML = this.renderExplorerBody();
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  escapeAttr(str) {
    return this.escapeHtml(str);
  }
};
