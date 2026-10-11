/**
 * ThreeBG - Interactive 3D Particle Constellation Background
 * 
 * Features:
 * - 900 floating 3D particles with organic drift and rotation
 * - Dynamic distance-based constellation connections with spatial hashing (60 FPS)
 * - Procedural radial gradient cloud sprites drifting through space (no external images)
 * - GPU-twinkling star sparkle field with customizable pulsing
 * - Smooth mouse parallax with dampened camera motion
 * - Three dynamic color themes: 'day', 'night', and 'cyber' with smooth transitions
 * - Responsive resize handling, visibility change optimization, and prefers-reduced-motion support
 * 
 * Export: window.ThreeBG = { init, setTheme, destroy, getTheme }
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ThreeBG = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const THREE_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

  // Theme Palettes
  const THEMES = {
    day: {
      name: 'day',
      background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 35%, #7dd3fc 70%, #bae6fd 100%)',
      particlePrimary: 0xfaf5ef,       // Warm white particles
      particleSecondary: 0xfef3c7,     // Warm soft ivory
      lineColor: 0x60a5fa,             // Soft blue connections
      cloudColor: 0xffffff,            // Soft white cumulus clouds
      cloudOpacity: 0.35,
      starColor: 0xfef9c3,             // Soft daylight sparkle shimmer
      blending: 'additive'             // Luminous glow on sky gradient
    },
    night: {
      name: 'night',
      background: 'linear-gradient(135deg, #020617 0%, #0b0f19 50%, #1e1b4b 100%)',
      particlePrimary: 0x38bdf8,       // Cool cyan / sky blue
      particleSecondary: 0xc084fc,     // Soft lavender purple accent
      lineColor: 0xa855f7,             // Violet-purple connections
      cloudColor: 0x312e81,            // Deep indigo / violet nebulae
      cloudOpacity: 0.24,
      starColor: 0x67e8f9,             // Diamond cyan twinkling
      blending: 'additive'             // Additive blending for luminous celestial glow
    },
    cyber: {
      name: 'cyber',
      background: 'linear-gradient(135deg, #050208 0%, #0a0514 50%, #000806 100%)',
      particlePrimary: 0x22c55e,       // Neon green
      particleSecondary: 0xec4899,     // Electric hot pink
      lineColor: 0x06b6d4,             // Electric cyan connections
      cloudColor: 0x701a75,            // Deep magenta void haze
      cloudOpacity: 0.22,
      starColor: 0x00ffcc,             // Neon emerald / cyan sparkle
      blending: 'additive'             // Additive glow
    }
  };

  // State
  let isInitialized = false;
  let isReady = false;
  let initPromise = null;
  let animationFrameId = null;

  // DOM Elements
  let containerElement = null;
  let canvasElement = null;

  // Three.js Instances
  let THREE = null;
  let scene = null;
  let camera = null;
  let renderer = null;

  // Scene Objects & Groups
  let constellationGroup = null;
  let particlePoints = null;
  let particleGeometry = null;
  let particleMaterial = null;
  let lineSegments = null;
  let lineGeometry = null;
  let lineMaterial = null;
  let cloudSprites = [];
  let starPoints = null;
  let starMaterial = null;

  // Data Buffers & Geometry Attributes
  const NUM_PARTICLES = 880;
  const MAX_LINES = 2200;
  const MAX_LINE_DIST = 92;
  const MAX_LINE_DIST_SQ = MAX_LINE_DIST * MAX_LINE_DIST;
  const MAX_CONNECTIONS_PER_PARTICLE = 4;

  let particlePositions = null;
  let particleVelocities = null;
  let particleBaseColors = null;
  let currentParticleColors = null;
  let targetParticleColors = null;
  let particleRatios = null;

  let linePositions = null;
  let lineColors = null;
  let connectionCounts = null;

  // Twinkling Stars
  const NUM_STARS = 320;
  let starPositions = null;
  let starSizes = null;
  let starPhases = null;
  let starSpeeds = null;

  // Animation & Motion
  let clock = null;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let prefersReducedMotion = false;
  let motionMediaQuery = null;

  // Active Theme & Transition Lerpers
  let currentThemeName = 'night';
  let targetThemeName = 'night';
  let colorTransitionFactor = 1.0;

  const currentLineColor = { r: 0.65, g: 0.33, b: 0.96 };
  const targetLineColor = { r: 0.65, g: 0.33, b: 0.96 };

  const currentCloudColor = { r: 0.19, g: 0.18, b: 0.5 };
  const targetCloudColor = { r: 0.19, g: 0.18, b: 0.5 };
  let currentCloudOpacity = 0.24;
  let targetCloudOpacity = 0.24;

  const currentStarColor = { r: 0.4, g: 0.9, b: 0.97 };
  const targetStarColor = { r: 0.4, g: 0.9, b: 0.97 };

  // Spatial Grid for O(N) Constellation Line Search
  const SPATIAL_CELL_SIZE = 95;
  const spatialGrid = new Map();

  /**
   * Load Three.js dynamically from CDN if not already loaded in the environment
   */
  function loadThree() {
    if (window.THREE && typeof window.THREE.WebGLRenderer === 'function') {
      THREE = window.THREE;
      return Promise.resolve(THREE);
    }

    if (initPromise) return initPromise;

    initPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src*="three.min.js"], script[src*="three.js"]`);
      if (existingScript) {
        if (window.THREE) {
          THREE = window.THREE;
          return resolve(THREE);
        }
        existingScript.addEventListener('load', () => {
          THREE = window.THREE;
          resolve(THREE);
        });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load existing Three.js script')));
        return;
      }

      const script = document.createElement('script');
      script.src = THREE_CDN_URL;
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        if (window.THREE) {
          THREE = window.THREE;
          resolve(THREE);
        } else {
          reject(new Error('Three.js script loaded, but window.THREE is undefined.'));
        }
      };

      script.onerror = () => {
        reject(new Error(`Failed to load Three.js from CDN: ${THREE_CDN_URL}`));
      };

      document.head.appendChild(script);
    });

    return initPromise;
  }

  /**
   * Procedural texture generator for soft glowing particle discs
   */
  function createParticleDiscTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Procedural texture generator for delicate 4-point twinkling star sparkles
   */
  function createStarSparkleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const center = size / 2;

    // Glowing core
    const radGrad = ctx.createRadialGradient(center, center, 0, center, center, center * 0.5);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.75)');
    radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 4-point light diffraction rays
    const rayGradH = ctx.createLinearGradient(0, center, size, center);
    rayGradH.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rayGradH.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    rayGradH.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rayGradH;
    ctx.fillRect(4, center - 1, size - 8, 2);

    const rayGradV = ctx.createLinearGradient(center, 0, center, size);
    rayGradV.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rayGradV.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    rayGradV.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rayGradV;
    ctx.fillRect(center - 1, 4, 2, size - 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Procedural texture generator for soft, wispy, organic cloud sprites
   * Uses multi-puff radial gradients on an offscreen canvas — zero external images
   */
  function createProceduralCloudTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Natural puff clusters with varying radius, center, and alpha
    const puffs = [
      { x: 256, y: 256, r: 190, a: 0.55 },
      { x: 180, y: 240, r: 150, a: 0.42 },
      { x: 330, y: 245, r: 160, a: 0.44 },
      { x: 225, y: 195, r: 135, a: 0.40 },
      { x: 285, y: 310, r: 130, a: 0.38 },
      { x: 150, y: 280, r: 120, a: 0.32 },
      { x: 360, y: 200, r: 115, a: 0.34 },
      { x: 235, y: 325, r: 125, a: 0.36 },
      { x: 300, y: 175, r: 110, a: 0.30 }
    ];

    puffs.forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, `rgba(255, 255, 255, ${p.a})`);
      grad.addColorStop(0.35, `rgba(255, 255, 255, ${p.a * 0.65})`);
      grad.addColorStop(0.75, `rgba(255, 255, 255, ${p.a * 0.18})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Helper to convert Hex number / CSS color to normalized RGB object {r, g, b}
   */
  function hexToRgb(hex) {
    return {
      r: ((hex >> 16) & 255) / 255,
      g: ((hex >> 8) & 255) / 255,
      b: (hex & 255) / 255
    };
  }

  /**
   * Set target colors for the active theme
   */
  function applyThemeColors(themeName) {
    const theme = THEMES[themeName] || THEMES.night;
    currentThemeName = theme.name;

    // Update container CSS gradient
    if (containerElement) {
      containerElement.style.background = theme.background;
    }

    // Set line target color
    const lineRgb = hexToRgb(theme.lineColor);
    targetLineColor.r = lineRgb.r;
    targetLineColor.g = lineRgb.g;
    targetLineColor.b = lineRgb.b;

    // Set cloud target color and opacity
    const cloudRgb = hexToRgb(theme.cloudColor);
    targetCloudColor.r = cloudRgb.r;
    targetCloudColor.g = cloudRgb.g;
    targetCloudColor.b = cloudRgb.b;
    targetCloudOpacity = theme.cloudOpacity;

    // Set star target color
    const starRgb = hexToRgb(theme.starColor);
    targetStarColor.r = starRgb.r;
    targetStarColor.g = starRgb.g;
    targetStarColor.b = starRgb.b;

    // Calculate target particle colors for all particles
    const primRgb = hexToRgb(theme.particlePrimary);
    const secRgb = hexToRgb(theme.particleSecondary);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const ratio = particleRatios[i];
      const i3 = i * 3;
      // Interpolate between primary and secondary
      targetParticleColors[i3] = primRgb.r + (secRgb.r - primRgb.r) * ratio;
      targetParticleColors[i3 + 1] = primRgb.g + (secRgb.g - primRgb.g) * ratio;
      targetParticleColors[i3 + 2] = primRgb.b + (secRgb.b - primRgb.b) * ratio;
    }

    colorTransitionFactor = 0.0;

    // Update blending modes for material responsiveness
    const useAdditive = theme.blending === 'additive';
    const newBlending = useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

    if (particleMaterial && particleMaterial.blending !== newBlending) {
      particleMaterial.blending = newBlending;
      particleMaterial.needsUpdate = true;
    }
    if (lineMaterial && lineMaterial.blending !== newBlending) {
      lineMaterial.blending = newBlending;
      lineMaterial.needsUpdate = true;
    }
    if (cloudSprites.length > 0) {
      cloudSprites.forEach(cloud => {
        if (cloud.material.blending !== newBlending) {
          cloud.material.blending = newBlending;
          cloud.material.needsUpdate = true;
        }
      });
    }
  }

  /**
   * Build the 3D particle constellation system
   */
  function createConstellation() {
    constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // Particle buffers
    particlePositions = new Float32Array(NUM_PARTICLES * 3);
    particleVelocities = new Float32Array(NUM_PARTICLES * 3);
    particleBaseColors = new Float32Array(NUM_PARTICLES * 3);
    currentParticleColors = new Float32Array(NUM_PARTICLES * 3);
    targetParticleColors = new Float32Array(NUM_PARTICLES * 3);
    particleRatios = new Float32Array(NUM_PARTICLES);

    // Seed particles in an organic 3D ellipsoid volume
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i3 = i * 3;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 480;

      particlePositions[i3] = r * Math.sin(phi) * Math.cos(theta) * 1.35; // Wider X
      particlePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.9;
      particlePositions[i3 + 2] = r * Math.cos(phi) * 0.7;               // Flatter Z

      // Gentle organic drift velocities
      particleVelocities[i3] = (Math.random() - 0.5) * 0.32;
      particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.32;
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.22;

      // Color ratio (0 = primary, 1 = secondary/accent)
      particleRatios[i] = Math.random();
    }

    // Geometry & Material
    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(currentParticleColors, 3).setUsage(THREE.DynamicDrawUsage));

    const particleTexture = createParticleDiscTexture();

    particleMaterial = new THREE.PointsMaterial({
      size: 6.5,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    constellationGroup.add(particlePoints);

    // Dynamic Connecting Lines Buffer
    const maxLineVertices = MAX_LINES * 2;
    linePositions = new Float32Array(maxLineVertices * 3);
    lineColors = new Float32Array(maxLineVertices * 3);
    connectionCounts = new Uint8Array(NUM_PARTICLES);

    lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setDrawRange(0, 0);

    lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1
    });

    lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    constellationGroup.add(lineSegments);
  }

  /**
   * Build floating atmospheric clouds using procedural radial textures
   */
  function createFloatingClouds() {
    const cloudTexture = createProceduralCloudTexture();
    const CLOUD_COUNT = 7;
    cloudSprites = [];

    for (let i = 0; i < CLOUD_COUNT; i++) {
      const material = new THREE.SpriteMaterial({
        map: cloudTexture,
        color: new THREE.Color(targetCloudColor.r, targetCloudColor.g, targetCloudColor.b),
        transparent: true,
        opacity: targetCloudOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(material);

      // Distribute across space
      const x = (Math.random() - 0.5) * 1200;
      const y = (Math.random() - 0.5) * 600;
      const z = -180 + Math.random() * 260; // Varying depths

      sprite.position.set(x, y, z);

      // Cloud scale (soft, sprawling dimensions)
      const baseWidth = 520 + Math.random() * 380;
      const baseHeight = 360 + Math.random() * 260;
      sprite.scale.set(baseWidth, baseHeight, 1.0);

      // Custom motion parameters
      sprite.userData = {
        baseX: x,
        baseY: y,
        baseWidth,
        baseHeight,
        vx: (0.08 + Math.random() * 0.12) * (Math.random() < 0.5 ? 1 : -1),
        bobSpeed: 0.25 + Math.random() * 0.5,
        bobAmp: 18 + Math.random() * 24,
        phase: Math.random() * Math.PI * 2
      };

      scene.add(sprite);
      cloudSprites.push(sprite);
    }
  }

  /**
   * Build twinkling background star sparkle field with GPU-driven pulse shader
   */
  function createSparkleStars() {
    starPositions = new Float32Array(NUM_STARS * 3);
    starSizes = new Float32Array(NUM_STARS);
    starPhases = new Float32Array(NUM_STARS);
    starSpeeds = new Float32Array(NUM_STARS);

    for (let i = 0; i < NUM_STARS; i++) {
      const i3 = i * 3;
      // Wide background distribution
      starPositions[i3] = (Math.random() - 0.5) * 1600;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 1000;
      starPositions[i3 + 2] = -420 + Math.random() * 220; // Receded deep into background

      starSizes[i] = 3.5 + Math.random() * 5.5;
      starPhases[i] = Math.random() * Math.PI * 2;
      starSpeeds[i] = 0.8 + Math.random() * 2.4;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1));
    starGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(starSpeeds, 1));

    const starTexture = createStarSparkleTexture();

    // Custom GPU Point Shader for smooth 60fps twinkling without CPU overhead
    const starVertexShader = `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float pulse = sin(uTime * aSpeed + aPhase);
        // Twinkle factor from 0.15 to 1.0
        vAlpha = 0.20 + 0.80 * (0.5 + 0.5 * pulse);
        float dynamicSize = aSize * (0.75 + 0.35 * pulse);
        gl_PointSize = dynamicSize * uPixelRatio * (280.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const starFragmentShader = `
      uniform vec3 uColor;
      uniform sampler2D uTexture;
      varying float vAlpha;

      void main() {
        vec4 texColor = texture2D(uTexture, gl_PointCoord);
        if (texColor.a < 0.01) discard;
        gl_FragColor = vec4(uColor * texColor.rgb, texColor.a * vAlpha);
      }
    `;

    starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(targetStarColor.r, targetStarColor.g, targetStarColor.b) },
        uTexture: { value: starTexture },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) }
      },
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);
  }

  /**
   * Fast O(N) spatial grid query to find and connect nearby particles
   */
  function updateConstellationConnections() {
    spatialGrid.clear();

    const boundsX = 640;
    const boundsY = 420;
    const boundsZ = 320;

    const driftScale = prefersReducedMotion ? 0.05 : 1.0;

    // 1. Move particles and populate spatial grid
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i3 = i * 3;

      particlePositions[i3] += particleVelocities[i3] * driftScale;
      particlePositions[i3 + 1] += particleVelocities[i3 + 1] * driftScale;
      particlePositions[i3 + 2] += particleVelocities[i3 + 2] * driftScale;

      // Soft boundary reflection
      if (particlePositions[i3] > boundsX || particlePositions[i3] < -boundsX) {
        particleVelocities[i3] *= -1;
      }
      if (particlePositions[i3 + 1] > boundsY || particlePositions[i3 + 1] < -boundsY) {
        particleVelocities[i3 + 1] *= -1;
      }
      if (particlePositions[i3 + 2] > boundsZ || particlePositions[i3 + 2] < -boundsZ) {
        particleVelocities[i3 + 2] *= -1;
      }

      // Grid cell key
      const cx = Math.floor(particlePositions[i3] / SPATIAL_CELL_SIZE);
      const cy = Math.floor(particlePositions[i3 + 1] / SPATIAL_CELL_SIZE);
      const cz = Math.floor(particlePositions[i3 + 2] / SPATIAL_CELL_SIZE);
      const key = `${cx},${cy},${cz}`;

      let cell = spatialGrid.get(key);
      if (!cell) {
        cell = [];
        spatialGrid.set(key, cell);
      }
      cell.push(i);
    }

    particleGeometry.attributes.position.needsUpdate = true;

    // 2. Query spatial grid neighbors and create dynamic lines
    let lineVertexCount = 0;
    const maxVertices = MAX_LINES * 2;
    connectionCounts.fill(0);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      if (connectionCounts[i] >= MAX_CONNECTIONS_PER_PARTICLE) continue;

      const i3 = i * 3;
      const x1 = particlePositions[i3];
      const y1 = particlePositions[i3 + 1];
      const z1 = particlePositions[i3 + 2];

      const cx = Math.floor(x1 / SPATIAL_CELL_SIZE);
      const cy = Math.floor(y1 / SPATIAL_CELL_SIZE);
      const cz = Math.floor(z1 / SPATIAL_CELL_SIZE);

      // Check 3x3x3 adjacent cells
      searchLoop:
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const key = `${cx + dx},${cy + dy},${cz + dz}`;
            const cell = spatialGrid.get(key);
            if (!cell) continue;

            for (let c = 0; c < cell.length; c++) {
              const j = cell[c];
              if (j <= i) continue; // Prevent double testing
              if (connectionCounts[j] >= MAX_CONNECTIONS_PER_PARTICLE) continue;

              const j3 = j * 3;
              const x2 = particlePositions[j3];
              const y2 = particlePositions[j3 + 1];
              const z2 = particlePositions[j3 + 2];

              const dx2 = x1 - x2;
              const dy2 = y1 - y2;
              const dz2 = z1 - z2;
              const distSq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;

              if (distSq < MAX_LINE_DIST_SQ) {
                const dist = Math.sqrt(distSq);
                const alpha = 1.0 - (dist / MAX_LINE_DIST);

                const vIndex = lineVertexCount * 3;

                // Vertex 1
                linePositions[vIndex] = x1;
                linePositions[vIndex + 1] = y1;
                linePositions[vIndex + 2] = z1;
                lineColors[vIndex] = currentLineColor.r * alpha;
                lineColors[vIndex + 1] = currentLineColor.g * alpha;
                lineColors[vIndex + 2] = currentLineColor.b * alpha;

                // Vertex 2
                linePositions[vIndex + 3] = x2;
                linePositions[vIndex + 4] = y2;
                linePositions[vIndex + 5] = z2;
                lineColors[vIndex + 3] = currentLineColor.r * alpha;
                lineColors[vIndex + 4] = currentLineColor.g * alpha;
                lineColors[vIndex + 5] = currentLineColor.b * alpha;

                lineVertexCount += 2;
                connectionCounts[i]++;
                connectionCounts[j]++;

                if (lineVertexCount >= maxVertices || connectionCounts[i] >= MAX_CONNECTIONS_PER_PARTICLE) {
                  break searchLoop;
                }
              }
            }
          }
        }
      }
      if (lineVertexCount >= maxVertices) break;
    }

    lineGeometry.setDrawRange(0, lineVertexCount);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
  }

  /**
   * Update floating cloud positions and seamless boundary wrapping
   */
  function updateClouds(time) {
    const driftMultiplier = prefersReducedMotion ? 0.08 : 1.0;

    for (let i = 0; i < cloudSprites.length; i++) {
      const cloud = cloudSprites[i];
      const data = cloud.userData;

      // Slow horizontal drift
      cloud.position.x += data.vx * driftMultiplier;

      // Gentle vertical bobbing
      cloud.position.y = data.baseY + Math.sin(time * data.bobSpeed + data.phase) * data.bobAmp;

      // Subtle breathing scale
      const breathe = 1.0 + Math.sin(time * 0.4 + data.phase) * 0.04;
      cloud.scale.set(data.baseWidth * breathe, data.baseHeight * breathe, 1.0);

      // Seamless wrap-around at viewport bounds
      if (cloud.position.x > 800) {
        cloud.position.x = -800;
      } else if (cloud.position.x < -800) {
        cloud.position.x = 800;
      }
    }
  }

  /**
   * Smoothly interpolate theme colors over time
   */
  function updateColorTransitions() {
    const LERP_SPEED = 0.06;

    // Line Color Lerp
    currentLineColor.r += (targetLineColor.r - currentLineColor.r) * LERP_SPEED;
    currentLineColor.g += (targetLineColor.g - currentLineColor.g) * LERP_SPEED;
    currentLineColor.b += (targetLineColor.b - currentLineColor.b) * LERP_SPEED;

    // Cloud Color & Opacity Lerp
    currentCloudColor.r += (targetCloudColor.r - currentCloudColor.r) * LERP_SPEED;
    currentCloudColor.g += (targetCloudColor.g - currentCloudColor.g) * LERP_SPEED;
    currentCloudColor.b += (targetCloudColor.b - currentCloudColor.b) * LERP_SPEED;
    currentCloudOpacity += (targetCloudOpacity - currentCloudOpacity) * LERP_SPEED;

    cloudSprites.forEach(cloud => {
      cloud.material.color.setRGB(currentCloudColor.r, currentCloudColor.g, currentCloudColor.b);
      cloud.material.opacity = currentCloudOpacity;
    });

    // Star Color Lerp
    currentStarColor.r += (targetStarColor.r - currentStarColor.r) * LERP_SPEED;
    currentStarColor.g += (targetStarColor.g - currentStarColor.g) * LERP_SPEED;
    currentStarColor.b += (targetStarColor.b - currentStarColor.b) * LERP_SPEED;

    if (starMaterial && starMaterial.uniforms) {
      starMaterial.uniforms.uColor.value.setRGB(currentStarColor.r, currentStarColor.g, currentStarColor.b);
    }

    // Particle Colors Lerp
    if (colorTransitionFactor < 1.0) {
      colorTransitionFactor += 0.04;
      let needsColorUpdate = false;

      for (let i = 0; i < NUM_PARTICLES * 3; i++) {
        const diff = targetParticleColors[i] - currentParticleColors[i];
        if (Math.abs(diff) > 0.001) {
          currentParticleColors[i] += diff * LERP_SPEED;
          needsColorUpdate = true;
        }
      }

      if (needsColorUpdate && particleGeometry) {
        particleGeometry.attributes.color.needsUpdate = true;
      }
    }
  }

  /**
   * Main animation render loop (60 FPS with requestAnimationFrame)
   */
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Mouse Parallax with smooth lerp dampening
    const lerpRate = prefersReducedMotion ? 0.01 : 0.05;
    mouseX += (targetMouseX - mouseX) * lerpRate;
    mouseY += (targetMouseY - mouseY) * lerpRate;

    camera.position.x = mouseX * 45;
    camera.position.y = mouseY * 32;
    camera.lookAt(0, 0, 0);

    // 2. Slow organic rotation of the constellation group
    if (!prefersReducedMotion) {
      constellationGroup.rotation.y = elapsedTime * 0.025 + mouseX * 0.12;
      constellationGroup.rotation.x = elapsedTime * 0.012 - mouseY * 0.08;
    } else {
      constellationGroup.rotation.y = mouseX * 0.04;
      constellationGroup.rotation.x = -mouseY * 0.03;
    }

    // 3. Update subsystems
    updateConstellationConnections();
    updateClouds(elapsedTime);
    updateColorTransitions();

    // 4. Update GPU star uniforms
    if (starMaterial && starMaterial.uniforms) {
      starMaterial.uniforms.uTime.value = elapsedTime;
    }

    // 5. Render Scene
    renderer.render(scene, camera);
  }

  /**
   * Handle responsive window resizing
   */
  function onResize() {
    if (!renderer || !camera || !containerElement) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);

    if (starMaterial && starMaterial.uniforms) {
      starMaterial.uniforms.uPixelRatio.value = pixelRatio;
    }
  }

  /**
   * Track mouse movements for 3D depth parallax
   */
  function onPointerMove(event) {
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Track touch drag on mobile / tablet devices
   */
  function onTouchMove(event) {
    if (event.touches.length > 0) {
      targetMouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  /**
   * Reset parallax gently when mouse leaves window
   */
  function onMouseLeave() {
    targetMouseX = 0;
    targetMouseY = 0;
  }

  /**
   * Optimization: Pause rendering when browser tab is inactive
   */
  function onVisibilityChange() {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      if (!animationFrameId && isInitialized) {
        clock.start();
        animate();
      }
    }
  }

  /**
   * Handle user accessibility preference for reduced motion
   */
  function onReducedMotionChange(event) {
    prefersReducedMotion = event.matches;
  }

  /**
   * Initialize ThreeBG interactive 3D background
   * @param {string|HTMLElement} containerIdOrElement - ID or DOM element to host the canvas
   * @param {string} [initialTheme='night'] - Optional initial theme ('day', 'night', or 'cyber')
   */
  async function init(containerIdOrElement, initialTheme = 'night') {
    if (isInitialized) {
      console.warn('[ThreeBG] Already initialized. Destroying previous instance before re-initializing.');
      destroy();
    }

    // 1. Resolve container element
    let target = null;
    if (typeof containerIdOrElement === 'string') {
      const cleanId = containerIdOrElement.replace(/^#/, '');
      target = document.getElementById(cleanId) || document.querySelector(containerIdOrElement);

      if (!target) {
        target = document.createElement('div');
        target.id = cleanId;
        document.body.prepend(target);
      }
    } else if (containerIdOrElement instanceof HTMLElement) {
      target = containerIdOrElement;
    } else {
      target = document.createElement('div');
      target.id = 'three-bg-container';
      document.body.prepend(target);
    }

    containerElement = target;

    // Apply fixed viewport styles to container behind all content
    containerElement.style.position = 'fixed';
    containerElement.style.top = '0';
    containerElement.style.left = '0';
    containerElement.style.width = '100vw';
    containerElement.style.height = '100vh';
    containerElement.style.zIndex = '0';
    containerElement.style.pointerEvents = 'none';
    containerElement.style.overflow = 'hidden';
    containerElement.style.transition = 'background 1.2s cubic-bezier(0.4, 0, 0.2, 1)';

    // 2. Load Three.js from CDN
    await loadThree();

    // 3. Create WebGL Canvas
    canvasElement = document.createElement('canvas');
    canvasElement.id = 'three-bg-canvas';
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = '0';
    canvasElement.style.left = '0';
    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    canvasElement.style.display = 'block';
    canvasElement.style.pointerEvents = 'none';

    containerElement.appendChild(canvasElement);

    // 4. Initialize Three.js Engine
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
    camera.position.set(0, 0, 430);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Transparent to reveal CSS background gradient

    clock = new THREE.Clock();

    // 5. Check prefers-reduced-motion
    motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = motionMediaQuery.matches;
    motionMediaQuery.addEventListener('change', onReducedMotionChange);

    // 6. Build Scene Entities
    createConstellation();
    createFloatingClouds();
    createSparkleStars();

    // 7. Apply Theme
    const selectedTheme = THEMES[initialTheme] ? initialTheme : 'night';
    applyThemeColors(selectedTheme);

    // Initial instant color assignment
    for (let i = 0; i < NUM_PARTICLES * 3; i++) {
      currentParticleColors[i] = targetParticleColors[i];
    }
    particleGeometry.attributes.color.needsUpdate = true;

    currentLineColor.r = targetLineColor.r;
    currentLineColor.g = targetLineColor.g;
    currentLineColor.b = targetLineColor.b;

    currentCloudColor.r = targetCloudColor.r;
    currentCloudColor.g = targetCloudColor.g;
    currentCloudColor.b = targetCloudColor.b;
    currentCloudOpacity = targetCloudOpacity;

    currentStarColor.r = targetStarColor.r;
    currentStarColor.g = targetStarColor.g;
    currentStarColor.b = targetStarColor.b;

    // 8. Attach Window Event Listeners
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 9. Start Animation Loop
    isInitialized = true;
    isReady = true;
    animate();

    return ThreeBG;
  }

  /**
   * Switch the visual theme
   * @param {string} themeName - 'day', 'night', or 'cyber'
   */
  function setTheme(themeName) {
    const validTheme = THEMES[themeName] ? themeName : 'night';
    targetThemeName = validTheme;

    if (!isInitialized) {
      currentThemeName = validTheme;
      return;
    }

    applyThemeColors(validTheme);
  }

  /**
   * Get the current active theme name
   */
  function getTheme() {
    return currentThemeName;
  }

  /**
   * Clean up all Three.js resources, event listeners, and DOM elements
   */
  function destroy() {
    if (!isInitialized) return;

    // 1. Stop animation loop
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // 2. Remove event listeners
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    if (motionMediaQuery) {
      motionMediaQuery.removeEventListener('change', onReducedMotionChange);
      motionMediaQuery = null;
    }

    // 3. Dispose Geometries and Materials
    if (particleGeometry) {
      particleGeometry.dispose();
      particleGeometry = null;
    }
    if (particleMaterial) {
      if (particleMaterial.map) particleMaterial.map.dispose();
      particleMaterial.dispose();
      particleMaterial = null;
    }
    if (lineGeometry) {
      lineGeometry.dispose();
      lineGeometry = null;
    }
    if (lineMaterial) {
      lineMaterial.dispose();
      lineMaterial = null;
    }

    if (cloudSprites && cloudSprites.length > 0) {
      cloudSprites.forEach(sprite => {
        if (sprite.material) {
          if (sprite.material.map) sprite.material.map.dispose();
          sprite.material.dispose();
        }
      });
      cloudSprites = [];
    }

    if (starPoints) {
      if (starPoints.geometry) starPoints.geometry.dispose();
      if (starMaterial) {
        if (starMaterial.uniforms && starMaterial.uniforms.uTexture.value) {
          starMaterial.uniforms.uTexture.value.dispose();
        }
        starMaterial.dispose();
      }
      starPoints = null;
    }

    // 4. Dispose Renderer and Remove Canvas
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }

    if (canvasElement && canvasElement.parentNode) {
      canvasElement.parentNode.removeChild(canvasElement);
      canvasElement = null;
    }

    spatialGrid.clear();

    scene = null;
    camera = null;
    clock = null;
    containerElement = null;

    isInitialized = false;
    isReady = false;
  }

  const ThreeBG = {
    init,
    setTheme,
    getTheme,
    destroy,
    get isReady() {
      return isReady;
    }
  };

  return ThreeBG;
}));
