/**
 * AYUSH.OS — Certifications & Learning Application Module
 * Accredited credentials from Forage, Comtech Institute, and Universities.
 * Fully backed by authentic certificate verification codes and document inspection.
 * Styled with localhost:3000 retro design system & typography.
 * 
 * Export: window.CertificationsApp = { getContent(), init() }
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CertificationsApp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getCertifications() {
    if (typeof window !== 'undefined' && window.ownerProfile && Array.isArray(window.ownerProfile.certifications)) {
      return window.ownerProfile.certifications;
    }
    return [];
  }

  function getContent() {
    const list = getCertifications();

    return `
      <div class="certifications-container app-content" data-certifications-app>
        <span class="app-kicker">ACCREDITED CREDENTIALS / EVIDENCE ARCHIVE</span>
        <h2 class="app-heading">Skills tested by<br><em>verified authority.</em></h2>
        <p class="app-deck">Industry simulations, institutional accreditations, and technical certifications — each backed by authentic enrolment codes and downloadable credentials.</p>

        <div class="cert-toolbar">
          <div class="cert-stats-row">
            <div class="cert-stat-chip"><strong>6</strong><span>ACCREDITED CREDENTIALS</span></div>
            <div class="cert-stat-chip"><strong>100%</strong><span>DOCUMENT BACKED</span></div>
            <div class="cert-stat-chip"><strong>VERIFIED</strong><span>FORAGE / ISO / UNIVERSITIES</span></div>
          </div>
          <div class="cert-filters">
            <button type="button" class="cert-filter-btn is-active" data-cert-filter="all">ALL CREDENTIALS (${list.length})</button>
            <button type="button" class="cert-filter-btn" data-cert-filter="corporate">CORPORATE SIMULATIONS (2)</button>
            <button type="button" class="cert-filter-btn" data-cert-filter="technical">TECHNICAL INSTITUTES (2)</button>
            <button type="button" class="cert-filter-btn" data-cert-filter="university">UNIVERSITIES (2)</button>
          </div>
        </div>

        <div class="cert-scroll-area">
          <div class="cert-grid">
            ${list.map(renderCertCard).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderCertCard(cert) {
    const isCorporate = cert.id.includes('deloitte') || cert.id.includes('goldman');
    const isTechnical = cert.id.includes('comtech');
    const category = isCorporate ? 'corporate' : isTechnical ? 'technical' : 'university';

    return `
      <article class="cert-card" data-category="${category}" data-id="${cert.id}">
        <header class="cert-card-header">
          <span class="cert-type-pill">${(cert.docType || 'CERTIFICATE').replace(/_/g, ' ')}</span>
          <span class="cert-status-badge">VERIFIED</span>
        </header>
        <div class="cert-card-body">
          <h4 class="cert-title">${cert.title}</h4>
          <p class="cert-issuer">🏛️ ${cert.issuer}</p>
          <p class="cert-date">📅 ${cert.date}</p>
          
          ${cert.grade ? `<div class="cert-grade-tag">GRADE: <strong>${cert.grade}</strong></div>` : ''}
          ${cert.verificationCode ? `
            <div class="cert-verif-box">
              <small>ENROLMENT VERIFICATION CODE</small>
              <code>${cert.verificationCode}</code>
            </div>
          ` : ''}
          ${cert.certificateNo ? `
            <div class="cert-verif-box">
              <small>CERTIFICATE NUMBER</small>
              <code>${cert.certificateNo}</code>
            </div>
          ` : ''}
          ${cert.skills && cert.skills.length > 0 ? `
            <div class="cert-skills-list">
              ${cert.skills.map(s => `<span class="cert-skill-pill">${s}</span>`).join('')}
            </div>
          ` : ''}
          ${cert.signatory || cert.signatories ? `
            <p class="cert-signatory">✍️ ${cert.signatory || cert.signatories}</p>
          ` : ''}
        </div>
        <footer class="cert-card-footer">
          <button type="button" class="cert-inspect-btn" data-inspect-cert="${cert.id}">
            <span>🛡️ INSPECT CREDENTIAL</span>
          </button>
        </footer>
      </article>
    `;
  }

  function init(container) {
    if (!container) return;

    // Filter buttons
    const filterBtns = container.querySelectorAll('[data-cert-filter]');
    const cards = container.querySelectorAll('.cert-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.getAttribute('data-cert-filter');
        cards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
      });
    });

    // Inspect triggers
    const inspectBtns = container.querySelectorAll('[data-inspect-cert]');
    inspectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const certId = btn.getAttribute('data-inspect-cert');
        if (typeof window !== 'undefined' && window.EvidenceViewer) {
          const list = getCertifications();
          const cert = list.find(c => c.id === certId) || certId;
          window.EvidenceViewer.open(cert, 'certifications');
        }
      });
    });
  }

  return {
    getContent,
    init
  };
});
