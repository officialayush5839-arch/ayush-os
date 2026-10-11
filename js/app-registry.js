(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AppRegistry = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const APPS = [
    {
      id: 'projects',
      title: 'Projects Explorer',
      subtitle: 'VERIFIED REPOSITORIES // GITHUB ENGINE',
      icon: './assets/icons-v4/projects.png',
      badge: 'MAIN DRIVE',
      color: '#f5a39c',
      aliases: ['work']
    },
    {
      id: 'internships',
      title: 'Internships Archive',
      subtitle: 'CAREER FILE SYSTEM // EVIDENCE ARCHIVE',
      icon: './assets/icons-v4/internships.png',
      badge: 'CAREER ARCHIVE',
      color: '#a8d7e8',
      aliases: ['career']
    },
    {
      id: 'achievements',
      title: 'Achievements & Results',
      subtitle: 'PODIUM FINISHES // QUANTIFIED EVIDENCE',
      icon: './assets/icons-v4/revenue.png',
      badge: 'TROPHIES & METRICS',
      color: '#c7f36b',
      aliases: ['revenue', 'results', 'testimonials', 'proof']
    },
    {
      id: 'techstack',
      title: 'Tech Stack & Systems',
      subtitle: 'PRODUCTION COMPETENCY // SYSTEM ARCHITECTURE',
      icon: './assets/icons-v4/systems.png',
      badge: 'TECH RADAR',
      color: '#a8d7e8',
      aliases: ['systems', 'process', 'stack', 'skills']
    },
    {
      id: 'research',
      title: 'Research & Publications',
      subtitle: 'EXPERIMENTAL SYSTEMS // SCHOLARLY INQUIRY',
      icon: './assets/icons-v4/browser.png',
      badge: 'LAB & PREPRINTS',
      color: '#b9dfe8',
      aliases: ['papers', 'publications', 'lab']
    },
    {
      id: 'certifications',
      title: 'Certifications & Learning',
      subtitle: 'ACCREDITED CREDENTIALS // VERIFIED CODES',
      icon: './assets/icons-v4/learn.svg',
      badge: 'CREDENTIAL VAULT',
      color: '#e6e35f',
      aliases: ['learn', 'education', 'courses']
    },
    {
      id: 'journey',
      title: 'Journey & Story',
      subtitle: '2023 → 2026+ // ENGINEERING EVOLUTION',
      icon: './assets/icons-v4/journey.png',
      badge: 'FOUNDER CHRONICLE',
      color: '#b8a7e8',
      aliases: ['about', 'story', 'bio']
    },
    {
      id: 'contact',
      title: 'Contact & Collaborate',
      subtitle: 'RESEARCH // INTERNSHIPS // DIRECT CHANNELS',
      icon: './assets/icons-v4/contact.png',
      badge: 'DISPATCH CHANNEL',
      color: '#e9d19d',
      aliases: ['collaborate', 'messages', 'inbox']
    }
  ];

  const EXTENSIONS = [
    {
      id: 'resume',
      title: 'AYUSH.OS // PERSONNEL FILE',
      subtitle: 'PROFESSIONAL PROFILE • EXPERIENCE • TECHNICAL CAPABILITIES',
      icon: './assets/icons-v4/learn.svg',
      badge: 'PERSONNEL FILE',
      color: '#ffd95a',
      aliases: ['cv', 'personnel', 'profile-file']
    },
    {
      id: 'gallery',
      title: 'AYUSH.OS // MEDIA GALLERY',
      subtitle: 'AUTHENTIC VISUAL EVIDENCE • 3D AVATARS • CREDENTIALS',
      icon: './assets/icons-v4/browser.png',
      badge: 'GALLERY',
      color: '#c7f36b',
      aliases: ['photos', 'media', 'album']
    }
  ];

  const aliasMap = new Map();
  const canonicalMap = new Map();

  for (const app of [...APPS, ...EXTENSIONS]) {
    canonicalMap.set(app.id, app);
    aliasMap.set(app.id, app);
    if (Array.isArray(app.aliases)) {
      for (const alias of app.aliases) {
        aliasMap.set(alias.toLowerCase(), app);
      }
    }
  }

  return {
    resolve: function (id) {
      if (!id || typeof id !== 'string') return null;
      const cleanId = id.trim().toLowerCase();
      return aliasMap.get(cleanId) || null;
    },
    getAll: function () {
      return [...APPS];
    },
    isKnown: function (id) {
      return this.resolve(id) !== null;
    }
  };
});
