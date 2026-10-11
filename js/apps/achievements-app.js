(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AchievementsApp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function getAchievements() {
    if (typeof window !== 'undefined' && window.ownerProfile && Array.isArray(window.ownerProfile.achievements)) {
      return window.ownerProfile.achievements;
    }
    return [];
  }

  function getContent() {
    const list = getAchievements();
    const hackathons = list.filter(a => a.category !== 'MODEL_BENCHMARK');
    const benchmarks = list.filter(a => a.category === 'MODEL_BENCHMARK');

    return `
      <div class="achievements-container" data-achievements-app>
        <div class="achievements-toolbar">
          <div class="achievements-stats">
            <div class="ach-stat-chip"><strong>4</strong><span>PODIUMS & FINALISTS</span></div>
            <div class="ach-stat-chip"><strong>100%</strong><span>VERIFIED RECORDS</span></div>
            <div class="ach-stat-chip"><strong>IIT / VU</strong><span>HOST INSTITUTIONS</span></div>
          </div>
          <div class="achievements-filter-tabs">
            <button type="button" class="ach-tab-btn is-active" data-ach-filter="all">ALL RESULTS (${list.length})</button>
            <button type="button" class="ach-tab-btn" data-ach-filter="hackathons">HACKATHONS (${hackathons.length})</button>
            <button type="button" class="ach-tab-btn" data-ach-filter="benchmarks">MODEL BENCHMARKS (${benchmarks.length})</button>
          </div>
        </div>

        <div class="achievements-scroll-area">
          <section class="achievements-section" data-section="hackathons">
            <div class="ach-section-header">
              <span class="ach-section-badge">🏆 COMPETITIVE PODIUMS</span>
              <h3>NATIONAL & REGIONAL HACKATHON RECOGNITIONS</h3>
            </div>
            <div class="achievements-grid">
              ${hackathons.map(renderCard).join('')}
            </div>
          </section>

          <section class="achievements-section" data-section="benchmarks">
            <div class="ach-section-header">
              <span class="ach-section-badge">⚡ PRODUCTION PROOF</span>
              <h3>MEASURABLE MODEL PERFORMANCE BENCHMARKS</h3>
            </div>
            <div class="achievements-grid">
              ${benchmarks.map(renderCard).join('')}
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderCard(item) {
    const isHackathon = item.category !== 'MODEL_BENCHMARK';
    const rankBadgeClass = item.rank.includes('1st')
      ? 'gold'
      : item.rank.includes('2nd') || item.rank.includes('Third')
      ? 'silver'
      : 'bronze';

    return `
      <article class="ach-card" data-category="${isHackathon ? 'hackathons' : 'benchmarks'}" data-id="${item.id}">
        <header class="ach-card-header">
          <div class="ach-rank-tag ${rankBadgeClass}">${item.rank}</div>
          <span class="ach-status-pill">${item.status.toUpperCase()}</span>
        </header>
        <div class="ach-card-body">
          <h4 class="ach-title">${item.title}</h4>
          <p class="ach-organizer">🏛️ ${item.organizer} · <span>${item.date}</span></p>
          <p class="ach-desc">${item.description}</p>
          <div class="ach-metrics-row">
            ${(item.metrics || []).map(m => `
              <div class="ach-metric">
                <span class="ach-m-label">${m.label}</span>
                <strong class="ach-m-value">${m.value}</strong>
              </div>
            `).join('')}
          </div>
        </div>
        <footer class="ach-card-footer">
          <button type="button" class="ach-inspect-btn" data-inspect-achievement="${item.id}">
            <span>🛡️ INSPECT EVIDENCE</span>
          </button>
        </footer>
      </article>
    `;
  }

  function init(container) {
    if (!container) return;

    // Filter tab handler
    const tabs = container.querySelectorAll('[data-ach-filter]');
    const cards = container.querySelectorAll('.ach-card');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const filter = tab.getAttribute('data-ach-filter');
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

    // Evidence inspection handler
    container.addEventListener('click', e => {
      const btn = e.target.closest('[data-inspect-achievement]');
      if (!btn) return;
      const id = btn.getAttribute('data-inspect-achievement');
      const list = getAchievements();
      const item = list.find(a => a.id === id);
      if (!item) return;

      if (typeof window !== 'undefined' && window.EvidenceViewer && typeof window.EvidenceViewer.open === 'function') {
        window.EvidenceViewer.open({
          id: item.id,
          title: item.title,
          issuer: item.organizer,
          date: item.date,
          docType: item.category,
          verificationCode: `${item.id.toUpperCase()}-VERIFIED-2026`,
          fileUrl: item.fileUrl ? `./${item.fileUrl.replace(/^\.?\//, '')}` : null,
          notes: item.description
        });
      }
    });
  }

  return {
    getContent,
    init
  };
});
