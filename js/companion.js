/**
 * AYUSH.OS - AYU Interactive Companion Engine
 * 
 * Companion avatar (AYU) sitting in the bottom-left corner of the OS desktop.
 * Features:
 *  - Draggable with screen-bounds clamping & localStorage position memory
 *  - Speech bubbles cycling through ownerProfile.companionMessages every 15s
 *  - 6 Mood States: idle, happy, wave, alert, thinking, celebrate
 *  - Dynamic mood badge (IDLE, HAPPY, WAVING, ALERT, THINKING, CELEBRATE)
 *  - Periodic wave greeting every 30s ("shaking hand & saying hi/hello")
 *  - Click interaction with bounce, sound chirp, and random system tips
 *  - Auto initial greeting on boot: "Hey! Welcome to AYUSH.OS! 👋"
 *  - Audio integration via SoundEngine.companionHello()
 *  - Mobile responsive handling: fixed bottom-left, compact avatar
 *  - Illustrated portrait avatar from ownerProfile canonical data
 * 
 * Export: window.Companion = { init, setMood, say, wave, dismiss }
 */

(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Companion = factory();
  }
}(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // Storage and Timing Configurations
  const STORAGE_KEY = 'ayush_os_companion_pos';
  const CYCLE_INTERVAL = 15000;       // 15 seconds between speech tips
  const WAVE_INTERVAL = 30000;        // 30 seconds periodic wave greeting
  const SPEECH_DURATION = 5500;       // 5.5 seconds speech bubble display
  const INITIAL_GREETING_DELAY = 1800; // 1.8 seconds after boot

  // Fallback messages if ownerProfile is not yet loaded
  const DEFAULT_MESSAGES = [
    'Hey! 👋 Welcome to AYUSH.OS!',
    'I build intelligent systems with AI, data, and code.',
    'Click an app icon to explore my work.',
    'Try the Terminal — type "help" to start!',
    'Check out INTELLIEMO — my emotion AI platform.',
    'SkyGuard AI monitors weather stations in real-time.',
    'Evidence over hype. Systems over screenshots.',
    'Drag me around! I\'ll follow your cursor.',
    'Want to collaborate? Open the Contact app!',
    'Currently studying at Vishwakarma University, Pune.'
  ];

  // Periodic greetings pool for wave animation
  const WAVE_GREETINGS = [
    'Hey! 👋',
    'Hello there!',
    'Hey! Welcome to AYUSH.OS! 👋',
    'Need a hand? Click on me anytime!',
    'Systems running smoothly! 🚀',
    'Greetings from Pune! ☀️',
    'Evidence over hype. 💡',
    'Curious about my projects? Check Finder!'
  ];

  // DOM references
  let companionEl = null;
  let avatarImgEl = null;
  let moodBadgeEl = null;
  let speechBubbleEl = null;

  // State
  let currentMood = 'idle';
  let isInitialized = false;
  let messageIndex = 0;
  let isDragging = false;
  let hasDragged = false;
  let isSpeechVisible = false;

  // Drag tracking
  let pointerStartX = 0;
  let pointerStartY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let companionWidth = 72;
  let companionHeight = 72;

  // Timer references
  let cycleTimer = null;
  let waveTimer = null;
  let bubbleHideTimer = null;
  let moodResetTimer = null;
  let initialGreetingTimer = null;

  /**
   * Safe helper to detect small mobile screens (<= 768px)
   */
  function isMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Retrieves avatar image URL from canonical ownerProfile or defaults
   */
  function getAvatarSrc() {
    if (typeof window !== 'undefined' && window.ownerProfile && window.ownerProfile.identity) {
      const id = window.ownerProfile.identity;
      return id.illustratedPortrait || id.companion || id.photo || id.portrait || 'assets/ayush-illustrated.jpg';
    }
    return 'assets/ayush-illustrated.jpg';
  }

  /**
   * Retrieves message list from canonical ownerProfile or fallbacks
   */
  function getCompanionMessages() {
    if (typeof window !== 'undefined' &&
        window.ownerProfile &&
        Array.isArray(window.ownerProfile.companionMessages) &&
        window.ownerProfile.companionMessages.length > 0) {
      return window.ownerProfile.companionMessages;
    }
    return DEFAULT_MESSAGES;
  }

  /**
   * Synthesize audio chirp using SoundEngine if available
   */
  function playCompanionChirp() {
    try {
      if (typeof window !== 'undefined' &&
          window.SoundEngine &&
          typeof window.SoundEngine.companionHello === 'function') {
        window.SoundEngine.companionHello();
      }
    } catch (e) {
      // AudioContext might be pending user gesture or muted
    }
  }

  /**
   * Injects dynamic CSS rules for animations, mood states, and bubble placement
   */
  function injectCompanionStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('ayu-companion-dynamic-styles')) return;

    const style = document.createElement('style');
    style.id = 'ayu-companion-dynamic-styles';
    style.textContent = `
      /* AYU Companion Dynamic Enhancements */
      .companion {
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
      }
      .companion.is-dragging {
        cursor: grabbing !important;
        transition: none !important;
      }
      .companion.is-dragging .companion-avatar {
        transform: scale(1.1) rotate(2deg) !important;
        box-shadow: 0 16px 32px rgba(0,0,0,0.35), 0 0 24px var(--accent-glow, rgba(56, 189, 248, 0.4)) !important;
      }
      .companion-avatar img {
        user-select: none;
        -webkit-user-drag: none;
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Mood Animation Rules */
      .companion.happy .companion-avatar,
      .companion.bounce .companion-avatar {
        animation: companionBounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite alternate;
      }
      .companion.wave .companion-avatar {
        animation: companionWiggle 0.8s ease-in-out;
      }
      .companion.alert .companion-avatar {
        animation: companionPulse 0.45s ease-in-out infinite alternate;
        border-color: #f59e0b !important;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.5) !important;
      }
      .companion.thinking .companion-avatar {
        animation: companionTiltRotate 3s ease-in-out infinite;
        border-color: #a855f7 !important;
        box-shadow: 0 0 18px rgba(168, 85, 247, 0.45) !important;
      }
      .companion.celebrate .companion-avatar {
        animation: companionCelebrate 0.4s ease 3;
      }

      /* Dynamic Mood Badge Palette */
      .companion-mood {
        transition: background var(--transition-fast, 0.15s ease), color var(--transition-fast, 0.15s ease);
      }
      .companion.happy .companion-mood {
        background: rgba(16, 185, 129, 0.18) !important;
        color: #10b981 !important;
      }
      .companion.wave .companion-mood {
        background: rgba(56, 189, 248, 0.18) !important;
        color: #38bdf8 !important;
      }
      .companion.alert .companion-mood {
        background: rgba(245, 158, 11, 0.2) !important;
        color: #f59e0b !important;
      }
      .companion.thinking .companion-mood {
        background: rgba(168, 85, 247, 0.2) !important;
        color: #a855f7 !important;
      }
      .companion.celebrate .companion-mood {
        background: rgba(236, 72, 153, 0.2) !important;
        color: #ec4899 !important;
      }

      /* Flipped speech bubble arrow when positioned below avatar */
      .speech-bubble.flipped::after {
        bottom: auto !important;
        top: -6px !important;
        border-right: none !important;
        border-bottom: none !important;
        border-left: 1px solid var(--border, rgba(255,255,255,0.12)) !important;
        border-top: 1px solid var(--border, rgba(255,255,255,0.12)) !important;
      }

      /* Dismissed/Hidden State */
      .companion.dismissed {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.8) translateY(20px);
        transition: all 0.35s ease;
      }

      /* Animation Keyframes */
      @keyframes companionBounce {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.05); }
        100% { transform: translateY(0) scale(0.98); }
      }

      @keyframes companionWiggle {
        0% { transform: rotate(0deg); }
        20% { transform: rotate(-14deg) scale(1.08); }
        40% { transform: rotate(14deg) scale(1.08); }
        60% { transform: rotate(-10deg) scale(1.05); }
        80% { transform: rotate(8deg) scale(1.03); }
        100% { transform: rotate(0deg) scale(1); }
      }

      @keyframes companionPulse {
        0% { transform: scale(1); filter: brightness(1); }
        100% { transform: scale(1.09); filter: brightness(1.25); }
      }

      @keyframes companionTiltRotate {
        0% { transform: rotate(0deg) translateY(0); }
        25% { transform: rotate(-9deg) translateY(-3px) scale(1.02); }
        75% { transform: rotate(9deg) translateY(-3px) scale(1.02); }
        100% { transform: rotate(0deg) translateY(0); }
      }

      @keyframes companionCelebrate {
        0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
        35% { transform: translateY(-18px) scale(1.12) rotate(-6deg); }
        65% { transform: translateY(-8px) scale(1.06) rotate(6deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Injects or binds companion and speech bubble DOM structures
   */
  function setupDOM() {
    if (typeof document === 'undefined') return;

    injectCompanionStyles();

    // Check if companion already exists in DOM
    companionEl = document.getElementById('companion');
    speechBubbleEl = document.getElementById('speechBubble');

    const imgSrc = getAvatarSrc();

    if (!companionEl) {
      companionEl = document.createElement('div');
      companionEl.className = 'companion idle';
      companionEl.id = 'companion';
      companionEl.setAttribute('role', 'complementary');
      companionEl.setAttribute('aria-label', 'AYU System Companion');

      companionEl.innerHTML = `
        <div class="companion-avatar">
          <img src="${imgSrc}" alt="AYU" draggable="false" />
        </div>
        <div class="companion-info">
          <span class="companion-name">AYU</span>
          <span class="companion-role">system companion</span>
          <span class="companion-mood">IDLE</span>
        </div>
      `;

      // Inject into body or desktop container
      const targetParent = document.getElementById('desktop') || document.body;
      targetParent.appendChild(companionEl);
    }

    if (!speechBubbleEl) {
      speechBubbleEl = document.createElement('div');
      speechBubbleEl.className = 'speech-bubble';
      speechBubbleEl.id = 'speechBubble';
      speechBubbleEl.setAttribute('aria-live', 'polite');

      const targetParent = document.getElementById('desktop') || document.body;
      targetParent.appendChild(speechBubbleEl);
    }

    // Cache internal sub-element references
    avatarImgEl = companionEl.querySelector('.companion-avatar img');
    moodBadgeEl = companionEl.querySelector('.companion-mood');

    // Fallback error handling on avatar image
    if (avatarImgEl) {
      avatarImgEl.onerror = function () {
        if (!this.dataset.triedFallback1) {
          this.dataset.triedFallback1 = 'true';
          this.src = 'assets/ayu-illustration.jpg';
        } else if (!this.dataset.triedFallback2) {
          this.dataset.triedFallback2 = 'true';
          this.src = 'assets/ayush-photo.jpg';
        }
      };
    }

    // Load saved drag position if on desktop
    restoreSavedPosition();

    // Attach listeners for drag & click interactions
    attachEventListeners();
  }

  /**
   * Restores previously saved companion position from localStorage
   */
  function restoreSavedPosition() {
    if (!companionEl || isMobile()) return;

    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const pos = JSON.parse(raw);
      if (typeof pos.left === 'number' && typeof pos.top === 'number') {
        // Clamp to current viewport
        const clampedX = Math.max(10, Math.min(window.innerWidth - 80, pos.left));
        const clampedY = Math.max(34, Math.min(window.innerHeight - 80, pos.top));

        companionEl.style.left = `${clampedX}px`;
        companionEl.style.top = `${clampedY}px`;
        companionEl.style.bottom = 'auto';
        companionEl.style.right = 'auto';
      }
    } catch (e) {
      // Ignore corrupted localStorage data
    }
  }

  /**
   * Saves companion position to localStorage
   */
  function savePosition(left, top) {
    if (isMobile()) return;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          left: Math.round(left),
          top: Math.round(top)
        }));
      }
    } catch (e) {
      // Storage unavailable or quota exceeded
    }
  }

  /**
   * Calculates and anchors the speech bubble to the companion
   */
  function updateBubblePosition() {
    if (!companionEl || !speechBubbleEl) return;

    if (isMobile()) {
      // Reset inline styling to let CSS responsive rules govern placement
      speechBubbleEl.style.top = '';
      speechBubbleEl.style.left = '';
      speechBubbleEl.style.bottom = '';
      speechBubbleEl.style.right = '';
      speechBubbleEl.classList.remove('flipped');
      return;
    }

    const compRect = companionEl.getBoundingClientRect();
    const bubbleRect = speechBubbleEl.getBoundingClientRect();
    const bubbleHeight = bubbleRect.height || 64;
    const bubbleWidth = bubbleRect.width || 250;

    // Prefer positioning speech bubble above companion
    let top = compRect.top - bubbleHeight - 14;
    let isFlipped = false;

    // If too close to desktop top bar, flip bubble below companion
    if (top < 44) {
      top = compRect.bottom + 14;
      isFlipped = true;
    }

    // Horizontal positioning: align left with avatar, clamp to viewport
    let left = compRect.left;
    if (left + bubbleWidth > window.innerWidth - 20) {
      left = window.innerWidth - bubbleWidth - 20;
    }
    if (left < 14) {
      left = 14;
    }

    speechBubbleEl.style.top = `${Math.round(top)}px`;
    speechBubbleEl.style.left = `${Math.round(left)}px`;
    speechBubbleEl.style.bottom = 'auto';
    speechBubbleEl.style.right = 'auto';

    if (isFlipped) {
      speechBubbleEl.classList.add('flipped');
    } else {
      speechBubbleEl.classList.remove('flipped');
    }
  }

  /**
   * Sets companion mood state and updates badge
   * Moods: idle, happy, wave, alert, thinking, celebrate (or bounce)
   * 
   * @param {string} mood - Target mood name
   * @param {number} [durationMs=0] - Optional timeout to revert back to idle
   */
  function setMood(mood, durationMs = 0) {
    if (!companionEl) return Companion;

    const normalized = String(mood || 'idle').toLowerCase().trim();
    const knownMoods = ['idle', 'happy', 'wave', 'alert', 'thinking', 'celebrate', 'bounce'];
    const activeMood = knownMoods.includes(normalized) ? normalized : 'idle';

    currentMood = activeMood;

    // Clean previous mood classes
    knownMoods.forEach(m => companionEl.classList.remove(m));
    companionEl.classList.add(activeMood);

    // Update mood badge text
    if (moodBadgeEl) {
      let badgeText = activeMood.toUpperCase();
      if (activeMood === 'wave') badgeText = 'WAVING';
      if (activeMood === 'bounce') badgeText = 'BOUNCING';
      moodBadgeEl.textContent = badgeText;
    }

    // Dynamic 3D avatar swap when saying hi / waving
    if (avatarImgEl) {
      if (activeMood === 'wave') {
        avatarImgEl.src = 'assets/ayush-3d-wave.png';
      } else {
        avatarImgEl.src = 'assets/ayush-3d-dashboard.png';
      }
    }

    // Clear any previous auto-revert timer
    if (moodResetTimer) {
      clearTimeout(moodResetTimer);
      moodResetTimer = null;
    }

    // Auto-revert to idle if temporary animation duration specified
    if (durationMs > 0 && activeMood !== 'idle') {
      moodResetTimer = setTimeout(() => {
        setMood('idle');
      }, durationMs);
    }

    return Companion;
  }

  /**
   * Displays speech bubble with text message
   * 
   * @param {string} message - Message to display
   * @param {number} [durationMs=5500] - Duration bubble remains visible
   */
  function say(message, durationMs = SPEECH_DURATION) {
    if (!speechBubbleEl || !companionEl) return Companion;

    const text = String(message || '').trim();
    if (!text) return Companion;

    // Update message text
    speechBubbleEl.textContent = text;
    speechBubbleEl.classList.add('visible');
    isSpeechVisible = true;

    // Reposition bubble relative to companion
    updateBubblePosition();

    // Clear active hide timer
    if (bubbleHideTimer) {
      clearTimeout(bubbleHideTimer);
      bubbleHideTimer = null;
    }

    // Set auto-hide timer
    if (durationMs > 0) {
      bubbleHideTimer = setTimeout(() => {
        dismissSpeechBubble();
      }, durationMs);
    }

    return Companion;
  }

  /**
   * Hides the active speech bubble
   */
  function dismissSpeechBubble() {
    if (speechBubbleEl) {
      speechBubbleEl.classList.remove('visible');
      isSpeechVisible = false;
    }
    if (bubbleHideTimer) {
      clearTimeout(bubbleHideTimer);
      bubbleHideTimer = null;
    }
  }

  /**
   * Executes wave animation, greets the user, and plays cheerful sound
   * 
   * @param {string} [customGreeting] - Optional custom greeting text
   */
  function wave(customGreeting) {
    if (!companionEl) return Companion;

    // Trigger wave animation (0.8s - 1.6s duration)
    setMood('wave', 1600);

    // Audio chirp
    playCompanionChirp();

    // Select greeting
    let greeting = customGreeting;
    if (!greeting) {
      const idx = Math.floor(Math.random() * WAVE_GREETINGS.length);
      greeting = WAVE_GREETINGS[idx];
    }

    // Speak greeting
    say(greeting, 4200);

    return Companion;
  }

  /**
   * Dismisses speech bubble and sets mood to idle.
   * If hideCompanion is true, also hides the companion avatar.
   * 
   * @param {boolean} [hideCompanion=false] - Whether to hide companion avatar
   */
  function dismiss(hideCompanion = false) {
    dismissSpeechBubble();
    setMood('idle');

    if (hideCompanion && companionEl) {
      companionEl.classList.add('dismissed');
    }

    return Companion;
  }

  /**
   * Cycles to the next companion message from ownerProfile.companionMessages
   */
  function cycleMessage() {
    if (!companionEl || !speechBubbleEl) return;

    const messages = getCompanionMessages();
    if (!messages.length) return;

    // Advance message index sequentially
    const msg = messages[messageIndex % messages.length];
    messageIndex = (messageIndex + 1) % messages.length;

    // Slightly bounce companion while speaking
    setMood('happy', 1400);

    // Display speech bubble
    say(msg, SPEECH_DURATION);
  }

  /**
   * Click interaction handler: bounce, play sound, show random message
   */
  function handleClick() {
    // Play sound chirp
    playCompanionChirp();

    // Trigger joyful bounce
    setMood('happy', 1600);

    // Select random message
    const messages = getCompanionMessages();
    const randomIndex = Math.floor(Math.random() * messages.length);
    const msg = messages[randomIndex] || 'Hey! Enjoying AYUSH.OS? ✨';

    say(msg, 5000);

    // Reset cycle and wave timers so they don't immediately overwrite the user's click message
    restartSchedules();
  }

  /**
   * Starts or restarts the periodic 15s message cycle and 30s wave timers
   */
  function restartSchedules() {
    if (cycleTimer) clearInterval(cycleTimer);
    if (waveTimer) clearInterval(waveTimer);

    // Message cycle every 15 seconds
    cycleTimer = setInterval(() => {
      cycleMessage();
    }, CYCLE_INTERVAL);

    // Wave animation every 30 seconds
    waveTimer = setInterval(() => {
      wave();
    }, WAVE_INTERVAL);
  }

  /**
   * Sets up drag and click event handlers on companion
   */
  function attachEventListeners() {
    if (!companionEl) return;

    // --- Pointer Drag & Click Handling ---
    function onPointerDown(e) {
      // Right click or multi-touch ignored
      if (e.button && e.button !== 0) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      pointerStartX = clientX;
      pointerStartY = clientY;
      hasDragged = false;
      isDragging = false;

      const rect = companionEl.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      companionWidth = rect.width;
      companionHeight = rect.height;

      // Listen on window for smooth movement
      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
      window.addEventListener('touchcancel', onPointerUp);
    }

    function onPointerMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - pointerStartX;
      const dy = clientY - pointerStartY;

      // Threshold check to distinguish click vs drag
      if (!isDragging && Math.hypot(dx, dy) > 5) {
        // Dragging disabled on small screens (stays fixed bottom-left per requirement)
        if (isMobile()) return;

        isDragging = true;
        hasDragged = true;
        companionEl.classList.add('is-dragging');
      }

      if (isDragging) {
        if (e.cancelable) e.preventDefault();

        // Calculate new coordinate clamped within viewport bounds
        const minX = 8;
        const maxX = window.innerWidth - companionWidth - 8;
        const minY = 36; // Below system top bar
        const maxY = window.innerHeight - companionHeight - 8;

        const newLeft = Math.max(minX, Math.min(maxX, initialLeft + dx));
        const newTop = Math.max(minY, Math.min(maxY, initialTop + dy));

        companionEl.style.left = `${newLeft}px`;
        companionEl.style.top = `${newTop}px`;
        companionEl.style.bottom = 'auto';
        companionEl.style.right = 'auto';

        // Keep speech bubble attached while dragging
        if (isSpeechVisible) {
          updateBubblePosition();
        }
      }
    }

    function onPointerUp() {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('touchcancel', onPointerUp);

      if (isDragging) {
        isDragging = false;
        companionEl.classList.remove('is-dragging');

        // Persist final position
        const rect = companionEl.getBoundingClientRect();
        savePosition(rect.left, rect.top);

        // Final bubble sync
        if (isSpeechVisible) {
          updateBubblePosition();
        }
      } else if (!hasDragged) {
        // Pure click gesture
        handleClick();
      }
    }

    companionEl.addEventListener('mousedown', onPointerDown);
    companionEl.addEventListener('touchstart', onPointerDown, { passive: true });

    // Speech bubble click dismiss
    if (speechBubbleEl) {
      speechBubbleEl.addEventListener('click', () => {
        dismissSpeechBubble();
      });
    }

    // Window resize handler
    window.addEventListener('resize', () => {
      if (isMobile()) {
        // On mobile, reset inline coordinates to let CSS fixed bottom-left layout apply
        companionEl.style.left = '';
        companionEl.style.top = '';
        companionEl.style.bottom = '';
        companionEl.style.right = '';
      } else {
        // Clamp existing position to new window dimensions
        const rect = companionEl.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 8;
        const maxY = window.innerHeight - rect.height - 8;

        if (rect.left > maxX || rect.top > maxY) {
          const clampedX = Math.max(8, Math.min(maxX, rect.left));
          const clampedY = Math.max(36, Math.min(maxY, rect.top));
          companionEl.style.left = `${clampedX}px`;
          companionEl.style.top = `${clampedY}px`;
          savePosition(clampedX, clampedY);
        }
      }

      if (isSpeechVisible) {
        updateBubblePosition();
      }
    });
  }

  /**
   * Initializes AYU companion, injects DOM elements, schedules auto-greetings & timers
   * 
   * @param {Object} [options]
   * @returns {Object} Companion API
   */
  function init(options = {}) {
    if (isInitialized && companionEl) {
      // Already initialized: ensure restored visibility
      companionEl.classList.remove('dismissed');
      return Companion;
    }

    setupDOM();
    isInitialized = true;

    // Set initial mood to idle
    setMood('idle');

    // Auto Greeting on boot: companion waves and greets user
    const initialDelay = typeof options.greetingDelay === 'number'
      ? options.greetingDelay
      : INITIAL_GREETING_DELAY;

    initialGreetingTimer = setTimeout(() => {
      wave('Hey! Welcome to AYUSH.OS! 👋');
    }, initialDelay);

    // Start 15s speech bubble cycle and 30s wave timer
    restartSchedules();

    return Companion;
  }

  /**
   * Public Companion API Contract
   */
  const Companion = {
    init: init,
    setMood: setMood,
    say: say,
    wave: wave,
    dismiss: dismiss,

    // Supplementary utility methods
    getMood: function () {
      return currentMood;
    },
    celebrate: function () {
      playCompanionChirp();
      setMood('celebrate', 1800);
      say('🎉 Systems operational and ready!', 4000);
      return Companion;
    },
    alert: function (msg) {
      setMood('alert', 2500);
      say(msg || 'System notice incoming!', 4500);
      return Companion;
    },
    think: function (msg) {
      setMood('thinking', 3000);
      say(msg || 'Analyzing system telemetry...', 4000);
      return Companion;
    },
    resetPosition: function () {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {}

      if (companionEl) {
        companionEl.style.left = '';
        companionEl.style.top = '';
        companionEl.style.bottom = '';
        companionEl.style.right = '';
      }
      if (isSpeechVisible) {
        updateBubblePosition();
      }
      return Companion;
    },
    show: function () {
      if (companionEl) {
        companionEl.classList.remove('dismissed');
      }
      return Companion;
    }
  };

  // Auto-init on DOMContentLoaded if document ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Small timeout to allow other scripts (e.g. data.js) to load
      setTimeout(() => {
        if (!isInitialized) init();
      }, 50);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (!isInitialized) init();
      });
    }
  }

  return Companion;
}));
