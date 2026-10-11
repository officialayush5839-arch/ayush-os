const crypto = require('crypto');
const cache = require('./cacheService');

class ImageService {
  constructor() {
    this.apiKey = process.env.IMAGE_GENERATION_API_KEY || null;
    this.generationVersion = 'v1';
  }

  // Get project cover image according to priority order
  async getProjectImage(project) {
    if (!project) return null;

    // Cache key based on repository identity, updatedAt, and version
    const cacheKey = `img_${project.githubId || project.id}_${project.updatedAt || '0'}_${this.generationVersion}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    // Priority 1: Explicit project image if configured
    if (project.customImage) {
      const result = { url: project.customImage, type: 'custom' };
      cache.set(cacheKey, result, 0);
      return result;
    }

    // Priority 2: GitHub Open Graph Social Preview
    if (project.owner && project.name) {
      const ogUrl = `https://opengraph.githubassets.com/1/${project.owner}/${project.name}`;
      const result = { url: ogUrl, type: 'opengraph' };
      cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
      return result;
    }

    // Priority 3: Deterministic SVG technical project cover fallback
    const fallbackSvg = this.generateDeterministicSvg(project);
    const result = {
      svg: fallbackSvg,
      type: 'generated_svg',
      contentType: 'image/svg+xml'
    };
    cache.set(cacheKey, result, 0);
    return result;
  }

  // Deterministic SVG project cover generation based on language, name, and topics
  generateDeterministicSvg(project) {
    const name = project.name || 'Unnamed Project';
    const lang = project.language || 'Software';
    const desc = project.description || 'Intelligent software system and production architecture.';
    const isPrivate = Boolean(project.isPrivate);

    // Color palette based on language
    const langColors = {
      python: { bg1: '#1b2a4a', bg2: '#0b162c', accent: '#3776ab', secondary: '#ffd438' },
      typescript: { bg1: '#14233c', bg2: '#081220', accent: '#3178c6', secondary: '#60a5fa' },
      javascript: { bg1: '#332b00', bg2: '#1a1500', accent: '#f7df1e', secondary: '#facc15' },
      html: { bg1: '#3a1812', bg2: '#1f0b08', accent: '#e34f26', secondary: '#fb923c' },
      css: { bg1: '#122538', bg2: '#0a1420', accent: '#1572b6', secondary: '#38bdf8' },
      java: { bg1: '#331b14', bg2: '#1c0c08', accent: '#f89820', secondary: '#f97316' },
      rust: { bg1: '#2e1913', bg2: '#180a06', accent: '#dea584', secondary: '#d97706' },
      cpp: { bg1: '#152438', bg2: '#0a1320', accent: '#00599c', secondary: '#3b82f6' }
    };

    const palette = langColors[(lang || '').toLowerCase()] || {
      bg1: '#1f1a24',
      bg2: '#0f0c12',
      accent: '#a855f7',
      secondary: '#c084fc'
    };

    // Clean text for SVG safety
    const safeName = this.escapeXml(name);
    const safeDesc = this.escapeXml(desc.length > 90 ? desc.substring(0, 87) + '...' : desc);
    const safeLang = this.escapeXml(lang);
    const visibilityLabel = isPrivate ? 'PRIVATE ARCHIVE' : 'PUBLIC RELEASE';
    const visibilityColor = isPrivate ? '#f59e0b' : '#10b981';

    // Hash for deterministic pattern lines
    const hash = crypto.createHash('md5').update(name).digest('hex');
    const p1 = parseInt(hash.substr(0, 2), 16) % 100;
    const p2 = parseInt(hash.substr(2, 2), 16) % 100;
    const p3 = parseInt(hash.substr(4, 2), 16) % 100;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}" />
      <stop offset="100%" stop-color="${palette.bg2}" />
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="640" height="360" fill="url(#bgGrad)" />
  <rect width="640" height="360" fill="url(#grid)" />

  <!-- Technical Circuit Accent Lines -->
  <path d="M 40 180 L 140 180 L 190 ${120 + (p1 % 80)} L 360 ${120 + (p1 % 80)} L 420 240 L 600 240" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-opacity="0.4" stroke-dasharray="6,4" />
  <path d="M 100 80 L 220 80 L 280 ${180 + (p2 % 60)} L 540 ${180 + (p2 % 60)}" fill="none" stroke="${palette.secondary}" stroke-width="1.5" stroke-opacity="0.3" />

  <!-- Header Meta Tag -->
  <g transform="translate(40, 48)">
    <rect width="130" height="22" rx="3" fill="rgba(0,0,0,0.4)" stroke="${visibilityColor}" stroke-width="1" />
    <circle cx="12" cy="11" r="3.5" fill="${visibilityColor}" />
    <text x="24" y="15" fill="${visibilityColor}" font-family="monospace" font-size="9" font-weight="700" letter-spacing="1">${visibilityLabel}</text>
  </g>

  <!-- Language Badge -->
  <g transform="translate(180, 48)">
    <rect width="100" height="22" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
    <text x="50" y="15" fill="#f3f4f6" font-family="monospace" font-size="10" font-weight="600" text-anchor="middle">${safeLang}</text>
  </g>

  <!-- OS Watermark -->
  <text x="600" y="52" fill="rgba(255,255,255,0.25)" font-family="monospace" font-size="10" font-weight="600" text-anchor="end" letter-spacing="2">AYUSH.OS // ARCHIVE</text>

  <!-- Central Project Name -->
  <text x="40" y="170" fill="#ffffff" font-family="'Space Grotesk', -apple-system, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.5">${safeName}</text>

  <!-- Project Description -->
  <text x="40" y="212" fill="#9ca3af" font-family="monospace" font-size="12" font-weight="400">${safeDesc}</text>

  <!-- Bottom Technical Grid -->
  <line x1="40" y1="300" x2="600" y2="300" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
  <text x="40" y="324" fill="#6b7280" font-family="monospace" font-size="9" letter-spacing="1">SYSTEM IDENTIFIER: ${hash.substring(0, 12).toUpperCase()}</text>
  <text x="600" y="324" fill="${palette.accent}" font-family="monospace" font-size="9" font-weight="700" text-anchor="end">READY FOR INSPECTION ↗</text>
</svg>`;
  }

  escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

module.exports = new ImageService();
