/**
 * AYUSH.OS — Voice Agent Application Module
 * Simulated real-time AI voice assistant interface featuring a 9-bar audio wave visualizer,
 * state cycling ('LISTENING...', 'PROCESSING...', 'RESPONDING...'),
 * dynamic dialogue synthesis, and interactive query prompts.
 * 
 * Export: window.VoiceAgentApp = { getContent(), init(windowBody) }
 */

(function (root) {
  'use strict';

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Pre-configured simulated knowledge responses
  const AGENT_KNOWLEDGE = {
    'who': 'I am Ayu, the integrated AI assistant of AYUSH.OS. Ayush Vishwakarma is an AI/ML developer and systems architect based in Pune, India.',
    'intelliemo': 'INTELLIEMO is an enterprise-grade NLP emotion classifier with token-drop attribution explainability, achieving 90% Anger precision and 89.5% Fear F1 score.',
    'skills': 'Core stack: Python, PyTorch, YOLOv8, OpenCV, FastAPI, Node.js, TypeScript, React, Docker, and Industrial IoT edge telemetry.',
    'location': 'Ayush operates from Pune, Maharashtra, India (18.5204° N / 73.8567° E), studying Computer Science at Vishwakarma University (VU).'
  };

  const VoiceAgentApp = {
    /**
     * Generates HTML markup for the Voice Agent interface.
     * @returns {string} HTML markup
     */
    getContent: function () {
      // 9 audio wave bars
      const waveBarsHtml = Array.from({ length: 9 })
        .map((_, i) => `<span class="voice-wave-bar" data-bar="${i}"></span>`)
        .join('');

      return `
        <div class="voice-agent" style="max-width: 440px; margin: 0 auto; text-align: center;">
          <!-- Top Avatar & Name -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid var(--accent); overflow: hidden; box-shadow: 0 0 16px var(--accent-glow); background: var(--bg-glass);">
              <img src="assets/ayu-illustration.jpg" alt="Ayu Voice Assistant" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/ayush-illustrated.jpg';" />
            </div>
            <div style="font-family: var(--font-display); font-size: 1rem; font-weight: 700;">AYU // Neural Voice Agent</div>
            <div style="font-family: var(--font-mono); font-size: 0.625rem; color: var(--text-tertiary); letter-spacing: 0.08em;">SPEECH-TO-TEXT · INFERENCE RUNTIME v2.0</div>
          </div>

          <!-- 9-Bar Waveform Visualization -->
          <div class="voice-wave" role="img" aria-label="Audio Waveform Visualization">
            ${waveBarsHtml}
          </div>

          <!-- Dynamic Status Text -->
          <div class="voice-status" aria-live="polite">LISTENING...</div>

          <!-- Dialogue / Transcript Box -->
          <div class="voice-transcript" style="width: 100%; min-height: 80px; padding: 14px; background: var(--bg-glass); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6; text-align: left;">
            "Hey there! I am listening. Tap a suggested query below or let the system cycle."
          </div>

          <!-- Quick Interactive Queries -->
          <div style="width: 100%;">
            <div style="font-family: var(--font-mono); font-size: 0.5625rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 8px; text-align: left;">
              Quick Prompts:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <button type="button" class="btn btn-outline voice-prompt-btn" data-query="who" style="font-family: var(--font-mono); font-size: 0.625rem; padding: 4px 10px;">Who is Ayush?</button>
              <button type="button" class="btn btn-outline voice-prompt-btn" data-query="intelliemo" style="font-family: var(--font-mono); font-size: 0.625rem; padding: 4px 10px;">What is INTELLIEMO?</button>
              <button type="button" class="btn btn-outline voice-prompt-btn" data-query="skills" style="font-family: var(--font-mono); font-size: 0.625rem; padding: 4px 10px;">Skills & Stack</button>
              <button type="button" class="btn btn-outline voice-prompt-btn" data-query="location" style="font-family: var(--font-mono); font-size: 0.625rem; padding: 4px 10px;">Location & VU</button>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Initializes state cycle animations and event handlers.
     * @param {HTMLElement} windowBody 
     */
    init: function (windowBody) {
      if (!windowBody) return;

      const statusEl = windowBody.querySelector('.voice-status');
      const transcriptEl = windowBody.querySelector('.voice-transcript');
      const promptButtons = windowBody.querySelectorAll('.voice-prompt-btn');
      const waveBars = windowBody.querySelectorAll('.voice-wave-bar');

      if (!statusEl) return;

      // Status sequence definition
      const STATUS_CYCLE = ['LISTENING...', 'PROCESSING...', 'RESPONDING...'];
      let currentCycleIndex = 0;
      let cycleIntervalId = null;
      let isBusyWithUserQuery = false;

      // Companion messages pool for autonomous cycling
      const profile = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
      const companionQuotes = Array.isArray(profile.companionMessages) && profile.companionMessages.length > 0
        ? profile.companionMessages
        : [
            'I build intelligent systems with AI, data, and code.',
            'Check out INTELLIEMO — emotion classification with explainability.',
            'SkyGuard AI detects real-time anomalies for weather stations.',
            'Evidence over hype. Systems over screenshots.'
          ];
      let quoteIndex = 0;

      /**
       * Updates the status and waveform animation intensity.
       * @param {string} newStatus 
       */
      function setStatus(newStatus) {
        if (!statusEl) return;
        statusEl.textContent = newStatus;

        if (newStatus === 'LISTENING...') {
          statusEl.style.color = 'var(--accent)';
          waveBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
            bar.style.opacity = '0.65';
          });
        } else if (newStatus === 'PROCESSING...') {
          statusEl.style.color = 'var(--warning, #f59e0b)';
          waveBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
            bar.style.opacity = '1';
          });
        } else if (newStatus === 'RESPONDING...') {
          statusEl.style.color = 'var(--success, #10b981)';
          waveBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
            bar.style.opacity = '0.9';
          });
        }
      }

      /**
       * Autonomous state cycle interval.
       */
      function runCycle() {
        if (isBusyWithUserQuery) return;

        currentCycleIndex = (currentCycleIndex + 1) % STATUS_CYCLE.length;
        const state = STATUS_CYCLE[currentCycleIndex];
        setStatus(state);

        if (state === 'RESPONDING...' && transcriptEl) {
          const nextQuote = companionQuotes[quoteIndex % companionQuotes.length];
          quoteIndex++;
          transcriptEl.textContent = `"${nextQuote}"`;

          if (window.SoundEngine && typeof window.SoundEngine.companionHello === 'function') {
            window.SoundEngine.companionHello();
          }
        }
      }

      // Start autonomous cycle (every 3 seconds)
      cycleIntervalId = setInterval(runCycle, 3000);

      /**
       * Handles user clicking a preset query prompt.
       */
      function handlePrompt(key) {
        if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }

        isBusyWithUserQuery = true;
        setStatus('PROCESSING...');
        if (transcriptEl) {
          transcriptEl.textContent = 'Parsing neural intent and querying knowledge base...';
        }

        setTimeout(() => {
          setStatus('RESPONDING...');
          const reply = AGENT_KNOWLEDGE[key] || 'Knowledge node verified.';
          if (transcriptEl) {
            transcriptEl.textContent = `"${reply}"`;
          }

          if (window.SoundEngine && typeof window.SoundEngine.notification === 'function') {
            window.SoundEngine.notification();
          }

          // Return to listening state after 4 seconds
          setTimeout(() => {
            isBusyWithUserQuery = false;
            currentCycleIndex = 0;
            setStatus('LISTENING...');
          }, 4000);
        }, 1200);
      }

      promptButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-query');
          if (q) handlePrompt(q);
        });
      });

      // Cleanup hook if container is removed
      const cleanupObserver = new MutationObserver((mutations) => {
        if (!document.contains(windowBody)) {
          if (cycleIntervalId) clearInterval(cycleIntervalId);
          cleanupObserver.disconnect();
        }
      });
      cleanupObserver.observe(document.body, { childList: true, subtree: true });
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.VoiceAgentApp = VoiceAgentApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceAgentApp;
  }
})(typeof window !== 'undefined' ? window : this);
