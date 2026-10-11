/**
 * AYUSH.OS - Procedural Web Audio Engine
 * High-fidelity zero-dependency procedural sound system crafted with Web Audio API.
 * 
 * Synthesizes all audio in real time using oscillators, noise generators, biquad filters,
 * dynamic compressors, and micro-envelopes. Zero external sound files or dependencies.
 *
 * Acoustic Aesthetic: macOS Sonoma meets Notion — tactile, silky, warm, modern UI acoustics.
 */

(function (root) {
  'use strict';

  // Core AudioContext and Master Bus References
  let audioCtx = null;
  let masterGain = null;
  let masterCompressor = null;
  let isSoundMuted = false;
  let isInitialized = false;

  // Master output volume calibration
  const MASTER_VOLUME = 0.35;

  // Cached white noise buffer for tactile clicks and whooshes
  let cachedNoiseBuffer = null;

  // Retrieve user sound preference from localStorage if available
  try {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem('ayush_os_sound_enabled');
      if (savedState !== null) {
        isSoundMuted = savedState === 'false';
      }
    }
  } catch (e) {
    isSoundMuted = false;
  }

  /**
   * Generates or returns a cached 2-second mono white noise AudioBuffer.
   * @param {AudioContext} ctx 
   * @returns {AudioBuffer}
   */
  function getNoiseBuffer(ctx) {
    if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
      return cachedNoiseBuffer;
    }
    const sampleRate = ctx.sampleRate || 44100;
    const bufferSize = sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    cachedNoiseBuffer = buffer;
    return cachedNoiseBuffer;
  }

  /**
   * Initializes the AudioContext, Master Limiter/Compressor, and Master Gain bus.
   * Safe to call multiple times (idempotent).
   * @returns {AudioContext|null}
   */
  function initAudio() {
    if (isInitialized && audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('[SoundEngine] Web Audio API is not supported in this browser.');
        return null;
      }

      audioCtx = new AudioContextClass();

      // Master Dynamics Compressor: serves as a soft-knee mastering limiter
      // to prevent digital clipping when multiple UI sounds trigger concurrently.
      masterCompressor = audioCtx.createDynamicsCompressor();
      masterCompressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
      masterCompressor.knee.setValueAtTime(24, audioCtx.currentTime);
      masterCompressor.ratio.setValueAtTime(10, audioCtx.currentTime);
      masterCompressor.attack.setValueAtTime(0.002, audioCtx.currentTime);
      masterCompressor.release.setValueAtTime(0.15, audioCtx.currentTime);

      // Master Gain Node
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isSoundMuted ? 0 : MASTER_VOLUME, audioCtx.currentTime);

      // Routing: Sound Sources -> Master Gain -> Master Compressor -> Audio Output
      masterGain.connect(masterCompressor);
      masterCompressor.connect(audioCtx.destination);

      isInitialized = true;

      // Resume context if browser suspended it pending user gesture
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    } catch (err) {
      console.warn('[SoundEngine] Failed to initialize AudioContext:', err);
      return null;
    }

    return audioCtx;
  }

  /**
   * Validates if the sound engine is active and ready to synthesize.
   * Resumes suspended context if needed.
   * @returns {boolean}
   */
  function isReady() {
    if (isSoundMuted) return false;
    if (!audioCtx) {
      initAudio();
    }
    if (!audioCtx) return false;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return true;
  }

  /**
   * Automates safe cleanup and disconnection of AudioNodes to prevent memory leaks.
   * @param {Array<AudioNode>} nodes 
   * @param {number} delayMs 
   */
  function scheduleDisposal(nodes, delayMs) {
    setTimeout(() => {
      nodes.forEach(node => {
        try {
          if (node) {
            if (typeof node.stop === 'function') {
              try { node.stop(); } catch (e) {}
            }
            node.disconnect();
          }
        } catch (e) {}
      });
    }, delayMs + 100);
  }

  /**
   * Automatically unlocks the Web Audio context on the first user interaction gesture.
   */
  function registerAutoUnlock() {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      if (!isInitialized) {
        initAudio();
      } else if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      window.removeEventListener('pointerdown', unlockHandler, true);
      window.removeEventListener('keydown', unlockHandler, true);
      window.removeEventListener('touchstart', unlockHandler, true);
    };

    window.addEventListener('pointerdown', unlockHandler, { capture: true, once: true });
    window.addEventListener('keydown', unlockHandler, { capture: true, once: true });
    window.addEventListener('touchstart', unlockHandler, { capture: true, once: true });
  }

  // Register gesture listener immediately
  registerAutoUnlock();

  /**
   * AYUSH.OS SoundEngine Object
   */
  const SoundEngine = {
    /**
     * Explicitly initializes or wakes up the AudioContext on first user interaction.
     * @returns {AudioContext|null}
     */
    init: function () {
      return initAudio();
    },

    /**
     * click() - Short crisp UI click (high-freq sine ping, 50ms)
     * Acoustic inspiration: Apple Magic Trackpad haptic micro-click with glass sheen.
     */
    click: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.05; // 50ms

        // 1. Tonal Ping (fast downward frequency glide)
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + duration);

        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.18, now + 0.002);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        // 2. Micro-transient tactile noise tap (6ms)
        const noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = getNoiseBuffer(audioCtx);
        const noiseFilter = audioCtx.createBiquadFilter();
        const noiseGain = audioCtx.createGain();

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(3200, now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // Play
        osc.start(now);
        osc.stop(now + duration);
        noiseSource.start(now);
        noiseSource.stop(now + 0.012);

        scheduleDisposal([osc, oscGain, noiseSource, noiseFilter, noiseGain], 60);
      } catch (e) {
        console.debug('[SoundEngine.click]', e);
      }
    },

    /**
     * hover() - Very subtle soft tick (even higher freq, 20ms, very low volume)
     * Acoustic inspiration: Silky iOS picker dial or fluid macOS dock item hover.
     */
    hover: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.02; // 20ms

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2600, now);
        osc.frequency.exponentialRampToValueAtTime(2100, now + duration);

        // Very low, soft micro-gain
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);

        scheduleDisposal([osc, gain], 30);
      } catch (e) {
        console.debug('[SoundEngine.hover]', e);
      }
    },

    /**
     * windowOpen() - Smooth rising whoosh (filtered noise sweep, 200ms)
     * Acoustic inspiration: macOS Stage Manager expansion / smooth airy whoosh.
     */
    windowOpen: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.20; // 200ms

        // 1. Aerodynamic noise sweep through resonant bandpass
        const noise = audioCtx.createBufferSource();
        noise.buffer = getNoiseBuffer(audioCtx);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(2.2, now);
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(2600, now + duration);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.07);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // 2. Harmonic foundation tone (subtle warm rising sine)
        const tone = audioCtx.createOscillator();
        const toneGain = audioCtx.createGain();
        tone.type = 'sine';
        tone.frequency.setValueAtTime(240, now);
        tone.frequency.exponentialRampToValueAtTime(520, now + duration);

        toneGain.gain.setValueAtTime(0.0001, now);
        toneGain.gain.linearRampToValueAtTime(0.06, now + 0.06);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        tone.connect(toneGain);
        toneGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + duration);
        tone.start(now);
        tone.stop(now + duration);

        scheduleDisposal([noise, filter, noiseGain, tone, toneGain], 220);
      } catch (e) {
        console.debug('[SoundEngine.windowOpen]', e);
      }
    },

    /**
     * windowClose() - Descending soft thud (low freq drop, 150ms)
     * Acoustic inspiration: Smooth cushioned window snap / tactile dampening.
     */
    windowClose: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.15; // 150ms

        // Low-frequency downward sine drop
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + duration);

        // Lowpass filter to keep it soft, pillowy, non-abrasive
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);

        scheduleDisposal([osc, filter, gain], 170);
      } catch (e) {
        console.debug('[SoundEngine.windowClose]', e);
      }
    },

    /**
     * minimize() - Quick descending pop (sine sweep down, 100ms)
     * Acoustic inspiration: macOS Genie vacuum sweep / playful descending pop.
     */
    minimize: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.10; // 100ms

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + duration);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.13, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);

        scheduleDisposal([osc, gain], 120);
      } catch (e) {
        console.debug('[SoundEngine.minimize]', e);
      }
    },

    /**
     * maximize() - Expanding sweep up (sine sweep up, 200ms)
     * Acoustic inspiration: Fluid blossoming UI expansion / upward harmonic rise.
     */
    maximize: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.20; // 200ms

        // Primary fundamental upward sweep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + duration);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        // Subtle 5th harmonic shimmer for richness
        const shimmer = audioCtx.createOscillator();
        const shimmerGain = audioCtx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(420, now);
        shimmer.frequency.exponentialRampToValueAtTime(1260, now + duration);

        shimmerGain.gain.setValueAtTime(0.0001, now);
        shimmerGain.gain.linearRampToValueAtTime(0.035, now + 0.05);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(masterGain);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);
        shimmer.start(now);
        shimmer.stop(now + duration);

        scheduleDisposal([osc, gain, shimmer, shimmerGain], 220);
      } catch (e) {
        console.debug('[SoundEngine.maximize]', e);
      }
    },

    /**
     * dockBounce() - Playful bounce (two quick sine pings ascending, 150ms)
     * Acoustic inspiration: Bouncing dock icon / lively two-step harmonic bounce.
     */
    dockBounce: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;

        // Ping 1 (587.33Hz D5 -> 659.25Hz E5, 50ms)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.05);

        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.09, now + 0.004);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        osc1.connect(gain1);
        gain1.connect(masterGain);
        osc1.start(now);
        osc1.stop(now + 0.055);

        // Ping 2 (880Hz A5 -> 1046.50Hz C6, 75ms) starting at t + 65ms
        const t2 = now + 0.065;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, t2);
        osc2.frequency.exponentialRampToValueAtTime(1046.50, t2 + 0.075);

        gain2.gain.setValueAtTime(0.0001, t2);
        gain2.gain.linearRampToValueAtTime(0.11, t2 + 0.004);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.085);

        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start(t2);
        osc2.stop(t2 + 0.085);

        scheduleDisposal([osc1, gain1, osc2, gain2], 170);
      } catch (e) {
        console.debug('[SoundEngine.dockBounce]', e);
      }
    },

    /**
     * bootUp() - Cinematic boot sequence (chord arpeggiation, 2s)
     * Acoustic inspiration: Ambient luxury workstation startup chime (D Maj9 lush spread).
     */
    bootUp: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const totalDuration = 2.0;

        // Cinematic D Major 9 spread voicing:
        // D3 (146.83Hz), A3 (220Hz), F#4 (369.99Hz), A4 (440Hz), C#5 (554.37Hz), E5 (659.25Hz), A5 (880Hz)
        const notes = [
          { freq: 146.83, delay: 0.00, duration: 1.90, peak: 0.14, type: 'triangle' },
          { freq: 220.00, delay: 0.12, duration: 1.70, peak: 0.09, type: 'sine' },
          { freq: 369.99, delay: 0.24, duration: 1.60, peak: 0.09, type: 'sine' },
          { freq: 440.00, delay: 0.38, duration: 1.50, peak: 0.08, type: 'sine' },
          { freq: 554.37, delay: 0.52, duration: 1.40, peak: 0.08, type: 'sine' },
          { freq: 659.25, delay: 0.68, duration: 1.30, peak: 0.07, type: 'sine' },
          { freq: 880.00, delay: 0.84, duration: 1.15, peak: 0.06, type: 'sine' }
        ];

        // Shared warm lowpass filter that gently opens up
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 1.2);
        filter.frequency.exponentialRampToValueAtTime(1400, now + totalDuration);
        filter.connect(masterGain);

        const nodesToDispose = [filter];

        notes.forEach(note => {
          const startTime = now + note.delay;
          const stopTime = startTime + note.duration;

          // Main Oscillator
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = note.type;
          osc.frequency.setValueAtTime(note.freq, startTime);

          // Subtle detuned chorus oscillator (+3 cents) for analog warmth
          const chorus = audioCtx.createOscillator();
          chorus.type = 'sine';
          chorus.frequency.setValueAtTime(note.freq * 1.0017, startTime);

          // Smooth curved envelope
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(note.peak, startTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

          osc.connect(gain);
          chorus.connect(gain);
          gain.connect(filter);

          osc.start(startTime);
          osc.stop(stopTime);
          chorus.start(startTime);
          chorus.stop(stopTime);

          nodesToDispose.push(osc, chorus, gain);
        });

        scheduleDisposal(nodesToDispose, totalDuration * 1000 + 100);
      } catch (e) {
        console.debug('[SoundEngine.bootUp]', e);
      }
    },

    /**
     * themeSwitch() - Ambient mode change chime (major chord, 400ms)
     * Acoustic inspiration: Celestial glass chime / pristine theme transition.
     */
    themeSwitch: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.40; // 400ms

        // Crystalline E Major add9 chime: E5 (659.25Hz), G#5 (830.61Hz), B5 (987.77Hz), E6 (1318.51Hz)
        const chord = [
          { freq: 659.25, delay: 0.000, gain: 0.08 },
          { freq: 830.61, delay: 0.015, gain: 0.09 },
          { freq: 987.77, delay: 0.030, gain: 0.09 },
          { freq: 1318.51, delay: 0.045, gain: 0.07 }
        ];

        const nodesToDispose = [];

        chord.forEach(item => {
          const startTime = now + item.delay;
          const stopTime = startTime + (duration - item.delay);

          const osc = audioCtx.createOscillator();
          const overtone = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(item.freq, startTime);

          // Subtle bell harmonic (2nd octave at low gain)
          overtone.type = 'sine';
          overtone.frequency.setValueAtTime(item.freq * 2, startTime);

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(item.gain, startTime + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

          osc.connect(gain);
          overtone.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(stopTime);
          overtone.start(startTime);
          overtone.stop(stopTime);

          nodesToDispose.push(osc, overtone, gain);
        });

        scheduleDisposal(nodesToDispose, duration * 1000 + 50);
      } catch (e) {
        console.debug('[SoundEngine.themeSwitch]', e);
      }
    },

    /**
     * notification() - Attention bell (two-tone ding, 300ms)
     * Acoustic inspiration: Modern glass notification bell / elegant executive alert.
     */
    notification: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;

        // Tone 1: E5 (659.25Hz), 110ms
        const osc1 = audioCtx.createOscillator();
        const overtone1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        overtone1.type = 'sine';
        overtone1.frequency.setValueAtTime(659.25 * 2.76, now); // Bell harmonic ratio

        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.12, now + 0.004);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc1.connect(gain1);
        overtone1.connect(gain1);
        gain1.connect(masterGain);

        osc1.start(now);
        osc1.stop(now + 0.12);
        overtone1.start(now);
        overtone1.stop(now + 0.12);

        // Tone 2: B5 (987.77Hz), starts at t + 80ms, rings out for 220ms
        const t2 = now + 0.08;
        const osc2 = audioCtx.createOscillator();
        const overtone2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(987.77, t2);
        overtone2.type = 'sine';
        overtone2.frequency.setValueAtTime(987.77 * 2.76, t2);

        gain2.gain.setValueAtTime(0.0001, t2);
        gain2.gain.linearRampToValueAtTime(0.14, t2 + 0.004);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.22);

        osc2.connect(gain2);
        overtone2.connect(gain2);
        gain2.connect(masterGain);

        osc2.start(t2);
        osc2.stop(t2 + 0.22);
        overtone2.start(t2);
        overtone2.stop(t2 + 0.22);

        scheduleDisposal([osc1, overtone1, gain1, osc2, overtone2, gain2], 320);
      } catch (e) {
        console.debug('[SoundEngine.notification]', e);
      }
    },

    /**
     * typing() - Mechanical key click (noise burst, 30ms)
     * Acoustic inspiration: Lubricated mechanical tactile switch with organic keycap thud.
     * Features subtle natural pitch jitter on each tap to eliminate robotic repetition.
     */
    typing: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.03; // 30ms

        // Natural micro-jitter (±15Hz) for realistic keyboard feel
        const jitter = (Math.random() - 0.5) * 30;

        // 1. Tactile leaf/stem high-frequency noise transient (10ms)
        const noise = audioCtx.createBufferSource();
        noise.buffer = getNoiseBuffer(audioCtx);
        const noiseFilter = audioCtx.createBiquadFilter();
        const noiseGain = audioCtx.createGain();

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(3400 + jitter * 10, now);
        noiseFilter.Q.setValueAtTime(1.8, now);

        noiseGain.gain.setValueAtTime(0.045, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        noiseSourceConnect: {
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(masterGain);
        }

        // 2. Key bottom-out wooden/chassis body thud (25ms)
        const tone = audioCtx.createOscillator();
        const toneGain = audioCtx.createGain();

        tone.type = 'sine';
        tone.frequency.setValueAtTime(420 + jitter, now);
        tone.frequency.exponentialRampToValueAtTime(120, now + duration);

        toneGain.gain.setValueAtTime(0.0001, now);
        toneGain.gain.linearRampToValueAtTime(0.07, now + 0.002);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        tone.connect(toneGain);
        toneGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.012);
        tone.start(now);
        tone.stop(now + duration);

        scheduleDisposal([noise, noiseFilter, noiseGain, tone, toneGain], 40);
      } catch (e) {
        console.debug('[SoundEngine.typing]', e);
      }
    },

    /**
     * companionHello() - Cute friendly chirp (ascending sine wobble, 300ms)
     * Acoustic inspiration: Expressive digital AI companion greeting / friendly synth chirp.
     */
    companionHello: function () {
      if (!isReady()) return;
      try {
        const now = audioCtx.currentTime;
        const duration = 0.30; // 300ms

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';

        // Expressive cheerful pitch trajectory:
        // Starts at 560Hz -> glides to 840Hz -> playful dip to 760Hz -> chirps happily to 1280Hz
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.14);
        osc.frequency.exponentialRampToValueAtTime(1280, now + 0.24);
        osc.frequency.exponentialRampToValueAtTime(1150, now + duration);

        // Soft curved envelope
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
        gain.gain.setValueAtTime(0.12, now + 0.20);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);

        scheduleDisposal([osc, gain], 320);
      } catch (e) {
        console.debug('[SoundEngine.companionHello]', e);
      }
    },

    /**
     * toggle(enabled) - Enable or disable all sounds.
     * If enabled parameter is omitted, toggles the current state.
     * Persists mute state to localStorage.
     * @param {boolean} [enabled]
     * @returns {boolean} New enabled state (true if sounds enabled, false if muted).
     */
    toggle: function (enabled) {
      if (typeof enabled === 'boolean') {
        isSoundMuted = !enabled;
      } else {
        isSoundMuted = !isSoundMuted;
      }

      if (masterGain && audioCtx) {
        try {
          masterGain.gain.setValueAtTime(isSoundMuted ? 0 : MASTER_VOLUME, audioCtx.currentTime);
        } catch (e) {}
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ayush_os_sound_enabled', String(!isSoundMuted));
        }
      } catch (e) {}

      return !isSoundMuted;
    },

    /**
     * isEnabled() - Returns current sound state.
     * @returns {boolean} True if sounds are active, false if muted.
     */
    isEnabled: function () {
      return !isSoundMuted;
    }
  };

  // Expose globally on window
  if (typeof window !== 'undefined') {
    window.SoundEngine = SoundEngine;
  }

  // Export for module systems if present
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundEngine;
  }
})(typeof window !== 'undefined' ? window : this);
