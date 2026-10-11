/**
 * AYUSH.OS — Projects Application Module
 * Displays an interactive catalog of engineering projects, architecture specs, and live repos.
 * Reads canonical data from window.ownerProfile.projects.
 * 
 * Export: window.ProjectsApp = { getContent() }
 */

(function (root) {
  'use strict';

  /**
   * Safe HTML escaping helper to prevent script injection.
   * @param {string} str 
   * @returns {string}
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const ProjectsApp = {
    /**
     * Generates HTML markup for the Projects window.
     * @returns {string} HTML string
     */
    getContent: function () {
      const profile = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
      const projects = Array.isArray(profile.projects) ? profile.projects : [];

      let cardsHtml = '';

      if (projects.length === 0) {
        cardsHtml = `
          <div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 0.8125rem;">
            No project records loaded. Verify that js/data.js is properly initialized.
          </div>
        `;
      } else {
        cardsHtml = projects.map(proj => {
          const title = escapeHtml(proj.title || 'Untitled Project');
          const category = escapeHtml(proj.category || 'System');
          const tagline = escapeHtml(proj.tagline || '');
          const description = escapeHtml(proj.description || '');
          const repoUrl = escapeHtml(proj.repo || '#');
          const statusRaw = (proj.status || 'declared').toLowerCase();
          const statusClass = statusRaw === 'verified' ? 'verified' : 'declared';
          const statusText = statusRaw.toUpperCase();

          // Render tech tags
          const techList = Array.isArray(proj.tech) ? proj.tech : [];
          const techHtml = techList.map(tag => 
            `<span class="tech-tag">${escapeHtml(tag)}</span>`
          ).join('');

          // Render metrics
          const metricsList = Array.isArray(proj.metrics) ? proj.metrics : [];
          let metricsHtml = '';
          if (metricsList.length > 0) {
            metricsHtml = metricsList.map(m => `
              <div class="metric">
                <span class="metric-value">${escapeHtml(m.value)}</span>
                <span class="metric-label">${escapeHtml(m.label)}</span>
              </div>
            `).join('');
          }

          return `
            <article class="project-card" data-project-id="${escapeHtml(proj.id || '')}" onclick="if(window.SoundEngine) window.SoundEngine.click();">
              <header class="card-header">
                <h3 class="card-title">${title}</h3>
                <span class="card-cat">${category}</span>
              </header>

              ${tagline ? `<div style="font-family: var(--font-mono); font-size: 0.6875rem; color: var(--accent); margin-bottom: 8px; opacity: 0.9;">${tagline}</div>` : ''}

              <p class="card-desc">${description}</p>

              ${techHtml ? `<div class="card-tech">${techHtml}</div>` : ''}

              ${metricsHtml ? `<div class="card-metrics">${metricsHtml}</div>` : ''}

              <footer class="card-footer">
                <a class="card-link" href="${repoUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation(); if(window.SoundEngine) window.SoundEngine.click();">
                  <span>View Repository</span>
                  <span aria-hidden="true" style="font-size: 0.75rem;">↗</span>
                </a>
                <span class="card-status ${statusClass}">${statusText}</span>
              </footer>
            </article>
          `;
        }).join('');
      }

      return `
        <div class="app-content">
          <div class="app-eyebrow">PORTFOLIO // CANONICAL SYSTEMS</div>
          <h2>Production <em>Projects</em></h2>
          <p style="margin-bottom: 20px;">
            Production-oriented AI models, high-throughput systems, computer vision engines, and IoT infrastructure. All code repositories and empirical metrics are public.
          </p>

          <div class="projects-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.ProjectsApp = ProjectsApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsApp;
  }
})(typeof window !== 'undefined' ? window : this);
