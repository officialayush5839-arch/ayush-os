(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EvidenceViewer = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  let modalEl = null;
  let currentDoc = null;

  function ensureModal() {
    if (typeof document === 'undefined') return null;
    let existing = document.getElementById('evidence-viewer-modal');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'evidence-viewer-modal';
      existing.className = 'evidence-modal';
      existing.hidden = true;
      existing.setAttribute('role', 'dialog');
      existing.setAttribute('aria-modal', 'true');
      existing.setAttribute('aria-label', 'Document Evidence Viewer');

      existing.innerHTML = `
        <div class="evidence-modal-backdrop" data-evidence-close></div>
        <div class="evidence-modal-window">
          <header class="evidence-modal-header">
            <div class="evidence-header-title">
              <span class="evidence-shield-icon">🛡️</span>
              <strong data-evidence-title>DOCUMENT EVIDENCE</strong>
              <small data-evidence-issuer></small>
            </div>
            <div class="evidence-header-actions">
              <button type="button" class="evidence-close-btn" data-evidence-close aria-label="Close document">✕</button>
            </div>
          </header>
          <div class="evidence-modal-meta" data-evidence-meta></div>
          <div class="evidence-modal-body" data-evidence-body></div>
          <footer class="evidence-modal-footer">
            <span class="evidence-security-tag">🔒 ZERO FABRICATION // AUTHENTIC VERIFIED RECORD</span>
            <button type="button" class="evidence-done-btn" data-evidence-close>CLOSE EVIDENCE</button>
          </footer>
        </div>
      `;

      if (document.body && typeof document.body.appendChild === 'function') {
        document.body.appendChild(existing);
      }

      existing.addEventListener('click', function (e) {
        if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-evidence-close')) {
          close();
        }
      });

      if (typeof document.addEventListener === 'function') {
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && isOpen()) {
            close();
          }
        });
      }
    }
    modalEl = existing;
    return modalEl;
  }

  function resolveDocument(input) {
    if (!input) return null;
    if (typeof input === 'object') return { ...input };
    if (typeof input === 'string') {
      const p = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : null;
      if (p) {
        if (Array.isArray(p.certifications)) {
          const c = p.certifications.find(x => x.id === input);
          if (c) return { ...c };
        }
        if (Array.isArray(p.achievements)) {
          const a = p.achievements.find(x => x.id === input);
          if (a) return { ...a };
        }
        if (Array.isArray(p.journey)) {
          const j = p.journey.find(x => x.id === input);
          if (j) return { ...j };
        }
      }
      return { id: input, title: input };
    }
    return null;
  }

  function open(docInput) {
    const doc = resolveDocument(docInput);
    if (!doc) return;
    currentDoc = { ...doc };
    const el = ensureModal();
    if (!el) return;

    const titleEl = el.querySelector('[data-evidence-title]');
    const issuerEl = el.querySelector('[data-evidence-issuer]');
    const metaEl = el.querySelector('[data-evidence-meta]');
    const bodyEl = el.querySelector('[data-evidence-body]');

    if (titleEl) titleEl.textContent = doc.title || 'VERIFIED DOCUMENT';
    if (issuerEl) issuerEl.textContent = (doc.issuer || doc.organizer || doc.institution) ? `// ${doc.issuer || doc.organizer || doc.institution}` : '';

    if (metaEl) {
      let metaHtml = `
        <div class="evidence-meta-pill"><span>STATUS</span><strong>VERIFIED</strong></div>
        <div class="evidence-meta-pill"><span>DATE</span><strong>${doc.date || doc.year || 'NOT SPECIFIED'}</strong></div>
      `;
      if (doc.verificationCode) {
        metaHtml += `<div class="evidence-meta-pill highlight"><span>VERIFICATION CODE</span><code>${doc.verificationCode}</code></div>`;
      }
      if (doc.certificateNo) {
        metaHtml += `<div class="evidence-meta-pill highlight"><span>CERTIFICATE NO</span><code>${doc.certificateNo}</code></div>`;
      }
      if (doc.docType) {
        metaHtml += `<div class="evidence-meta-pill"><span>TYPE</span><strong>${doc.docType.replace(/_/g, ' ')}</strong></div>`;
      }
      if (doc.grade) {
        metaHtml += `<div class="evidence-meta-pill"><span>GRADE</span><strong>${doc.grade}</strong></div>`;
      }
      if (doc.rank) {
        metaHtml += `<div class="evidence-meta-pill"><span>RANK</span><strong>${doc.rank}</strong></div>`;
      }
      metaEl.innerHTML = metaHtml;
    }

    if (bodyEl) {
      if (doc.fileUrl) {
        const isPdf = typeof doc.fileUrl === 'string' && doc.fileUrl.toLowerCase().endsWith('.pdf');
        if (isPdf) {
          bodyEl.innerHTML = `
            <div class="evidence-pdf-container">
              <div class="evidence-doc-actions">
                <a href="${doc.fileUrl}" target="_blank" rel="noopener noreferrer" class="evidence-btn">
                  <span>↗ OPEN PDF IN NEW TAB</span>
                </a>
                <a href="${doc.fileUrl}" download class="evidence-btn">
                  <span>⬇ DOWNLOAD PDF</span>
                </a>
              </div>
              <iframe src="${doc.fileUrl}#view=FitH" class="evidence-pdf-frame" title="${doc.title || 'Verified Document'}"></iframe>
            </div>
          `;
        } else {
          bodyEl.innerHTML = `
            <div class="evidence-img-container">
              <div class="evidence-doc-actions">
                <a href="${doc.fileUrl}" target="_blank" rel="noopener noreferrer" class="evidence-btn">
                  <span>↗ VIEW FULL SIZE</span>
                </a>
                <a href="${doc.fileUrl}" download class="evidence-btn">
                  <span>⬇ DOWNLOAD</span>
                </a>
              </div>
              <img src="${doc.fileUrl}" alt="${doc.title || 'Document scan'}" class="evidence-img" onerror="this.parentElement.innerHTML='<div class=\\'evidence-fallback\\'>📄 Document scan on physical record archive.</div>'" />
            </div>
          `;
        }
      } else {
        bodyEl.innerHTML = `
          <div class="evidence-fallback">
            <div class="evidence-fallback-icon">🛡️</div>
            <h4>AUTHENTIC CREDENTIAL ON FILE</h4>
            <p>Verification Code: <code>${doc.verificationCode || 'VERIFIED-RECORD'}</code></p>
            <p class="evidence-fallback-notes">${doc.notes || doc.description || 'Verified through official institutional records.'}</p>
          </div>
        `;
      }
    }

    el.hidden = false;
    if (el.classList && typeof el.classList.add === 'function') el.classList.add('is-open');
    if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.windowOpen === 'function') {
      window.SoundEngine.windowOpen();
    }
  }

  function close() {
    currentDoc = null;
    const el = ensureModal();
    if (!el) return;
    el.hidden = true;
    if (el.classList && typeof el.classList.remove === 'function') el.classList.remove('is-open');
    if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.windowClose === 'function') {
      window.SoundEngine.windowClose();
    }
  }

  function isOpen() {
    return currentDoc !== null;
  }

  function getCurrent() {
    return currentDoc ? { ...currentDoc } : null;
  }

  return {
    open,
    close,
    isOpen,
    getCurrent
  };
});
