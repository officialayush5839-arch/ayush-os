/**
 * AYUSH.OS — Dock System
 * High-fidelity macOS-inspired dock with fish-eye magnification,
 * app launch bounce animations, active app indicators, procedural sound integration,
 * touch gestures for mobile, and AppLauncher connectivity.
 *
 * Window Export:
 *   window.Dock = { init, addItem, setActive, bounce, ... }
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Dock = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Configuration Constants
  const DOCK_SELECTOR = '.dock';
  const DOCK_CONTAINER_SELECTOR = '.dock-container';
  const MAX_RADIUS = 140;        // Maximum pixel distance for fish-eye magnification
  const MAX_SCALE = 1.42;        // Peak magnification factor for the hovered icon
  const MAX_LIFT = 10;           // Peak upward translation in pixels
  const BOUNCE_DURATION = 600;   // Duration of dockBounce keyframe animation in ms

  // Default Dock Applications in Canonical Order
  const DEFAULT_ITEMS = [
    {
      id: 'projects',
      label: 'Projects',
      icon: '📂'
    },
    {
      id: 'systems',
      label: 'Systems',
      icon: '⚙️'
    },
    {
      id: 'proof',
      label: 'Proof',
      icon: '📊'
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: '⬛'
    },
    {
      type: 'separator',
      id: 'separator-1'
    },
    {
      id: 'whiteboard',
      label: 'Whiteboard',
      icon: '🎨'
    },
    {
      id: 'music',
      label: 'Music',
      icon: '🎵'
    },
    {
      id: 'voice-agent',
      label: 'Voice Agent',
      icon: '🎙️',
      aliases: ['voice', 'voiceagent', 'voice-assistant']
    },
    {
      type: 'separator',
      id: 'separator-2'
    },
    {
      id: 'journey',
      label: 'Journey',
      icon: '🗺️'
    },
    {
      id: 'founder',
      label: 'Profile / Founder.txt',
      icon: '📝',
      aliases: ['profile', 'founder-txt', 'founder.txt', 'founder_txt']
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '✉️'
    }
  ];

  // Internal State
  let items = [];
  let activeAppIds = new Set();
  let dockElement = null;
  let dockContainerElement = null;
  let isInitialized = false;
  let lastHoveredId = null;
  let rafId = null;
  let pendingMouseX = null;
  let isTouching = false;
  let activeTouchItemEl = null;
  let resetTransitionTimer = null;

  /**
   * Normalize an appId string for safe comparison and alias lookup.
   * @param {string} id
   * @returns {string}
   */
  function normalizeId(id) {
    if (!id) return '';
    return String(id).trim().toLowerCase();
  }

  /**
   * Check if prefers-reduced-motion is active.
   * @returns {boolean}
   */
  function isReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /**
   * Locate an item configuration by id or alias.
   * @param {string} appId
   * @returns {Object|null}
   */
  function findItemConfig(appId) {
    if (!appId) return null;
    const target = normalizeId(appId);

    return items.find(item => {
      if (!item || item.type === 'separator' || item.separator) return false;
      if (normalizeId(item.id) === target) return true;

      // Check registered aliases
      if (Array.isArray(item.aliases)) {
        if (item.aliases.some(a => normalizeId(a) === target)) return true;
      }

      // Hardened fallbacks for canonical system apps
      if ((target === 'founder' || target === 'profile' || target === 'founder-txt' || target === 'founder.txt') &&
          (normalizeId(item.id) === 'founder' || normalizeId(item.id) === 'profile')) {
        return true;
      }
      if ((target === 'voice' || target === 'voice-agent' || target === 'voiceagent') &&
          (normalizeId(item.id) === 'voice' || normalizeId(item.id) === 'voice-agent')) {
        return true;
      }

      return false;
    }) || null;
  }

  /**
   * Locate the DOM element for a dock item by appId or alias.
   * @param {string} appId
   * @returns {HTMLElement|null}
   */
  function findItemElement(appId) {
    const config = findItemConfig(appId);
    if (!config || !dockElement) return null;
    return dockElement.querySelector(
      `.dock-item[data-id="${config.id}"], .dock-item[data-app="${config.id}"], .dock-item[data-app-id="${config.id}"]`
    );
  }

  /**
   * Safely play hover sound from SoundEngine.
   */
  function playHoverSound(id) {
    if (lastHoveredId === id) return;
    lastHoveredId = id;
    if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.hover === 'function') {
      try {
        window.SoundEngine.hover();
      } catch (e) {
        console.debug('[Dock.SoundEngine.hover]', e);
      }
    }
  }

  /**
   * Safely play click sound from SoundEngine.
   */
  function playClickSound() {
    if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
      try {
        window.SoundEngine.click();
      } catch (e) {
        console.debug('[Dock.SoundEngine.click]', e);
      }
    }
  }

  /**
   * Safely play dockBounce sound from SoundEngine.
   */
  function playDockBounceSound() {
    if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.dockBounce === 'function') {
      try {
        window.SoundEngine.dockBounce();
      } catch (e) {
        console.debug('[Dock.SoundEngine.dockBounce]', e);
      }
    }
  }

  /**
   * Ensure necessary CSS helper styles for touch and accessibility are in place.
   */
  function injectHelperStyles() {
    const styleId = 'ayush-os-dock-enhancements';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .dock-item:focus-visible .dock-tooltip,
      .dock-item.touch-active .dock-tooltip {
        opacity: 1 !important;
        transform: translateX(-50%) translateY(0) !important;
      }
      .dock-item:focus-visible .dock-icon {
        border-color: var(--accent, #00ff88);
        box-shadow: 0 0 12px var(--accent-glow, rgba(0, 255, 136, 0.4));
      }
      .dock-item.touch-active .dock-icon {
        transform: scale(1.3) translateY(-6px);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Resolve or construct the .dock and .dock-container DOM elements.
   * @param {string|HTMLElement} [target]
   * @returns {HTMLElement|null}
   */
  function ensureDockElement(target) {
    if (target instanceof HTMLElement) {
      dockElement = target;
      dockContainerElement = dockElement.closest(DOCK_CONTAINER_SELECTOR) || dockElement.parentElement;
      return dockElement;
    }

    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        dockElement = el;
        dockContainerElement = dockElement.closest(DOCK_CONTAINER_SELECTOR) || dockElement.parentElement;
        return dockElement;
      }
    }

    // Try finding existing .dock
    dockElement = document.querySelector(DOCK_SELECTOR);
    if (dockElement) {
      dockContainerElement = dockElement.closest(DOCK_CONTAINER_SELECTOR) || dockElement.parentElement;
      return dockElement;
    }

    // If .dock doesn't exist, check for .dock-container
    dockContainerElement = document.querySelector(DOCK_CONTAINER_SELECTOR);
    if (!dockContainerElement) {
      dockContainerElement = document.createElement('div');
      dockContainerElement.className = 'dock-container';
      const shell = document.querySelector('.desktop-shell') || document.body;
      shell.appendChild(dockContainerElement);
    }

    dockElement = document.createElement('div');
    dockElement.className = 'dock';
    dockElement.setAttribute('role', 'toolbar');
    dockElement.setAttribute('aria-label', 'AYUSH.OS Application Dock');
    dockContainerElement.appendChild(dockElement);

    return dockElement;
  }

  /**
   * Render a single dock item element into the DOM.
   * @param {Object} itemConfig
   * @returns {HTMLElement}
   */
  function createItemElement(itemConfig) {
    // 1. Separator Element
    if (itemConfig.type === 'separator' || itemConfig.separator) {
      const sep = document.createElement('div');
      sep.className = 'dock-separator';
      sep.setAttribute('role', 'separator');
      sep.setAttribute('aria-orientation', 'vertical');
      if (itemConfig.id) {
        sep.setAttribute('data-id', itemConfig.id);
        sep.dataset.id = itemConfig.id;
      }
      return sep;
    }

    // 2. Interactive Dock Item Element
    const itemEl = document.createElement('div');
    itemEl.className = 'dock-item';
    itemEl.setAttribute('data-id', itemConfig.id);
    itemEl.setAttribute('data-app', itemConfig.id);
    itemEl.dataset.id = itemConfig.id;

    if (Array.isArray(itemConfig.aliases) && itemConfig.aliases.length > 0) {
      itemEl.setAttribute('data-app-id', itemConfig.aliases[0]);
    } else {
      itemEl.setAttribute('data-app-id', itemConfig.id);
    }
    itemEl.setAttribute('role', 'button');
    itemEl.setAttribute('tabindex', '0');
    itemEl.setAttribute('aria-label', itemConfig.label || itemConfig.id);

    if (activeAppIds.has(itemConfig.id)) {
      itemEl.classList.add('active');
      itemEl.setAttribute('aria-pressed', 'true');
    }

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'dock-tooltip';
    tooltip.textContent = itemConfig.label || itemConfig.id;
    itemEl.appendChild(tooltip);

    // Icon container
    const icon = document.createElement('div');
    icon.className = 'dock-icon';
    icon.textContent = itemConfig.icon || '🚀';
    itemEl.appendChild(icon);

    // Bind item click
    itemEl.addEventListener('click', (e) => {
      e.stopPropagation();
      handleItemClick(itemConfig, e);
    });

    // Keyboard navigation (Enter / Space)
    itemEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleItemClick(itemConfig, e);
      }
    });

    return itemEl;
  }

  /**
   * Handle launching and activating an app when its dock icon is triggered.
   * @param {Object} itemConfig
   * @param {Event} event
   */
  function handleItemClick(itemConfig, event) {
    if (!itemConfig || itemConfig.type === 'separator' || itemConfig.separator) return;

    // 1. Trigger audio feedback: both click and dockBounce sounds
    playClickSound();
    playDockBounceSound();

    // 2. Trigger Mac-style bounce animation
    bounce(itemConfig.id);

    // 3. Invoke custom onClick handler if specified in config
    if (typeof itemConfig.onClick === 'function') {
      try {
        itemConfig.onClick(itemConfig, event);
      } catch (err) {
        console.error('[Dock] Error in custom item onClick handler:', err);
      }
    }

    // 4. Connect to window.AppLauncher if available
    launchAppViaAppLauncher(itemConfig);

    // 5. Broadcast custom OS event for modular listeners
    try {
      window.dispatchEvent(new CustomEvent('ayush-os:app-launch', {
        detail: { appId: itemConfig.id, config: itemConfig }
      }));
    } catch (e) {}
  }

  /**
   * Launch application through window.AppLauncher with intelligent alias resolution.
   * @param {Object} itemConfig
   */
  function launchAppViaAppLauncher(itemConfig) {
    if (typeof window === 'undefined' || !window.AppLauncher || typeof window.AppLauncher.launch !== 'function') {
      return;
    }

    const primaryId = itemConfig.id;
    const candidates = [primaryId];
    if (Array.isArray(itemConfig.aliases)) {
      candidates.push(...itemConfig.aliases);
    }

    // Check if AppLauncher has a specific registry or query method
    let resolvedId = primaryId;
    if (typeof window.AppLauncher.getAppConfig === 'function') {
      const matched = candidates.find(cand => Boolean(window.AppLauncher.getAppConfig(cand)));
      if (matched) resolvedId = matched;
    } else if (typeof window.AppLauncher.hasApp === 'function') {
      const matched = candidates.find(cand => window.AppLauncher.hasApp(cand));
      if (matched) resolvedId = matched;
    } else if (window.AppLauncher.apps && typeof window.AppLauncher.apps === 'object') {
      const matched = candidates.find(cand => Boolean(window.AppLauncher.apps[cand]));
      if (matched) resolvedId = matched;
    }

    try {
      window.AppLauncher.launch(resolvedId);
    } catch (err) {
      console.warn(`[Dock] AppLauncher.launch failed for "${resolvedId}":`, err);
      // If primary launch threw an error, try the first alternative alias if available
      if (candidates.length > 1 && resolvedId === primaryId) {
        try {
          window.AppLauncher.launch(candidates[1]);
        } catch (e2) {}
      }
    }
  }

  /**
   * Recalculate and apply fish-eye magnification to dock icons.
   * Calculates distance between cursor/touch and each dock item's horizontal center.
   * @param {number} mouseX
   */
  function updateMagnification(mouseX) {
    if (!dockElement || isReducedMotion()) return;

    const itemEls = dockElement.querySelectorAll('.dock-item');
    if (!itemEls.length) return;

    let closestItem = null;
    let closestDist = Infinity;

    itemEls.forEach(itemEl => {
      const iconEl = itemEl.querySelector('.dock-icon');
      if (!iconEl) return;

      // If an icon is actively bouncing, let the keyframe animation own the transform
      if (itemEl.classList.contains('bouncing')) {
        return;
      }

      // Calculate horizontal center of the dock-item container.
      // We measure itemEl instead of iconEl because itemEl's layout box remains constant,
      // preventing geometric feedback jitter.
      const rect = itemEl.getBoundingClientRect();
      const itemCenterX = rect.left + (rect.width / 2);
      const dist = Math.abs(mouseX - itemCenterX);

      if (dist < closestDist) {
        closestDist = dist;
        closestItem = itemEl;
      }

      if (dist < MAX_RADIUS) {
        // Cosine bell curve wave function (macOS Sonoma / Sequoia aesthetic)
        const norm = dist / MAX_RADIUS; // 0 (exact center) to 1 (outer edge)
        const factor = 0.5 * (1 + Math.cos(norm * Math.PI)); // 1.0 down to 0.0
        const scale = 1.0 + ((MAX_SCALE - 1.0) * factor);
        const translateY = -(MAX_LIFT * factor);

        iconEl.style.transition = 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)';
        iconEl.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(2)}px)`;
        itemEl.style.zIndex = String(Math.round(scale * 100));
      } else {
        iconEl.style.transition = 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)';
        iconEl.style.transform = 'scale(1) translateY(0px)';
        itemEl.style.zIndex = '1';
      }
    });

    // Play subtle hover sound when crossing the threshold into a new item
    if (closestItem && closestDist < (closestItem.offsetWidth || 50)) {
      const id = closestItem.dataset?.id || closestItem.getAttribute('data-id');
      if (id) {
        playHoverSound(id);
      }
    }
  }

  /**
   * Reset all icon transforms and transitions smoothly when cursor leaves the dock.
   */
  function resetMagnification() {
    if (!dockElement) return;

    if (resetTransitionTimer) {
      clearTimeout(resetTransitionTimer);
      resetTransitionTimer = null;
    }

    const itemEls = dockElement.querySelectorAll('.dock-item');
    itemEls.forEach(itemEl => {
      itemEl.style.zIndex = '';
      const iconEl = itemEl.querySelector('.dock-icon');
      if (iconEl && !itemEl.classList.contains('bouncing')) {
        // macOS spring release curve
        iconEl.style.transition = 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)';
        iconEl.style.transform = 'scale(1) translateY(0px)';
      }
    });

    // Clear inline transform and transition after animation settles so native CSS resumes
    resetTransitionTimer = setTimeout(() => {
      itemEls.forEach(itemEl => {
        const iconEl = itemEl.querySelector('.dock-icon');
        if (iconEl && !itemEl.classList.contains('bouncing')) {
          iconEl.style.transition = '';
          iconEl.style.transform = '';
        }
      });
      resetTransitionTimer = null;
    }, 350);

    lastHoveredId = null;
  }

  /**
   * Set up desktop mouse tracking and hover events.
   */
  function attachMouseListeners() {
    if (!dockElement) return;

    dockElement.addEventListener('mousemove', (e) => {
      if (isTouching) return; // Prioritize touch handler when touching
      pendingMouseX = e.clientX;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (pendingMouseX !== null) {
            updateMagnification(pendingMouseX);
          }
        });
      }
    }, { passive: true });

    dockElement.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingMouseX = null;
      resetMagnification();
    });

    // Extra safety: clean up if window loses focus or pointer exits viewport
    window.addEventListener('blur', resetMagnification);
  }

  /**
   * Set up mobile touch gestures: gliding magnification and tap to launch.
   */
  function attachTouchListeners() {
    if (!dockElement) return;

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      isTouching = true;
      const touch = e.touches[0];
      handleTouchMove(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      // Prevent screen bouncing when sliding across dock
      if (e.cancelable && dockElement.contains(document.elementFromPoint(touch.clientX, touch.clientY))) {
        e.preventDefault();
      }
      handleTouchMove(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (e) => {
      if (activeTouchItemEl) {
        const targetId = activeTouchItemEl.dataset?.id || activeTouchItemEl.getAttribute('data-id');
        const config = findItemConfig(targetId);
        if (config) {
          handleItemClick(config, e);
        }
        activeTouchItemEl.classList.remove('touch-active');
        activeTouchItemEl = null;
      }

      isTouching = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      resetMagnification();
    };

    const onTouchCancel = () => {
      if (activeTouchItemEl) {
        activeTouchItemEl.classList.remove('touch-active');
        activeTouchItemEl = null;
      }
      isTouching = false;
      resetMagnification();
    };

    dockElement.addEventListener('touchstart', onTouchStart, { passive: true });
    dockElement.addEventListener('touchmove', onTouchMove, { passive: false });
    dockElement.addEventListener('touchend', onTouchEnd, { passive: true });
    dockElement.addEventListener('touchcancel', onTouchCancel, { passive: true });
  }

  /**
   * Process touch coordinates across the dock bar.
   * @param {number} clientX
   * @param {number} clientY
   */
  function handleTouchMove(clientX, clientY) {
    updateMagnification(clientX);

    // Identify which item is directly under finger
    const elementUnderTouch = document.elementFromPoint(clientX, clientY);
    const itemEl = elementUnderTouch ? elementUnderTouch.closest('.dock-item') : null;

    if (itemEl !== activeTouchItemEl) {
      if (activeTouchItemEl) {
        activeTouchItemEl.classList.remove('touch-active');
      }
      if (itemEl) {
        itemEl.classList.add('touch-active');
        const id = itemEl.dataset?.id || itemEl.getAttribute('data-id');
        if (id) playHoverSound(id);
      }
      activeTouchItemEl = itemEl;
    }
  }

  /**
   * Render all items into the .dock element.
   */
  function render() {
    if (!dockElement) return;

    // Clear previous DOM contents safely
    dockElement.innerHTML = '';

    const fragment = document.createDocumentFragment();
    items.forEach(config => {
      const el = createItemElement(config);
      fragment.appendChild(el);
    });

    dockElement.appendChild(fragment);
  }

  // ============================================================
  // Public API
  // ============================================================

  const Dock = {
    /**
     * Initialize the dock system.
     * Renders items into `.dock`, sets up magnification, bounce, sound, and touch listeners.
     * @param {Object} [options] Optional configuration options
     * @param {string|HTMLElement} [options.container] Custom selector or element for dock
     * @param {Array<Object>} [options.items] Custom initial dock items
     * @returns {Object} The Dock instance for chaining
     */
    init: function (options = {}) {
      injectHelperStyles();

      const target = options.container || DOCK_SELECTOR;
      ensureDockElement(target);

      if (!dockElement) {
        console.warn('[Dock] Unable to initialize: target element could not be found or created.');
        return Dock;
      }

      // Populate items: provided list or default AYUSH.OS applications
      if (Array.isArray(options.items) && options.items.length > 0) {
        items = options.items.map(item => ({ ...item }));
      } else if (items.length === 0) {
        items = DEFAULT_ITEMS.map(item => ({ ...item }));
      }

      render();

      if (!isInitialized) {
        attachMouseListeners();
        attachTouchListeners();
        isInitialized = true;
      }

      return Dock;
    },

    /**
     * Add a new item or separator to the dock.
     * @param {Object} config Item configuration { id, label, icon, onClick, type, separator, aliases }
     * @returns {Object} The Dock instance
     */
    addItem: function (config) {
      if (!config) return Dock;

      // Check if item with this ID already exists
      if (config.id && !config.separator && config.type !== 'separator') {
        const existingIndex = items.findIndex(i => i.id === config.id);
        if (existingIndex !== -1) {
          items[existingIndex] = { ...items[existingIndex], ...config };
          render();
          return Dock;
        }
      }

      items.push({ ...config });

      if (dockElement) {
        const el = createItemElement(config);
        dockElement.appendChild(el);
      } else {
        render();
      }

      return Dock;
    },

    /**
     * Set active dot indicator state below open applications.
     * @param {string} appId The ID or alias of the target app
     * @param {boolean} [active=true] Whether the app is active
     * @returns {boolean} True if matching item was found and updated, false otherwise
     */
    setActive: function (appId, active = true) {
      const config = findItemConfig(appId);
      if (!config) return false;

      const isAppActive = Boolean(active);
      if (isAppActive) {
        activeAppIds.add(config.id);
      } else {
        activeAppIds.delete(config.id);
      }

      const itemEl = findItemElement(config.id);
      if (itemEl) {
        if (isAppActive) {
          itemEl.classList.add('active');
          itemEl.setAttribute('aria-pressed', 'true');
        } else {
          itemEl.classList.remove('active');
          itemEl.setAttribute('aria-pressed', 'false');
        }
        return true;
      }

      return false;
    },

    /**
     * Trigger the macOS-style bouncing animation on an application icon.
     * Plays SoundEngine.dockBounce() and toggles the `dockBounce` CSS keyframe animation.
     * @param {string} appId The ID or alias of the app to bounce
     * @returns {boolean} True if item was found and bounce started, false otherwise
     */
    bounce: function (appId) {
      const config = findItemConfig(appId);
      if (!config) return false;

      const itemEl = findItemElement(config.id);
      if (!itemEl) return false;

      const iconEl = itemEl.querySelector('.dock-icon');
      if (!iconEl) return false;

      // Play procedural dock bounce sound chime
      playDockBounceSound();

      // Reset any active inline transform to let the keyframe animation operate smoothly
      iconEl.style.transform = '';
      iconEl.style.transition = '';

      // Force animation restart if already bouncing
      itemEl.classList.remove('bouncing');
      void itemEl.offsetWidth; // Trigger browser reflow

      itemEl.classList.add('bouncing');

      const cleanupBounce = () => {
        itemEl.classList.remove('bouncing');
        itemEl.removeEventListener('animationend', cleanupBounce);
      };

      itemEl.addEventListener('animationend', cleanupBounce, { once: true });

      // Fallback timeout in case animationend does not fire (e.g. tab in background)
      setTimeout(cleanupBounce, BOUNCE_DURATION + 50);

      return true;
    },

    /**
     * Retrieve all current dock item configurations.
     * @returns {Array<Object>}
     */
    getItems: function () {
      return items.map(i => ({ ...i }));
    },

    /**
     * Retrieve a specific item configuration by appId or alias.
     * @param {string} appId
     * @returns {Object|null}
     */
    getItem: function (appId) {
      const config = findItemConfig(appId);
      return config ? { ...config } : null;
    },

    /**
     * Remove an item from the dock by its ID.
     * @param {string} appId
     * @returns {boolean}
     */
    removeItem: function (appId) {
      const config = findItemConfig(appId);
      if (!config) return false;

      items = items.filter(i => i.id !== config.id);
      activeAppIds.delete(config.id);

      const itemEl = findItemElement(config.id);
      if (itemEl && itemEl.parentNode) {
        itemEl.parentNode.removeChild(itemEl);
        return true;
      }

      render();
      return true;
    },

    /**
     * Destroy the dock instance and clean up listeners.
     */
    destroy: function () {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (resetTransitionTimer) {
        clearTimeout(resetTransitionTimer);
        resetTransitionTimer = null;
      }
      if (dockElement) {
        dockElement.innerHTML = '';
      }
      isInitialized = false;
      lastHoveredId = null;
      isTouching = false;
      activeTouchItemEl = null;
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.Dock = Dock;

    // Automatic DOM initialization when document is ready if .dock exists or auto-boot is expected
    const autoInit = function () {
      if (document.querySelector(DOCK_SELECTOR) || document.querySelector(DOCK_CONTAINER_SELECTOR)) {
        Dock.init();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit, { once: true });
    } else {
      autoInit();
    }
  }

  return Dock;
}));
