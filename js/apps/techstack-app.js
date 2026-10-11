/**
 * AYUSH.OS — Tech Stack & Systems Application Module
 * Visualizes authentic production competencies, architectural pipeline,
 * and tech proficiencies with zero arbitrary percentage meters.
 * Styled with localhost:3000 retro design system & typography.
 * 
 * Export: window.TechStackApp = { getContent(), init() }
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TechStackApp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getTechStack() {
    if (typeof window !== 'undefined' && window.ownerProfile && window.ownerProfile.techStack) {
      return window.ownerProfile.techStack;
    }
    return { production: [], proficient: [], familiar: [] };
  }

  function getContent() {
    const stack = getTechStack();

    return `
      <div class="techstack-container app-content" data-techstack-app>
        <span class="app-kicker">SYSTEMS &amp; PRODUCTION RADAR</span>
        <h2 class="app-heading">Engineered for<br><em>high throughput.</em></h2>
        <p class="app-deck">Categorized strictly by verified engineering competency and deployed codebases — zero arbitrary percentage meters.</p>

        <div class="techstack-header-bar">
          <div class="techstack-summary">
            <span class="tech-radar-label">⚡ FILTER BY TIER</span>
          </div>
          <div class="techstack-view-tabs">
            <button type="button" class="tech-tab-btn is-active" data-tech-view="all">ALL TIERS</button>
            <button type="button" class="tech-tab-btn" data-tech-view="production">CORE (${stack.production.length})</button>
            <button type="button" class="tech-tab-btn" data-tech-view="proficient">ACTIVE (${stack.proficient.length})</button>
            <button type="button" class="tech-tab-btn" data-tech-view="familiar">FAMILIAR (${stack.familiar.length})</button>
            <button type="button" class="tech-tab-btn" data-tech-view="architecture">ARCHITECTURE MAP</button>
          </div>
        </div>

        <div class="techstack-content-scroll">
          <section class="techstack-pipeline-box" data-tech-section="architecture">
            <div class="pipeline-header">
              <span class="pipeline-badge">⚡ PRODUCTION PIPELINE</span>
              <h4>HOW AYUSH'S AI SYSTEMS SHIP: END-TO-END DATA &amp; INFERENCE ARCHITECTURE</h4>
            </div>
            <div class="systems-pipeline">
              <div class="pipeline-node is-active" data-node="ingestion">
                <span class="node-icon">📡</span>
                <strong>INGESTION</strong>
                <small>Sensor Telemetry / REST</small>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-node" data-node="preprocessing">
                <span class="node-icon">🔄</span>
                <strong>PREPROCESSING</strong>
                <small>Sliding Window / NumPy</small>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-node" data-node="model">
                <span class="node-icon">🧠</span>
                <strong>MODEL INFERENCE</strong>
                <small>PyTorch / YOLO / OpenCV</small>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-node" data-node="api">
                <span class="node-icon">⚡</span>
                <strong>FASTAPI SERVICE</strong>
                <small>Async Endpoints &lt;100ms</small>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-node" data-node="ui">
                <span class="node-icon">🖥️</span>
                <strong>AYUSH.OS SHELL</strong>
                <small>Interactive Presentation</small>
              </div>
            </div>
            <div class="pipeline-detail-panel" data-pipeline-detail>
              <div class="detail-tag">ACTIVE ARCHITECTURE NODE: INGESTION</div>
              <p>Captures real-time raw streams: automatic weather station telemetry (SkyGuard), text tokens (INTELLIEMO), or high-FPS video feeds (Parking Assist) with strict input validation.</p>
            </div>
          </section>

          <section class="techstack-tier-section" data-tech-section="production">
            <div class="tier-title-row">
              <span class="tier-badge core">TIER 1</span>
              <h4>CORE / PRODUCTION-READY</h4>
              <small>Technologies used in fully-tested production architectures and deployed systems.</small>
            </div>
            <div class="techstack-grid">
              ${stack.production.map(t => renderToolCard(t, 'production')).join('')}
            </div>
          </section>

          <section class="techstack-tier-section" data-tech-section="proficient">
            <div class="tier-title-row">
              <span class="tier-badge active">TIER 2</span>
              <h4>PROFICIENT / ACTIVELY BUILDING</h4>
              <small>Technologies applied daily in active repositories and frontend/backend modules.</small>
            </div>
            <div class="techstack-grid">
              ${stack.proficient.map(t => renderToolCard(t, 'proficient')).join('')}
            </div>
          </section>

          <section class="techstack-tier-section" data-tech-section="familiar">
            <div class="tier-title-row">
              <span class="tier-badge exploring">TIER 3</span>
              <h4>FAMILIAR / EXPLORING</h4>
              <small>Technologies utilized in academic labs, experimental scripts, and cloud configurations.</small>
            </div>
            <div class="techstack-grid">
              ${stack.familiar.map(t => renderToolCard(t, 'familiar')).join('')}
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderToolCard(tool, tier) {
    return `
      <div class="tool-card tier-${tier}">
        <div class="tool-card-top">
          <strong class="tool-name">${tool.name}</strong>
          <span class="tool-category">${tool.category}</span>
        </div>
        <p class="tool-desc">${tool.description}</p>
        <div class="tool-card-footer">
          <span class="tool-verified-tag">✓ VERIFIED IN PRODUCTION</span>
        </div>
      </div>
    `;
  }

  function init(container) {
    if (!container) return;

    // View tabs
    const tabs = container.querySelectorAll('[data-tech-view]');
    const sections = container.querySelectorAll('[data-tech-section]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const view = tab.getAttribute('data-tech-view');
        sections.forEach(sec => {
          if (view === 'all') {
            sec.style.display = '';
          } else if (sec.getAttribute('data-tech-section') === view) {
            sec.style.display = '';
          } else {
            sec.style.display = 'none';
          }
        });
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
      });
    });

    // Pipeline nodes
    const nodeDetails = {
      ingestion: {
        tag: 'INGESTION',
        desc: 'Captures raw streams: automatic weather station telemetry (SkyGuard), text tokens (INTELLIEMO), or camera frames (Parking Assist) with strict schema validation.'
      },
      preprocessing: {
        tag: 'PREPROCESSING',
        desc: 'NumPy/Pandas feature vectors, sliding-window statistical normalization, token attribution masking, and OpenCV frame resizing.'
      },
      model: {
        tag: 'MODEL INFERENCE',
        desc: 'Deep learning neural models trained with PyTorch, OpenCV computer vision pipelines, and YOLO object detection models operating at edge speeds.'
      },
      api: {
        tag: 'FASTAPI SERVICE',
        desc: 'Asynchronous microservice endpoints handling authenticated requests with sub-100ms response latencies and full JSON schema guarantees.'
      },
      ui: {
        tag: 'AYUSH.OS SHELL',
        desc: 'Interactive presentation layer: window management, real-time dashboards, charts, and transparent metric proof.'
      }
    };

    const nodes = container.querySelectorAll('.pipeline-node');
    const detailPanel = container.querySelector('[data-pipeline-detail]');

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        nodes.forEach(n => n.classList.remove('is-active'));
        node.classList.add('is-active');
        const key = node.getAttribute('data-node');
        const detail = nodeDetails[key];
        if (detail && detailPanel) {
          detailPanel.innerHTML = `
            <div class="detail-tag">ACTIVE ARCHITECTURE NODE: ${detail.tag}</div>
            <p>${detail.desc}</p>
          `;
        }
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
      });
    });
  }

  return {
    getContent,
    init
  };
});
