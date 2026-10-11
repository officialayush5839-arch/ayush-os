/**
 * AYUSH.OS — Whiteboard Drawing Application Module
 * HTML5 Canvas interactive sketchpad with multi-color palettes, brush diameters,
 * eraser support, and PNG image export.
 * 
 * Export: window.WhiteboardApp = { getContent(), init(windowBody) }
 */

(function (root) {
  'use strict';

  const WhiteboardApp = {
    /**
     * Generates HTML markup for whiteboard toolbar and canvas.
     * @returns {string} HTML markup
     */
    getContent: function () {
      return `
        <div class="whiteboard-container" style="height: 100%; min-height: 420px; display: flex; flex-direction: column;">
          <div class="whiteboard-toolbar" role="toolbar" aria-label="Whiteboard Tools">
            <!-- Mode Buttons -->
            <button type="button" class="wb-tool-btn active" data-tool="pen" title="Pen Tool">✏️ Pen</button>
            <button type="button" class="wb-tool-btn" data-tool="eraser" title="Eraser Tool">🧹 Eraser</button>
            
            <div style="width: 1px; height: 18px; background: var(--border); margin: 0 4px;" aria-hidden="true"></div>

            <!-- Color Palette: black, red, blue, green, purple, orange -->
            <div style="display: flex; align-items: center; gap: 6px;" role="radiogroup" aria-label="Drawing Colors">
              <span class="whiteboard-color active" data-color="#000000" style="background: #000000;" title="Black" role="radio" aria-checked="true" tabindex="0"></span>
              <span class="whiteboard-color" data-color="#ef4444" style="background: #ef4444;" title="Red" role="radio" aria-checked="false" tabindex="0"></span>
              <span class="whiteboard-color" data-color="#3b82f6" style="background: #3b82f6;" title="Blue" role="radio" aria-checked="false" tabindex="0"></span>
              <span class="whiteboard-color" data-color="#10b981" style="background: #10b981;" title="Green" role="radio" aria-checked="false" tabindex="0"></span>
              <span class="whiteboard-color" data-color="#8b5cf6" style="background: #8b5cf6;" title="Purple" role="radio" aria-checked="false" tabindex="0"></span>
              <span class="whiteboard-color" data-color="#f97316" style="background: #f97316;" title="Orange" role="radio" aria-checked="false" tabindex="0"></span>
            </div>

            <div style="width: 1px; height: 18px; background: var(--border); margin: 0 4px;" aria-hidden="true"></div>

            <!-- Brush Sizes: 2px, 4px, 8px -->
            <div style="display: flex; align-items: center; gap: 4px;" role="radiogroup" aria-label="Stroke Thickness">
              <button type="button" class="wb-size-btn active" data-size="2" title="Fine Stroke (2px)">2px</button>
              <button type="button" class="wb-size-btn" data-size="4" title="Medium Stroke (4px)">4px</button>
              <button type="button" class="wb-size-btn" data-size="8" title="Thick Stroke (8px)">8px</button>
            </div>

            <!-- Actions -->
            <div style="margin-left: auto; display: flex; align-items: center; gap: 6px;">
              <button type="button" class="wb-action-btn wb-clear-btn" title="Clear all drawings">Clear</button>
              <button type="button" class="wb-action-btn wb-export-btn" title="Export drawing as PNG" style="background: var(--accent); color: var(--text-inverse); border-color: var(--accent);">Export PNG</button>
            </div>
          </div>

          <canvas class="whiteboard-canvas" style="touch-action: none; width: 100%; flex: 1;"></canvas>
        </div>
      `;
    },

    /**
     * Initializes drawing context and event listeners.
     * @param {HTMLElement} windowBody 
     */
    init: function (windowBody) {
      if (!windowBody) return;

      const container = windowBody.querySelector('.whiteboard-container');
      const canvas = windowBody.querySelector('.whiteboard-canvas');
      if (!container || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Active state
      let activeTool = 'pen'; // 'pen' | 'eraser'
      let activeColor = '#000000';
      let activeSize = 2;
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      // Adapt black stroke if the user is in dark or cyber mode so strokes remain high-contrast
      function getResolvedColor(hexColor) {
        if (hexColor.toLowerCase() === '#000000') {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'night';
          if (currentTheme === 'night' || currentTheme === 'cyber') {
            return '#f0f6fc'; // Crisp visible chalk white on dark canvas
          }
        }
        return hexColor;
      }

      /**
       * Sizes canvas to container resolution with DPI scaling.
       */
      function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const width = Math.floor(rect.width) || 600;
        const height = Math.floor(rect.height) || 400;

        if (width === 0 || height === 0) return;

        // Temporarily backup existing artwork
        let tempCanvas = null;
        if (canvas.width > 0 && canvas.height > 0) {
          tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) tempCtx.drawImage(canvas, 0, 0);
        }

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Restore previous strokes
        if (tempCanvas) {
          ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
        }
      }

      // Initial dimension setup
      setTimeout(resizeCanvas, 30);
      window.addEventListener('resize', resizeCanvas);

      /**
       * Get coordinates relative to canvas in CSS pixels.
       */
      function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }

      // Pointer event handlers
      function onPointerDown(e) {
        if (e.button !== 0) return; // Only primary button
        isDrawing = true;
        const coords = getCanvasCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;

        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}

        // Dot click draw
        drawSegment(lastX, lastY, coords.x, coords.y);
      }

      function onPointerMove(e) {
        if (!isDrawing) return;
        const coords = getCanvasCoordinates(e);
        drawSegment(lastX, lastY, coords.x, coords.y);
        lastX = coords.x;
        lastY = coords.y;
      }

      function onPointerUp(e) {
        if (!isDrawing) return;
        isDrawing = false;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }

      function drawSegment(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (activeTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = activeSize * 4; // Generous eraser radius
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = getResolvedColor(activeColor);
          ctx.lineWidth = activeSize;
        }

        ctx.stroke();
        ctx.closePath();
      }

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);

      // Tool selection: Pen / Eraser
      const toolButtons = windowBody.querySelectorAll('.wb-tool-btn');
      toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          toolButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeTool = btn.getAttribute('data-tool');
          if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
        });
      });

      // Color selection
      const colorSwatches = windowBody.querySelectorAll('.whiteboard-color');
      colorSwatches.forEach(swatch => {
        const pickColor = () => {
          colorSwatches.forEach(s => {
            s.classList.remove('active');
            s.setAttribute('aria-checked', 'false');
          });
          swatch.classList.add('active');
          swatch.setAttribute('aria-checked', 'true');
          activeColor = swatch.getAttribute('data-color') || '#000000';

          // Auto-switch back to pen if user was using eraser
          if (activeTool === 'eraser') {
            activeTool = 'pen';
            toolButtons.forEach(b => {
              if (b.getAttribute('data-tool') === 'pen') b.classList.add('active');
              else b.classList.remove('active');
            });
          }

          if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
        };

        swatch.addEventListener('click', pickColor);
        swatch.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pickColor();
          }
        });
      });

      // Size selection
      const sizeButtons = windowBody.querySelectorAll('.wb-size-btn');
      sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          sizeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeSize = parseInt(btn.getAttribute('data-size'), 10) || 2;
          if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
        });
      });

      // Clear button
      const clearBtn = windowBody.querySelector('.wb-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          const dpr = window.devicePixelRatio || 1;
          ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
          if (window.SoundEngine && typeof window.SoundEngine.windowClose === 'function') {
            window.SoundEngine.windowClose();
          }
        });
      }

      // Export PNG button
      const exportBtn = windowBody.querySelector('.wb-export-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          try {
            // Render composite with clean background
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = canvas.width;
            exportCanvas.height = canvas.height;
            const exportCtx = exportCanvas.getContext('2d');
            if (!exportCtx) return;

            const theme = document.documentElement.getAttribute('data-theme') || 'night';
            exportCtx.fillStyle = (theme === 'day') ? '#ffffff' : '#1a1a2e';
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            exportCtx.drawImage(canvas, 0, 0);

            // Watermark footer
            exportCtx.font = '12px "JetBrains Mono", monospace';
            exportCtx.fillStyle = (theme === 'day') ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
            exportCtx.fillText('AYUSH.OS // Whiteboard Export', 16, exportCanvas.height - 16);

            const dataUrl = exportCanvas.toDataURL('image/png');
            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = dataUrl;
            downloadAnchor.download = `ayush-os-sketch-${Date.now()}.png`;
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            document.body.removeChild(downloadAnchor);

            if (window.SoundEngine && typeof window.SoundEngine.notification === 'function') {
              window.SoundEngine.notification();
            }
          } catch (e) {
            console.error('[WhiteboardApp] Export failed:', e);
          }
        });
      }
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.WhiteboardApp = WhiteboardApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhiteboardApp;
  }
})(typeof window !== 'undefined' ? window : this);
