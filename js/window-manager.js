/**
 * AYUSH.OS — Window Management System
 * Production-ready draggable, resizable, stackable window manager.
 * 
 * Export: window.WindowManager
 * Zero external dependencies.
 */

(function (root) {
  'use strict';

  // Master window state registry: windowId -> WindowState
  const windowsMap = new Map();

  // Stacking context counters
  const BASE_Z_INDEX = 50;
  let currentZIndex = BASE_Z_INDEX;

  // Viewport & layout dimensions
  const TOPBAR_HEIGHT = 36;
  const DOCK_RESERVE = 88;
  const MIN_WIDTH = 360;
  const MIN_HEIGHT = 240;
  const CASCADE_STEP = 30;

  // Cascading coordinate tracker
  let cascadeOffset = { x: 70, y: 55 };

  /**
   * Dispatches a custom event on the window object.
   * @param {string} name 
   * @param {Object} detail 
   */
  function emitEvent(name, detail) {
    try {
      if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
        const event = new CustomEvent(name, { detail, bubbles: true });
        window.dispatchEvent(event);
      }
    } catch (e) {
      console.debug('[WindowManager.emitEvent]', e);
    }
  }

  /**
   * Safely plays audio through the procedural SoundEngine.
   * @param {string} soundName 
   */
  function playSound(soundName) {
    try {
      if (typeof window !== 'undefined' && window.SoundEngine) {
        if (typeof window.SoundEngine[soundName] === 'function') {
          window.SoundEngine[soundName]();
        }
      }
    } catch (e) {
      console.debug('[WindowManager.playSound]', e);
    }
  }

  /**
   * Sanitizes text strings for safe injection into window title.
   * @param {string} str 
   * @returns {string}
   */
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Resolves the primary container element for windows.
   * @returns {HTMLElement}
   */
  function getContainer() {
    return (
      document.querySelector('.desktop-content') ||
      document.querySelector('#desktopContent') ||
      document.querySelector('.desktop-shell') ||
      document.body
    );
  }

  /**
   * Synchronizes dock items reflecting window open/active/minimized states.
   * @param {string} appId 
   */
  function updateDock(appId) {
    if (!appId) return;

    try {
      const dockItems = document.querySelectorAll(
        `.dock-item[data-app="${appId}"], .dock-item[data-app-id="${appId}"], .dock-item[data-id="${appId}"]`
      );

      if (!dockItems || dockItems.length === 0) return;

      const appWindows = Array.from(windowsMap.values()).filter(w => w.appId === appId);
      const hasOpenWindow = appWindows.length > 0;
      const isAllMinimized = hasOpenWindow && appWindows.every(w => w.minimized);
      const hasFocused = hasOpenWindow && appWindows.some(w => w.focused && !w.minimized);

      dockItems.forEach(item => {
        item.classList.toggle('active', hasOpenWindow);
        item.classList.toggle('minimized', isAllMinimized);
        item.classList.toggle('focused', hasFocused);
        item.setAttribute('aria-expanded', String(hasOpenWindow));
      });
    } catch (e) {
      console.debug('[WindowManager.updateDock]', e);
    }
  }

  /**
   * Clamps window position and dimensions strictly within viewport boundaries.
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  function clampBounds(x, y, width, height) {
    const vpWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
    const vpHeight = window.innerHeight || document.documentElement.clientHeight || 768;

    // Viewport-adaptive maximums
    const maxWidth = Math.max(MIN_WIDTH, vpWidth - 24);
    const maxHeight = Math.max(MIN_HEIGHT, vpHeight - TOPBAR_HEIGHT - DOCK_RESERVE - 16);

    const clampedW = Math.max(MIN_WIDTH, Math.min(width, maxWidth));
    const clampedH = Math.max(MIN_HEIGHT, Math.min(height, maxHeight));

    // Clamp coordinates:
    // Window header must remain below topbar and above bottom edge
    const minY = TOPBAR_HEIGHT + 6;
    const maxY = Math.max(minY, vpHeight - 48);

    // Keep at least 60px of the title bar inside screen horizontally
    const minX = -(clampedW - 80);
    const maxX = vpWidth - 80;

    let clampedX = Math.max(minX, Math.min(x, maxX));
    let clampedY = Math.max(minY, Math.min(y, maxY));

    // For initial placement, ensure whole window fits when possible
    if (clampedX + clampedW > vpWidth - 12) {
      clampedX = Math.max(12, vpWidth - clampedW - 12);
    }
    if (clampedY + clampedH > vpHeight - DOCK_RESERVE) {
      clampedY = Math.max(minY, vpHeight - DOCK_RESERVE - clampedH - 12);
    }

    return {
      x: Math.round(clampedX),
      y: Math.round(clampedY),
      width: Math.round(clampedW),
      height: Math.round(clampedH)
    };
  }

  /**
   * Obtains the next highest z-index.
   * @returns {number}
   */
  function getNextZIndex() {
    return ++currentZIndex;
  }

  /**
   * Draggable Title Bar Engine
   * Smooth physics, boundary bounding, multi-pointer & touch support.
   * @param {HTMLElement} winEl 
   * @param {HTMLElement} barEl 
   * @param {string} windowId 
   */
  function setupDraggable(winEl, barEl, windowId) {
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let initialWinX = 0;
    let initialWinY = 0;
    let rafId = null;

    function onPointerDown(e) {
      // Ignore right clicks or clicks on window dots / controls
      if (e.type === 'mousedown' && e.button !== 0) return;
      if (e.target.closest('.window-dot') || e.target.closest('button') || e.target.closest('a')) {
        return;
      }

      const winState = windowsMap.get(windowId);
      if (!winState) return;

      // Bring window to front immediately
      WindowManager.focus(windowId);

      // Disallow moving while maximized
      if (winState.maximized) return;

      isDragging = true;
      const point = e.touches ? e.touches[0] : e;
      startPointerX = point.clientX;
      startPointerY = point.clientY;

      const rect = winEl.getBoundingClientRect();
      initialWinX = rect.left;
      initialWinY = rect.top;

      barEl.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';

      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp, { passive: false });
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp, { passive: false });
      window.addEventListener('touchcancel', onPointerUp, { passive: false });

      if (e.cancelable) e.preventDefault();
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();

      const point = e.touches ? e.touches[0] : e;
      const deltaX = point.clientX - startPointerX;
      const deltaY = point.clientY - startPointerY;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const winState = windowsMap.get(windowId);
        if (!winState || winState.maximized) return;

        const rawX = initialWinX + deltaX;
        const rawY = initialWinY + deltaY;

        const bounds = clampBounds(rawX, rawY, winState.width, winState.height);

        winEl.style.left = bounds.x + 'px';
        winEl.style.top = bounds.y + 'px';

        winState.x = bounds.x;
        winState.y = bounds.y;
      });
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      barEl.style.cursor = '';
      document.body.style.userSelect = '';

      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('touchcancel', onPointerUp);

      const winState = windowsMap.get(windowId);
      if (winState) {
        emitEvent('window:moved', { windowId, x: winState.x, y: winState.y });
      }
    }

    barEl.addEventListener('mousedown', onPointerDown);
    barEl.addEventListener('touchstart', onPointerDown, { passive: false });

    // Double-click title bar to toggle maximize
    barEl.addEventListener('dblclick', (e) => {
      if (e.target.closest('.window-dot') || e.target.closest('button')) return;
      WindowManager.maximize(windowId);
    });
  }

  /**
   * Resizable Window Engine
   * Smooth multi-directional corner and edge resizing with boundary clamping.
   * @param {HTMLElement} winEl 
   * @param {HTMLElement} resizeHandle 
   * @param {string} windowId 
   */
  function setupResizable(winEl, resizeHandle, windowId) {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    let rafId = null;

    function onResizeStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;

      const winState = windowsMap.get(windowId);
      if (!winState || winState.maximized) return;

      isResizing = true;
      WindowManager.focus(windowId);

      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;

      const rect = winEl.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;

      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
      winEl.classList.add('resizing');

      window.addEventListener('mousemove', onResizeMove, { passive: false });
      window.addEventListener('mouseup', onResizeEnd, { passive: false });
      window.addEventListener('touchmove', onResizeMove, { passive: false });
      window.addEventListener('touchend', onResizeEnd, { passive: false });
      window.addEventListener('touchcancel', onResizeEnd, { passive: false });

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }

    function onResizeMove(e) {
      if (!isResizing) return;
      if (e.cancelable) e.preventDefault();

      const point = e.touches ? e.touches[0] : e;
      const deltaX = point.clientX - startX;
      const deltaY = point.clientY - startY;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const winState = windowsMap.get(windowId);
        if (!winState || winState.maximized) return;

        const vpWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
        const vpHeight = window.innerHeight || document.documentElement.clientHeight || 768;

        const maxAvailableW = Math.max(MIN_WIDTH, vpWidth - winState.x - 12);
        const maxAvailableH = Math.max(MIN_HEIGHT, vpHeight - winState.y - DOCK_RESERVE);

        const newW = Math.max(MIN_WIDTH, Math.min(startW + deltaX, maxAvailableW));
        const newH = Math.max(MIN_HEIGHT, Math.min(startH + deltaY, maxAvailableH));

        winEl.style.width = Math.round(newW) + 'px';
        winEl.style.height = Math.round(newH) + 'px';

        winState.width = Math.round(newW);
        winState.height = Math.round(newH);
      });
    }

    function onResizeEnd() {
      if (!isResizing) return;
      isResizing = false;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      winEl.classList.remove('resizing');

      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeEnd);
      window.removeEventListener('touchmove', onResizeMove);
      window.removeEventListener('touchend', onResizeEnd);
      window.removeEventListener('touchcancel', onResizeEnd);

      const winState = windowsMap.get(windowId);
      if (winState) {
        emitEvent('window:resized', {
          windowId,
          width: winState.width,
          height: winState.height
        });
      }
    }

    resizeHandle.addEventListener('mousedown', onResizeStart);
    resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
  }

  /**
   * Finds and focuses the next highest z-index visible window.
   */
  function focusNextTopWindow() {
    let highestWin = null;
    let maxZ = -1;

    windowsMap.forEach(win => {
      if (!win.minimized && !win.isClosing) {
        if (win.zIndex > maxZ) {
          maxZ = win.zIndex;
          highestWin = win;
        }
      }
    });

    if (highestWin) {
      WindowManager.focus(highestWin.id);
    }
  }

  // ============================================================
  // WindowManager Public Interface
  // ============================================================
  const WindowManager = {
    /**
     * Opens a new window at a smart cascading position.
     * @param {string} appId - Identifier of the application
     * @param {string} title - Window bar title text
     * @param {string} contentHTML - HTML body string
     * @param {Object} [options] - Configuration options:
     *   { width, height, x, y, maximized, icon, forceNew }
     * @returns {string} windowId
     */
    open: function (appId, title, contentHTML, options) {
      options = options || {};

      // If single-instance is expected and window already exists: restore & focus
      if (!options.forceNew && WindowManager.isOpen(appId)) {
        const existing = WindowManager.getWindowByAppId(appId);
        if (existing) {
          if (existing.minimized) {
            WindowManager.restore(existing.id);
          }
          WindowManager.focus(existing.id);

          if (typeof contentHTML === 'string' && contentHTML.trim().length > 0) {
            WindowManager.setContent(existing.id, contentHTML);
          }
          if (title) {
            WindowManager.setTitle(existing.id, title);
          }
          return existing.id;
        }
      }

      // Generate unique window ID
      const timestamp = Date.now().toString(36);
      const rand = Math.random().toString(36).substring(2, 6);
      const windowId = `win_${appId}_${timestamp}_${rand}`;

      // Calculate initial dimensions
      const vpWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
      const vpHeight = window.innerHeight || document.documentElement.clientHeight || 768;

      const targetW = options.width || (vpWidth < 800 ? vpWidth - 32 : 720);
      const targetH = options.height || (vpHeight < 700 ? vpHeight - TOPBAR_HEIGHT - DOCK_RESERVE - 20 : 500);

      // Smart cascading position
      let posX = options.x;
      let posY = options.y;

      if (typeof posX !== 'number' || typeof posY !== 'number') {
        posX = cascadeOffset.x;
        posY = cascadeOffset.y;

        // Cascade increment for subsequent window
        cascadeOffset.x += CASCADE_STEP;
        cascadeOffset.y += CASCADE_STEP;

        // Wrap around when reaching right or bottom thresholds
        if (
          cascadeOffset.x + targetW > vpWidth - 40 ||
          cascadeOffset.y + targetH > vpHeight - DOCK_RESERVE
        ) {
          cascadeOffset.x = 60;
          cascadeOffset.y = 50;
        }
      }

      const bounds = clampBounds(posX, posY, targetW, targetH);
      const zIndex = getNextZIndex();

      // Create window root element
      const winEl = document.createElement('div');
      winEl.className = 'window window-open-3d';
      winEl.id = windowId;
      winEl.setAttribute('data-app-id', appId);
      winEl.setAttribute('role', 'dialog');
      winEl.setAttribute('aria-labelledby', `${windowId}-title`);

      winEl.style.left = bounds.x + 'px';
      winEl.style.top = bounds.y + 'px';
      winEl.style.width = bounds.width + 'px';
      winEl.style.height = bounds.height + 'px';
      winEl.style.zIndex = zIndex;

      // Construct Window Bar (traffic light dots + optional icon + title)
      const iconMarkup = options.icon ? `<span class="window-icon" style="margin-right:6px;">${options.icon}</span>` : '';
      const safeTitle = escapeHTML(title || appId);

      winEl.innerHTML = `
        <div class="window-bar">
          <div class="window-bar-left">
            <div class="window-dots">
              <button class="window-dot close" type="button" title="Close" aria-label="Close window"></button>
              <button class="window-dot minimize" type="button" title="Minimize" aria-label="Minimize window"></button>
              <button class="window-dot maximize" type="button" title="Maximize" aria-label="Maximize window"></button>
            </div>
            ${iconMarkup}
            <span class="window-title" id="${windowId}-title">${safeTitle}</span>
          </div>
          <div class="window-bar-right"></div>
        </div>
        <div class="window-body">
          ${contentHTML || ''}
        </div>
        <div class="window-resize" title="Resize window"></div>
      `;

      // Mount into DOM container
      const container = getContainer();
      container.appendChild(winEl);

      // Play open sound
      playSound('windowOpen');

      // Cache state in registry
      const winState = {
        id: windowId,
        appId: appId,
        title: title || appId,
        element: winEl,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        minimized: false,
        maximized: false,
        focused: false,
        zIndex: zIndex,
        isClosing: false,
        prevRect: null,
        options: options
      };
      windowsMap.set(windowId, winState);

      // Wire Traffic Light Dots
      const btnClose = winEl.querySelector('.window-dot.close');
      const btnMinimize = winEl.querySelector('.window-dot.minimize');
      const btnMaximize = winEl.querySelector('.window-dot.maximize');
      const barEl = winEl.querySelector('.window-bar');
      const resizeHandle = winEl.querySelector('.window-resize');

      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        WindowManager.close(windowId);
      });

      btnMinimize.addEventListener('click', (e) => {
        e.stopPropagation();
        WindowManager.minimize(windowId);
      });

      btnMaximize.addEventListener('click', (e) => {
        e.stopPropagation();
        WindowManager.maximize(windowId);
      });

      // Clicking anywhere inside window brings it to focus
      winEl.addEventListener('mousedown', () => {
        WindowManager.focus(windowId);
      });
      winEl.addEventListener('touchstart', () => {
        WindowManager.focus(windowId);
      }, { passive: true });

      // Setup dragging and resizing
      setupDraggable(winEl, barEl, windowId);
      setupResizable(winEl, resizeHandle, windowId);

      // Clean up 3D open animation class upon completion
      const handleOpenAnimEnd = () => {
        winEl.classList.remove('window-open-3d');
        winEl.removeEventListener('animationend', handleOpenAnimEnd);
      };
      winEl.addEventListener('animationend', handleOpenAnimEnd);
      // Fallback timer in case animationend does not fire
      setTimeout(() => {
        winEl.classList.remove('window-open-3d');
      }, 550);

      // Set focus to the newly opened window
      WindowManager.focus(windowId);

      // Handle initial maximized option
      if (options.maximized) {
        WindowManager.maximize(windowId);
      }

      // Update dock status
      updateDock(appId);

      emitEvent('window:opened', { windowId, appId, title });
      return windowId;
    },

    /**
     * Closes a window with a 3D exit animation, removes it from the DOM,
     * and clears it from internal state.
     * @param {string} windowId 
     */
    close: function (windowId) {
      const winState = windowsMap.get(windowId);
      if (!winState || winState.isClosing) return;

      winState.isClosing = true;
      const winEl = winState.element;

      // Play close sound
      playSound('windowClose');

      // Apply 3D close animation
      winEl.classList.remove('window-open-3d', 'restoring', 'minimizing');
      winEl.classList.add('window-close-3d');

      const finalizeClose = () => {
        if (winEl.parentNode) {
          winEl.parentNode.removeChild(winEl);
        }
        windowsMap.delete(windowId);
        updateDock(winState.appId);

        // Bring the next highest window to focus if this was focused
        if (winState.focused) {
          focusNextTopWindow();
        }

        emitEvent('window:closed', { windowId, appId: winState.appId });
      };

      let cleanedUp = false;
      const onAnimEnd = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        winEl.removeEventListener('animationend', onAnimEnd);
        finalizeClose();
      };

      winEl.addEventListener('animationend', onAnimEnd);
      // Fallback in case animationend does not fire
      setTimeout(() => {
        if (!cleanedUp) {
          cleanedUp = true;
          finalizeClose();
        }
      }, 380);
    },

    /**
     * Minimizes a window, scales it down, hides it, and marks it in the dock.
     * @param {string} windowId 
     */
    minimize: function (windowId) {
      const winState = windowsMap.get(windowId);
      if (!winState || winState.minimized || winState.isClosing) return;

      const winEl = winState.element;

      // Play minimize sound
      playSound('minimize');

      winEl.classList.remove('restoring', 'window-open-3d');
      winEl.classList.add('minimizing');
      winState.focused = false;
      winEl.classList.remove('focused');

      const finalizeMinimize = () => {
        winEl.classList.remove('minimizing');
        winEl.classList.add('is-minimized');
        winEl.style.display = 'none';
        winState.minimized = true;

        updateDock(winState.appId);
        focusNextTopWindow();

        emitEvent('window:minimized', { windowId, appId: winState.appId });
      };

      let completed = false;
      const onAnimEnd = () => {
        if (completed) return;
        completed = true;
        winEl.removeEventListener('animationend', onAnimEnd);
        finalizeMinimize();
      };

      winEl.addEventListener('animationend', onAnimEnd);
      setTimeout(() => {
        if (!completed) {
          completed = true;
          finalizeMinimize();
        }
      }, 370);
    },

    /**
     * Restores a minimized window with a spring animation and focuses it.
     * @param {string} windowId 
     */
    restore: function (windowId) {
      const winState = windowsMap.get(windowId);
      if (!winState || !winState.minimized || winState.isClosing) return;

      const winEl = winState.element;

      // Play restore/open sound
      playSound('windowOpen');

      winEl.style.display = 'flex';
      winEl.classList.remove('is-minimized', 'minimizing');
      winEl.classList.add('restoring');
      winState.minimized = false;

      const onAnimEnd = () => {
        winEl.classList.remove('restoring');
        winEl.removeEventListener('animationend', onAnimEnd);
      };
      winEl.addEventListener('animationend', onAnimEnd);
      setTimeout(() => {
        winEl.classList.remove('restoring');
      }, 370);

      WindowManager.focus(windowId);
      updateDock(winState.appId);

      emitEvent('window:restored', { windowId, appId: winState.appId });
    },

    /**
     * Toggles between maximized and restored normal state.
     * @param {string} windowId 
     */
    maximize: function (windowId) {
      const winState = windowsMap.get(windowId);
      if (!winState || winState.isClosing) return;

      const winEl = winState.element;
      playSound('maximize');

      if (!winState.maximized) {
        // Save unmaximized geometry
        winState.prevRect = {
          x: winState.x,
          y: winState.y,
          width: winState.width,
          height: winState.height
        };

        winEl.classList.add('maximized');
        winState.maximized = true;

        // Clear manual inline geometries so CSS .maximized takes over
        winEl.style.removeProperty('left');
        winEl.style.removeProperty('top');
        winEl.style.removeProperty('width');
        winEl.style.removeProperty('height');

        emitEvent('window:maximized', { windowId, appId: winState.appId });
      } else {
        winEl.classList.remove('maximized');
        winState.maximized = false;

        // Restore saved geometry or fallback to viewport bounds
        if (winState.prevRect) {
          const bounds = clampBounds(
            winState.prevRect.x,
            winState.prevRect.y,
            winState.prevRect.width,
            winState.prevRect.height
          );
          winState.x = bounds.x;
          winState.y = bounds.y;
          winState.width = bounds.width;
          winState.height = bounds.height;
        }

        winEl.style.left = winState.x + 'px';
        winEl.style.top = winState.y + 'px';
        winEl.style.width = winState.width + 'px';
        winEl.style.height = winState.height + 'px';

        emitEvent('window:unmaximized', { windowId, appId: winState.appId });
      }

      WindowManager.focus(windowId);
    },

    /**
     * Brings the window to the front, increments its z-index, and marks it as focused.
     * @param {string} windowId 
     */
    focus: function (windowId) {
      const target = windowsMap.get(windowId);
      if (!target || target.isClosing) return;

      // If already focused and atop stack, skip unnecessary DOM updates
      if (target.focused && target.zIndex === currentZIndex) {
        return;
      }

      const newZ = getNextZIndex();
      target.zIndex = newZ;
      target.element.style.zIndex = newZ;

      // Update focused class across all windows
      windowsMap.forEach(win => {
        if (win.id === windowId) {
          win.focused = true;
          win.element.classList.add('focused');
        } else {
          win.focused = false;
          win.element.classList.remove('focused');
        }
        updateDock(win.appId);
      });

      emitEvent('window:focused', { windowId, appId: target.appId });
    },

    /**
     * Closes all open windows in the system.
     */
    closeAll: function () {
      const ids = Array.from(windowsMap.keys());
      ids.forEach(id => {
        WindowManager.close(id);
      });

      // Reset cascading origin
      cascadeOffset = { x: 70, y: 55 };
    },

    /**
     * Returns an array of descriptor objects for all registered windows.
     * @returns {Array<{id: string, appId: string, title: string, minimized: boolean, maximized: boolean, focused: boolean, zIndex: number}>}
     */
    getOpenWindows: function () {
      const list = [];
      windowsMap.forEach(win => {
        list.push({
          id: win.id,
          appId: win.appId,
          title: win.title,
          minimized: win.minimized,
          maximized: win.maximized,
          focused: win.focused,
          zIndex: win.zIndex
        });
      });
      return list;
    },

    /**
     * Checks if a window with the given appId is currently open (and not closing).
     * @param {string} appId 
     * @returns {boolean}
     */
    isOpen: function (appId) {
      if (!appId) return false;
      for (const win of windowsMap.values()) {
        if (win.appId === appId && !win.isClosing) {
          return true;
        }
      }
      return false;
    },

    /**
     * Retrieves window metadata by windowId.
     * @param {string} windowId 
     * @returns {Object|null}
     */
    getWindow: function (windowId) {
      return windowsMap.get(windowId) || null;
    },

    /**
     * Retrieves the first active window matching an appId.
     * @param {string} appId 
     * @returns {Object|null}
     */
    getWindowByAppId: function (appId) {
      for (const win of windowsMap.values()) {
        if (win.appId === appId && !win.isClosing) {
          return win;
        }
      }
      return null;
    },

    /**
     * Updates the inner HTML content of a window body.
     * @param {string} windowId 
     * @param {string} contentHTML 
     */
    setContent: function (windowId, contentHTML) {
      const win = windowsMap.get(windowId);
      if (!win) return;
      const bodyEl = win.element.querySelector('.window-body');
      if (bodyEl) {
        bodyEl.innerHTML = contentHTML;
      }
    },

    /**
     * Updates the title of an existing window.
     * @param {string} windowId 
     * @param {string} title 
     */
    setTitle: function (windowId, title) {
      const win = windowsMap.get(windowId);
      if (!win) return;
      win.title = title;
      const titleEl = win.element.querySelector('.window-title');
      if (titleEl) {
        titleEl.textContent = title;
      }
    }
  };

  // Viewport resize watcher: ensures open windows remain inside screen bounds
  let resizeDebounce = null;
  window.addEventListener('resize', () => {
    if (resizeDebounce) clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      windowsMap.forEach(win => {
        if (!win.maximized && !win.minimized && !win.isClosing) {
          const bounds = clampBounds(win.x, win.y, win.width, win.height);
          win.x = bounds.x;
          win.y = bounds.y;
          win.width = bounds.width;
          win.height = bounds.height;

          win.element.style.left = bounds.x + 'px';
          win.element.style.top = bounds.y + 'px';
          win.element.style.width = bounds.width + 'px';
          win.element.style.height = bounds.height + 'px';
        }
      });
    }, 100);
  });

  // Global export
  if (typeof window !== 'undefined') {
    window.WindowManager = WindowManager;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WindowManager;
  }
})(typeof window !== 'undefined' ? window : this);
