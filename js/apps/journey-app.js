/**
 * AYUSH.OS — Engineering Journey Application Module
 * Chronological timeline tracking academic excellence, competitive exam distinction,
 * university education at Vishwakarma University, and national hackathon podiums.
 * Styled with localhost:3000 retro design system, editorial typography, and milestone blocks.
 * 
 * Export: window.JourneyApp = { getContent(), init() }
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JourneyApp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getMilestoneColor(year) {
    if (year.includes('2023')) return '#ffd95a';
    if (year.includes('2024')) return '#f5a39c';
    if (year.includes('2025')) return '#a8d7e8';
    if (year.includes('2026')) return '#c7f36b';
    return '#b8a7e8';
  }

  function getContent() {
    const profile = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
    const journeyList = Array.isArray(profile.journey) ? profile.journey : [];

    const milestones = journeyList.map(step => {
      const year = escapeHtml(step.year || '');
      const phase = escapeHtml(step.phase || '');
      const title = escapeHtml(step.title || '');
      const tagline = escapeHtml(step.tagline || '');
      const institution = escapeHtml(step.institution || '');
      const metric = escapeHtml(step.metric || '');
      const desc = escapeHtml(step.description || '');
      const milestoneColor = getMilestoneColor(year);

      const highlights = Array.isArray(step.highlights) ? step.highlights : [];
      const highlightsHTML = highlights.length > 0 ? `
        <div class="journey-highlights-grid">
          ${highlights.map(h => `
            <div class="journey-highlight-chip">
              <span class="journey-hl-label">${escapeHtml(h.label)}</span>
              <strong class="journey-hl-val">${escapeHtml(h.value)}</strong>
            </div>
          `).join('')}
        </div>
      ` : '';

      const tags = Array.isArray(step.tags) ? step.tags : [];
      const tagsHTML = tags.length > 0 ? `
        <div class="journey-tags-row">
          ${tags.map(t => `<span class="journey-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      ` : '';

      return `
        <article class="journey-entry journey-item" style="--milestone:${milestoneColor}">
          <time class="journey-year-tag">${year}</time>
          <div class="journey-card">
            <div class="journey-card-topbar">
              ${phase ? `<span class="journey-phase-tag">${phase}</span>` : ''}
              ${metric ? `<span class="journey-metric-pill">${metric}</span>` : ''}
            </div>
            <h3 class="journey-title">${title}</h3>
            ${tagline ? `<div class="journey-tagline">${tagline}</div>` : ''}
            ${institution ? `<div class="journey-institution"><span class="journey-inst-icon">🏛️</span> ${institution}</div>` : ''}
            <p class="journey-desc">${desc}</p>
            ${highlightsHTML}
            ${tagsHTML}
            ${step.fileUrl ? `
              <div class="journey-evidence-actions" style="margin-top: 14px;">
                <button type="button" class="cert-inspect-btn" data-inspect-journey="${escapeHtml(step.id)}">
                  <span>🛡️ INSPECT OFFICIAL MARKSHEET / RECORD</span>
                </button>
              </div>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    return `
      <div class="journey-container app-content" data-journey-app>
        <span class="app-kicker">MY JOURNEY / PUBLIC CHRONOLOGY</span>
        <h2 class="app-heading">Built in chapters.<br><em>Still becoming.</em></h2>
        <p class="app-deck">
          An authentic progression grounded in academic rigor, quantified performance, and high-stakes engineering. From secondary education at Kroot Memorial School and higher secondary science distinction, through state competitive examination, to computer science and national hackathon podiums at Vishwakarma University (VU), Pune.
        </p>

        <div class="journey-scroll-area">
          <div class="journey-list journey-timeline">
            ${milestones}

            <article class="journey-entry journey-item horizon-item" style="--milestone:#b8a7e8">
              <time class="journey-year-tag horizon">NEXT</time>
              <div class="journey-card horizon-card">
                <div class="journey-card-topbar">
                  <span class="journey-phase-tag horizon">FRONTIER HORIZON // 2026+</span>
                  <span class="journey-metric-pill horizon">RESEARCH &amp; ADVANCED SYSTEMS</span>
                </div>
                <h3 class="journey-title">NEXT HORIZON // AUTONOMOUS INTELLIGENCE &amp; RESEARCH</h3>
                <div class="journey-tagline">Scaling agent architectures, edge-compute pipelines, and peer-reviewed ML preprints</div>
                <p class="journey-desc">
                  Expanding into autonomous agentic workflows, edge-compute computer vision pipelines, explainable model attribution, and academic research collaborations. Building systems that bridge foundational mathematics, deep learning inference, and industrial software delivery.
                </p>
                <div class="journey-tags-row">
                  <span class="journey-tag">Autonomous Agents</span>
                  <span class="journey-tag">Edge Vision</span>
                  <span class="journey-tag">Explainable AI</span>
                  <span class="journey-tag">Academic Research</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    `;
  }

  function init(container) {
    if (!container) return;
    const inspectBtns = container.querySelectorAll('[data-inspect-journey]');
    inspectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-inspect-journey');
        if (typeof window !== 'undefined' && window.EvidenceViewer) {
          window.EvidenceViewer.open(id, 'journey');
        }
      });
    });
  }

  return {
    getContent,
    init
  };
});
