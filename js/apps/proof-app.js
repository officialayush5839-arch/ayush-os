/**
 * AYUSH.OS — Proof & Verification Application Module
 * Aggregates empirical engineering metrics, model validation scores, and architectural claims.
 * Reads canonical data from window.ownerProfile.projects.
 * 
 * Export: window.ProofApp = { getContent() }
 */

(function (root) {
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

  const ProofApp = {
    /**
     * Generates HTML markup for the Proof & Verification window.
     * @returns {string} HTML string
     */
    getContent: function () {
      const profile = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
      const projects = Array.isArray(profile.projects) ? profile.projects : [];
      const disclaimer = (profile.legal && profile.legal.metricDisclaimer) || 
        'Metrics derived from model evaluation benchmarks. All results are reproducible from public repositories.';

      // Collect all metrics across all projects
      const collectedMetrics = [];

      projects.forEach(project => {
        const projTitle = project.title || 'Project';
        if (Array.isArray(project.metrics) && project.metrics.length > 0) {
          project.metrics.forEach(m => {
            collectedMetrics.push({
              project: projTitle,
              value: m.value || '—',
              label: m.label || 'Metric',
              status: (m.status || project.status || 'declared').toLowerCase()
            });
          });
        } else {
          // If project has no metrics yet, represent its empirical verification status
          collectedMetrics.push({
            project: projTitle,
            value: 'N/A',
            label: `${projTitle} Benchmark`,
            status: 'not available'
          });
        }
      });

      // Render proof items grid
      const gridHtml = collectedMetrics.map(item => {
        const val = escapeHtml(item.value);
        const lbl = escapeHtml(`${item.project} · ${item.label}`);
        const statusKey = item.status === 'verified' ? 'verified' : (item.status === 'declared' ? 'declared' : 'not available');
        const statusText = statusKey.toUpperCase();

        let statusStyle = '';
        if (statusKey === 'verified') {
          statusStyle = 'background: rgba(16, 185, 129, 0.12); color: var(--success, #10b981); border: 1px solid rgba(16, 185, 129, 0.25);';
        } else if (statusKey === 'declared') {
          statusStyle = 'background: rgba(245, 158, 11, 0.12); color: var(--warning, #f59e0b); border: 1px solid rgba(245, 158, 11, 0.25);';
        } else {
          statusStyle = 'background: rgba(107, 114, 128, 0.15); color: #9ca3af; border: 1px solid rgba(107, 114, 128, 0.25);';
        }

        return `
          <div class="proof-item" onclick="if(window.SoundEngine) window.SoundEngine.click();">
            <div class="proof-value">${val}</div>
            <div class="proof-label">${lbl}</div>
            <span class="proof-status" style="${statusStyle}">${statusText}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="app-content">
          <div class="app-eyebrow">VERIFICATION // EMPIRICAL PROOF</div>
          <h2>System <em>Metrics</em> & Results</h2>
          <p style="margin-bottom: 16px;">
            Evidence over hype. Every metric reported across all software systems is categorized by empirical audit status to ensure full transparency and reproducible benchmarks.
          </p>

          <!-- Proof Metrics Grid -->
          <div class="proof-grid">
            ${gridHtml}
          </div>

          <!-- Status Classification Legend -->
          <div class="proof-legend">
            <h3>Metric Verification Standards</h3>
            
            <div class="proof-legend-item">
              <span class="proof-legend-dot" style="background: var(--success, #10b981);"></span>
              <span><strong>VERIFIED</strong> — Empirically measured via reproducible automated benchmarks, cross-validation runs, and public git repositories.</span>
            </div>

            <div class="proof-legend-item">
              <span class="proof-legend-dot" style="background: var(--warning, #f59e0b);"></span>
              <span><strong>DECLARED</strong> — Field telemetry or target architecture specifications reported in system design blueprints.</span>
            </div>

            <div class="proof-legend-item">
              <span class="proof-legend-dot" style="background: #9ca3af;"></span>
              <span><strong>NOT AVAILABLE</strong> — System is under active local hardware testing or pending public benchmark release.</span>
            </div>

            <p style="font-family: var(--font-mono); font-size: 0.6875rem; color: var(--text-tertiary); margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--border); line-height: 1.5;">
              <span style="color: var(--accent); font-weight: 600;">AUDIT NOTE:</span> ${escapeHtml(disclaimer)}
            </p>
          </div>
        </div>
      `;
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.ProofApp = ProofApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProofApp;
  }
})(typeof window !== 'undefined' ? window : this);
