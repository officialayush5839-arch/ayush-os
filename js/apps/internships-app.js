/**
 * AYUSH.OS - INTERNSHIPS.EXE (CAREER FILE SYSTEM)
 * Document-Driven, Evidence-Backed Career Archive Controller
 */
window.InternshipsApp = {
  container: null,
  state: {
    view: 'cards', // 'cards' | 'timeline' | 'detail'
    filter: 'all', // 'all' | 'completed' | 'current'
    internships: [],
    activeInternship: null,
    viewerDoc: null,
    zoomLevel: 1,
    isRedactedView: true,
    loading: true,
    error: null,
    showIngestModal: false,
    ingestStatus: null
  },

  async init(container) {
    if (!container) return;
    this.container = container;
    this.bindEvents();
    await this.fetchInternships();
  },

  async fetchInternships() {
    this.state.loading = true;
    this.state.error = null;
    this.render();

    try {
      const res = await fetch('/api/internships');
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load career files.`);
      const data = await res.json();
      this.state.internships = data.internships || [];
      this.state.loading = false;
      this.render();
    } catch (err) {
      console.error('[InternshipsApp] Error:', err);
      this.state.loading = false;
      this.state.error = err.message || 'Unable to connect to Career File System.';
      this.render();
    }
  },

  async openDetail(id) {
    this.state.loading = true;
    this.render();

    try {
      const res = await fetch(`/api/internships/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Could not retrieve career file detail.');
      const data = await res.json();
      this.state.activeInternship = data.internship;
      this.state.view = 'detail';
      this.state.loading = false;
      this.render();
    } catch (err) {
      this.state.loading = false;
      this.state.error = err.message;
      this.render();
    }
  },

  openDocViewer(docId) {
    if (!this.state.activeInternship) return;
    const doc = (this.state.activeInternship.documents || []).find(d => d.id === docId);
    if (!doc) return;

    this.state.viewerDoc = doc;
    this.state.zoomLevel = 1;
    this.state.isRedactedView = doc.privacyMode === 'REDACTED_PUBLIC';
    this.render();
  },

  closeDocViewer() {
    this.state.viewerDoc = null;
    this.state.zoomLevel = 1;
    this.render();
  },

  bindEvents() {
    // 1. Delegated listener directly on the current container instance
    if (this.container) {
      this.container.onclick = (e) => this.handleActionClick(e);
    }

    // 2. Persistent global document listener so clicks NEVER fail even across window re-renders
    if (this._globalBound) return;
    this._globalBound = true;

    document.addEventListener('click', (e) => this.handleActionClick(e));
    document.addEventListener('change', async (e) => {
      if (e.target.id === 'internshipFileInput') {
        const file = e.target.files[0];
        if (!file) return;

        this.state.ingestStatus = `Reading ${file.name} and calculating SHA-256...`;
        this.render();

        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const base64Data = evt.target.result;
            const res = await fetch('/api/internships/ingest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: file.name,
                base64Data,
                mimeType: file.type
              })
            });

            const result = await res.json();
            if (res.status === 409) {
              this.state.ingestStatus = `⚠️ DUPLICATE DETECTED: Document hash already registered. (Doc ID: ${result.existingDocumentId})`;
            } else if (!res.ok) {
              this.state.ingestStatus = `❌ Ingestion failed: ${result.message || 'Error'}`;
            } else {
              this.state.ingestStatus = `✓ Document ingested! SHA-256: ${result.document.fileHash.slice(0, 16)}... Status: ${result.document.extractionStatus}`;
              await this.fetchInternships();
            }
            this.render();
          } catch (err) {
            this.state.ingestStatus = `❌ Ingestion error: ${err.message}`;
            this.render();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  },

  handleActionClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    // Check that target belongs to an internships container
    const appEl = target.closest('[data-internships-app]') || target.closest('.internships-app-container') || target.closest('.doc-viewer-backdrop');
    if (!appEl && !this.container) return;

    e.preventDefault();
    e.stopPropagation();

    const action = target.dataset.action;

    if (action === 'set-view') {
      this.state.view = target.dataset.view;
      this.render();
    } else if (action === 'set-filter') {
      this.state.filter = target.dataset.filter;
      this.render();
    } else if (action === 'open-detail') {
      const id = target.dataset.id;
      this.openDetail(id);
    } else if (action === 'back-to-archive') {
      this.state.view = 'cards';
      this.state.activeInternship = null;
      this.render();
    } else if (action === 'close-internship-app') {
      const win = (this.container || target).closest('.os-window');
      if (win) {
        const closeBtn = win.querySelector('.window-control.close') || win.querySelector('.close');
        if (closeBtn) closeBtn.click();
      }
    } else if (action === 'open-doc') {
      const docId = target.dataset.docId;
      this.openDocViewer(docId);
    } else if (action === 'close-doc') {
      this.closeDocViewer();
    } else if (action === 'zoom-in') {
      this.state.zoomLevel = Math.min(this.state.zoomLevel + 0.25, 2.5);
      this.updateZoom();
    } else if (action === 'zoom-out') {
      this.state.zoomLevel = Math.max(this.state.zoomLevel - 0.25, 0.5);
      this.updateZoom();
    } else if (action === 'zoom-reset') {
      this.state.zoomLevel = 1;
      this.updateZoom();
    } else if (action === 'toggle-redaction') {
      this.state.isRedactedView = !this.state.isRedactedView;
      this.render();
    } else if (action === 'open-ingest-modal') {
      this.state.showIngestModal = true;
      this.state.ingestStatus = null;
      this.render();
    } else if (action === 'close-ingest-modal') {
      this.state.showIngestModal = false;
      this.render();
    }
  },

  updateZoom() {
    const img = this.container.querySelector('#docViewerImage');
    const zoomText = this.container.querySelector('#zoomPercentage');
    if (img) {
      img.style.transform = `scale(${this.state.zoomLevel})`;
    }
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.state.zoomLevel * 100)}%`;
    }
  },

  getFilteredInternships() {
    let list = this.state.internships;
    if (this.state.filter === 'completed') {
      list = list.filter(i => i.status === 'COMPLETED');
    } else if (this.state.filter === 'current') {
      list = list.filter(i => i.status === 'CURRENT');
    }
    return list;
  },

  render() {
    if (!this.container) return;

    if (this.state.loading) {
      this.container.innerHTML = `
        <div class="projects-loading-state" style="padding: 60px;">
          <div class="projects-loading-icon">💼</div>
          <div class="projects-loading-title">INTERNSHIPS.EXE — LOADING CAREER ARCHIVES</div>
          <div class="projects-loading-sub">Connecting to verified document repository...</div>
          <div class="projects-progress-track"><div class="projects-progress-fill"></div></div>
        </div>
      `;
      return;
    }

    if (this.state.error) {
      this.container.innerHTML = `
        <div class="projects-error-box" style="margin: 40px auto; max-width: 500px;">
          <h4>CAREER ARCHIVE ERROR</h4>
          <p>${this.escapeHtml(this.state.error)}</p>
          <button class="internships-action-btn" data-action="back-to-archive" type="button">[ RETRY ]</button>
        </div>
      `;
      return;
    }

    let mainContent = '';
    if (this.state.view === 'detail' && this.state.activeInternship) {
      mainContent = this.renderDetailView();
    } else if (this.state.view === 'timeline') {
      mainContent = this.renderTimelineView();
    } else {
      mainContent = this.renderCardsView();
    }

    this.container.innerHTML = `
      <div class="internships-app-container">
        ${this.state.view !== 'detail' ? this.renderToolbar() : ''}
        <div class="internships-scroll-area">
          ${mainContent}
        </div>
        ${this.state.viewerDoc ? this.renderDocViewerModal() : ''}
        ${this.state.showIngestModal ? this.renderIngestModal() : ''}
      </div>
    `;
  },

  renderToolbar() {
    return `
      <header class="internships-toolbar">
        <div class="internships-toolbar-left">
          <span class="internships-brand-badge">
            <i class="pulse-dot"></i> INTERNSHIPS.EXE
          </span>

          <div class="internships-filter-group">
            <button class="internships-chip ${this.state.filter === 'all' ? 'active' : ''}" data-action="set-filter" data-filter="all" type="button">ALL (${this.state.internships.length})</button>
            <button class="internships-chip ${this.state.filter === 'completed' ? 'active' : ''}" data-action="set-filter" data-filter="completed" type="button">COMPLETED</button>
            <button class="internships-chip ${this.state.filter === 'current' ? 'active' : ''}" data-action="set-filter" data-filter="current" type="button">CURRENT</button>
          </div>
        </div>

        <div class="internships-toolbar-right">
          <button class="internships-view-btn ${this.state.view === 'cards' ? 'active' : ''}" data-action="set-view" data-view="cards" type="button">
            ⊞ CARDS
          </button>
          <button class="internships-view-btn ${this.state.view === 'timeline' ? 'active' : ''}" data-action="set-view" data-view="timeline" type="button">
            ⏱ TIMELINE
          </button>
          <button class="internships-action-btn" data-action="open-ingest-modal" type="button">
            + INGEST DOCUMENT
          </button>
        </div>
      </header>
    `;
  },

  renderCardsView() {
    const list = this.getFilteredInternships();

    if (list.length === 0) {
      return `
        <div class="projects-empty-box" style="margin: 40px auto; max-width: 400px; text-align: center;">
          <h4>NO CAREER FILES MATCH</h4>
          <p>No verified internship records match the active filter criteria.</p>
          <button class="internships-chip" data-action="set-filter" data-filter="all" type="button">[ RESET FILTER ]</button>
        </div>
      `;
    }

    return `
      <div class="internships-cards-grid">
        ${list.map(item => this.renderCard(item)).join('')}
      </div>
    `;
  },

  renderCard(item) {
    const isCompleted = item.status === 'COMPLETED';
    const statusClass = isCompleted ? 'completed' : 'current';
    const statusLabel = isCompleted ? '✓ COMPLETED' : '● CURRENT';
    const emblem = item.company.substring(0, 2).toUpperCase();

    return `
      <article class="internship-card" data-action="open-detail" data-id="${this.escapeAttr(item.id)}" tabindex="0" role="button" aria-label="Open internship file for ${this.escapeAttr(item.company)}">
        <div>
          <div class="internship-card-header">
            <div class="company-badge-emblem">${emblem}</div>
            <span class="internship-status-pill ${statusClass}">${statusLabel}</span>
          </div>

          <h3 class="internship-card-company">${this.escapeHtml(item.company)}</h3>
          <div class="internship-card-role">${this.escapeHtml(item.role)}</div>

          <div class="internship-card-meta">
            <div class="meta-row">
              <span class="meta-label">Dates:</span>
              <span class="meta-val">${this.escapeHtml(item.startDate)} → ${this.escapeHtml(item.endDate)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Duration:</span>
              <span class="meta-val">${this.escapeHtml(item.officialDuration || item.calendarDuration)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Work Mode:</span>
              <span class="meta-val">${this.escapeHtml(item.workMode || 'Remote')}</span>
            </div>
          </div>
        </div>

        <div class="internship-card-footer">
          <span class="docs-count-tag">
            📄 ${item.documentCount} ${item.documentCount === 1 ? 'Official Doc' : 'Official Docs'}
          </span>
          <span class="open-file-hint">OPEN CAREER FILE ↘</span>
        </div>
      </article>
    `;
  },

  renderTimelineView() {
    const list = [...this.state.internships].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    return `
      <div class="internships-timeline-container">
        <div class="timeline-line"></div>
        ${list.map(item => {
          const isCompleted = item.status === 'COMPLETED';
          const nodeClass = isCompleted ? 'completed' : 'current';
          return `
            <div class="timeline-node ${nodeClass}">
              <div class="timeline-node-dot"></div>
              <div class="timeline-card" data-action="open-detail" data-id="${this.escapeAttr(item.id)}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="font-size: 13px;">${this.escapeHtml(item.company)}</strong>
                  <span class="internship-status-pill ${nodeClass}" style="font-size: 8px;">${item.status}</span>
                </div>
                <div style="color: var(--wine, #851c3d); font-weight: 700; font-size: 11px; margin-bottom: 4px;">
                  ${this.escapeHtml(item.role)}
                </div>
                <div style="color: #6b7280; font-size: 10px;">
                  ${this.escapeHtml(item.startDate)} → ${this.escapeHtml(item.endDate)} (${this.escapeHtml(item.officialDuration)})
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderDetailView() {
    const item = this.state.activeInternship;
    const isCompleted = item.status === 'COMPLETED';
    const statusClass = isCompleted ? 'completed' : 'current';
    const statusLabel = isCompleted ? '✓ COMPLETED' : '● CURRENT';

    return `
      <div class="internship-detail-view">
        <!-- Breadcrumb Navigation -->
        <div class="detail-nav-bar">
          <div class="detail-breadcrumb">
            <button class="bc-back-btn" data-action="back-to-archive" type="button">← CAREER ARCHIVE</button>
            <span style="color: #9ca3af;">/</span>
            <span>${this.escapeHtml(item.company)}</span>
            <span style="color: #9ca3af;">/</span>
            <span style="color: var(--wine, #851c3d);">CAREER_FILE.EXE</span>
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="internships-chip" data-action="back-to-archive" type="button">[ ← BACK TO ARCHIVE ]</button>
            <button class="internships-chip" data-action="close-internship-app" type="button">[ ✕ CLOSE WINDOW ]</button>
          </div>
        </div>

        <!-- Header Banner -->
        <header class="detail-header-banner">
          <div class="detail-title-group">
            <h2>${this.escapeHtml(item.company)}</h2>
            <div class="role-tag">${this.escapeHtml(item.role)}</div>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; align-items: center;">
              <span class="internship-status-pill ${statusClass}">${statusLabel}</span>
              ${item.officialDuration ? `<span class="internships-chip" style="cursor: default;">Duration: ${this.escapeHtml(item.officialDuration)}</span>` : ''}
              ${item.location ? `<span class="internships-chip" style="cursor: default;">📍 ${this.escapeHtml(item.location)}</span>` : ''}
            </div>
          </div>

          <div class="detail-header-actions">
            ${item.website ? `
              <a class="internships-action-btn" href="${this.escapeAttr(item.website)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                ↗ OFFICIAL WEBSITE
              </a>
            ` : ''}
            ${item.associatedProject ? `
              <a class="internships-action-btn" href="${this.escapeAttr(item.associatedProject.repo)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; background: #0284c7;">
                📂 ASSOCIATED REPO
              </a>
            ` : ''}
          </div>
        </header>

        <!-- Main Detail Scroll Body -->
        <div class="detail-body-scroll">
          <!-- Overview Facts Grid -->
          <section class="detail-section">
            <div class="detail-section-title">VERIFIED CAREER METADATA</div>
            <div class="detail-facts-grid">
              <div class="fact-box">
                <div class="fact-box-label">Official Role</div>
                <div class="fact-box-value">${this.escapeHtml(item.role)}</div>
              </div>
              <div class="fact-box">
                <div class="fact-box-label">Organization</div>
                <div class="fact-box-value">${this.escapeHtml(item.officialOrganization || item.company)}</div>
              </div>
              <div class="fact-box">
                <div class="fact-box-label">Date Range</div>
                <div class="fact-box-value">${this.escapeHtml(item.startDate)} → ${this.escapeHtml(item.endDate)}</div>
              </div>
              <div class="fact-box">
                <div class="fact-box-label">Official Duration</div>
                <div class="fact-box-value">${this.escapeHtml(item.officialDuration || 'Not specified')}</div>
              </div>
              <div class="fact-box">
                <div class="fact-box-label">Work Mode</div>
                <div class="fact-box-value">${this.escapeHtml(item.workMode || 'Remote')}</div>
              </div>
              <div class="fact-box">
                <div class="fact-box-label">Signatory / Authority</div>
                <div class="fact-box-value">${this.escapeHtml(item.signatory || 'Not specified')}</div>
              </div>
            </div>
          </section>

          <!-- Responsibilities (Verified from docs) -->
          ${item.responsibilities && item.responsibilities.length > 0 ? `
            <section class="detail-section">
              <div class="detail-section-title">DOCUMENT-VERIFIED RESPONSIBILITIES</div>
              <ul class="responsibilities-list">
                ${item.responsibilities.map(r => `<li>${this.escapeHtml(r)}</li>`).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- Technologies -->
          ${item.technologies && item.technologies.length > 0 ? `
            <section class="detail-section">
              <div class="detail-section-title">VERIFIED TECHNICAL DOMAIN</div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${item.technologies.map(t => `<span class="internships-chip" style="cursor: default;">${this.escapeHtml(t)}</span>`).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Evidence Traceability Matrix -->
          <section class="detail-section">
            <div class="detail-section-title">EVIDENCE TRACEABILITY MATRIX (ZERO FABRICATION)</div>
            <div class="evidence-table-wrap">
              <table class="evidence-table">
                <thead>
                  <tr>
                    <th>Fact / Property</th>
                    <th>Extracted Value</th>
                    <th>Source Document</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  ${(item.evidenceTrace || []).map(trace => `
                    <tr>
                      <td style="font-weight: 700;">${this.escapeHtml(trace.fact)}</td>
                      <td>${this.escapeHtml(trace.value)}</td>
                      <td style="font-family: monospace; color: #4b5563;">${this.escapeHtml(trace.sourceDoc)} (p. ${trace.page || 1})</td>
                      <td>
                        <span class="evidence-level-badge ${trace.level === 'VERIFIED' ? 'verified' : 'derived'}">
                          ${this.escapeHtml(trace.level)}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>

          <!-- Documents Drawer -->
          <section class="detail-section">
            <div class="detail-section-title">OFFICIAL EVIDENTIARY DOCUMENTS (${item.documents ? item.documents.length : 0})</div>
            <div class="documents-grid">
              ${(item.documents || []).map(doc => `
                <div class="document-item-card">
                  <div>
                    <span class="doc-type-tag">${this.escapeHtml(doc.documentType.replace('_', ' '))}</span>
                    <div class="doc-filename">${this.escapeHtml(doc.filename)}</div>
                    <div class="doc-hash-preview">SHA-256: ${this.escapeHtml(doc.fileHash.slice(0, 16))}...</div>
                  </div>
                  <button class="doc-view-btn" data-action="open-doc" data-doc-id="${this.escapeAttr(doc.id)}" type="button">
                    [ 👁 VIEW DOCUMENT EVIDENCE ]
                  </button>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    `;
  },

  renderDocViewerModal() {
    const doc = this.state.viewerDoc;
    if (!doc) return '';

    const factsForThisDoc = (this.state.activeInternship?.evidenceTrace || []).filter(
      t => t.sourceDoc === doc.filename || (t.sourceDoc && t.sourceDoc.toLowerCase().includes(doc.documentType.toLowerCase()))
    );

    return `
      <div class="doc-viewer-backdrop" role="dialog" aria-modal="true" aria-label="Document Viewer">
        <div class="doc-viewer-window">
          <!-- Titlebar -->
          <header class="doc-viewer-titlebar">
            <span>DOCUMENT VIEWER // ${this.escapeHtml(doc.filename)}</span>
            <button class="bc-back-btn" data-action="close-doc" type="button" style="color: #fff;">[ ✕ CLOSE ]</button>
          </header>

          <!-- Toolbar -->
          <div class="doc-viewer-toolbar">
            <div class="zoom-controls">
              <span style="font-size: 10px; font-weight: 700; color: #4b5563;">ZOOM:</span>
              <button class="zoom-btn" data-action="zoom-out" type="button" title="Zoom Out">−</button>
              <span id="zoomPercentage" style="font-size: 11px; font-weight: 700; min-width: 42px; text-align: center;">
                ${Math.round(this.state.zoomLevel * 100)}%
              </span>
              <button class="zoom-btn" data-action="zoom-in" type="button" title="Zoom In">+</button>
              <button class="zoom-btn" data-action="zoom-reset" type="button" title="Reset Zoom">FIT</button>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <span class="evidence-level-badge verified">VERIFIED SOURCE</span>
              <a class="internships-chip" href="${this.escapeAttr(doc.url)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                ↗ OPEN RAW
              </a>
            </div>
          </div>

          <!-- Split: Document Canvas & Evidence Sidebar -->
          <div class="doc-viewer-split">
            <div class="doc-canvas-container">
              <img
                id="docViewerImage"
                class="doc-image-preview"
                src="${this.escapeAttr(doc.url)}"
                alt="Document evidence for ${this.escapeAttr(doc.filename)}"
                style="transform: scale(${this.state.zoomLevel});"
              />
            </div>

            <aside class="doc-evidence-sidebar">
              <h4>DOCUMENT AUDIT TRAIL</h4>
              <div style="font-size: 10px; color: #4b5563; margin-bottom: 12px;">
                <strong>Type:</strong> ${this.escapeHtml(doc.documentType)}<br>
                <strong>SHA-256 Checksum:</strong><br>
                <code style="word-break: break-all; font-size: 9px;">${this.escapeHtml(doc.fileHash)}</code>
              </div>

              <h4>EXTRACTED FACTS</h4>
              ${factsForThisDoc.length > 0 ? factsForThisDoc.map(f => `
                <div class="doc-fact-card">
                  <div class="fact-label">${this.escapeHtml(f.fact)}</div>
                  <div class="fact-text">${this.escapeHtml(f.value)}</div>
                </div>
              `).join('') : `
                <p style="color: #6b7280; font-size: 10px;">All extracted properties for this entity are indexed in the career file matrix.</p>
              `}
            </aside>
          </div>
        </div>
      </div>
    `;
  },

  renderIngestModal() {
    return `
      <div class="doc-viewer-backdrop" role="dialog" aria-modal="true" aria-label="Ingest Document">
        <div class="ingest-modal-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px solid var(--ink, #17131b); padding-bottom: 8px;">
            <h3 style="font: 12px/1 var(--pixel, monospace); margin: 0;">DOCUMENT INGESTION &amp; AUDIT PIPELINE</h3>
            <button class="internships-chip" data-action="close-ingest-modal" type="button">✕</button>
          </div>

          <p style="font-size: 11px; line-height: 1.5; color: #4b5563; margin-bottom: 16px;">
            Upload official internship documents (Offer Letter, Completion Certificate, Joining Letter).
            The pipeline computes the SHA-256 hash, checks for duplicates, extracts evidence, and halts at human verification before publishing.
          </p>

          <label class="dropzone-box" for="internshipFileInput">
            <div style="font-size: 28px; margin-bottom: 8px;">📥</div>
            <div style="font-weight: 700; font-size: 12px; margin-bottom: 4px;">Click or drag official document file</div>
            <div style="font-size: 10px; color: #6b7280;">Supported: PDF, PNG, JPG, JPEG (Max 15MB)</div>
            <input type="file" id="internshipFileInput" accept=".pdf,.png,.jpg,.jpeg" style="display: none;" />
          </label>

          ${this.state.ingestStatus ? `
            <div style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 10px; font-size: 11px; margin-bottom: 14px; word-break: break-all;">
              ${this.escapeHtml(this.state.ingestStatus)}
            </div>
          ` : ''}

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="internships-chip" data-action="close-ingest-modal" type="button">[ CLOSE ]</button>
          </div>
        </div>
      </div>
    `;
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
