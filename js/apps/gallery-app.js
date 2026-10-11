/**
 * AYUSH.OS — Gallery Application Module
 * 
 * Standalone visual evidence vault & interactive media gallery.
 * Features:
 *  - 3D Avatars, Photography, and Verified Credentials
 *  - Real-time category filtering (All, 3D Avatars, Portraits, Credentials)
 *  - Interactive full-screen Lightbox Inspector with keyboard navigation & download
 *  - SoundEngine audio hooks and retro OS responsive styling
 * 
 * Export: window.GalleryApp = { getContent, init }
 */

(function (root, factory) {
  'use strict';
  const mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (typeof window !== 'undefined') {
    window.GalleryApp = mod;
  }
  if (root) {
    root.GalleryApp = mod;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getGalleryItems() {
    const p = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
    return Array.isArray(p.gallery) ? p.gallery : [];
  }

  function getContent() {
    const items = getGalleryItems();
    const count3D = items.filter(i => i.category === '3D_AVATAR').length;
    const countPortraits = items.filter(i => i.category === 'PORTRAIT').length;
    const countHackathons = items.filter(i => i.category === 'HACKATHON').length;
    const countCerts = items.filter(i => i.category === 'CREDENTIAL').length;

    return `
      <div class="gallery-app-container app-content" data-gallery-app>
        <!-- Application Header -->
        <header class="gallery-header-bar">
          <div class="gallery-title-wrap">
            <span class="app-kicker">AYUSH.OS // MEDIA GALLERY</span>
            <h2 class="app-heading">Authentic<br><em>Visual Vault.</em></h2>
            <p class="app-deck">3D Cyber Avatars • Studio Portraits • Hackathon Podiums • Verified Credentials</p>
          </div>
          <div class="gallery-stats-badge">
            <span class="gallery-stat-pill">
              <i class="status-dot"></i> <strong>${items.length}</strong> VERIFIED ASSETS
            </span>
          </div>
        </header>

        <!-- Category Filter Strip -->
        <div class="gallery-filter-bar">
          <button type="button" class="gallery-filter-btn active" data-filter="all">
            <span>● ALL ASSETS</span> <small class="filter-count">(${items.length})</small>
          </button>
          <button type="button" class="gallery-filter-btn" data-filter="3D_AVATAR">
            <span>🤖 3D AVATARS</span> <small class="filter-count">(${count3D})</small>
          </button>
          <button type="button" class="gallery-filter-btn" data-filter="PORTRAIT">
            <span>📷 PORTRAITS</span> <small class="filter-count">(${countPortraits})</small>
          </button>
          <button type="button" class="gallery-filter-btn" data-filter="HACKATHON">
            <span>🏆 HACKATHONS</span> <small class="filter-count">(${countHackathons})</small>
          </button>
          <button type="button" class="gallery-filter-btn" data-filter="CREDENTIAL">
            <span>📜 CREDENTIALS</span> <small class="filter-count">(${countCerts})</small>
          </button>
        </div>

        <!-- Media Grid -->
        <div class="gallery-grid" data-gallery-grid>
          ${items.map(item => `
            <article class="gallery-card" data-card-id="${item.id}" data-category="${item.category}">
              <div class="gallery-thumbnail-wrap" data-lightbox-trigger="${item.id}">
                <img src="${item.src}" alt="${item.title}" class="gallery-thumbnail" data-svg-fallback="${item.svgFallback || ''}" onerror="if(!this.dataset.fallbackApplied && this.dataset.svgFallback){this.dataset.fallbackApplied='1';this.src=this.dataset.svgFallback;}else if(!this.dataset.retriedWithDot){this.dataset.retriedWithDot='1';this.src='./'+this.getAttribute('src');}" />
                <div class="gallery-card-overlay">
                  <span class="overlay-zoom-icon">🔍 INSPECT</span>
                </div>
              </div>
              <div class="gallery-card-body">
                <div class="gallery-card-header">
                  <span class="gallery-category-tag ${item.category.toLowerCase()}">${item.categoryLabel || item.category}</span>
                  <span class="gallery-aspect-badge">${item.aspectRatio || 'IMG'}</span>
                </div>
                <h4 class="gallery-card-title">${item.title}</h4>
                <p class="gallery-card-desc">${item.description || ''}</p>
                <div class="gallery-card-actions">
                  <button type="button" class="gallery-btn-action" data-lightbox-trigger="${item.id}">
                    <span>VIEW FULL RES</span>
                  </button>
                  <a href="${item.src}" download class="gallery-btn-dl" title="Download original asset">
                    <span>⬇</span>
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>

        <!-- Full-Screen Lightbox Modal -->
        <div class="gallery-lightbox-modal" data-gallery-lightbox hidden>
          <div class="lightbox-backdrop" data-lightbox-close></div>
          <div class="lightbox-dialog" role="dialog" aria-modal="true">
            <header class="lightbox-header">
              <div class="lightbox-title-area">
                <span class="lightbox-kicker" data-lightbox-kicker>AYUSH.OS // ASSET INSPECTOR</span>
                <h3 class="lightbox-title" data-lightbox-title>Image Inspection</h3>
              </div>
              <div class="lightbox-header-actions">
                <a href="#" download class="lightbox-header-btn" data-lightbox-download title="Download file">⬇ DOWNLOAD</a>
                <button type="button" class="lightbox-close-btn" data-lightbox-close title="Close (Esc)">✕ CLOSE</button>
              </div>
            </header>
            
            <div class="lightbox-content-body">
              <button type="button" class="lightbox-nav-btn prev" data-lightbox-prev title="Previous asset">◀</button>
              <div class="lightbox-image-stage">
                <img src="" alt="" class="lightbox-image" data-lightbox-img onerror="if(!this.dataset.fallbackApplied && this.dataset.svgFallback){this.dataset.fallbackApplied='1';this.src=this.dataset.svgFallback;}else if(!this.dataset.retriedWithDot){this.dataset.retriedWithDot='1';this.src='./'+this.getAttribute('src');}" />
              </div>
              <button type="button" class="lightbox-nav-btn next" data-lightbox-next title="Next asset">▶</button>
            </div>

            <footer class="lightbox-footer">
              <div class="lightbox-meta">
                <span class="lightbox-cat-badge" data-lightbox-category>CATEGORY</span>
                <span class="lightbox-index-text" data-lightbox-index>1 of 16</span>
              </div>
              <p class="lightbox-desc" data-lightbox-desc></p>
            </footer>
          </div>
        </div>
      </div>
    `;
  }

  function init(container) {
    if (!container) return;
    const items = getGalleryItems();
    if (items.length === 0) return;

    let currentIndex = 0;
    const filteredItems = [...items];

    const filterBtns = container.querySelectorAll('.gallery-filter-btn');
    const cards = container.querySelectorAll('.gallery-card');
    const lightbox = container.querySelector('[data-gallery-lightbox]');
    const lightboxImg = container.querySelector('[data-lightbox-img]');
    const lightboxTitle = container.querySelector('[data-lightbox-title]');
    const lightboxDesc = container.querySelector('[data-lightbox-desc]');
    const lightboxCat = container.querySelector('[data-lightbox-category]');
    const lightboxIndex = container.querySelector('[data-lightbox-index]');
    const lightboxDl = container.querySelector('[data-lightbox-download]');

    function playSound(type) {
      if (typeof window !== 'undefined' && window.SoundEngine) {
        if (type === 'click' && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        } else if (type === 'open' && typeof window.SoundEngine.windowOpen === 'function') {
          window.SoundEngine.windowOpen();
        } else if (type === 'close' && typeof window.SoundEngine.windowClose === 'function') {
          window.SoundEngine.windowClose();
        }
      }
    }

    // Filter functionality
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-filter');
        cards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = '';
            card.classList.add('filter-visible');
          } else {
            card.style.display = 'none';
            card.classList.remove('filter-visible');
          }
        });
      });
    });

    // Open lightbox for a given item index
    function openLightbox(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;

      const item = items[currentIndex];
      if (!item || !lightbox) return;

      if (lightboxImg) {
        lightboxImg.dataset.svgFallback = item.svgFallback || '';
        delete lightboxImg.dataset.fallbackApplied;
        delete lightboxImg.dataset.retriedWithDot;
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
      }
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (lightboxDesc) lightboxDesc.textContent = item.description || '';
      if (lightboxCat) {
        lightboxCat.textContent = item.categoryLabel || item.category;
        lightboxCat.className = `lightbox-cat-badge ${item.category.toLowerCase()}`;
      }
      if (lightboxIndex) {
        lightboxIndex.textContent = `${currentIndex + 1} / ${items.length}`;
      }
      if (lightboxDl) {
        lightboxDl.href = item.src;
        lightboxDl.download = item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      }

      lightbox.hidden = false;
      lightbox.classList.add('active');
      playSound('open');
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.hidden = true;
      lightbox.classList.remove('active');
      playSound('close');
    }

    // Trigger buttons
    container.querySelectorAll('[data-lightbox-trigger]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-lightbox-trigger');
        const idx = items.findIndex(i => i.id === id);
        if (idx !== -1) {
          openLightbox(idx);
        }
      });
    });

    // Close buttons
    container.querySelectorAll('[data-lightbox-close]').forEach(btn => {
      btn.addEventListener('click', () => closeLightbox());
    });

    // Prev / Next buttons
    const prevBtn = container.querySelector('[data-lightbox-prev]');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        openLightbox(currentIndex - 1);
      });
    }

    const nextBtn = container.querySelector('[data-lightbox-next]');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        openLightbox(currentIndex + 1);
      });
    }

    // Keyboard support
    function handleKeyDown(e) {
      if (!lightbox || lightbox.hidden) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        playSound('click');
        openLightbox(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        playSound('click');
        openLightbox(currentIndex + 1);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
  }

  return {
    getContent,
    init
  };
});
