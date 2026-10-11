/**
 * AYUSH.OS — Research & Publications Application Module
 * Formal tracking of lab experiments, literature reviews, datasets, and preprints.
 * Strictly distinguishes ongoing experimental research from published papers.
 * Styled with localhost:3000 retro design system & typography.
 * 
 * Export: window.ResearchApp = { getContent(), init() }
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ResearchApp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getResearch() {
    if (typeof window !== 'undefined' && window.ownerProfile && Array.isArray(window.ownerProfile.research)) {
      return window.ownerProfile.research;
    }
    return [];
  }

  function getContent() {
    const list = getResearch();

    return `
      <div class="research-container app-content" data-research-app>
        <span class="app-kicker">SCHOLARLY INQUIRY / LAB REPO</span>
        <h2 class="app-heading">Questions tested with<br><em>empirical code.</em></h2>
        <p class="app-deck">Formal tracking of active lab experiments, literature gaps, empirical datasets, and reproducible code — strictly separating active research from published manuscripts.</p>

        <div class="research-header-banner">
          <div class="research-title-group">
            <span class="research-lab-badge">🔬 FORMAL PEER-REVIEW TAXONOMY</span>
          </div>
          <div class="research-status-legend">
            <span class="res-status-tag wip">● WORK IN PROGRESS</span>
            <span class="res-status-tag submitted">● SUBMITTED</span>
            <span class="res-status-tag under-review">● UNDER REVIEW</span>
            <span class="res-status-tag preprint">● PREPRINT</span>
            <span class="res-status-tag published">● PUBLISHED</span>
          </div>
        </div>

        <div class="research-list-scroll">
          ${list.map(renderResearchCard).join('')}
        </div>
      </div>
    `;
  }

  function renderResearchCard(item) {
    const statusLabel = (item.status || 'WORK_IN_PROGRESS').replace(/_/g, ' ');

    return `
      <article class="research-card">
        <header class="res-card-header">
          <div class="res-card-badges">
            <span class="res-status-pill ${item.status.toLowerCase()}">${statusLabel}</span>
            <span class="res-focus-tag">${item.focusArea || 'AI / Systems'}</span>
          </div>
          <h3 class="res-card-title">${item.title}</h3>
        </header>

        <div class="res-card-grid">
          <div class="res-field-box">
            <span class="res-field-label">❓ RESEARCH QUESTION</span>
            <p class="res-field-text">${item.researchQuestion}</p>
          </div>

          <div class="res-field-box">
            <span class="res-field-label">🧪 METHODOLOGY &amp; EXPERIMENTAL DESIGN</span>
            <p class="res-field-text">${item.methodology}</p>
          </div>

          <div class="res-field-box">
            <span class="res-field-label">📊 DATASET &amp; TELEMETRY</span>
            <p class="res-field-text">${item.dataset || 'Empirical telemetry corpus'}</p>
          </div>

          ${item.metrics && item.metrics.length > 0 ? `
            <div class="res-field-box">
              <span class="res-field-label">⚡ VALIDATED EXPERIMENTAL METRICS</span>
              <div class="res-metrics-row">
                ${item.metrics.map(m => `
                  <div class="res-metric-item">
                    <small>${m.label}</small>
                    <strong>${m.value}</strong>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <footer class="res-card-footer">
          <span class="res-open-science-tag">🌐 OPEN SCIENCE // REPRODUCIBILITY GUARANTEE</span>
          ${item.reproducibilityUrl ? `
            <a href="${item.reproducibilityUrl}" target="_blank" rel="noopener noreferrer" class="res-code-link">
              <span>EXPLORE REPRODUCIBILITY CODEBASE ↗</span>
            </a>
          ` : ''}
        </footer>
      </article>
    `;
  }

  function init(container) {
    // Interactivity if needed
  }

  return {
    getContent,
    init
  };
});
