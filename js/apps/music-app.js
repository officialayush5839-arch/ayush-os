/**
 * AYUSH.OS — Ambient Music Player Application Module
 * Procedural generative audio synthesizer generating continuous lofi pads,
 * resonant filter sweeps, and 24-band reactive spectrum visualization.
 * 
 * Export: window.MusicApp = { getContent(), init(windowBody) }
 */

(function (root) {
  'use strict';

  // Global audio singleton for persistence across window minimize/re-open
  let audioContext = null;
  let musicMasterGain = null;
  let analyserNode = null;
  let isMusicPlaying = false;
  let activeNodes = [];
  let animFrameId = null;
  let timerInterval = null;
  let elapsedSeconds = 0;
  let currentVolume = 0.7;

  // Lofi generative chord progressions (frequencies in Hz)
  const CHORD_PROGRESSIONS = [
    [146.83, 220.00, 277.18, 369.99, 440.00], // D Maj9
    [196.00, 246.94, 293.66, 369.99, 440.00], // G Maj7
    [123.47, 185.00, 220.00, 293.66, 369.99], // B min7
    [110.00, 164.81, 196.00, 277.18, 329.63]  // A 7sus4
  ];
  let chordIndex = 0;

  /**
   * Initializes or returns the audio context.
   */
  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 64; // 32 frequency bins
        analyserNode.smoothingTimeConstant = 0.8;

        musicMasterGain = audioContext.createGain();
        musicMasterGain.gain.setValueAtTime(currentVolume, audioContext.currentTime);

        musicMasterGain.connect(analyserNode);
        analyserNode.connect(audioContext.destination);
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  /**
   * Starts procedural ambient pad generation.
   */
  function startProceduralAudio() {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopProceduralAudio();

    const now = ctx.currentTime;
    const currentChord = CHORD_PROGRESSIONS[chordIndex % CHORD_PROGRESSIONS.length];
    chordIndex++;

    // Shared warm lowpass filter with slow undulating LFO
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(3.0, now);

    // LFO for filter breathing (0.08 Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, now);
    lfoGain.gain.setValueAtTime(250, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);

    filter.connect(musicMasterGain);
    activeNodes.push(filter, lfo, lfoGain);

    // Generate voice layers for each chord note
    currentChord.forEach((freq, idx) => {
      // Primary Oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Analog Chorus Oscillator (+4 cents detuned)
      const chorusOsc = ctx.createOscillator();
      chorusOsc.type = 'sine';
      chorusOsc.frequency.setValueAtTime(freq * 1.0023, now);

      // Volume envelope: soft fade in
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.06 / currentChord.length, now + 2.0);

      osc.connect(oscGain);
      chorusOsc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(now);
      chorusOsc.start(now);

      activeNodes.push(osc, chorusOsc, oscGain);
    });

    // Sub-bass root note for warmth
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(currentChord[0] / 2, now);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.04, now + 1.5);
    subOsc.connect(subGain);
    subGain.connect(musicMasterGain);
    subOsc.start(now);
    activeNodes.push(subOsc, subGain);

    // Schedule next chord transition every 12 seconds
    if (isMusicPlaying) {
      setTimeout(() => {
        if (isMusicPlaying) {
          startProceduralAudio();
        }
      }, 12000);
    }
  }

  /**
   * Stops procedural audio nodes safely.
   */
  function stopProceduralAudio() {
    if (activeNodes.length > 0) {
      activeNodes.forEach(node => {
        try {
          if (typeof node.stop === 'function') node.stop();
          node.disconnect();
        } catch (e) {}
      });
      activeNodes = [];
    }
  }

  const MusicApp = {
    /**
     * Generates HTML markup for music player interface.
     * @returns {string} HTML markup
     */
    getContent: function () {
      // 24 visualizer bars
      const barsHtml = Array.from({ length: 24 })
        .map((_, i) => `<div class="music-bar" data-bar="${i}" style="height: 6px;"></div>`)
        .join('');

      return `
        <div class="music-player" style="max-width: 480px; margin: 0 auto;">
          <!-- Track Title & Metadata -->
          <div class="music-info">
            <h3 class="music-title">Ambient Focus // AYUSH.OS</h3>
            <p class="music-artist">Procedural Web Audio Engine · 432Hz Generative Binaural Pad</p>
          </div>

          <!-- 24-Bar Spectrum Visualizer -->
          <div class="music-visualizer" role="img" aria-label="Audio Spectrum Visualizer">
            ${barsHtml}
          </div>

          <!-- Progress Bar & Elapsed Time -->
          <div class="music-progress">
            <span class="music-time current-time">00:00</span>
            <div class="music-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
              <div class="music-progress-fill" style="width: 0%;"></div>
            </div>
            <span class="music-time total-time">∞</span>
          </div>

          <!-- Playback Controls -->
          <div class="music-controls">
            <button type="button" class="ctrl-prev" title="Previous Chord" aria-label="Previous Chord">⏮</button>
            <button type="button" class="play-btn" title="Play or Pause" aria-label="Play or Pause">${isMusicPlaying ? '⏸' : '▶'}</button>
            <button type="button" class="ctrl-next" title="Next Chord" aria-label="Next Chord">⏭</button>
          </div>

          <!-- Volume Regulation -->
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
            <span style="font-size: 0.875rem;" aria-hidden="true">🔈</span>
            <input type="range" class="music-volume" min="0" max="1" step="0.02" value="${currentVolume}" 
                   style="width: 120px; accent-color: var(--accent); cursor: pointer;" aria-label="Volume Slider" />
            <span style="font-size: 0.875rem;" aria-hidden="true">🔊</span>
          </div>
        </div>
      `;
    },

    /**
     * Initializes playback events, visualizer rendering, and timers.
     * @param {HTMLElement} windowBody 
     */
    init: function (windowBody) {
      if (!windowBody) return;

      const playBtn = windowBody.querySelector('.play-btn');
      const prevBtn = windowBody.querySelector('.ctrl-prev');
      const nextBtn = windowBody.querySelector('.ctrl-next');
      const volumeSlider = windowBody.querySelector('.music-volume');
      const timeDisplay = windowBody.querySelector('.current-time');
      const progressFill = windowBody.querySelector('.music-progress-fill');
      const bars = windowBody.querySelectorAll('.music-bar');

      if (!playBtn) return;

      // Update button state icon
      function updatePlayButtonUI() {
        if (playBtn) {
          playBtn.textContent = isMusicPlaying ? '❚❚' : '▶';
          playBtn.setAttribute('title', isMusicPlaying ? 'Pause Ambient Sound' : 'Play Ambient Sound');
        }
      }

      // Visualizer animation loop
      function renderVisualizer() {
        if (isMusicPlaying && analyserNode) {
          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserNode.getByteFrequencyData(dataArray);

          // Update the 24 bars based on frequency data
          bars.forEach((bar, index) => {
            const dataIndex = Math.floor((index / 24) * (bufferLength - 4));
            const rawVal = dataArray[dataIndex] || 0;
            // Scale between 4px and 60px
            const height = Math.max(4, Math.min(60, (rawVal / 255) * 60 + Math.sin(Date.now() * 0.005 + index) * 6 + 4));
            bar.style.height = `${height}px`;
            bar.style.opacity = (0.4 + (height / 60) * 0.6).toFixed(2);
          });

          animFrameId = requestAnimationFrame(renderVisualizer);
        } else {
          // Gently return bars to resting height
          bars.forEach((bar, index) => {
            bar.style.height = '4px';
            bar.style.opacity = '0.35';
          });
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        }
      }

      // Start/Pause Toggle
      function togglePlayback() {
        if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }

        if (isMusicPlaying) {
          isMusicPlaying = false;
          stopProceduralAudio();
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
          updatePlayButtonUI();
          renderVisualizer();
        } else {
          isMusicPlaying = true;
          startProceduralAudio();
          updatePlayButtonUI();
          renderVisualizer();

          // Elapsed timer tick
          if (!timerInterval) {
            timerInterval = setInterval(() => {
              elapsedSeconds++;
              const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
              const secs = String(elapsedSeconds % 60).padStart(2, '0');
              if (timeDisplay) timeDisplay.textContent = `${mins}:${secs}`;
              if (progressFill) {
                // Loop progress bar every 180 seconds
                const progressPct = ((elapsedSeconds % 180) / 180) * 100;
                progressFill.style.width = `${progressPct.toFixed(1)}%`;
              }
            }, 1000);
          }
        }
      }

      playBtn.addEventListener('click', togglePlayback);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          chordIndex = (chordIndex - 2 + CHORD_PROGRESSIONS.length) % CHORD_PROGRESSIONS.length;
          if (isMusicPlaying) startProceduralAudio();
          if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (isMusicPlaying) startProceduralAudio();
          if (window.SoundEngine && typeof window.SoundEngine.click === 'function') {
            window.SoundEngine.click();
          }
        });
      }

      // Volume slider adjustment
      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          currentVolume = parseFloat(e.target.value);
          if (musicMasterGain && audioContext) {
            musicMasterGain.gain.setValueAtTime(currentVolume, audioContext.currentTime);
          }
        });
      }

      // Initial visualizer frame
      if (isMusicPlaying) {
        renderVisualizer();
      }
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.MusicApp = MusicApp;
  }

  // CommonJS export if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicApp;
  }
})(typeof window !== 'undefined' ? window : this);
