/* ============================================================
   AYUSH.OS — System Initialization & App Launcher
   Boot sequence, theme, clock, desktop icons, sparkles
   ============================================================ */

(function() {
  'use strict';

  // ===== Desktop Icon Definitions =====
  const DESKTOP_ICONS = [
    { id: 'projects', label: 'PROJECTS', sub: 'selected files', icon: '📂', badge: 'CORE' },
    { id: 'proof', label: 'RESULTS', sub: 'evidence ledger', icon: '📊', badge: 'LOG' },
    { id: 'systems', label: 'SYSTEMS', sub: 'architecture map', icon: '⚙️', badge: 'MAP' },
    { id: 'terminal', label: 'TERMINAL', sub: 'command line', icon: '⬛', badge: 'DEV' },
    { id: 'skills', label: 'SKILL MAP', sub: 'what I use', icon: '✛', badge: 'STACK' },
    { id: 'journey', label: 'JOURNEY', sub: 'learning path', icon: '🗺️', badge: '2026' },
    { id: 'whiteboard', label: 'WHITEBOARD', sub: 'ideas in motion', icon: '🎨', badge: 'LAB' },
    { id: 'music', label: 'MUSIC', sub: 'ambient focus', icon: '🎵', badge: 'PLAY' },
    { id: 'voiceagent', label: 'AI AGENT', sub: 'voice demo', icon: '🎙️', badge: 'LIVE' },
    { id: 'founder', label: 'FOUNDER.TXT', sub: 'read me', icon: '📝', badge: 'TXT' },
    { id: 'browser', label: 'BROWSER', sub: 'research mode', icon: '🌐', badge: 'WEB' },
    { id: 'contact', label: 'CONTACT', sub: 'open channel', icon: '✉️', badge: 'OPEN' },
  ];

  // ===== App Launcher =====
  window.AppLauncher = {
    launch(appId) {
      if (!window.WindowManager) return;

      // If already open, focus it
      if (window.WindowManager.isOpen(appId)) {
        const wins = window.WindowManager.getOpenWindows();
        const w = wins.find(w => w.appId === appId);
        if (w) {
          if (w.minimized) window.WindowManager.restore(w.id);
          else window.WindowManager.focus(w.id);
        }
        return;
      }

      const appConfig = this.getAppConfig(appId);
      if (!appConfig) return;

      // Dock bounce
      if (window.Dock) window.Dock.bounce(appId);

      const windowId = window.WindowManager.open(
        appId,
        appConfig.title,
        appConfig.content,
        appConfig.options
      );

      // Mark dock active
      if (window.Dock) window.Dock.setActive(appId, true);

      // Post-open initialization
      if (appConfig.init) {
        setTimeout(() => {
          const wins = window.WindowManager.getOpenWindows();
          const w = wins.find(w => w.id === windowId);
          if (w && w.element) {
            appConfig.init(w.element.querySelector('.window-body'));
          }
        }, 100);
      }
    },

    getAppConfig(appId) {
      const p = window.ownerProfile || {};
      switch(appId) {
        case 'projects':
          return {
            title: 'PROJECTS',
            content: window.ProjectsApp ? window.ProjectsApp.getContent() : '<p>Loading projects...</p>',
            options: { width: 720, height: 520 }
          };
        case 'systems':
          return {
            title: 'SYSTEMS',
            content: window.SystemsApp ? window.SystemsApp.getContent() : '<p>Loading systems...</p>',
            options: { width: 680, height: 460 }
          };
        case 'proof':
          return {
            title: 'PROOF / RESULTS',
            content: window.ProofApp ? window.ProofApp.getContent() : '<p>Loading proof...</p>',
            options: { width: 640, height: 480 }
          };
        case 'terminal':
          return {
            title: 'TERMINAL',
            content: window.TerminalApp ? window.TerminalApp.getContent() : '<p>Loading terminal...</p>',
            options: { width: 600, height: 400 },
            init: (body) => { if (window.TerminalApp && window.TerminalApp.init) window.TerminalApp.init(body); }
          };
        case 'whiteboard':
          return {
            title: 'WHITEBOARD',
            content: window.WhiteboardApp ? window.WhiteboardApp.getContent() : '<p>Loading whiteboard...</p>',
            options: { width: 700, height: 500 },
            init: (body) => { if (window.WhiteboardApp && window.WhiteboardApp.init) window.WhiteboardApp.init(body); }
          };
        case 'music':
          return {
            title: 'MUSIC',
            content: window.MusicApp ? window.MusicApp.getContent() : '<p>Loading music...</p>',
            options: { width: 380, height: 420 },
            init: (body) => { if (window.MusicApp && window.MusicApp.init) window.MusicApp.init(body); }
          };
        case 'voiceagent':
          return {
            title: 'AI VOICE AGENT',
            content: window.VoiceAgentApp ? window.VoiceAgentApp.getContent() : '<p>Loading voice agent...</p>',
            options: { width: 400, height: 380 },
            init: (body) => { if (window.VoiceAgentApp && window.VoiceAgentApp.init) window.VoiceAgentApp.init(body); }
          };
        case 'journey':
          return {
            title: 'JOURNEY',
            content: window.JourneyApp ? window.JourneyApp.getContent() : '<p>Loading journey...</p>',
            options: { width: 500, height: 480 }
          };
        case 'founder':
          return {
            title: 'FOUNDER.TXT',
            content: '<div class="founder-txt">' + (p.founderTxt || 'I build.').replace(/\n/g, '<br>') + '<span class="signature">— Ayush Vishwakarma</span></div>',
            options: { width: 460, height: 380 }
          };
        case 'skills':
          return {
            title: 'SKILL MAP',
            content: this.buildSkillsContent(),
            options: { width: 560, height: 420 }
          };
        case 'browser':
          return {
            title: 'BROWSER',
            content: '<div style="padding:8px;text-align:center;"><p class="eyebrow" style="margin-bottom:12px;">BROWSER / RESEARCH MODE</p><p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:16px;">External links open in a new tab for security.</p><div style="display:flex;flex-direction:column;gap:8px;max-width:320px;margin:0 auto;"><a class="contact-link" href="https://github.com/officialayush5839-arch" target="_blank" rel="noreferrer"><span class="link-icon">🐙</span>GitHub<span class="link-arrow">↗</span></a><a class="contact-link" href="https://www.linkedin.com/in/ayush-vishwakarama-7a79803ba/" target="_blank" rel="noreferrer"><span class="link-icon">💼</span>LinkedIn<span class="link-arrow">↗</span></a></div></div>',
            options: { width: 420, height: 340 }
          };
        case 'contact':
          return {
            title: 'CONTACT',
            content: window.ContactApp ? window.ContactApp.getContent() : '<p>Loading contact...</p>',
            options: { width: 400, height: 380 }
          };
        default:
          return null;
      }
    },

    buildSkillsContent() {
      const p = window.ownerProfile;
      if (!p || !p.skills) return '<p>No skills data</p>';
      const groups = Object.entries(p.skills);
      let html = '<div class="app-content"><p class="app-eyebrow">SKILL MAP / TECH STACK</p><h2>What I <em>Use.</em></h2></div><div class="skills-grid">';
      groups.forEach(([key, items]) => {
        html += '<div class="skill-group"><div class="skill-group-title">' + key.replace(/_/g, ' ') + '</div><div class="skill-tags">';
        items.forEach(item => { html += '<span class="skill-tag">' + item + '</span>'; });
        html += '</div></div>';
      });
      html += '</div>';
      return html;
    }
  };

  // ===== Render Desktop Icons =====
  function renderDesktopIcons() {
    const grid = document.getElementById('appGrid');
    if (!grid) return;
    grid.innerHTML = DESKTOP_ICONS.map(app => `
      <button class="app-icon" data-app="${app.id}" title="Open ${app.label}">
        <div class="icon-face">
          <span class="icon-badge">${app.badge}</span>
          ${app.icon}
        </div>
        <span class="icon-label">${app.label}</span>
        <span class="icon-sub">${app.sub}</span>
      </button>
    `).join('');

    // Click handlers
    grid.querySelectorAll('.app-icon').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.SoundEngine) window.SoundEngine.click();
        window.AppLauncher.launch(btn.dataset.app);
      });
    });
  }

  // ===== Generate Sparkle Stars =====
  function generateSparkles() {
    const container = document.getElementById('sparkles');
    if (!container) return;
    const count = window.innerWidth < 768 ? 15 : 30;
    let html = '';
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 1 + Math.random() * 3;
      const dur = 2 + Math.random() * 4;
      const delay = Math.random() * dur;
      html += `<span class="sparkle-star" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:-${delay}s;"></span>`;
    }
    container.innerHTML = html;
  }

  // ===== Clock =====
  function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    el.textContent = h + ':' + m + ' IST';
  }

  // ===== Theme System =====
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ayush_os_theme', theme);

    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeSet === theme);
    });

    // Update Three.js background
    if (window.ThreeBG) window.ThreeBG.setTheme(theme);

    // Sound
    if (window.SoundEngine) window.SoundEngine.themeSwitch();
  }

  function initTheme() {
    const saved = localStorage.getItem('ayush_os_theme') || 'night';
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeSet === saved);
      btn.addEventListener('click', () => setTheme(btn.dataset.themeSet));
    });
  }

  // ===== Sound Toggle =====
  function initSoundToggle() {
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    const update = () => {
      const on = window.SoundEngine && window.SoundEngine.isEnabled();
      btn.textContent = on ? '🔊' : '🔇';
    };
    update();
    btn.addEventListener('click', () => {
      if (window.SoundEngine) {
        window.SoundEngine.toggle(!window.SoundEngine.isEnabled());
        update();
      }
    });
  }

  // ===== Welcome Card =====
  function initWelcomeCard() {
    const card = document.getElementById('welcomeCard');
    const dismiss = document.getElementById('dismissWelcome');
    if (!card || !dismiss) return;

    dismiss.addEventListener('click', () => {
      card.style.opacity = '0';
      card.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => card.remove(), 400);
      if (window.SoundEngine) window.SoundEngine.click();
    });

    // CTA buttons
    card.querySelectorAll('[data-app]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.AppLauncher.launch(btn.dataset.app);
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 400);
      });
    });
  }

  // ===== Topbar Nav =====
  function initTopbarNav() {
    document.querySelectorAll('.topbar-nav button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.SoundEngine) window.SoundEngine.click();
        window.AppLauncher.launch(btn.dataset.app);
      });
    });
  }

  // ===== Hire Tab & Portrait =====
  function initHireTab() {
    const tab = document.querySelector('.hire-tab');
    if (tab) {
      tab.addEventListener('click', () => {
        if (window.SoundEngine) window.SoundEngine.click();
        window.AppLauncher.launch(tab.dataset.app);
      });
    }
  }

  // ===== 3D Card Tilt on App Icons =====
  function init3DTilt() {
    document.querySelectorAll('.app-icon').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ===== Window Close Handler (for dock active state) =====
  function setupWindowCloseWatcher() {
    // Watch for window removals to update dock
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.removedNodes.forEach(node => {
          if (node.classList && node.classList.contains('window')) {
            const appId = node.dataset.appId;
            if (appId && window.Dock) window.Dock.setActive(appId, false);
          }
        });
      });
    });
    const container = document.getElementById('windowsContainer');
    if (container) observer.observe(container, { childList: true });
  }

  // ===== Boot Sequence =====
  function runBoot() {
    const screen = document.getElementById('bootScreen');
    const bar = document.getElementById('bootBar');
    const checks = document.querySelectorAll('.boot-check');
    const skip = document.getElementById('bootSkip');
    const shell = document.getElementById('desktopShell');

    let progress = 0;
    const checkNames = ['identity', 'projects', 'systems', 'companion', 'desktop'];
    let checkIndex = 0;

    const finishBoot = () => {
      bar.style.width = '100%';
      checks.forEach(c => { c.classList.add('active'); c.querySelector('b').textContent = 'READY'; });

      setTimeout(() => {
        screen.classList.add('hidden');
        shell.classList.add('active');

        // Play boot sound
        if (window.SoundEngine) window.SoundEngine.bootUp();

        // Init Three.js BG
        const theme = localStorage.getItem('ayush_os_theme') || 'night';
        if (window.ThreeBG) window.ThreeBG.init('threeBg', theme);

        // Init companion after a beat
        setTimeout(() => {
          if (window.Companion) window.Companion.init();
        }, 1500);

      }, 600);
    };

    if (skip) skip.addEventListener('click', finishBoot);

    // Animate boot
    const bootInterval = setInterval(() => {
      progress += 3 + Math.random() * 5;
      if (progress > 100) progress = 100;
      bar.style.width = progress + '%';

      if (checkIndex < checkNames.length && progress > (checkIndex + 1) * 18) {
        const check = document.querySelector(`.boot-check[data-check="${checkNames[checkIndex]}"]`);
        if (check) {
          check.classList.add('active');
          check.querySelector('b').textContent = 'READY';
        }
        checkIndex++;
      }

      if (progress >= 100) {
        clearInterval(bootInterval);
        setTimeout(finishBoot, 400);
      }
    }, 120);
  }

  // ===== Master Init =====
  function init() {
    initTheme();
    renderDesktopIcons();
    generateSparkles();
    updateClock();
    setInterval(updateClock, 15000);
    initSoundToggle();
    initWelcomeCard();
    initTopbarNav();
    initHireTab();
    setupWindowCloseWatcher();

    // Init sound on first interaction
    document.addEventListener('pointerdown', () => {
      if (window.SoundEngine) window.SoundEngine.init();
    }, { once: true });

    // Init dock
    if (window.Dock) window.Dock.init();

    // 3D tilt after icons render
    setTimeout(init3DTilt, 500);

    // Start boot
    runBoot();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
