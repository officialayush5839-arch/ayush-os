/**
 * AYUSH.OS — Contact & Communication Module
 * Displays verified primary contact number (+91 8983233911) and email (officialayush5839@gmail.com)
 * with instant one-click calling, WhatsApp, direct email, and clipboard copying.
 * 
 * Export: window.ContactApp = { getContent(), init() }
 */

(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (typeof window !== 'undefined') {
    window.ContactApp = mod;
  }
  if (root) {
    root.ContactApp = mod;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getContent() {
    const profile = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
    const email = profile.identity?.email || 'officialayush5839@gmail.com';
    const phone = profile.identity?.phone || '+91 8983233911';
    const rawPhone = phone.replace(/[^0-9+]/g, '');
    const github = profile.identity?.github || 'https://github.com/officialayush5839-arch';
    const linkedin = profile.identity?.linkedin || 'https://www.linkedin.com/in/ayush-vishwakarama-7a79803ba/';
    const location = profile.identity?.location || 'Pune, Maharashtra, India';

    return `
      <div class="contact-app-container app-content" data-contact-app>
        <div class="contact-header-full">
          <span class="app-kicker">VERIFIED CONTACT CHANNELS // DIRECT DISPATCH</span>
          <h2 class="app-heading">Get in<br><em>touch.</em></h2>
          <p class="app-deck">Reach out directly to Ayush Vishwakarma via phone, WhatsApp, or official email for AI engineering, project collaborations, and inquiries.</p>
        </div>

        <div class="contact-direct-cards">
          <!-- Phone Card -->
          <div class="contact-card-box phone-box">
            <div class="contact-card-header">
              <span class="contact-badge phone-badge">PRIMARY CONTACT NUMBER</span>
              <span class="contact-live-tag">● DIRECT</span>
            </div>
            <div class="contact-card-body">
              <div class="contact-icon">📞</div>
              <div class="contact-details">
                <small>DIRECT PHONE / WHATSAPP</small>
                <div class="contact-big-value">${phone}</div>
              </div>
            </div>
            <div class="contact-card-actions">
              <a class="contact-action-btn call-action" href="tel:${rawPhone}">
                <span>📞 CALL ${phone} ↗</span>
              </a>
              <a class="contact-action-btn whatsapp-action" href="https://wa.me/918983233911?text=Hey%20Ayush%2C%20I%20would%20like%20to%20connect%20regarding%20an%20AI%20project." target="_blank" rel="noopener noreferrer">
                <span>💬 WHATSAPP ↗</span>
              </a>
              <button type="button" class="contact-action-btn copy-action" data-copy-phone>
                <span>📋 COPY NUMBER</span>
              </button>
            </div>
          </div>

          <!-- Email Card -->
          <div class="contact-card-box email-box">
            <div class="contact-card-header">
              <span class="contact-badge email-badge">OFFICIAL INBOX</span>
              <span class="contact-live-tag">● VERIFIED</span>
            </div>
            <div class="contact-card-body">
              <div class="contact-icon">✉️</div>
              <div class="contact-details">
                <small>OFFICIAL EMAIL ADDRESS</small>
                <div class="contact-big-value email-text">${email}</div>
              </div>
            </div>
            <div class="contact-card-actions">
              <a class="contact-action-btn email-action" href="mailto:${email}">
                <span>✉️ SEND EMAIL ↗</span>
              </a>
              <button type="button" class="contact-action-btn copy-action" data-copy-email>
                <span>📋 COPY EMAIL</span>
              </button>
              <a class="contact-action-btn github-action" href="${github}" target="_blank" rel="noopener noreferrer">
                <span>💻 GITHUB ↗</span>
              </a>
            </div>
          </div>
        </div>

        <div class="contact-meta-strip">
          <div class="meta-strip-item">
            <span>LOCATION</span>
            <strong>${location} (IST)</strong>
          </div>
          <div class="meta-strip-item">
            <span>CAMPUS</span>
            <strong>VISHWAKARMA UNIVERSITY (VU), PUNE</strong>
          </div>
          <div class="meta-strip-item">
            <span>OPEN FOR</span>
            <strong>RESEARCH COLLABORATION · INTERNSHIP · PRODUCTION PROJECT BUILDS</strong>
          </div>
        </div>
      </div>
    `;
  }

  function init(container) {
    if (!container) return;

    // Phone Copy
    const copyPhoneBtn = container.querySelector('[data-copy-phone]');
    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener('click', async () => {
        const phone = '8983233911';
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(phone);
          }
          const orig = copyPhoneBtn.innerHTML;
          copyPhoneBtn.innerHTML = '<span>✓ NUMBER COPIED!</span>';
          if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
          setTimeout(() => {
            copyPhoneBtn.innerHTML = orig;
          }, 2000);
        } catch (err) {
          copyPhoneBtn.innerHTML = '<span>8983233911</span>';
        }
      });
    }

    // Email Copy
    const copyEmailBtn = container.querySelector('[data-copy-email]');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async () => {
        const email = 'officialayush5839@gmail.com';
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(email);
          }
          const orig = copyEmailBtn.innerHTML;
          copyEmailBtn.innerHTML = '<span>✓ EMAIL COPIED!</span>';
          if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
          setTimeout(() => {
            copyEmailBtn.innerHTML = orig;
          }, 2000);
        } catch (err) {
          copyEmailBtn.innerHTML = '<span>' + email + '</span>';
        }
      });
    }
  }

  return {
    getContent,
    init
  };
});
