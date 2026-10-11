/**
 * AYUSH.OS — Systems Architecture Application Module
 * Interactive pipeline map illustrating end-to-end data flow:
 * DATA → PROCESSING → MODEL → API → INTERFACE
 * 
 * Export: window.SystemsApp = { getContent() }
 */

(function (root) {
  'use strict';

  // Architectural node definitions with deep technical breakdowns
  const SYSTEM_NODES = [
    {
      num: '01',
      label: 'DATA',
      title: '01 // DATA LAYER: Ingestion & Telemetry Pipelines',
      description: 'Real-time telemetry ingestion from multi-sensor arrays, edge IoT weather stations (SkyGuard AWS), industrial pump controllers (Wilo), and streaming video feeds. Implements robust timestamp synchronization, data deduplication, and fault-tolerant local logging before batch or streaming dispatch.',
      specs: 'MQTT / HTTP Webhooks / RTSP Camera Feeds / Time-Series Sensors / SQLite Buffer'
    },
    {
      num: '02',
      label: 'PROCESSING',
      title: '02 // PROCESSING LAYER: Tensor Normalization & Feature Pipeline',
      description: 'High-throughput data sanitization and feature transformation engine. Performs NLP subword tokenization, vocabulary mapping, image spatial normalization, bounding box augmentation, and outlier filtering to construct zero-leakage training sets and low-latency inference tensors.',
      specs: 'NumPy / PyTorch Tensor Transforms / OpenCV Vector Processing / Scikit-learn Scalers'
    },
    {
      num: '03',
      label: 'MODEL',
      title: '03 // MODEL LAYER: Neural Networks & Predictive Inference',
      description: 'Domain-specialized machine learning backbones: explainable PyTorch emotion classifiers with token-drop attribution (INTELLIEMO), real-time YOLO object detectors for parking slot localization (<100ms), and multivariate time-series statistical anomaly detection.',
      specs: 'PyTorch / YOLOv8 / Custom Explainable Attribution / Statistical Anomaly Detectors'
    },
    {
      num: '04',
      label: 'API',
      title: '04 // API LAYER: Asynchronous Microservices & Orchestration',
      description: 'Production-ready asynchronous REST and WebSocket microservices built on FastAPI and Node.js. Provides secure authentication, predictive endpoint routing, model caching, concurrency control, and live streaming metrics back to user clients.',
      specs: 'FastAPI / Python AsyncIO / Node.js REST / Docker Containerization / Pydantic Contracts'
    },
    {
      num: '05',
      label: 'INTERFACE',
      title: '05 // INTERFACE LAYER: Spatial Desktop & Real-time Visualization',
      description: 'Reactive client interfaces and spatial operating systems (AYUSH.OS). Renders WebGL Three.js interactive 3D particle galaxies, Web Audio API procedural synthesis engines, responsive window managers, and dynamic diagnostic charts for telemetry analytics.',
      specs: 'Three.js / WebGL / Web Audio API / CSS3 Glassmorphism / Pure Vanilla ES6+'
    }
  ];

  const SystemsApp = {
    /**
     * Stored node data for dynamic interaction.
     */
    nodes: SYSTEM_NODES,

    /**
     * Updates the active node and replaces detail section content.
     * @param {number} index 
     * @param {HTMLElement} [element]
     */
    selectNode: function (index, element) {
      if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
        window.SoundEngine.click();
      }

      const nodeData = SYSTEM_NODES[index];
      if (!nodeData) return;

      // Find the closest systems container or search the document
      let container = null;
      if (element && element.closest) {
        container = element.closest('.app-content') || element.closest('.systems-map-wrapper');
      }
      if (!container) {
        container = document;
      }

      // Update active class on all nodes in this container
      const allNodes = container.querySelectorAll('.system-node');
      allNodes.forEach((node, idx) => {
        if (idx === index) {
          node.classList.add('active');
          node.setAttribute('aria-selected', 'true');
        } else {
          node.classList.remove('active');
          node.setAttribute('aria-selected', 'false');
        }
      });

      // Update detail div
      const detailTitle = container.querySelector('.system-detail-title');
      const detailDesc = container.querySelector('.system-detail-desc');
      const detailSpecs = container.querySelector('.system-detail-specs');

      if (detailTitle) detailTitle.textContent = nodeData.title;
      if (detailDesc) detailDesc.textContent = nodeData.description;
      if (detailSpecs) detailSpecs.textContent = nodeData.specs;
    },

    /**
     * Returns HTML string for the interactive systems architecture map.
     * @returns {string} HTML markup
     */
    getContent: function () {
      const defaultNode = SYSTEM_NODES[0];

      // Build 5 nodes with connectors between them
      let nodesHtml = '';
      SYSTEM_NODES.forEach((node, index) => {
        const isActive = index === 0;
        nodesHtml += `
          <div class="system-node ${isActive ? 'active' : ''}" 
               role="button" 
               tabindex="0" 
               aria-selected="${isActive ? 'true' : 'false'}"
               onclick="window.SystemsApp.selectNode(${index}, this);"
               onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.SystemsApp.selectNode(${index}, this); }">
            <span class="node-num">${node.num}</span>
            <span class="node-label">${node.label}</span>
          </div>
        `;

        // Add connector between nodes, but not after the last node
        if (index < SYSTEM_NODES.length - 1) {
          nodesHtml += `<div class="system-connector" aria-hidden="true"></div>`;
        }
      });

      return `
        <div class="app-content systems-map-wrapper">
          <div class="app-eyebrow">SYSTEMS ARCHITECTURE // DATA FLOW</div>
          <h2>End-to-End <em>Pipelines</em></h2>
          <p style="margin-bottom: 16px;">
            Every production system built in AYUSH.OS follows a verified multi-tiered architecture from raw hardware telemetry to high-performance client rendering. Click any pipeline phase to examine technical specifications.
          </p>

          <!-- Interactive Node Pipeline -->
          <div class="systems-map" role="region" aria-label="System Architecture Pipeline">
            ${nodesHtml}
          </div>

          <!-- Dynamic Specification Detail Box -->
          <div class="system-detail" id="systemDetail" aria-live="polite">
            <h3 class="system-detail-title">${defaultNode.title}</h3>
            <p class="system-detail-desc" style="margin-bottom: 12px;">${defaultNode.description}</p>
            <div style="display: flex; align-items: baseline; gap: 8px; font-family: var(--font-mono); font-size: 0.6875rem; border-top: 1px solid var(--border); padding-top: 10px;">
              <span style="color: var(--accent); font-weight: 700; text-transform: uppercase;">Stack / Protocols:</span>
              <span class="system-detail-specs" style="color: var(--text-secondary);">${defaultNode.specs}</span>
            </div>
          </div>
        </div>
      `;
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.SystemsApp = SystemsApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SystemsApp;
  }
})(typeof window !== 'undefined' ? window : this);
