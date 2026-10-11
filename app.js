const proofVideos = [
  { id: "Oe2s8j6JomQ", label: "AI Deployment", type: "Vertical testimonial", duration: "00:39", url: "https://youtube.com/shorts/Oe2s8j6JomQ", story: "A client describes the moment an AI deployment moved from a promising demo into a usable operating workflow." },
  { id: "ktfwr3nOFeU", label: "ROI Consulting", type: "Vertical testimonial", duration: "00:59", url: "https://youtube.com/shorts/ktfwr3nOFeU", story: "A concise account of the strategy, decisions, and commercial thinking behind a consulting engagement." },
  { id: "IIjhViAlMTA", label: "AI Services", type: "Vertical testimonial", duration: "01:05", url: "https://youtube.com/shorts/IIjhViAlMTA", story: "A client voice on delivery quality, responsiveness, and turning a requested AI service into something practical." },
  { id: "9OCD3Udnfs8", label: "Client Voice 04", type: "Client testimonial", duration: "00:44", url: "https://youtu.be/9OCD3Udnfs8", story: "A first-person testimonial preserved as source evidence so visitors can judge the work in the client's own voice." },
  { id: "mtmHkGaE0r0", label: "Client Voice 05", type: "Client testimonial", duration: "01:30", url: "https://youtu.be/mtmHkGaE0r0", story: "A longer client account of the engagement, outcome, and experience of working with the team." },
];

const clientCases = [
  {
    id: "intelliemo",
    company: "INTELLIEMO",
    sector: "ENTERPRISE NLP / EXPLAINABLE AI",
    metric: "90.0%",
    metricLabel: "ANGER CLASSIFICATION PRECISION",
    summary: "Enterprise-grade text emotion intelligence & explainable NLP platform with token-drop attribution and transition mapping.",
    outcome: "Achieved 90.0% precision on Anger and 89.49% F1-score on Fear across a 6-emotion classification taxonomy. Includes FastAPI backend and React dashboard.",
    image: "./assets/case-studies/systems-map.png",
    color: "#f3aaa8"
  },
  {
    id: "skyguard",
    company: "SkyGuard AI",
    sector: "SENSOR INTELLIGENCE / EDGE AI",
    metric: "<1s",
    metricLabel: "REAL-TIME ANOMALY INFERENCE",
    summary: "Intelligent real-time anomaly detection and sensor health system for automatic weather stations monitoring multi-sensor drift.",
    outcome: "Continuous telemetry monitoring with automated alert dispatching for automatic weather station networks.",
    image: "./assets/case-studies/investors-propmart.png",
    color: "#b9dfe8"
  },
  {
    id: "smartfarm",
    company: "Smart Farm AI",
    sector: "AGRITECH / AI DECISION PLATFORM",
    metric: "IOT",
    metricLabel: "TELEMETRY IRRIGATION PIPELINE",
    summary: "Intelligent agricultural decision platform analyzing crop telemetry, soil factors, and weather predictions.",
    outcome: "Automated recommendations reducing water waste and maximizing yield based on environmental sensor telemetry.",
    image: "./assets/case-studies/imperium-marketing.png",
    color: "#c7f36b"
  },
  {
    id: "parking-assist",
    company: "Parking Assist",
    sector: "COMPUTER VISION / REAL-TIME EDGE",
    metric: "LIVE",
    metricLabel: "PARKING OCCUPANCY DETECTION",
    summary: "Real-time automated parking slot detection, occupancy mapping, and vision guidance using deep learning computer vision.",
    outcome: "Real-time multi-camera detection pipeline with sub-100ms OpenCV inference and occupancy mapping.",
    image: "./assets/case-studies/systems-map.png",
    color: "#c2b2e9"
  }
];

const caseFileSystem = {
  name: "Ayush OS",
  type: "folder",
  children: [
    {
      name: "Case Studies",
      type: "folder",
      children: [
        {
          name: "Real Estate",
          type: "folder",
          children: clientCases.slice(0, 2).map(item => ({ name: `${item.company}.case`, type: "case", caseId: item.id }))
        },
        {
          name: "Voice AI",
          type: "folder",
          children: [
            { name: "Imperium Marketing.case", type: "case", caseId: "imperium-marketing" },
            { name: "Pan-India CPaaS.case", type: "document", title: "Pan-India CPaaS Voice Layer", copy: "Delivered voice cloning and a multi-provider voice layer with Gemini and Cartesia integration, prompt hardening, voicemail handling, and dashboard work." },
            { name: "Dental Voice Agent.case", type: "document", title: "Dental Voice Agent", copy: "A US-practice workflow demo built and iterated for appointment and enquiry handling. Final client sign-off remains pending." }
          ]
        },
        {
          name: "Websites",
          type: "folder",
          children: [
            { name: "Kawsaypac Preview 3.case", type: "link", url: "https://toprmrproducer.github.io/kawsaypac-preview3/", copy: "Final cinematic commerce preview across a 17-product catalog." },
            { name: "EXTNGO.case", type: "link", url: "https://www.extngo.com/", copy: "Shopify-backed product site for a retractable flat CAT6 cable." },
            { name: "SimpliiGood.case", type: "link", url: "https://www.simpliigood.com/", copy: "Retail-first spirulina experience and education system." },
            { name: "Pawd Store.case", type: "link", url: "https://pawdstore.com", copy: "Live pet-commerce storefront and Shopify implementation." },
            { name: "Try Nokt.case", type: "link", url: "https://trynokt.com", copy: "Live product website from the Ayush AI Systems web portfolio." },
            { name: "Fastcreek AI Studio.case", type: "link", url: "https://fastcreek-creatives.vercel.app", copy: "AI-native creative studio website and conversion system." }
          ]
        },
        {
          name: "Consulting",
          type: "folder",
          children: [
            { name: "Revenue System Audit.read", type: "document", title: "Revenue System Audit", copy: "Constraint discovery, leverage mapping, proof criteria, automation boundaries, and an executable build plan." },
            { name: "Deployment Playbook.read", type: "document", title: "Deployment Playbook", copy: "A five-stage loop: find leverage, lock the system, build the sharp edge, test the full loop, then ship and measure." }
          ]
        }
      ]
    },
    {
      name: "Client Videos",
      type: "folder",
      children: proofVideos.map((video, index) => ({
        name: `${String(index + 1).padStart(2, "0")}  -  ${video.label}.story`,
        type: "video",
        videoId: video.id,
        title: video.label,
        copy: video.story,
        url: video.url
      }))
    },
    {
      name: "AI Field Notes",
      type: "folder",
      children: [
        { name: "AI Specialist in India.article", type: "link", url: "./blog/ai-specialist-india.html", copy: "How to evaluate an applied AI specialist in India." },
        { name: "AI Specialist in Pune.article", type: "link", url: "./blog/ai-specialist-pune.html", copy: "A local buyer's guide to applied AI delivery in Pune." },
        { name: "AI Agency in Pune.article", type: "link", url: "./blog/ai-agency-pune.html", copy: "What separates a production AI agency from a demo shop." }
      ]
    },
    {
      name: "Services",
      type: "folder",
      children: [
        { name: "AI Voice Agents.service", type: "document", title: "AI Voice Agents", copy: "Conversation design, telephony, prompts, voice, integrations, testing, analytics, and operational handoff." },
        { name: "Premium Websites.service", type: "document", title: "Premium Websites", copy: "Distinctive, responsive systems that explain, convert, and remain maintainable after launch." },
        { name: "AI Consulting.service", type: "document", title: "AI Consulting", copy: "Find the expensive business constraint and turn it into a testable implementation plan." },
        { name: "Production Deployment.service", type: "document", title: "Production Deployment", copy: "Infrastructure, integrations, failure paths, monitoring, and the final mile from prototype to daily use." }
      ]
    }
  ]
};

const learningVideos = [
  { id: "iuZeXR6bgGc", title: "Build & Sell Your Own AI OS With Claude Code (Free Full Build)", url: "https://www.youtube.com/watch?v=iuZeXR6bgGc" },
  { id: "P9A8a9-fZ48", title: "Vapi Made Me Broke. This Made It Free.", url: "https://www.youtube.com/watch?v=P9A8a9-fZ48" },
  { id: "k8F-jAggcBA", title: "I Copied Top AI Gurus' Personal Brand Playbook", url: "https://www.youtube.com/watch?v=k8F-jAggcBA" },
  { id: "lWiesgoPekU", title: "I'm 17 and I Charge $5,000 a Project. Here's How.", url: "https://www.youtube.com/watch?v=lWiesgoPekU" },
  { id: "4IWr1Orc0tQ", title: "Get Your First Client in 14 Days With This AI Website System", url: "https://www.youtube.com/watch?v=4IWr1Orc0tQ" },
  { id: "4HJRVXCg2Wc", title: "How I Got My First Client with 3,600 Cold Calls | AI Agency Uncut Ep. 01", url: "https://www.youtube.com/watch?v=4HJRVXCg2Wc" },
];

const musicTracks = [
  { title: "Tomb of Death", artist: "Braiz · Super Slowed", duration: "1:53", src: "./assets/music/tomb-of-death-super-slowed.mp3" },
  { title: "Encanto", artist: "KIT", duration: "2:08", src: "./assets/music/encanto-kit.mp3" },
  { title: "Lina Colina", artist: "blueberry · DJ KHRLP", duration: "1:40", src: "./assets/music/lina-colina-blueberry.mp3" },
  { title: "Flutuar", artist: "Sped Up", duration: "2:15", src: "./assets/music/flutuar-sped-up.mp3" },
];

const portraitPoses = [
  { src: "./assets/ayush-3d-dashboard.png", label: "BUILDER MODE" },
  { src: "./assets/ayush-3d-wave.png", label: "HELLO MODE" },
  { src: "./assets/ayush-3d-intro.png", label: "FOUNDER MODE" },
];

const apps = {
  projects: {
    title: "Projects  -  Finder",
    chrome: "#f5a39c",
    subtitle: "GITHUB DYNAMIC FILE EXPLORER",
    render: () => `
      <div class="projects-app-container" data-projects-app>
        <div class="projects-loading-state">
          <div class="projects-loading-icon">📁</div>
          <div class="projects-loading-title">PROJECTS.EXE — MOUNTING FILE SYSTEM</div>
          <div class="projects-loading-sub">Connecting to GitHub dynamic repository engine...</div>
          <div class="projects-progress-track"><div class="projects-progress-fill"></div></div>
        </div>
      </div>`,
  },
  internships: {
    title: "Internships  -  Career Archive",
    chrome: "#b8d8d8",
    subtitle: "CAREER FILE SYSTEM // EVIDENCE ARCHIVE",
    render: () => `
      <div class="internships-app-container" data-internships-app>
        <div class="projects-loading-state" style="padding: 60px;">
          <div class="projects-loading-icon">💼</div>
          <div class="projects-loading-title">INTERNSHIPS.EXE — MOUNTING CAREER ARCHIVES</div>
          <div class="projects-loading-sub">Connecting to verified document repository...</div>
          <div class="projects-progress-track"><div class="projects-progress-fill"></div></div>
        </div>
      </div>`,
  },
  achievements: {
    title: "Achievements & Results  -  Proof Vault",
    chrome: "#c7f36b",
    subtitle: "PODIUM FINISHES // QUANTIFIED EVIDENCE",
    render: () => window.AchievementsApp ? window.AchievementsApp.getContent() : `
      <div class="achievements-container" data-achievements-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">🏆</div><div class="projects-loading-title">ACHIEVEMENTS.EXE</div></div>
      </div>`
  },
  techstack: {
    title: "Tech Stack & Systems  -  Systems.app",
    chrome: "#a8d7e8",
    subtitle: "PRODUCTION COMPETENCY // SYSTEM ARCHITECTURE",
    render: () => window.TechStackApp ? window.TechStackApp.getContent() : `
      <div class="techstack-container" data-techstack-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">⚙️</div><div class="projects-loading-title">TECHSTACK.EXE</div></div>
      </div>`
  },
  research: {
    title: "Research & Publications  -  Lab Portal",
    chrome: "#b9dfe8",
    subtitle: "EXPERIMENTAL SYSTEMS // SCHOLARLY INQUIRY",
    render: () => window.ResearchApp ? window.ResearchApp.getContent() : `
      <div class="research-container" data-research-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">🔬</div><div class="projects-loading-title">RESEARCH.EXE</div></div>
      </div>`
  },
  certifications: {
    title: "Certifications & Learning  -  Credentials",
    chrome: "#e6e35f",
    subtitle: "ACCREDITED CREDENTIALS // VERIFIED CODES",
    render: () => window.CertificationsApp ? window.CertificationsApp.getContent() : `
      <div class="certifications-container" data-certifications-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">📜</div><div class="projects-loading-title">CERTIFICATIONS.EXE</div></div>
      </div>`
  },
  revenue: {
    title: "Achievements & Results  -  Proof Vault",
    chrome: "#c7f36b",
    subtitle: "PODIUM FINISHES // QUANTIFIED EVIDENCE",
    render: () => window.AchievementsApp ? window.AchievementsApp.getContent() : `
      <div class="achievements-container" data-achievements-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">🏆</div><div class="projects-loading-title">ACHIEVEMENTS.EXE</div></div>
      </div>`
  },
  process: {
    title: "How We Work  -  Systems.app",
    chrome: "#a8d7e8",
    subtitle: "OPERATING LOOP",
    render: () => `
      <div class="app-content">
        <span class="app-kicker">THE RAPIDXAI OPERATING LOOP</span>
        <h2 class="app-heading">Fast, but never<br><em>careless.</em></h2>
        <p class="app-deck">Every serious build moves through the same five stages. The point is not more meetings. The point is fewer surprises.</p>
        <div class="process-list">
          ${step("Find the leverage","We isolate the one business constraint worth attacking: cost, speed, conversion, capacity, or attention.","#f5a39c")}
          ${step("Lock the system","Scope, proof criteria, visual direction, data boundaries, and failure paths become one written contract.","#ffd95a")}
          ${step("Build the sharp edge","The differentiating interaction or technical risk gets built first. No polishing a weak core.","#a8d7e8")}
          ${step("Test the full loop","Real-browser QA, mobile behavior, edge cases, and the actual end-user outcome. “It compiled” means nothing.","#c7f36b")}
          ${step("Ship, measure, improve","Production verification, evidence, handoff, then iteration from real usage instead of opinions.","#b8a7e8")}
        </div>
        <div class="app-scene-grid">
          <figure><img src="./assets/ayush-fitness.webp" alt="Ayush training in a pixel-art kickboxing gym"><figcaption>A weak operator builds a weak business.</figcaption></figure>
          <figure><img src="./assets/ayush-systems.webp" alt="Ayush inside a pixel-art systems control room"><figcaption>Your business is not strong if it needs you awake.</figcaption></figure>
        </div>
      </div>`,
  },
  journey: {
    title: "Journey & Story  -  Timeline.app",
    chrome: "#b8a7e8",
    subtitle: "2023 → 2026+ EVOLUTION",
    render: () => window.JourneyApp ? window.JourneyApp.getContent() : `
      <div class="journey-container" data-journey-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">🗺️</div><div class="projects-loading-title">JOURNEY.EXE</div></div>
      </div>`,
  },
  founder: {
    title: "Founder.txt  -  Notepad",
    chrome: "#e6e35f",
    subtitle: "NOTE FROM AYUSH",
    render: () => `
      <div class="app-content founder-note-app">
        <span class="app-kicker">AYUSH VISHWAKARMA / MANIFESTO</span>
        <h2 class="app-heading">Evidence over hype.<br><em>Systems over screenshots.</em></h2>
        <div class="notepad-paper">
          <p>I build.</p>
          <p>I learn by making things real.</p>
          <p>I care about the difference between a demo and a system. Anyone can generate a prototype or a pretty UI. Very few make systems with actual data pipelines, evaluation, reproducible benchmarks, and production-grade reliability.</p>
          <p>AI is a tool. Engineering is the discipline. Curiosity is the engine.</p>
          <p>Currently engineering intelligent software and studying Computer Science at <strong>Vishwakarma University (VU), Pune</strong>.</p>
          <p>If you're building intelligent systems or have a hard engineering problem to solve, my inbox is open.</p>
          <p class="notepad-sign"><span>AYUSH VISHWAKARMA</span><small>AI & Machine Learning Systems Architect · Pune, India</small></p>
        </div>
      </div>`,
  },
  files: {
    title: "Case Files  -  Finder",
    chrome: "#a8d7e8",
    subtitle: "NESTED FOLDERS / DOUBLE-CLICK",
    render: () => renderFileExplorer(),
  },
  blog: {
    title: "AI Field Notes  -  Blog.app",
    chrome: "#b8a7e8",
    subtitle: "PUNE · INDIA · APPLIED AI",
    render: () => `
      <div class="app-content blog-app">
        <span class="app-kicker">AYUSH VISHWAKARMA / AI FIELD NOTES</span>
        <h2 class="app-heading">Useful answers.<br><em>Built from the work.</em></h2>
        <p class="app-deck">No one can honestly guarantee a “number one” Google ranking. This library targets the questions buyers actually ask and backs every claim with projects, methods, and clearly labelled case evidence.</p>
        <div class="blog-card-grid">
          ${blogCard("AI Specialist in India","A practical framework for evaluating an AI specialist in India - technical depth, deployment ownership, proof, and commercial outcomes.","./blog/ai-specialist-india.html","#f3aaa8")}
          ${blogCard("AI Specialist in Pune","What Pune companies should look for in an applied AI partner, from discovery through voice, automation, integrations, and handoff.","./blog/ai-specialist-pune.html","#b9dfe8")}
          ${blogCard("AI Agency in Pune","A buyer's guide to selecting an AI agency in Pune without confusing demos, automations, or vanity metrics for production systems.","./blog/ai-agency-pune.html","#c7f36b")}
        </div>
        <a class="blog-index-link" href="./blog/" target="_blank" rel="noreferrer">OPEN THE COMPLETE AI FIELD NOTES INDEX ↗</a>
        <p class="source-note">SEO NOTE: the pages are static, crawlable, internally linked, authored by Ayush Vishwakarma, and written for humans first. Search position still depends on authority, competition, technical health, and external corroboration.</p>
      </div>`,
  },
  whiteboard: {
    title: "Whiteboard  -  Notes.app",
    chrome: "#fff8dc",
    subtitle: "DRAG · WRITE · PERSIST",
    render: () => `
      <div class="whiteboard-app" data-whiteboard>
        <header>
          <div><span>AYUSH OS WHITEBOARD</span><h2>Leave a<br><em>sticky note.</em></h2></div>
          <form data-note-form>
            <label for="sticky-note-copy">YOUR NOTE</label>
            <textarea id="sticky-note-copy" data-note-input maxlength="180" rows="3" placeholder="What should Ayush build, fix, or remember?" required></textarea>
            <div><button type="submit">+ ADD STICKY</button><button type="button" data-reset-desktop>RESET DESKTOP ICONS</button></div>
          </form>
        </header>
        <div class="whiteboard-canvas" data-note-board aria-label="Draggable sticky notes"></div>
        <footer>NOTES AND ICON POSITIONS PERSIST IN THIS BROWSER · DRAG EACH NOTE BY ITS TOP BAR</footer>
      </div>`,
  },
  socials: {
    title: "Socials  -  Network.app",
    chrome: "#f4b6cf",
    subtitle: "CONNECT & EXPLORE",
    render: () => `
      <div class="app-content">
        <span class="app-kicker">CHANNELS / PUBLIC PROFILES</span>
        <h2 class="app-heading">Find me on<br><em>the web.</em></h2>
        <p class="app-deck">Open channels for collaboration, technical discussions, research inquiries, and open-source contributions.</p>
        <div class="social-cards">
          <a class="social-card" href="https://github.com/officialayush5839-arch" target="_blank" rel="noopener noreferrer" style="--social:#333">
            <span class="social-icon">🐙</span>
            <strong>GitHub</strong>
            <small>@officialayush5839-arch · 13+ Repos</small>
            <span>VIEW CODE ↗</span>
          </a>
          <a class="social-card" href="https://www.linkedin.com/in/ayush-vishwakarama-7a79803ba/" target="_blank" rel="noopener noreferrer" style="--social:#0a66c2">
            <span class="social-icon">💼</span>
            <strong>LinkedIn</strong>
            <small>Ayush Vishwakarma · Pune, India</small>
            <span>CONNECT ↗</span>
          </a>
          <a class="social-card" href="mailto:officialayush5839@gmail.com" style="--social:#ea4335">
            <span class="social-icon">✉️</span>
            <strong>Email</strong>
            <small>officialayush5839@gmail.com</small>
            <span>SEND EMAIL ↗</span>
          </a>
        </div>
      </div>`,
  },
  updates: {
    title: "Updates  -  Changelog.app",
    chrome: "#9ec58f",
    subtitle: "LIVE OS / v5.0.0",
    render: () => `
      <div class="app-content">
        <span class="app-kicker">PUBLIC CHANGELOG</span>
        <h2 class="app-heading">A portfolio that<br><em>keeps shipping.</em></h2>
        <p class="app-deck">AYUSH.OS gets patched as engineering evolves. Projects, proof, lessons, and experiments become visible updates instead of stale résumé bullets.</p>
        <div class="process-list">
          ${step("v5.0.0 · Personal World","Added Music Deck, Garage Mail, video suggestions, Game Room, hidden Learn and prank folders, portrait pose switching, a visible SOS channel, and original day/night ambient events.","#f4b6cf")}
          ${step("v4.1.0 · Video Proof","Embedded five real YouTube testimonials with actual audio, thumbnails, playlist selection, cinema expansion, and direct source fallbacks.","#ffd95a")}
          ${step("v4.0.0 · Homepage Mode","Restored the original desktop composition, removed the game world, added Day/Night/Dark themes, professional iconography, honest activity, Founder.txt, and Journey.app.","#f5a39c")}
          ${step("v3.2.0 · Night + Voice","Added a safe browser-native voice concierge and appearance controls.","#a9e1d2")}
          ${step("v3.0.0 · Desktop Mode","One-screen desktop, working browser, emergency channel, movable windows, and an interactive Ayush.","#c7f36b")}
          ${step("v1.2.0 · Proof Vault","Source-backed metrics and five canonical client testimonial links added.","#ffd95a")}
          ${step("v1.0.0 · First Boot","Desktop OS, draggable windows, command search, projects, revenue, process, achievements, socials, and contact.","#f5a39c")}
        </div>
      </div>`,
  },
  about: {
    title: "About  -  Ayush.app",
    chrome: "#e9d19d",
    subtitle: "PROFILE / ONLINE",
    render: () => `
      <div class="app-content">
        <span class="app-kicker">USER PROFILE</span>
        <div class="profile-hero">
          <div class="profile-portrait"><img src="./assets/ayush-avatar.png" alt=""></div>
          <div>
            <h2 class="app-heading">Ayush<br><em>Vishwakarma.</em></h2>
            <div class="tag-row"><span class="tag">PUNE, INDIA</span><span class="tag">FOUNDER & BUILDER</span><span class="tag">18</span></div>
          </div>
        </div>
        <div class="hairline"></div>
        <p class="app-deck">AI/ML developer and systems architect focused on intelligent software, explainable NLP models, computer vision pipelines, and industrial IoT automation.</p>
        <p class="app-deck">Currently studying at Vishwakarma University (VU), Pune. National hackathon champion and active production systems builder.</p>
        <div class="quote">I BUILD INTELLIGENT SYSTEMS.<br>Evidence over hype. Systems over screenshots.</div>
        <div class="tag-row">
          <span class="tag">AI / ML</span><span class="tag">COMPUTER VISION</span><span class="tag">EXPLAINABLE NLP</span><span class="tag">INDUSTRIAL IOT</span>
        </div>
      </div>`,
  },
  contact: {
    title: "Contact & Collaborate  -  Dispatch.app",
    chrome: "#e9d19d",
    subtitle: "SECURE INQUIRY DISPATCH // DIRECT CHANNELS",
    render: () => window.ContactApp ? window.ContactApp.getContent() : `
      <div class="contact-app-container" data-contact-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">✉️</div><div class="projects-loading-title">CONTACT.EXE</div></div>
      </div>`,
  },
  resume: {
    title: "AYUSH.OS // PERSONNEL FILE",
    chrome: "#ffd95a",
    subtitle: "PROFESSIONAL PROFILE • EXPERIENCE • TECHNICAL CAPABILITIES",
    render: () => window.ResumeApp ? window.ResumeApp.getContent() : `
      <div class="resume-app-container" data-resume-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">📄</div><div class="projects-loading-title">RESUME.EXE</div></div>
      </div>`,
  },
  gallery: {
    title: "AYUSH.OS // MEDIA GALLERY",
    chrome: "#c7f36b",
    subtitle: "AUTHENTIC VISUAL EVIDENCE • 3D AVATARS • CREDENTIALS",
    render: () => window.GalleryApp ? window.GalleryApp.getContent() : `
      <div class="gallery-app-container" data-gallery-app>
        <div class="projects-loading-state"><div class="projects-loading-icon">🖼️</div><div class="projects-loading-title">GALLERY.EXE</div></div>
      </div>`,
  },
  voice: {
    title: "Talk to the AI Voice Agent  -  Concierge.app",
    chrome: "#9fded4",
    subtitle: "BROWSER VOICE / ONLINE",
    render: () => `
      <div class="voice-agent">
        <header class="voice-agent-hero">
          <img src="./assets/premium-world/voice-lab.png" alt="" />
          <div><span>AYUSH AI CONCIERGE</span><h2>Talk to the<br><em>AI voice agent.</em></h2><p>Ask about projects, results, systems, testimonials, the journey, or starting a project.</p></div>
        </header>
        <div class="voice-console">
          <div class="voice-status"><i></i><span data-voice-status>READY FOR A COMMAND</span></div>
          <div class="voice-transcript" data-voice-transcript aria-live="polite">
            <p class="agent-line"><strong>AYUSH OS</strong><span>Say “show me the projects” or type below.</span></p>
          </div>
          <div class="voice-controls">
            <button type="button" data-voice-mic>HOLD TO TALK</button>
            <label><input type="text" data-voice-input placeholder="Ask AYUSH OS..." autocomplete="off" /><button type="button" data-voice-send>SEND</button></label>
          </div>
          <div class="voice-prompts">
            <button type="button" data-voice-prompt="Show me the projects">PROJECTS</button>
            <button type="button" data-voice-prompt="What results have you generated?">RESULTS</button>
            <button type="button" data-voice-prompt="How can I contact Ayush?">CONTACT</button>
          </div>
        </div>
        <div class="voice-embed-slot" data-dograh-lab>
          <header><div><span>LIVE VOICE AGENT EMBEDS</span><strong>DOGRAH CLOUD / PRODUCTION</strong></div><small data-dograh-status>AGENT 01 SELECTED</small></header>
          <nav aria-label="Voice agent selection">
            <button class="active" type="button" data-dograh-agent="1">AGENT 01</button>
            <button type="button" data-dograh-agent="2">AGENT 02</button>
            <button type="button" data-dograh-agent="3">AGENT 03</button>
            <button type="button" data-dograh-agent="4">AGENT 04</button>
          </nav>
          <iframe data-dograh-frame src="./voice-agents/?agent=1" title="Ayush production voice agent 01" loading="lazy" allow="microphone"></iframe>
          <p>Each agent runs in an isolated frame so the provider widgets cannot collide. The local AYUSH OS concierge above remains available.</p>
        </div>
        <p class="source-note">PRIVACY: this version uses the browser's speech recognition and speech synthesis. No Gemini or other private API key is exposed in the static site.</p>
      </div>`,
  },
  browser: {
    title: "Browser  -  AyuNet.app",
    chrome: "#a8d7e8",
    subtitle: "WEB / SECURE",
    render: () => `
      <div class="browser-app">
        <div class="browser-toolbar">
          <button type="button" data-browser-home aria-label="Browser home">⌂</button>
          <label><span>HTTPS://</span><input type="text" value="ayushvishwakarma.dev" aria-label="Web address" /></label>
          <button type="button" data-browser-go>GO</button>
          <button type="button" data-browser-external>OPEN ↗</button>
        </div>
        <nav class="browser-bookmarks" aria-label="Browser bookmarks">
          <button type="button" data-browser-url="https://github.com/officialayush5839-arch">GITHUB ARCHIVE</button>
          <button type="button" data-browser-url="https://github.com/officialayush5839-arch/INTELLIEMO">INTELLIEMO</button>
          <button type="button" data-browser-url="https://github.com/officialayush5839-arch/skyguard-ai">SKYGUARD AI</button>
          <button type="button" data-browser-url="https://www.linkedin.com/in/ayush-vishwakarama-7a79803ba/">LINKEDIN</button>
        </nav>
        <div class="browser-start">
          <img src="./assets/premium-world/update-terminal.png" alt="" />
          <span>AYUNET / READY</span>
          <h2>Where do you<br /><em>want to go?</em></h2>
          <p>This is a working browser surface. Some websites block embedded viewing; OPEN ↗ always launches the address in a full browser tab.</p>
        </div>
        <iframe class="browser-frame" title="AyuNet browser page" hidden></iframe>
      </div>`,
  },
  music: {
    title: "Music  -  SoundDeck.app",
    chrome: "#f4b6cf",
    subtitle: "4 TRACKS / MANUAL PLAY",
    render: () => `
      <div class="app-content music-app">
        <span class="app-kicker">AYUSH'S CURRENT ROTATION</span>
        <h2 class="app-heading">Sound on.<br><em>Build mode.</em></h2>
        <p class="app-deck">The player never autostarts. Pick a track here or use the compact deck on the desktop.</p>
        <div class="music-library">
          ${musicTracks.map((track, index) => `
            <button type="button" data-music-track="${index}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${track.title}</strong>
              <small>${track.artist}</small>
              <time>${track.duration}</time>
            </button>
          `).join("")}
        </div>
        <p class="source-note">MEDIA NOTE: public deployment requires web-distribution permission for every track. Playback is opt-in and local to this browser tab.</p>
      </div>`,
  },
  games: {
    title: "Games  -  Arcade.app",
    chrome: "#8d78d8",
    subtitle: "2 LIVE / LOCAL LEADERBOARDS",
    render: () => `
      <div class="game-room">
        <header>
          <div><span>AYUSH BUILT THESE</span><h2>Game<br><em>Room.</em></h2></div>
          <nav aria-label="Playable games">
            <button class="active" type="button" data-game-url="./games/viper-arena/" data-game-title="VIPER ARENA">VIPER ARENA</button>
            <button type="button" data-game-url="./games/fangs-io/" data-game-title="FANGS.IO">FANGS.IO</button>
            <button type="button" data-game-all>ALL GAMES</button>
            <button type="button" data-game-fullscreen>FULLSCREEN</button>
            <button type="button" data-game-exit-fullscreen hidden>EXIT FULLSCREEN</button>
          </nav>
        </header>
        <div class="game-stage">
          <div class="game-stage-bar"><strong data-game-now>VIPER ARENA</strong><span>USERNAME · LOADOUT · BOSSES · LOCAL LEADERBOARD · ASMR</span><a href="./games/viper-arena/" data-game-external target="_blank" rel="noreferrer">OPEN FULLSCREEN ↗</a></div>
          <iframe data-game-frame src="./games/viper-arena/" title="VIPER ARENA game" loading="lazy" allow="autoplay; fullscreen"></iframe>
        </div>
        <div class="game-case-files">
          <article><img src="./assets/games/viper-arena.png" alt="Viper Arena gameplay screenshot" /><div><strong>VIPER ARENA</strong><span>FLAGSHIP · BOSSES · LOADOUTS · ASMR · SCORES</span></div></article>
          <article class="fangs-feature"><span class="fangs-art" aria-hidden="true">FANGS.IO</span><div><strong>FANGS.IO</strong><span>PLAYABLE · LOCAL HIGH SCORES</span></div></article>
          <article class="neon-feature"><img src="./assets/games/neon-drift.png" alt="Neon Drift gameplay screenshot" /><div><strong>NEON DRIFT</strong><span>FEATURED CASE FILE · PLAYABLE SOURCE RECOVERY NEXT</span></div></article>
        </div>
      </div>`,
  },
  learn: {
    title: "Learn  -  YouTube.library",
    chrome: "#e6e35f",
    subtitle: "6 VIDEOS / REAL LIBRARY",
    render: () => `
      <div class="app-content learn-app">
        <span class="app-kicker">AYUSH VISHWAKARMA / VIDEO LIBRARY</span>
        <h2 class="app-heading">Learn from the<br><em>actual uploads.</em></h2>
        <p class="app-deck">A direct library of practical builds, agency lessons, voice infrastructure, client acquisition, and personal-brand systems from my YouTube channel.</p>
        ${renderLearningLibrary()}
      </div>`,
  },
  keys: {
    title: "API_KEYS.env  -  TextEdit",
    chrome: "#a9e1d2",
    subtitle: "DEMO FILE / NOT REAL",
    render: () => `
      <div class="fake-keys">
        <header><span>API_KEYS.env</span><strong>SAFE DEMO</strong></header>
        <pre><code># If you found this, congratulations.
# Every value below is intentionally fake.

OPENAI_API_KEY=DEMO_KEY_NOT_REAL
GEMINI_API_KEY=DEMO_KEY_NOT_REAL
STRIPE_SECRET_KEY=DEMO_KEY_NOT_REAL
SUPABASE_SERVICE_ROLE=DEMO_KEY_NOT_REAL

MESSAGE="Nice try. Real secrets never ship to the browser."</code></pre>
        <button type="button" data-open="learn">FINE. TEACH ME SOMETHING ↗</button>
      </div>`,
  },
  prank: {
    title: "DO_NOT_OPEN  -  Finder",
    chrome: "#ff6b63",
    subtitle: "6 ITEMS / YOU WERE WARNED",
    render: () => renderPrankFinder(),
  },
  hack: {
    title: "SYSTEM DIAGNOSTICS  -  Terminal.exe",
    chrome: "#17131b",
    subtitle: "SYSTEM TERMINAL MODE",
    render: () => `
      <div class="hack-terminal" data-hack-terminal>
        <div class="hack-output" data-hack-output>
          <p>AYUSH OS SECURE SHELL v5.5  -  developer session</p>
          <p>Intelligent AI Systems Architecture & Telemetry Diagnostics.</p>
          <p>Explore production modules, benchmark evaluations, and systems.</p>
          <p>Type <b>help</b> to see your options.</p>
        </div>
        <label class="hack-input-row"><span>root@ayushos:~$</span><input type="text" data-hack-input autocomplete="off" spellcheck="false" placeholder="type a command..." /></label>
      </div>`,
  },
  emergency: {
    title: "Direct Contact  -  Hotline.app",
    chrome: "#ff6b63",
    subtitle: "DIRECT & VERIFIED CHANNEL",
    render: () => `
      <div class="app-content emergency-content">
        <span class="app-kicker">DIRECT CONTACT CHANNELS</span>
        <h2 class="app-heading">Let's talk.<br /><em>Direct channels.</em></h2>
        <p class="app-deck">Reach Ayush Vishwakarma directly via phone call, WhatsApp, or official email for engineering collaborations, AI pipelines, or technical consultations.</p>
        <div class="emergency-actions">
          <a class="emergency-primary" href="tel:+918983233911">CALL NOW ↗<small>+91 8983233911</small></a>
          <a class="emergency-secondary" href="https://wa.me/918983233911?text=Hey%20Ayush%2C%20I%20would%20like%20to%20connect%20regarding%20an%20AI%20project." target="_blank" rel="noreferrer">WHATSAPP ↗<small>+91 8983233911</small></a>
          <a class="emergency-secondary" href="mailto:officialayush5839@gmail.com">EMAIL AYUSH ↗<small>officialayush5839@gmail.com</small></a>
        </div>
      </div>`,
  },
  rickroll: {
    title: "media player  -  now playing",
    chrome: "#ff6b63",
    subtitle: "LOADING YOUR FILE...",
    render: () => `
      <div class="rickroll-app">
        <div class="rickroll-fakebar"><span data-rickroll-label>opening your file...</span><small>0:00 / 3:33</small></div>
        <div class="rickroll-frame">
          <iframe data-rickroll-frame src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0" title="Now playing" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>
        </div>
        <p class="rickroll-caption">You have been rickrolled by a 17 year old's portfolio website. Close the window and pretend this never happened.</p>
      </div>`,
  },
  run: {
    title: "Founder Run  -  Arcade.exe",
    chrome: "#c7f36b",
    subtitle: "ONE BUTTON / INFINITE HUSTLE",
    render: () => `
      <div class="run-app" data-run-app>
        <div class="run-hud">
          <span class="run-kicker">FOUNDER RUN</span>
          <div class="run-scores"><span>SCORE <b data-run-score>0</b></span><span>BEST <b data-run-best>0</b></span></div>
        </div>
        <div class="run-stage">
          <canvas data-run-canvas width="720" height="300"></canvas>
          <div class="run-overlay" data-run-overlay>
            <strong data-run-over-title>FOUNDER RUN</strong>
            <p data-run-over-copy>Jump the bugs, the scams, and the pointless meetings. Grab the cash. See how long you last.</p>
            <button type="button" class="run-start" data-run-start>PRESS SPACE / TAP TO START</button>
          </div>
        </div>
        <p class="run-hint">SPACE or TAP to jump · again mid-air for a double jump · land on the green platforms, grab the ₹, dodge everything.</p>
      </div>`,
  },
};

const projects = [];
const openWindows = new Map();
const visits = new Set(JSON.parse(localStorage.getItem("ayush-os-visits") || "[]"));
let zTop = 1200;
let cascade = 0;
let booted = false;
let dragState = null;

const os = document.querySelector("#os");
const boot = document.querySelector("#boot");
const layer = document.querySelector("#window-layer");
const palette = document.querySelector("#command-palette");
const commandInput = document.querySelector("#command-input");
const commandResults = document.querySelector("#command-results");
const worldScroll = document.querySelector("#world-scroll");
const worldPlayer = document.querySelector("#world-player");
const playerSprite = worldPlayer?.querySelector("img");
const playerLabel = document.querySelector("#player-label");
const themeButtons = [...document.querySelectorAll("[data-theme-choice]")];
const musicAudio = document.querySelector("#music-audio");
const musicDeck = document.querySelector("[data-music-deck]");
const musicToggle = document.querySelector("[data-music-toggle]");
const musicClose = document.querySelector("[data-music-close]");
const portraitButton = document.querySelector("[data-portrait]");
const portraitImage = document.querySelector("[data-portrait-img]");
const learnSticky = document.querySelector("[data-learn-sticky]");
let musicIndex = 0;
let portraitIndex = 0;
let stickyDrag = null;
const spriteSources = {
  down: "./assets/ayush-front.png",
  up: "./assets/ayush-front.png",
  left: "./assets/ayush-front.png",
  right: "./assets/ayush-front.png"
};
const districtLabels = {
  home: "AYU · HOME BASE",
  systems: "AYU · SYSTEMS DISTRICT",
  proof: "AYU · PROOF PLAZA",
  updates: "AYU · UPDATE TERMINAL",
};
let playerState = { x: 0, y: 0, direction: "down", waypoint: -1, paused: false };
let walkTimer;

function applyTheme(theme) {
  const safeTheme = ["day", "night", "dark"].includes(theme) ? theme : "day";
  os.dataset.theme = safeTheme;
  os.classList.toggle("night-mode", safeTheme === "night");
  os.classList.toggle("dark-mode", safeTheme === "dark");
  themeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.themeChoice === safeTheme)));
  localStorage.setItem("ayush-os-theme", safeTheme);
}

function toggleTheme() {
  const sequence = ["day", "dark"];
  const current = sequence.indexOf(os.dataset.theme || "day");
  const next = sequence[(current + 1) % sequence.length];
  applyTheme(next);
  toast(`${next.toUpperCase()} MODE`, next === "night" ? "The night desk is online." : next === "dark" ? "Distraction-free dark workstation enabled." : "Day operations resumed.");
}

function projectCard(index, title, category, copy, proofA, proofB, color, url) {
  return `<article class="project-card" style="--card:${color}" data-project-url="${url}">
    <span class="project-index">${index} / SYSTEM</span>
    <h3>${title}</h3><strong>${category}</strong><p>${copy}</p>
    <div class="proof-chips"><span>${proofA}</span><span>${proofB}</span></div>
    <span class="open-project">${url ? "OPEN ↗" : "CASE FILE"}</span>
  </article>`;
}
function renderClientCase(item) {
  return `<article class="client-case-card" style="--case:${item.color}" data-case-id="${item.id}">
    <div class="client-case-art"><img src="${item.image}" alt="Editorial pixel-art illustration for the ${item.company} case study" loading="lazy" /></div>
    <div class="client-case-copy">
      <small>${item.sector}</small>
      <h3>${item.company}</h3>
      <div class="client-case-metric"><strong>${item.metric}</strong><span>${item.metricLabel}</span></div>
      <p>${item.summary}</p>
      <details><summary>READ THE OUTCOME</summary><p>${item.outcome}</p></details>
    </div>
  </article>`;
}
function blogCard(title, copy, url, color) {
  return `<article class="blog-card" style="--blog:${color}">
    <small>AI FIELD NOTE / AYUSH VISHWAKARMA</small>
    <h3>${title}</h3>
    <p>${copy}</p>
    <a href="${url}" target="_blank" rel="noreferrer">READ ARTICLE ↗</a>
  </article>`;
}
function renderFileExplorer() {
  return `
    <div class="file-explorer" data-file-explorer>
      <header class="finder-toolbar">
        <div class="finder-nav"><button type="button" data-finder-back aria-label="Back">‹</button><button type="button" data-finder-forward aria-label="Forward">›</button></div>
        <strong data-finder-title>Ayush OS</strong>
        <div class="finder-views" aria-hidden="true"><span>▦</span><span>☷</span><span>▥</span></div>
        <label><span>⌕</span><input type="search" data-finder-search placeholder="Search case files" aria-label="Search case files" /></label>
      </header>
      <div class="finder-shell">
        <aside class="finder-sidebar">
          <strong>FAVOURITES</strong>
          <button type="button" data-finder-path="">⌂ All Files</button>
          <button type="button" data-finder-path="Case Studies">▣ Case Studies</button>
          <button type="button" data-finder-path="Client Videos">▶ Client Videos</button>
          <button type="button" data-finder-path="AI Field Notes">✎ AI Field Notes</button>
          <button type="button" data-finder-path="Services">◆ Services</button>
          <strong>LOCATIONS</strong>
          <button type="button" data-open="projects">◫ Projects</button>
          <button type="button" data-open="revenue">▥ Client Results</button>
        </aside>
        <main class="finder-main">
          <nav class="finder-breadcrumbs" data-finder-breadcrumbs aria-label="Current folder"></nav>
          <div class="finder-list-head"><span>NAME</span><span>KIND</span><span>STATUS</span></div>
          <div class="finder-list" data-finder-list></div>
          <p class="finder-hint">DOUBLE-CLICK A FOLDER OR FILE · SINGLE-CLICK TO PREVIEW</p>
        </main>
        <aside class="finder-preview" data-finder-preview>
          <span class="finder-preview-icon">▣</span>
          <h3>Case Files</h3>
          <p>Select a file to preview its story. Double-click to open folders, source links, videos, and articles.</p>
        </aside>
      </div>
    </div>`;
}
const prankFiles = [
  { id: "keys", name: "api_keys.env", kind: "Env File", status: "DEFINITELY REAL", size: "1 KB", icon: "▣", preview: "Oh you sweet summer child. You think the real keys are just sitting in a folder called DO_NOT_OPEN? Double-click it. See what happens to people who go looking." },
  { id: "xxx", name: "definitely_not_xxx.mp4", kind: "Video", status: "18+ ??", size: "0 KB", icon: "▶", preview: "Why are you here? Genuinely. It is a portfolio website. What did you think this was. Double-click if you have truly abandoned all shame." },
  { id: "pokemon", name: "pokemon_emerald_ROM_legit.gba", kind: "ROM", status: "TOTALLY LEGAL", size: "8 MB", icon: "◈", preview: "A totally legal, definitely-purchased copy of a game from 2004. Nintendo's lawyers are already in the car. Double-click and find out." },
  { id: "feelings", name: "my_actual_feelings", kind: "Folder", status: "0 ITEMS", size: "empty", icon: "▤", preview: "Why do you care? It is empty. It has always been empty. A founder does not keep those on disk, they keep them in the pricing." },
  { id: "mixtape", name: "mixtape_FINAL_v2_REAL_final.mp3", kind: "Audio", status: "CERTIFIED FIRE", size: "4.2 MB", icon: "♪", preview: "Seventeen tracks. Zero skips. The filename alone is a red flag and a promise. Double-click it. You are so ready. You are not ready." },
  { id: "sys32", name: "delete_system32.bat", kind: "Script", status: "DO NOT RUN", size: "0 KB", icon: "!", preview: "One job. The filename is a warning, a dare, and a personality test. Double-clicking this is a choice you make completely alone." },
];

function renderPrankFinder() {
  return `
    <div class="file-explorer prank-finder" data-prank-app>
      <header class="finder-toolbar">
        <div class="finder-nav"><button type="button" aria-label="Back">‹</button><button type="button" aria-label="Forward">›</button></div>
        <strong>DO_NOT_OPEN</strong>
        <div class="finder-views" aria-hidden="true"><span>▦</span><span>☷</span><span>▥</span></div>
        <label><span>⌕</span><input type="search" placeholder="Search files you should not open" aria-label="Search" /></label>
      </header>
      <div class="finder-shell">
        <aside class="finder-sidebar">
          <strong>FAVOURITES</strong>
          <button type="button" class="active">⚠ DO_NOT_OPEN</button>
          <button type="button" data-open="hack">⌘ System Diagnostics</button>
          <button type="button" data-open="keys">▣ api_keys.env</button>
          <strong>LOCATIONS</strong>
          <button type="button" data-open="files">◫ Actual Case Files</button>
          <button type="button" data-home>⌂ Escape While You Can</button>
        </aside>
        <main class="finder-main">
          <nav class="finder-breadcrumbs"><span>Ayush OS</span><i>›</i><span>DO_NOT_OPEN</span></nav>
          <div class="finder-list-head"><span>NAME</span><span>KIND</span><span>STATUS</span></div>
          <div class="finder-list" data-prank-list>
            ${prankFiles.map(f => `
              <button type="button" class="finder-row" data-prank-file="${f.id}">
                <span><i>${f.icon}</i><strong>${f.name}</strong></span><span>${f.kind}</span><span>${f.status}</span>
              </button>`).join("")}
          </div>
          <p class="finder-hint" data-prank-hint>DOUBLE-CLICK TO OPEN · SINGLE-CLICK TO PREVIEW · NOTHING GOOD IS IN HERE</p>
        </main>
        <aside class="finder-preview" data-prank-preview>
          <span class="finder-preview-icon">⚠</span>
          <h3>DO_NOT_OPEN</h3>
          <p>Six files. Zero good decisions. Single-click to read what you are about to do. Double-click to do it anyway.</p>
        </aside>
      </div>
    </div>`;
}

function metric(value, label, copy, color) { return `<article class="metric-card" style="--metric:${color}"><strong>${value}</strong><span>${label}</span><p>${copy}</p></article>`; }
function step(title, copy, color) { return `<article class="process-step" style="--step:${color}"><div><h3>${title}</h3><p>${copy}</p></div></article>`; }
function milestone(year, title, copy, color) { return `<article class="journey-entry" style="--milestone:${color}"><time>${year}</time><div><h3>${title}</h3><p>${copy}</p></div></article>`; }
function badge(glyph, title, copy, color) { return `<article class="badge-card" style="--badge:${color}"><span class="badge-glyph">${glyph}</span><h3>${title}</h3><p>${copy}</p></article>`; }
function team(initials, name, role, copy, color) { return `<article class="team-card" style="--team:${color}"><span class="team-avatar">${initials}</span><h3>${name}</h3><strong>${role}</strong><p>${copy}</p></article>`; }
function renderProofTheater() {
  const first = proofVideos[0];
  return `
    <section class="proof-theater" data-proof-theater>
      <div class="proof-screen">
        <div class="proof-screen-bar">
          <span><i></i> NOW PLAYING</span>
          <strong data-proof-now>${first.label}</strong>
          <small data-proof-duration>${first.duration}</small>
        </div>
        <div class="proof-frame-wrap">
          <iframe
            data-proof-frame
            src="https://www.youtube-nocookie.com/embed/${first.id}?rel=0&modestbranding=1"
            title="${first.label} client testimonial"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        <div class="proof-screen-actions">
          <button type="button" data-proof-expand aria-pressed="false">EXPAND THEATER</button>
          <a data-proof-external href="${first.url}" target="_blank" rel="noreferrer">OPEN ON YOUTUBE ↗</a>
        </div>
        <div class="proof-story">
          <small>THE STORY BEHIND THIS FILE</small>
          <p data-proof-story>${first.story}</p>
        </div>
      </div>
      <div class="proof-playlist" aria-label="Client testimonial videos">
        ${proofVideos.map((video, index) => `
          <button
            class="proof-video-card ${index === 0 ? "active" : ""}"
            type="button"
            data-proof-video="${video.id}"
            data-proof-label="${video.label}"
            data-proof-duration="${video.duration}"
            data-proof-url="${video.url}"
            data-proof-story="${video.story}"
            aria-pressed="${index === 0 ? "true" : "false"}"
          >
            <span class="proof-thumb">
              <img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="${video.label} YouTube thumbnail" loading="lazy" />
              <i aria-hidden="true"></i>
              <time>${video.duration}</time>
            </span>
            <span class="proof-card-copy">
              <small>${String(index + 1).padStart(2, "0")} / CLIENT VOICE</small>
              <strong>${video.label}</strong>
              <em>${video.type}</em>
            </span>
          </button>
        `).join("")}
      </div>
    </section>`;
}

function renderLearningLibrary() {
  const first = learningVideos[0];
  return `
    <section class="learn-library" data-learn-library>
      <div class="learn-player">
        <iframe
          data-learn-frame
          src="https://www.youtube-nocookie.com/embed/${first.id}?rel=0&modestbranding=1"
          title="${first.title}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <div>
          <strong data-learn-now>${first.title}</strong>
          <a data-learn-external href="${first.url}" target="_blank" rel="noreferrer">OPEN ON YOUTUBE ↗</a>
        </div>
      </div>
      <div class="learn-video-grid">
        ${learningVideos.map((video, index) => `
          <button class="${index === 0 ? "active" : ""}" type="button" data-learn-video="${video.id}" data-learn-title="${video.title}" data-learn-url="${video.url}" aria-pressed="${index === 0 ? "true" : "false"}">
            <img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="" loading="lazy" />
            <span><small>${String(index + 1).padStart(2, "0")} / VIDEO</small><strong>${video.title}</strong></span>
          </button>
        `).join("")}
      </div>
      <a class="youtube-library-link" href="https://github.com/officialayush5839-arch" target="_blank" rel="noreferrer">EXPLORE ALL PROJECTS ON GITHUB ↗</a>
    </section>`;
}

function social(mark, name, copy, url, color) {
  const sprite = {
    YT: "./assets/premium-dock/voices.png",
    IG: "./assets/premium-apps/socials.png",
    X: "./assets/premium-world/data-beacon.png",
    GH: "./assets/premium-world/data-modules.png",
  }[mark];
  return `<a class="social-link" href="${url}" target="_blank" rel="noreferrer" style="--social:${color}"><span class="social-monogram">${sprite ? `<img src="${sprite}" alt="">` : mark}</span><span><strong>${name}</strong><small>${copy}</small></span><b>↗</b></a>`;
}

function finishBoot() {
  if (booted) return;
  booted = true;
  boot.classList.add("done");
  os.classList.add("ready");
  setTimeout(() => {
    toast("SYSTEM ONLINE", "Ayush OS loaded. Open an app or press ⌘K.");
  }, 680);
}

function openApp(rawId, options = {}) {
  let id = rawId;
  if (typeof window !== "undefined" && window.AppRegistry && typeof window.AppRegistry.resolve === "function") {
    const resolved = window.AppRegistry.resolve(rawId);
    if (resolved && (apps[resolved.id] || resolved.id)) {
      id = resolved.id;
    }
  }
  const app = apps[id];
  if (!app) return;
  if (id === "testimonials" || id === "games" || id === "learn") pauseMusic();
  if (openWindows.has(id)) {
    const existing = openWindows.get(id);
    existing.classList.remove("minimized");
    resumeProofMedia(existing);
    resumeGameMedia(existing);
    focusWindow(existing);
    existing.focus({ preventScroll: true });
    return;
  }

  const win = document.createElement("section");
  win.className = "os-window";
  win.dataset.app = id;
  win.tabIndex = -1;
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-modal", "false");
  win.style.setProperty("--chrome", app.chrome);
  const desktopWidth = window.innerWidth;
  const baseLeft = desktopWidth > 760 ? Math.min(180 + (cascade % 5) * 34, desktopWidth - 730) : 8;
  const baseTop = desktopWidth > 760 ? 64 + (cascade % 5) * 27 : 8;
  win.style.left = `${Math.max(16, baseLeft)}px`;
  win.style.top = `${baseTop}px`;
  if (id === "browser" && desktopWidth > 760) {
    const browserWidth = Math.min(980, desktopWidth - 56);
    win.style.left = `${Math.max(16, (desktopWidth - browserWidth) / 2)}px`;
    win.style.top = "48px";
  }
  win.style.zIndex = ++zTop;
  cascade += 1;
  win.innerHTML = `
    <header class="window-titlebar">
      <div class="window-controls">
        <button class="window-control close" type="button" aria-label="Close ${app.title}"></button>
        <button class="window-control min" type="button" aria-label="Minimize ${app.title}"></button>
        <button class="window-control max" type="button" aria-label="Maximize ${app.title}"></button>
      </div>
      <strong class="window-title" id="window-title-${id}">${app.title}</strong>
      <span class="window-meta">${app.subtitle}</span>
    </header>
    <div class="window-body">${app.render()}</div>
    <i class="resize-handle rh-w" data-resize="w"></i>
    <i class="resize-handle rh-e" data-resize="e"></i>
    <i class="resize-handle rh-s" data-resize="s"></i>
    <i class="resize-handle rh-sw" data-resize="sw"></i>
    <i class="resize-handle rh-se" data-resize="se"></i>`;
  layer.appendChild(win);
  win.setAttribute("aria-labelledby", `window-title-${id}`);
  openWindows.set(id, win);
  document.querySelectorAll(`[data-open="${id}"]`).forEach(el => el.classList.add("open"));
  bindWindow(win);
  focusWindow(win);
  win.focus({ preventScroll: true });
  recordVisit(id, options.auto);
}

function pauseProofMedia(win) {
  const frame = win.querySelector("[data-proof-frame]");
  if (!frame || frame.src === "about:blank") return;
  frame.dataset.restoreSrc = frame.src;
  frame.src = "about:blank";
}

function resumeProofMedia(win) {
  const frame = win.querySelector("[data-proof-frame]");
  if (!frame?.dataset.restoreSrc) return;
  frame.src = frame.dataset.restoreSrc;
  delete frame.dataset.restoreSrc;
}

function pauseGameMedia(win) {
  const frame = win.querySelector("[data-game-frame]");
  if (!frame || frame.src === "about:blank") return;
  frame.dataset.restoreSrc = frame.src;
  frame.src = "about:blank";
}

function resumeGameMedia(win) {
  const frame = win.querySelector("[data-game-frame]");
  if (!frame?.dataset.restoreSrc) return;
  frame.src = frame.dataset.restoreSrc;
  delete frame.dataset.restoreSrc;
}

function bindWindow(win) {
  const bar = win.querySelector(".window-titlebar");
  win.addEventListener("pointerdown", () => focusWindow(win));
  win.querySelector(".close").addEventListener("click", (event) => { event.stopPropagation(); closeWindow(win); });
  win.querySelector(".min").addEventListener("click", (event) => {
    event.stopPropagation();
    pauseProofMedia(win);
    pauseGameMedia(win);
    win.classList.add("minimized");
  });
  win.querySelector(".max").addEventListener("click", (event) => { event.stopPropagation(); win.classList.toggle("maximized"); });
  bar.addEventListener("dblclick", () => win.classList.toggle("maximized"));
  bar.addEventListener("pointerdown", startDrag);
  win.querySelectorAll(".resize-handle").forEach(handle => handle.addEventListener("pointerdown", startResize));
  win.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", () => copyText(button.dataset.copy)));
  win.querySelectorAll("[data-project-url]").forEach(card => card.addEventListener("click", () => {
    const url = card.dataset.projectUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else toast("CASE FILE", "This system is documented internally. Public deployment pending.");
  }));
  const browserInput = win.querySelector(".browser-toolbar input");
  const browserFrame = win.querySelector(".browser-frame");
  if (browserInput && browserFrame) {
    const normalizeUrl = value => /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
    const navigateBrowser = value => {
      const url = normalizeUrl(value || browserInput.value);
      browserInput.value = url.replace(/^https?:\/\//i, "");
      browserFrame.hidden = false;
      win.querySelector(".browser-start").hidden = true;
      browserFrame.src = url;
      toast("AYUNET", `Loading ${url.replace(/^https?:\/\//i, "")}`);
    };
    win.querySelector("[data-browser-go]").addEventListener("click", () => navigateBrowser());
    win.querySelector("[data-browser-external]").addEventListener("click", () => window.open(normalizeUrl(browserInput.value), "_blank", "noopener,noreferrer"));
    win.querySelector("[data-browser-home]").addEventListener("click", () => {
      browserFrame.hidden = true;
      browserFrame.removeAttribute("src");
      win.querySelector(".browser-start").hidden = false;
    });
    win.querySelectorAll("[data-browser-url]").forEach(button => button.addEventListener("click", () => navigateBrowser(button.dataset.browserUrl)));
    browserInput.addEventListener("keydown", event => { if (event.key === "Enter") navigateBrowser(); });
  }
  const voiceInput = win.querySelector("[data-voice-input]");
  if (voiceInput) bindVoiceAgent(win, voiceInput);
  const dograhLab = win.querySelector("[data-dograh-lab]");
  if (dograhLab) bindDograhLab(dograhLab);
  const whiteboard = win.querySelector("[data-whiteboard]");
  if (whiteboard) bindWhiteboard(whiteboard);
  const projectsAppContainer = win.querySelector("[data-projects-app]");
  if (projectsAppContainer && window.ProjectsExplorerApp) {
    window.ProjectsExplorerApp.init(projectsAppContainer);
  }
  const internshipsAppContainer = win.querySelector("[data-internships-app]");
  if (internshipsAppContainer && window.InternshipsApp) {
    window.InternshipsApp.init(internshipsAppContainer);
  }
  const achievementsContainer = win.querySelector("[data-achievements-app]");
  if (achievementsContainer && window.AchievementsApp) {
    window.AchievementsApp.init(achievementsContainer);
  }
  const techstackContainer = win.querySelector("[data-techstack-app]");
  if (techstackContainer && window.TechStackApp) {
    window.TechStackApp.init(techstackContainer);
  }
  const researchContainer = win.querySelector("[data-research-app]");
  if (researchContainer && window.ResearchApp) {
    window.ResearchApp.init(researchContainer);
  }
  const certContainer = win.querySelector("[data-certifications-app]");
  if (certContainer && window.CertificationsApp) {
    window.CertificationsApp.init(certContainer);
  }
  const journeyContainer = win.querySelector("[data-journey-app]");
  if (journeyContainer && window.JourneyApp) {
    window.JourneyApp.init(journeyContainer);
  }
  const contactContainer = win.querySelector("[data-contact-app]");
  if (contactContainer && window.ContactApp) {
    window.ContactApp.init(contactContainer);
  }
  const resumeContainer = win.querySelector("[data-resume-app]");
  if (resumeContainer && window.ResumeApp) {
    window.ResumeApp.init(resumeContainer);
  }
  const galleryContainer = win.querySelector("[data-gallery-app]");
  if (galleryContainer && window.GalleryApp) {
    window.GalleryApp.init(galleryContainer);
  }
  const fileExplorer = win.querySelector("[data-file-explorer]");
  if (fileExplorer) bindFileExplorer(fileExplorer);
  const proofTheater = win.querySelector("[data-proof-theater]");
  if (proofTheater) bindProofTheater(win, proofTheater);
  const learnLibrary = win.querySelector("[data-learn-library]");
  if (learnLibrary) bindLearningLibrary(learnLibrary);
  if (win.querySelector("[data-game-frame]")) bindGameRoom(win);
  if (win.querySelector("[data-ajax-form]")) bindAjaxForms(win);
  if (win.querySelector("[data-prank-app]")) bindPrank(win);
  if (win.querySelector("[data-hack-terminal]")) bindHack(win);
  if (win.querySelector("[data-run-app]")) bindRun(win);
  win.querySelectorAll("[data-music-track]").forEach(button => button.addEventListener("click", () => {
    selectMusicTrack(Number(button.dataset.musicTrack), true);
  }));
}

function bindDograhLab(lab) {
  const frame = lab.querySelector("[data-dograh-frame]");
  const status = lab.querySelector("[data-dograh-status]");
  const buttons = [...lab.querySelectorAll("[data-dograh-agent]")];
  buttons.forEach(button => button.addEventListener("click", () => {
    const agent = button.dataset.dograhAgent;
    buttons.forEach(item => item.classList.toggle("active", item === button));
    frame.src = `./voice-agents/?agent=${agent}`;
    frame.title = `Ayush production voice agent ${agent.padStart(2, "0")}`;
    status.textContent = `AGENT ${agent.padStart(2, "0")} SELECTED`;
  }));
}

function bindLearningLibrary(library) {
  const frame = library.querySelector("[data-learn-frame]");
  const now = library.querySelector("[data-learn-now]");
  const external = library.querySelector("[data-learn-external]");
  const videos = [...library.querySelectorAll("[data-learn-video]")];
  videos.forEach(button => button.addEventListener("click", () => {
    pauseMusic();
    videos.forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.learnVideo}?autoplay=1&rel=0&modestbranding=1`;
    frame.title = button.dataset.learnTitle;
    now.textContent = button.dataset.learnTitle;
    external.href = button.dataset.learnUrl;
  }));
}

function bindProofTheater(win, theater) {
  const frame = theater.querySelector("[data-proof-frame]");
  const nowPlaying = theater.querySelector("[data-proof-now]");
  const duration = theater.querySelector("[data-proof-duration]");
  const external = theater.querySelector("[data-proof-external]");
  const story = theater.querySelector("[data-proof-story]");
  const expand = theater.querySelector("[data-proof-expand]");
  const cards = [...theater.querySelectorAll("[data-proof-video]")];

  const selectVideo = card => {
    pauseMusic();
    cards.forEach(item => {
      const selected = item === card;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    nowPlaying.textContent = card.dataset.proofLabel;
    duration.textContent = card.dataset.proofDuration;
    external.href = card.dataset.proofUrl;
    if (story) story.textContent = card.dataset.proofStory;
    frame.title = `${card.dataset.proofLabel} client testimonial`;
    delete frame.dataset.restoreSrc;
    frame.src = `https://www.youtube-nocookie.com/embed/${card.dataset.proofVideo}?autoplay=1&rel=0&modestbranding=1`;
    toast("PROOF LOADED", `${card.dataset.proofLabel} · ${card.dataset.proofDuration}`);
  };

  cards.forEach(card => card.addEventListener("click", () => selectVideo(card)));
  theater.querySelectorAll(".proof-thumb img").forEach(image => image.addEventListener("error", () => {
    image.hidden = true;
    image.closest(".proof-thumb")?.classList.add("thumb-error");
  }));
  expand.addEventListener("click", () => {
    const expanded = theater.classList.toggle("cinema-mode");
    win.classList.toggle("proof-cinema-window", expanded);
    expand.textContent = expanded ? "EXIT THEATER" : "EXPAND THEATER";
    expand.setAttribute("aria-pressed", String(expanded));
  });
}

function bindGameRoom(win) {
  const frame = win.querySelector("[data-game-frame]");
  const title = win.querySelector("[data-game-now]");
  const external = win.querySelector("[data-game-external]");
  const enterFullscreen = win.querySelector("[data-game-fullscreen]");
  const exitFullscreen = win.querySelector("[data-game-exit-fullscreen]");
  const allGames = win.querySelector("[data-game-all]");
  const gallery = win.querySelector(".game-case-files");
  win.querySelectorAll("[data-game-url]").forEach(button => button.addEventListener("click", () => {
    const url = button.dataset.gameUrl;
    frame.src = url;
    delete frame.dataset.restoreSrc;
    frame.title = `${button.dataset.gameTitle} game`;
    title.textContent = button.dataset.gameTitle;
    external.href = url;
    win.querySelectorAll("[data-game-url]").forEach(item => item.classList.toggle("active", item === button));
    toast("ARCADE LOADED", `${button.dataset.gameTitle} is ready.`);
  }));
  const syncFullscreen = () => {
    const active = document.fullscreenElement === win;
    enterFullscreen.hidden = active;
    exitFullscreen.hidden = !active;
    win.classList.toggle("game-fullscreen", active);
  };
  enterFullscreen.addEventListener("click", async () => {
    try {
      await win.requestFullscreen();
      syncFullscreen();
    } catch {
      toast("FULLSCREEN BLOCKED", "Use the green window control or open the game in a new tab.");
    }
  });
  exitFullscreen.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    syncFullscreen();
  });
  allGames.addEventListener("click", () => gallery?.scrollIntoView({ behavior: "smooth", block: "start" }));
  document.addEventListener("fullscreenchange", syncFullscreen);
}

function bindFileExplorer(explorer) {
  const list = explorer.querySelector("[data-finder-list]");
  const preview = explorer.querySelector("[data-finder-preview]");
  const breadcrumbs = explorer.querySelector("[data-finder-breadcrumbs]");
  const title = explorer.querySelector("[data-finder-title]");
  const search = explorer.querySelector("[data-finder-search]");
  const back = explorer.querySelector("[data-finder-back]");
  const forward = explorer.querySelector("[data-finder-forward]");
  let path = [];
  let backStack = [];
  let forwardStack = [];

  const findNode = nextPath => nextPath.reduce((node, segment) => node?.children?.find(item => item.name === segment), caseFileSystem);
  const iconFor = node => node.type === "folder" ? "▣" : node.type === "video" ? "▶" : node.type === "link" ? "↗" : node.type === "case" ? "◆" : "▤";
  const kindFor = node => ({
    folder: "Folder",
    case: "Client case file",
    video: "Video story",
    link: "Web link",
    document: "Read-only document"
  }[node.type] || "File");

  const showPreview = node => {
    const clientCase = node.caseId ? clientCases.find(item => item.id === node.caseId) : null;
    preview.replaceChildren();
    if (clientCase) {
      const image = document.createElement("img");
      image.src = clientCase.image;
      image.alt = `${clientCase.company} case-study art`;
      const heading = document.createElement("h3");
      heading.textContent = clientCase.company;
      const metric = document.createElement("strong");
      metric.textContent = `${clientCase.metric} · ${clientCase.metricLabel}`;
      const copy = document.createElement("p");
      copy.textContent = clientCase.outcome;
      preview.append(image, heading, metric, copy);
      return;
    }
    const glyph = document.createElement("span");
    glyph.className = "finder-preview-icon";
    glyph.textContent = iconFor(node);
    const heading = document.createElement("h3");
    heading.textContent = node.title || node.name;
    const copy = document.createElement("p");
    copy.textContent = node.copy || (node.type === "folder" ? `${node.children?.length || 0} items inside this folder.` : "Double-click to open this file.");
    preview.append(glyph, heading, copy);
    if (node.type === "video") {
      const image = document.createElement("img");
      image.src = `https://i.ytimg.com/vi/${node.videoId}/hqdefault.jpg`;
      image.alt = "";
      preview.prepend(image);
    }
  };

  const openNode = node => {
    if (node.type === "folder") {
      navigate([...path, node.name]);
      return;
    }
    if (node.caseId) {
      openApp("revenue");
      toast("CASE FILE OPEN", `${node.name} is available in Client Results.`);
      return;
    }
    if (node.url) {
      window.open(node.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (node.type === "video") {
      window.open(node.url, "_blank", "noopener,noreferrer");
      return;
    }
    showPreview(node);
  };

  const renderRows = (items, query = "") => {
    const matches = items.filter(node => node.name.toLowerCase().includes(query.toLowerCase()));
    list.replaceChildren();
    matches.forEach(node => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "finder-row";
      row.innerHTML = `<span><i>${iconFor(node)}</i><strong>${node.name}</strong></span><span>${kindFor(node)}</span><span>${node.type === "folder" ? `${node.children?.length || 0} ITEMS` : "READY"}</span>`;
      row.addEventListener("click", () => {
        list.querySelectorAll(".finder-row").forEach(item => item.classList.toggle("selected", item === row));
        showPreview(node);
      });
      row.addEventListener("dblclick", () => openNode(node));
      list.append(row);
    });
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "finder-empty";
      empty.textContent = "No files match this search.";
      list.append(empty);
    }
  };

  const render = () => {
    const node = findNode(path) || caseFileSystem;
    title.textContent = node.name;
    breadcrumbs.replaceChildren();
    ["Ayush OS", ...path].forEach((segment, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = segment;
      button.addEventListener("click", () => navigate(path.slice(0, index)));
      breadcrumbs.append(button);
    });
    renderRows(node.children || [], search.value);
    back.disabled = !backStack.length;
    forward.disabled = !forwardStack.length;
  };

  function navigate(nextPath, record = true) {
    if (!findNode(nextPath)) return;
    if (record) {
      backStack.push(path);
      forwardStack = [];
    }
    path = nextPath;
    search.value = "";
    render();
  }

  back.addEventListener("click", () => {
    if (!backStack.length) return;
    forwardStack.push(path);
    path = backStack.pop();
    render();
  });
  forward.addEventListener("click", () => {
    if (!forwardStack.length) return;
    backStack.push(path);
    path = forwardStack.pop();
    render();
  });
  search.addEventListener("input", () => render());
  explorer.querySelectorAll("[data-finder-path]").forEach(button => button.addEventListener("click", () => {
    const next = button.dataset.finderPath ? [button.dataset.finderPath] : [];
    navigate(next);
  }));
  render();
}

function bindWhiteboard(boardApp) {
  const storageKey = "ayush-os-whiteboard-v1";
  const board = boardApp.querySelector("[data-note-board]");
  const form = boardApp.querySelector("[data-note-form]");
  const input = boardApp.querySelector("[data-note-input]");
  const colors = ["#fff38a", "#f7b5cc", "#b9e4f0", "#c7f36b", "#d5c8f4"];
  let notes;
  try {
    notes = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(notes)) notes = [];
  } catch {
    notes = [];
  }

  const save = () => localStorage.setItem(storageKey, JSON.stringify(notes.slice(0, 24)));
  const render = () => {
    board.replaceChildren();
    notes.forEach(note => {
      const card = document.createElement("article");
      const grip = document.createElement("button");
      const area = document.createElement("textarea");
      const remove = document.createElement("button");
      card.className = "board-note";
      card.style.left = `${note.x}px`;
      card.style.top = `${note.y}px`;
      card.style.background = note.color;
      card.style.transform = `rotate(${note.rotation}deg)`;
      grip.type = "button";
      grip.className = "note-grip";
      grip.textContent = "DRAG NOTE";
      grip.setAttribute("aria-label", "Drag sticky note");
      area.value = note.text;
      area.maxLength = 180;
      area.setAttribute("aria-label", "Sticky note text");
      remove.type = "button";
      remove.className = "note-delete";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Delete sticky note");
      card.append(grip, area, remove);
      board.append(card);

      area.addEventListener("input", () => {
        note.text = area.value;
        save();
      });
      remove.addEventListener("click", () => {
        notes = notes.filter(item => item.id !== note.id);
        save();
        render();
      });
      grip.addEventListener("pointerdown", event => {
        event.stopPropagation();
        grip.setPointerCapture(event.pointerId);
        const start = { x: event.clientX, y: event.clientY, left: note.x, top: note.y };
        const move = moveEvent => {
          const maxX = Math.max(0, board.clientWidth - card.offsetWidth);
          const maxY = Math.max(0, board.clientHeight - card.offsetHeight);
          note.x = Math.max(0, Math.min(maxX, start.left + moveEvent.clientX - start.x));
          note.y = Math.max(0, Math.min(maxY, start.top + moveEvent.clientY - start.y));
          card.style.left = `${note.x}px`;
          card.style.top = `${note.y}px`;
        };
        const end = () => {
          grip.removeEventListener("pointermove", move);
          save();
        };
        grip.addEventListener("pointermove", move);
        grip.addEventListener("pointerup", end, { once: true });
        grip.addEventListener("pointercancel", end, { once: true });
      });
    });
  };

  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const index = notes.length;
    notes.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      x: 18 + (index % 4) * 155,
      y: 18 + (index % 3) * 128,
      color: colors[index % colors.length],
      rotation: [-2, 1, -1, 2][index % 4],
    });
    input.value = "";
    save();
    render();
  });

  boardApp.querySelector("[data-reset-desktop]").addEventListener("click", () => {
    localStorage.removeItem("ayush-os-desktop-layout-v1");
    document.querySelectorAll(".desktop-app").forEach(button => {
      button.style.removeProperty("transform");
      button.classList.remove("arranged");
    });
    toast("DESKTOP RESET", "Application icons returned to their original grid.");
  });
  render();
}

function encodeForm(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

function mailFallback(form) {
  const data = Object.fromEntries(new FormData(form));
  const subject = data["form-name"] === "video-suggestion" ? "Video suggestion for Ayush" : "Garage Mail for Ayush";
  const message = data.message || data.suggestion || "";
  return `mailto:officialayush5839@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nFrom: ${data.name || ""} <${data.email || ""}>`)}`;
}

function bindAjaxForms(win) {
  win.querySelectorAll("[data-ajax-form]").forEach(form => form.addEventListener("submit", async event => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    if (!form.reportValidity()) return;
    status.textContent = "TRANSMITTING…";
    submit.disabled = true;
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(form),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const formName = form.querySelector('[name="form-name"]').value;
      status.textContent = formName === "video-suggestion" ? "IDEA QUEUED. THANK YOU." : "MESSAGE DELIVERED TO AYUSH.";
      toast("GARAGE MAIL", "Transmission received. Ayush has your note.");
      form.reset();
    } catch {
      status.textContent = "NETLIFY IS NOT ACTIVE HERE. ";
      const fallback = document.createElement("a");
      fallback.href = mailFallback(form);
      fallback.textContent = "SEND BY EMAIL ↗";
      status.appendChild(fallback);
    } finally {
      submit.disabled = false;
    }
  }));
}

function bindPrank(win) {
  const preview = win.querySelector("[data-prank-preview]");
  const hint = win.querySelector("[data-prank-hint]");
  const rows = [...win.querySelectorAll("[data-prank-file]")];
  let mixtapeClicks = 0;
  const showPreview = file => {
    preview.innerHTML = `
      <span class="finder-preview-icon">${file.icon}</span>
      <h3>${file.name}</h3>
      <p class="finder-preview-meta">${file.kind} · ${file.size} · ${file.status}</p>
      <p>${file.preview}</p>
      <button type="button" class="finder-preview-open" data-prank-open="${file.id}">OPEN IT ANYWAY ↗</button>`;
    preview.querySelector("[data-prank-open]")?.addEventListener("click", () => openPrankFile(file.id));
  };
  const openPrankFile = id => {
    if (id === "keys") { toast("api_keys.env", "Opening the definitely-real secrets..."); openApp("keys"); }
    else if (id === "xxx") { toast("BUSTED", "You actually double-clicked that. On a founder's portfolio. Enjoy."); if (hint) hint.textContent = "There is no going back from what you just tried to open."; openRickroll("definitely_not_xxx.mp4"); }
    else if (id === "pokemon") { toast("NINTENDO HAS BEEN NOTIFIED", "Loading pokemon_emerald_ROM_legit.gba..."); if (hint) hint.textContent = "The lawyers are outside. Do not answer the door."; openRickroll("pokemon_emerald_ROM_legit.gba"); }
    else if (id === "mixtape") {
      mixtapeClicks += 1;
      if (mixtapeClicks === 1) { toast("PLAYBACK DENIED", "The mixtape is too powerful for browser speakers. Double-click again if you insist."); if (hint) hint.textContent = "Double-click it once more if you truly believe you are ready."; }
      else { toast("FINE. PLAYING IT.", "You asked for this."); openRickroll("mixtape_FINAL_v2_REAL_final.mp3"); }
    }
    else if (id === "feelings") { toast("my_actual_feelings", "The folder is empty. Why do you care?"); if (hint) hint.textContent = "0 items. A founder keeps those in the pricing, not on disk."; }
    else if (id === "sys32") { toast("FATAL DECISION", "Running delete_system32.bat... you did this."); if (hint) hint.textContent = "You ran it. This is on you and you alone."; setTimeout(() => powerDown("delete_system32.bat completed successfully. Congratulations, hacker."), 950); }
  };
  rows.forEach(row => {
    const file = prankFiles.find(f => f.id === row.dataset.prankFile);
    row.addEventListener("click", () => {
      rows.forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
      showPreview(file);
    });
    row.addEventListener("dblclick", () => openPrankFile(file.id));
  });
}

function openRickroll(label) {
  openApp("rickroll");
  setTimeout(() => {
    const win = openWindows.get("rickroll");
    if (!win) return;
    const labelEl = win.querySelector("[data-rickroll-label]");
    if (labelEl) labelEl.textContent = `now playing: ${label || "your file"}`;
  }, 60);
}

function bindRun(win) {
  const canvas = win.querySelector("[data-run-canvas]");
  const ctx = canvas.getContext("2d");
  const overlay = win.querySelector("[data-run-overlay]");
  const overTitle = win.querySelector("[data-run-over-title]");
  const overCopy = win.querySelector("[data-run-over-copy]");
  const scoreEl = win.querySelector("[data-run-score]");
  const bestEl = win.querySelector("[data-run-best]");
  const W = canvas.width, H = canvas.height, GROUND = H - 48;
  const playerImg = new Image();
  playerImg.src = "./assets/ayush-front.png";
  const OBSTACLES = ["BUG", "SCAM", "MEETING", "DOUBT", "TAX"];
  const QUIPS = [
    "A meeting got you. It happens to the best of us.",
    "Scammed again. At least this one was free.",
    "The bug won this round. Ship it anyway.",
    "Doubt is undefeated at close range. Run it back.",
    "Taxes. The one boss you cannot dodge forever.",
  ];
  let best = Number(localStorage.getItem("ayush-os-run-best") || 0);
  bestEl.textContent = best;
  let state = "idle";
  let player, obstacles, coins, platforms, speed, score, jumps, spawnTimer, coinTimer, platTimer, raf, lastQuip = "";
  const reset = () => {
    player = { x: 70, y: GROUND, vy: 0, w: 30, h: 42, onGround: true };
    obstacles = []; coins = []; platforms = []; speed = 4.2; score = 0; jumps = 0;
    spawnTimer = 50; coinTimer = 70; platTimer = 120;
  };
  const jump = () => {
    if (state === "idle" || state === "over") { start(); return; }
    if (player.onGround) { player.vy = -13.6; player.onGround = false; jumps = 1; }
    else if (jumps < 2) { player.vy = -11.6; jumps = 2; }
  };
  const start = () => {
    reset();
    state = "running";
    overlay.classList.add("hidden");
    cancelAnimationFrame(raf);
    loop();
  };
  const gameOver = () => {
    state = "over";
    if (Math.floor(score) > best) { best = Math.floor(score); localStorage.setItem("ayush-os-run-best", best); bestEl.textContent = best; }
    lastQuip = QUIPS[Math.floor(score) % QUIPS.length];
    overTitle.textContent = `RUN OVER · ${Math.floor(score)}`;
    overCopy.textContent = lastQuip + " Press space or tap to run it back.";
    overlay.classList.remove("hidden");
  };
  const rect = (x, y, w, h, fill) => { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); };
  const loop = () => {
    if (state !== "running") return;
    ctx.clearRect(0, 0, W, H);
    // sky + hills
    rect(0, 0, W, H, "#fbe3ec");
    rect(0, GROUND + player.h, W, H, "#efd0b7");
    ctx.fillStyle = "rgba(247,169,189,.55)";
    for (let i = 0; i < 5; i++) { const hx = (i * 190 - (score * 0.9) % 190) - 40; ctx.beginPath(); ctx.moveTo(hx, GROUND + player.h); ctx.lineTo(hx + 90, GROUND + player.h - 60); ctx.lineTo(hx + 180, GROUND + player.h); ctx.fill(); }
    ctx.fillStyle = "rgba(123,22,53,.16)";
    for (let i = 0; i < 6; i++) { const cx = (i * 150 - (score * 1.4) % 150); ctx.fillRect(cx, 40 + (i % 2) * 22, 46, 14); }
    // ground brick line
    ctx.fillStyle = "#17131b"; ctx.fillRect(0, GROUND + player.h, W, 4);
    ctx.fillStyle = "rgba(123,22,53,.25)";
    for (let i = 0; i < W / 40 + 1; i++) { const bx = (i * 40 - (score * speed) % 40); ctx.fillRect(bx, GROUND + player.h + 6, 2, 10); }
    // physics + platform landing (one-way from above)
    const prevBottom = player.y + player.h;
    player.vy += 0.66; player.y += player.vy;
    player.onGround = false;
    platforms.forEach(p => {
      const withinX = player.x + player.w > p.x + 4 && player.x < p.x + p.w - 4;
      if (withinX && player.vy >= 0 && prevBottom <= p.y + 6 && player.y + player.h >= p.y) {
        player.y = p.y - player.h; player.vy = 0; player.onGround = true; jumps = 0;
      }
    });
    if (player.y >= GROUND) { player.y = GROUND; player.vy = 0; player.onGround = true; jumps = 0; }
    // draw player
    if (playerImg.complete && playerImg.naturalWidth) ctx.drawImage(playerImg, player.x - 8, player.y - 6, 46, player.h + 10);
    else rect(player.x, player.y, player.w, player.h, "#7b1635");
    // spawn floating platforms
    if (--platTimer <= 0) {
      const py = GROUND - 40 - Math.random() * 90;
      const pw = 70 + Math.random() * 70;
      platforms.push({ x: W + 30, y: py, w: pw });
      // a coin sitting on the platform
      coins.push({ x: W + 30 + pw / 2, y: py - 22, r: 11, got: false });
      platTimer = 150 + Math.random() * 120;
    }
    // spawn ground obstacles (goombas)
    if (--spawnTimer <= 0) {
      const label = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
      const h = 30 + Math.random() * 24;
      obstacles.push({ x: W + 20, y: GROUND + player.h - h, w: 28 + label.length * 3, h, label });
      spawnTimer = Math.max(42, 96 - speed * 5) + Math.random() * 34;
    }
    // spawn low coins
    if (--coinTimer <= 0) {
      coins.push({ x: W + 20, y: GROUND - 30 - Math.random() * 40, r: 11, got: false });
      coinTimer = 120 + Math.random() * 90;
    }
    // platforms
    platforms.forEach(p => {
      p.x -= speed;
      rect(p.x, p.y, p.w, 14, "#c7f36b");
      ctx.fillStyle = "#17131b"; ctx.fillRect(p.x, p.y, p.w, 3); ctx.fillRect(p.x, p.y + 11, p.w, 3);
    });
    platforms = platforms.filter(p => p.x + p.w > -10);
    // obstacles
    ctx.font = "bold 9px 'Silkscreen', monospace";
    obstacles.forEach(o => {
      o.x -= speed;
      rect(o.x, o.y, o.w, o.h, "#17131b");
      ctx.fillStyle = "#ff6b63"; ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, 4);
      ctx.fillStyle = "#fff8dc"; ctx.textAlign = "center";
      ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 3);
      if (player.x < o.x + o.w - 6 && player.x + player.w > o.x + 6 && player.y + player.h > o.y + 4) gameOver();
    });
    obstacles = obstacles.filter(o => o.x + o.w > -10);
    // coins
    coins.forEach(c => {
      c.x -= speed;
      if (!c.got) {
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd95a"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#17131b"; ctx.stroke();
        ctx.fillStyle = "#17131b"; ctx.textAlign = "center"; ctx.font = "bold 11px 'Silkscreen', monospace";
        ctx.fillText("₹", c.x, c.y + 4);
        const dx = player.x + player.w / 2 - c.x, dy = player.y + player.h / 2 - c.y;
        if (Math.hypot(dx, dy) < c.r + 20) { c.got = true; score += 15; }
      }
    });
    coins = coins.filter(c => c.x > -20 && !c.got);
    // score + speed
    score += 0.16; speed += 0.0016;
    scoreEl.textContent = Math.floor(score);
    raf = requestAnimationFrame(loop);
  };
  // controls
  const keyHandler = e => {
    if (!win.isConnected) { window.removeEventListener("keydown", keyHandler); return; }
    if (!win.classList.contains("focused")) return;
    if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
  };
  window.addEventListener("keydown", keyHandler);
  canvas.addEventListener("pointerdown", e => { e.preventDefault(); jump(); });
  win.querySelector("[data-run-start]")?.addEventListener("click", start);
  reset();
  // idle preview frame
  ctx.clearRect(0, 0, W, H); rect(0, 0, W, H, "#fbe3ec"); rect(0, GROUND + 42, W, H, "#efd0b7");
  ctx.fillStyle = "#17131b"; ctx.fillRect(0, GROUND + 42, W, 3);
  const drawIdle = () => { if (playerImg.complete && playerImg.naturalWidth) ctx.drawImage(playerImg, 62, GROUND - 6, 46, 52); };
  if (playerImg.complete) drawIdle(); else playerImg.onload = drawIdle;
}

function bindHack(win) {
  const output = win.querySelector("[data-hack-output]");
  const input = win.querySelector("[data-hack-input]");
  let hacking = false;
  const print = (text, cls) => {
    const line = document.createElement("p");
    if (cls) line.className = cls;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };
  const sequence = (lines, done) => {
    hacking = true;
    let index = 0;
    const tick = () => {
      if (index >= lines.length) { hacking = false; done?.(); return; }
      print(lines[index][0], lines[index][1]);
      index += 1;
      setTimeout(tick, 420 + Math.random() * 380);
    };
    tick();
  };
  const commands = {
    help: () => print("Commands: <b>ls</b>, <b>whoami</b>, <b>passwd</b>, <b>hack</b>, <b>steal keys</b>, <b>play</b>, <b>sudo make-me-rich</b>, <b>clear</b>, <b>exit</b>"),
    ls: () => print("api_keys.env&nbsp;&nbsp;bank_details.txt&nbsp;&nbsp;definitely_not_a_honeypot/&nbsp;&nbsp;vibes.config"),
    whoami: () => print("script_kiddie_" + Math.floor(100 + Math.random() * 900)),
    passwd: () => print("Hint: Access credentials authorized for Ayush."),
    clear: () => { output.innerHTML = ""; },
    exit: () => { print("Session logged. System diagnostics complete."); setTimeout(() => closeWindow(win), 1400); },
    "sudo make-me-rich": () => print("Permission granted. Step 1: close this window and go build something."),
    play: () => { print("Loading hidden arcade: FOUNDER RUN..."); setTimeout(() => openApp("run"), 500); },
    run: () => { print("Loading hidden arcade: FOUNDER RUN..."); setTimeout(() => openApp("run"), 500); },
  };
  const runHack = () => sequence([
    ["Scanning ayushvishwakarma.dev for vulnerabilities...", ""],
    ["Found 0 open ports. Found 1 intelligent AI architecture.", ""],
    ["Bypassing defense-in-depth authorization layer...", ""],
    ["Verifying security keys... <b>AUTHENTICATED</b>", ""],
    ["Loading diagnostic toolchain...", ""],
    ["Brute-forcing test suites... 54 passed.", ""],
    ["ACCESS GRANTED. Diagnostic stream ready.", "hack-success"],
  ], () => {
    print("Wait. These system files look...", "");
    setTimeout(() => { openApp("keys"); print("Protected. Real secrets never ship to the browser. Zero keys in client.", "hack-success"); }, 900);
  });
  input.addEventListener("keydown", event => {
    if (event.key !== "Enter" || hacking) return;
    const raw = input.value.trim();
    if (!raw) return;
    print(`ayush@ayush-os:~$ ${raw}`, "hack-echo");
    input.value = "";
    const cmd = raw.toLowerCase();
    if (commands[cmd]) commands[cmd]();
    else if (/^(hack|sudo hack|attack|breach|exploit)$/.test(cmd)) runHack();
    else if (/steal|keys|api/.test(cmd)) runHack();
    else if (/rm -rf|format|delete/.test(cmd)) { print("Nice try. That trick is older than this founder."); }
    else if (/hello|hi|hey/.test(cmd)) print("This is a hacking terminal, not a networking event.");
    else print(`'${raw}' is not recognized. Neither is your hacking ability. Type <b>help</b>.`);
  });
  setTimeout(() => input.focus({ preventScroll: true }), 300);
}

function updateMusicDeck() {
  if (!musicDeck || !musicAudio) return;
  const track = musicTracks[musicIndex];
  musicDeck.querySelector("[data-music-title]").textContent = track.title;
  musicDeck.querySelector("[data-music-artist]").textContent = track.artist;
  musicDeck.querySelector("[data-music-play]").textContent = musicAudio.paused ? "▶ PLAY" : "❚❚ PAUSE";
  musicDeck.querySelector("[data-music-play]").setAttribute("aria-pressed", String(!musicAudio.paused));
  musicToggle?.classList.toggle("is-playing", !musicAudio.paused);
  const launcherLabel = musicToggle?.querySelector("[data-music-launcher-label]");
  if (launcherLabel) launcherLabel.textContent = musicAudio.paused ? "MUSIC" : "PLAYING";
  document.querySelectorAll("[data-music-track]").forEach(button => button.classList.toggle("active", Number(button.dataset.musicTrack) === musicIndex));
}

function setMusicDeckOpen(isOpen) {
  if (!musicDeck || !musicToggle) return;
  musicDeck.hidden = !isOpen;
  musicToggle.classList.toggle("is-open", isOpen);
  musicToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) musicDeck.querySelector("[data-music-play]")?.focus({ preventScroll: true });
}

function selectMusicTrack(index, shouldPlay = false) {
  if (!musicAudio) return;
  musicIndex = (index + musicTracks.length) % musicTracks.length;
  const track = musicTracks[musicIndex];
  musicAudio.src = track.src;
  musicAudio.load();
  updateMusicDeck();
  if (shouldPlay) playMusic();
}

function playMusic() {
  if (!musicAudio) return;
  openWindows.forEach(win => pauseProofMedia(win));
  if (!musicAudio.src) selectMusicTrack(musicIndex);
  musicAudio.play().then(() => {
    updateMusicDeck();
    toast("SOUND DECK", `${musicTracks[musicIndex].title} is playing.`);
  }).catch(() => toast("AUDIO BLOCKED", "Tap PLAY again to allow audio in this browser."));
}

function pauseMusic() {
  if (!musicAudio) return;
  musicAudio.pause();
  updateMusicDeck();
}

function toggleMusic() {
  if (!musicAudio) return;
  musicAudio.paused ? playMusic() : pauseMusic();
}

function bindVoiceAgent(win, voiceInput) {
  const transcript = win.querySelector("[data-voice-transcript]");
  const status = win.querySelector("[data-voice-status]");
  const mic = win.querySelector("[data-voice-mic]");
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  const addLine = (role, copy) => {
    const line = document.createElement("p");
    line.className = role === "YOU" ? "user-line" : "agent-line";
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = role;
    span.textContent = copy;
    line.append(strong, span);
    transcript.appendChild(line);
    transcript.scrollTop = transcript.scrollHeight;
  };

  const speak = copy => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(copy);
    utterance.rate = 1.05;
    utterance.pitch = .94;
    window.speechSynthesis.speak(utterance);
  };

  const answer = query => {
    const clean = query.trim();
    if (!clean) {
      status.textContent = "TYPE OR SAY SOMETHING FIRST";
      return;
    }
    addLine("YOU", clean);
    const q = clean.toLowerCase();
    let response = "I can open projects, results, systems, testimonials, the journey, Founder.txt, socials, browser, or the emergency contact channel.";
    let target;
    if (/project|kawsay|ship|work/.test(q)) {
      response = "Opening the shipped project files. Kawsaypac Preview 3 is the final commerce preview.";
      target = "projects";
    } else if (/result|revenue|number|proof|money/.test(q)) {
      response = "Opening public results and inspectable proof. Internal company revenue stays private.";
      target = "revenue";
    } else if (/system|process|how.*work/.test(q)) {
      response = "Opening the Ayush AI Systems operating system and delivery loop.";
      target = "process";
    } else if (/testimonial|client|voice.*proof/.test(q)) {
      response = "Opening five canonical client testimonial videos.";
      target = "testimonials";
    } else if (/journey|timeline|2015|milestone/.test(q)) {
      response = "Opening Ayush's public journey and milestone file.";
      target = "journey";
    } else if (/founder|note|who.*ayush|about/.test(q)) {
      response = "Opening Founder dot text - the plain-language note behind the operating system.";
      target = "founder";
    } else if (/instagram|social|youtube|github|twitter|\\bx\\b/.test(q)) {
      response = "Opening the live social channels. LinkedIn is intentionally not listed.";
      target = "socials";
    } else if (/contact|call|whatsapp|emergency|hire|start/.test(q)) {
      response = "Opening the priority contact channel. You can WhatsApp, call, email, or book thirty minutes.";
      target = "emergency";
    } else if (/browser|web|internet/.test(q)) {
      response = "Opening AyuNet, the built-in browser surface.";
      target = "browser";
    }
    addLine("AYUSH OS", response);
    status.textContent = "COMMAND COMPLETE";
    speak(response);
    if (target) setTimeout(() => openApp(target), 420);
  };

  win.querySelector("[data-voice-send]").addEventListener("click", () => {
    answer(voiceInput.value);
    voiceInput.value = "";
  });
  voiceInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      answer(voiceInput.value);
      voiceInput.value = "";
    }
  });
  win.querySelectorAll("[data-voice-prompt]").forEach(button => button.addEventListener("click", () => answer(button.dataset.voicePrompt)));

  if (Recognition) {
    recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.addEventListener("start", () => {
      mic.classList.add("listening");
      mic.textContent = "LISTENING...";
      status.textContent = "MICROPHONE LIVE";
    });
    recognition.addEventListener("result", event => answer(event.results[0][0].transcript));
    recognition.addEventListener("error", event => {
      status.textContent = `MIC ERROR: ${event.error.toUpperCase()}`;
      addLine("AYUSH OS", "Microphone access failed. You can still type your command below.");
    });
    recognition.addEventListener("end", () => {
      mic.classList.remove("listening");
      mic.textContent = "HOLD TO TALK";
    });
    mic.addEventListener("click", () => recognition.start());
  } else {
    mic.disabled = true;
    mic.textContent = "VOICE UNSUPPORTED";
    status.textContent = "TYPE MODE READY";
  }
}

function startDrag(event) {
  if (window.innerWidth <= 760 || event.target.closest(".window-controls")) return;
  const win = event.currentTarget.closest(".os-window");
  if (win.classList.contains("maximized")) return;
  const rect = win.getBoundingClientRect();
  dragState = { win, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
  event.currentTarget.setPointerCapture(event.pointerId);
}
window.addEventListener("pointermove", event => {
  if (!dragState) return;
  const { win, x, y, left, top } = dragState;
  const nextLeft = Math.max(0, Math.min(window.innerWidth - 120, left + event.clientX - x));
  const nextTop = Math.max(0, Math.min(window.innerHeight - 110, top + event.clientY - y - 38));
  win.style.left = `${nextLeft}px`;
  win.style.top = `${nextTop}px`;
});
window.addEventListener("pointerup", () => { dragState = null; });

let resizeState = null;
function startResize(event) {
  if (window.innerWidth <= 760) return;
  const win = event.currentTarget.closest(".os-window");
  if (win.classList.contains("maximized")) return;
  event.stopPropagation();
  const rect = win.getBoundingClientRect();
  resizeState = {
    win,
    dir: event.currentTarget.dataset.resize,
    x: event.clientX,
    y: event.clientY,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
}
window.addEventListener("pointermove", event => {
  if (!resizeState) return;
  const { win, dir, x, y, left, top, width, height } = resizeState;
  const dx = event.clientX - x;
  const dy = event.clientY - y;
  const minWidth = 420;
  const minHeight = 280;
  if (dir.includes("e")) {
    const maxWidth = window.innerWidth - left - 8;
    win.style.width = `${Math.max(minWidth, Math.min(maxWidth, width + dx))}px`;
  }
  if (dir.includes("w")) {
    const maxWidth = left + width - 8;
    const nextWidth = Math.max(minWidth, Math.min(maxWidth, width - dx));
    win.style.width = `${nextWidth}px`;
    win.style.left = `${left + width - nextWidth}px`;
  }
  if (dir.includes("s")) {
    const maxHeight = window.innerHeight - top - 8;
    win.style.height = `${Math.max(minHeight, Math.min(maxHeight, height + dy))}px`;
  }
});
window.addEventListener("pointerup", () => { resizeState = null; });

function focusWindow(win) {
  document.querySelectorAll(".os-window").forEach(item => item.classList.remove("focused"));
  win.classList.add("focused");
  win.style.zIndex = ++zTop;
}
function closeWindow(win) {
  const id = win.dataset.app;
  win.style.opacity = "0";
  win.style.transform = "scale(.92)";
  setTimeout(() => win.remove(), 150);
  openWindows.delete(id);
  document.querySelectorAll(`[data-open="${id}"]`).forEach(el => el.classList.remove("open"));
}
function closeFocused() {
  const focused = document.querySelector(".os-window.focused");
  if (focused) closeWindow(focused);
}
function showDesktop() {
  openWindows.forEach(win => {
    pauseProofMedia(win);
    pauseGameMedia(win);
    win.classList.add("minimized");
  });
  toast("SHOW DESKTOP", "All windows minimized. Click an open app to restore it.");
}

function jumpTo(id) {
  const section = document.querySelector(`#${id}`);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  if (playerLabel) playerLabel.textContent = districtLabels[id] || "AYU · ONLINE";
}

function renderPlayer() {
  if (!worldPlayer || !playerSprite) return;
  const scale = window.innerWidth <= 760 ? .78 : 1;
  worldPlayer.style.transform = `translate3d(${playerState.x}px, ${playerState.y}px, 0) scale(${scale})`;
  playerSprite.src = spriteSources[playerState.direction];
  worldPlayer.classList.toggle("facing-left", playerState.direction === "left");
  worldPlayer.classList.add("walking");
  clearTimeout(walkTimer);
  walkTimer = setTimeout(() => worldPlayer.classList.remove("walking"), 1900);
}

function syncWorld() {
  if (playerLabel) playerLabel.textContent = "AYU · HOME BASE";
}

function patrolWaypoints() {
  const mobile = window.innerWidth <= 760;
  const x = window.innerWidth;
  const y = window.innerHeight;
  return mobile
    ? [
        { x: 0, y: 0, label: "AYU · HOME BASE" },
        { x: -x * .18, y: -y * .08, label: "AYU · CHECKING FILES" },
        { x: x * .12, y: -y * .15, label: "AYU · SHIPPING" },
        { x: x * .04, y: -y * .02, label: "AYU · ONLINE" },
      ]
    : [
        { x: 0, y: 0, label: "AYU · HOME BASE" },
        { x: -x * .17, y: -y * .04, label: "AYU · CHECKING FILES" },
        { x: -x * .08, y: -y * .19, label: "AYU · BUILDING" },
        { x: x * .16, y: -y * .16, label: "AYU · SHIPPING" },
        { x: x * .08, y: -y * .03, label: "AYU · BACK ONLINE" },
      ];
}

function autoPatrol() {
  if (!worldPlayer || !playerSprite) return;
  if (playerState.paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const waypoints = patrolWaypoints();
  playerState.waypoint = (playerState.waypoint + 1) % waypoints.length;
  const target = waypoints[playerState.waypoint];
  const deltaX = target.x - playerState.x;
  const deltaY = target.y - playerState.y;
  playerState.direction = Math.abs(deltaX) > Math.abs(deltaY)
    ? (deltaX < 0 ? "left" : "right")
    : (deltaY < 0 ? "up" : "down");
  playerState.x = target.x;
  playerState.y = target.y;
  playerLabel.textContent = target.label;
  renderPlayer();
}

function waveHello() {
  if (!worldPlayer || !playerSprite) return;
  playerState.paused = true;
  worldPlayer.classList.remove("walking");
  worldPlayer.classList.add("waving");
  playerSprite.src = spriteSources.down;
  worldPlayer.classList.remove("facing-left");
  playerLabel.textContent = "AYU · HEY THERE!";
  toast("PLAYER 01", "Ayush waved. He is getting back to work.");
  setTimeout(() => {
    worldPlayer.classList.remove("waving");
    playerState.paused = false;
    playerLabel.textContent = "AYU · BACK TO WORK";
    autoPatrol();
  }, 1450);
}

function recordVisit(id, silent = false) {
  const before = visits.size;
  visits.add(id);
  localStorage.setItem("ayush-os-visits", JSON.stringify([...visits]));
  if (!silent && visits.size > before) toast("APP DISCOVERED", `${apps[id].title} added to your session.`);
  if (visits.size === Object.keys(apps).length) toast("ACHIEVEMENT UNLOCKED", "FULL SYSTEM TOUR  -  you found every Ayush OS app.");
}

function toast(title, message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  document.querySelector("#toast-stack").appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(20px)"; }, 3600);
  setTimeout(() => el.remove(), 3950);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast("COPIED", `${value} is on your clipboard.`);
  } catch {
    toast("COPY FAILED", `Use this address: ${value}`);
  }
}

function openPalette() {
  palette.classList.add("open");
  palette.setAttribute("aria-hidden", "false");
  commandInput.value = "";
  renderCommands("");
  setTimeout(() => commandInput.focus(), 30);
}
function closePalette() {
  palette.classList.remove("open");
  palette.setAttribute("aria-hidden", "true");
}
function renderCommands(query) {
  const commands = [
    ...Object.entries(apps).map(([id, app]) => ({ id, label: `Open ${app.title}`, hint: "APP" })),
    { id: "desktop", label: "Show desktop", hint: "SYSTEM" },
    { id: "theme", label: "Cycle day / night / dark", hint: "SYSTEM" },
    { id: "email", label: "Copy Ayush's email", hint: "ACTION" },
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  commandResults.innerHTML = commands.map((item, index) => `<button class="command-result ${index === 0 ? "active" : ""}" type="button" data-command-id="${item.id}"><strong>${item.label}</strong><small>${item.hint}</small></button>`).join("");
  commandResults.querySelectorAll(".command-result").forEach(button => button.addEventListener("click", () => runCommand(button.dataset.commandId)));
}
function runCommand(id) {
  closePalette();
  if (apps[id]) openApp(id);
  else if (id === "desktop") showDesktop();
  else if (id === "theme") toggleTheme();
  else if (id === "email") copyText("officialayush5839@gmail.com");
}

function cyclePortrait() {
  if (!portraitButton || !portraitImage) return;
  portraitIndex = (portraitIndex + 1) % portraitPoses.length;
  const pose = portraitPoses[portraitIndex];
  portraitImage.src = pose.src;
  portraitButton.querySelector("span").textContent = `PLAYER 01 / ${pose.label}`;
}

function revealLearn() {
  document.querySelector("[data-learn-cluster]")?.classList.add("revealed");
  toast("HIDDEN FILE FOUND", "Learn.app was underneath the sticky note.");
}

function setDailyMotivation() {
  const quotes = [
    "BUILD THE THING YOU KEEP WISHING EXISTED.",
    "YOUR NEXT CLIENT NEEDS PROOF, NOT ANOTHER PROMISE.",
    "SHIP THE HARD PART FIRST. POLISH WHAT SURVIVES.",
    "LEVERAGE BEGINS WHERE REPETITIVE WORK ENDS.",
    "MAKE THE SYSTEM STRONG ENOUGH TO WORK WITHOUT YOU.",
    "THE PORTFOLIO IS THE RECEIPT. KEEP SHIPPING.",
    "CONSISTENCY LOOKS BORING UNTIL IT BECOMES UNFAIR.",
  ];
  const today = new Date();
  const index = Math.floor(today.getTime() / 86400000) % quotes.length;
  const quote = document.querySelector("[data-motivation-quote]");
  const date = document.querySelector("[data-motivation-date]");
  if (quote) quote.textContent = quotes[index];
  if (date) date.textContent = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(today).toUpperCase();
}

function bindIdentityMorph() {
  const label = document.querySelector("[data-identity-morph]");
  if (!label) return;
  const identities = ["AYUSH VISHWAKARMA OS", "AI SYSTEMS OPERATOR", "VOICE + WEB BUILDER", "AYUSH VISHWAKARMA OS"];
  let index = 0;
  window.setInterval(() => {
    label.classList.remove("spring-in");
    label.classList.add("spring-out");
    window.setTimeout(() => {
      index = (index + 1) % identities.length;
      label.textContent = identities[index];
      label.classList.remove("spring-out");
      label.classList.add("spring-in");
    }, 220);
  }, 3200);
}

function bindDesktopArrangement() {
  const storageKey = "ayush-os-desktop-layout-v1";
  let layout;
  try {
    layout = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (!layout || typeof layout !== "object") layout = {};
  } catch {
    layout = {};
  }
  const save = () => localStorage.setItem(storageKey, JSON.stringify(layout));
  document.querySelectorAll(".desktop-app[data-open]").forEach(button => {
    const id = button.dataset.open;
    const saved = layout[id];
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      button.style.transform = `translate3d(${saved.x}px, ${saved.y}px, 0)`;
      button.classList.add("arranged");
    }
    let drag = null;
    let suppressClick = false;
    button.addEventListener("pointerdown", event => {
      if (window.innerWidth <= 760 || event.button !== 0) return;
      const current = layout[id] || { x: 0, y: 0 };
      drag = { startX: event.clientX, startY: event.clientY, x: current.x, y: current.y, moved: false };
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener("pointermove", event => {
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) < 7 && !drag.moved) return;
      drag.moved = true;
      const x = Math.max(-520, Math.min(520, drag.x + dx));
      const y = Math.max(-280, Math.min(470, drag.y + dy));
      layout[id] = { x, y };
      button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      button.classList.add("arranged", "dragging");
    });
    const end = () => {
      if (!drag) return;
      suppressClick = drag.moved;
      button.classList.remove("dragging");
      if (drag.moved) save();
      drag = null;
      setTimeout(() => { suppressClick = false; }, 0);
    };
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("click", event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  });
}

function bindMovableWidgets() {
  const storageKey = "ayush-os-widget-layout-v1";
  let layout;
  try {
    layout = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (!layout || typeof layout !== "object") layout = {};
  } catch {
    layout = {};
  }
  document.querySelectorAll("[data-movable-widget]").forEach(widget => {
    const id = widget.dataset.movableWidget;
    const saved = layout[id];
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) widget.style.translate = `${saved.x}px ${saved.y}px`;
    let drag = null;
    widget.addEventListener("pointerdown", event => {
      if (window.innerWidth <= 900 || event.button !== 0 || event.target.closest("button,a,input,textarea")) return;
      const current = layout[id] || { x: 0, y: 0 };
      drag = { x: event.clientX, y: event.clientY, left: current.x, top: current.y };
      widget.setPointerCapture(event.pointerId);
      widget.classList.add("widget-dragging");
    });
    widget.addEventListener("pointermove", event => {
      if (!drag) return;
      const x = Math.max(-700, Math.min(700, drag.left + event.clientX - drag.x));
      const y = Math.max(-500, Math.min(500, drag.top + event.clientY - drag.y));
      layout[id] = { x, y };
      widget.style.translate = `${x}px ${y}px`;
    });
    const stop = () => {
      if (!drag) return;
      drag = null;
      widget.classList.remove("widget-dragging");
      localStorage.setItem(storageKey, JSON.stringify(layout));
    };
    widget.addEventListener("pointerup", stop);
    widget.addEventListener("pointercancel", stop);
  });
}

if (musicDeck && musicAudio) {
  const playButton = musicDeck.querySelector("[data-music-play]");
  const progress = musicDeck.querySelector("[data-music-progress]");
  const volume = musicDeck.querySelector("[data-music-volume]");
  const savedVolume = Number(localStorage.getItem("ayush-os-volume") || ".72");
  musicAudio.volume = Number.isFinite(savedVolume) ? Math.max(0, Math.min(1, savedVolume)) : .72;
  volume.value = String(musicAudio.volume);
  playButton.addEventListener("click", toggleMusic);
  musicDeck.querySelector("[data-music-prev]").addEventListener("click", () => selectMusicTrack(musicIndex - 1, true));
  musicDeck.querySelector("[data-music-next]").addEventListener("click", () => selectMusicTrack(musicIndex + 1, true));
  musicDeck.querySelector("[data-music-open]").addEventListener("click", () => openApp("music"));
  progress.addEventListener("input", () => {
    if (musicAudio.duration) musicAudio.currentTime = (Number(progress.value) / 1000) * musicAudio.duration;
  });
  volume.addEventListener("input", () => {
    musicAudio.volume = Number(volume.value);
    localStorage.setItem("ayush-os-volume", String(musicAudio.volume));
  });
  musicAudio.addEventListener("timeupdate", () => {
    progress.value = musicAudio.duration ? String(Math.round((musicAudio.currentTime / musicAudio.duration) * 1000)) : "0";
  });
  musicAudio.addEventListener("play", updateMusicDeck);
  musicAudio.addEventListener("pause", updateMusicDeck);
  musicAudio.addEventListener("ended", () => selectMusicTrack(musicIndex + 1, true));
  musicToggle?.addEventListener("click", () => setMusicDeckOpen(true));
  musicClose?.addEventListener("click", () => setMusicDeckOpen(false));
  selectMusicTrack(0);
  setMusicDeckOpen(false);
}

portraitButton?.addEventListener("click", event => {
  event.stopPropagation();
  cyclePortrait();
});

learnSticky?.addEventListener("click", revealLearn);
learnSticky?.addEventListener("pointerdown", event => {
  stickyDrag = { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY };
  learnSticky.setPointerCapture(event.pointerId);
});
learnSticky?.addEventListener("pointermove", event => {
  if (!stickyDrag) return;
  stickyDrag.x = event.clientX;
  stickyDrag.y = event.clientY;
  const dx = Math.max(-70, Math.min(95, event.clientX - stickyDrag.startX));
  const dy = Math.max(-45, Math.min(85, event.clientY - stickyDrag.startY));
  learnSticky.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(-3deg)`;
  if (Math.abs(dx) + Math.abs(dy) > 38) revealLearn();
});
learnSticky?.addEventListener("pointerup", () => { stickyDrag = null; });
setDailyMotivation();
bindIdentityMorph();
bindDesktopArrangement();
bindMovableWidgets();

document.addEventListener("click", event => {
  const opener = event.target.closest("[data-open]");
  if (opener) openApp(opener.dataset.open);
  const jumper = event.target.closest("[data-jump]");
  if (jumper) jumpTo(jumper.dataset.jump);
  if (event.target.closest("[data-home]")) showDesktop();
  if (event.target.closest("[data-command]")) openPalette();
});
document.querySelector(".boot-skip").addEventListener("click", finishBoot);
themeButtons.forEach(button => button.addEventListener("click", () => {
  applyTheme(button.dataset.themeChoice);
  toast(`${button.dataset.themeChoice.toUpperCase()} MODE`, "Appearance updated and saved.");
}));
document.querySelector(".palette-backdrop").addEventListener("click", closePalette);
commandInput.addEventListener("input", event => renderCommands(event.target.value));
commandInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const first = commandResults.querySelector(".command-result");
    if (first) runCommand(first.dataset.commandId);
  }
});
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openPalette(); }
  if (event.key === "Escape") { palette.classList.contains("open") ? closePalette() : closeFocused(); }
});
document.querySelector(".sticky")?.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") openApp(event.currentTarget.dataset.open);
});
worldPlayer?.addEventListener("click", event => { event.stopPropagation(); waveHello(); });
worldPlayer?.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    waveHello();
  }
});
window.addEventListener("resize", () => {
  playerState.waypoint = -1;
  autoPatrol();
});

function initDailyTransmission() {
  const stack = document.querySelector(".motivation-stack");
  const closeButton = document.querySelector("[data-motivation-close]");
  if (!stack) return;
  const todayKey = new Date().toDateString();
  const dismissedOn = localStorage.getItem("ayush-os-transmission-dismissed");
  if (dismissedOn === todayKey) {
    stack.hidden = true;
    return;
  }
  closeButton?.addEventListener("click", event => {
    event.stopPropagation();
    localStorage.setItem("ayush-os-transmission-dismissed", todayKey);
    stack.classList.add("closing");
    setTimeout(() => { stack.hidden = true; }, 180);
  });
}
initDailyTransmission();

function powerDown(message) {
  const screen = document.querySelector("#shutdown-screen");
  const line = screen.querySelector("[data-shutdown-line]");
  const power = screen.querySelector("[data-power-on]");
  screen.hidden = false;
  document.body.classList.add("crt-off");
  line.textContent = message || "AYUSH OS is shutting down...";
  power.hidden = true;
  setTimeout(() => {
    line.textContent = "It is now safe to turn off your founder.";
    power.hidden = false;
  }, 1600);
}

function initSystemMenu() {
  const brandButton = document.querySelector("[data-brand-menu]");
  const dropdown = document.querySelector("[data-brand-dropdown]");
  if (!brandButton || !dropdown) return;
  const closeMenu = () => { dropdown.hidden = true; brandButton.setAttribute("aria-expanded", "false"); };
  brandButton.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = dropdown.hidden;
    dropdown.hidden = !willOpen;
    brandButton.setAttribute("aria-expanded", String(willOpen));
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".brand-cluster")) closeMenu();
  });
  dropdown.addEventListener("click", event => {
    if (event.target.closest("button")) closeMenu();
  });
  document.querySelector("[data-system-restart]")?.addEventListener("click", () => {
    toast("SYSTEM RESTART", "Rebooting Ayush OS...");
    setTimeout(() => window.location.reload(), 700);
  });
  document.querySelector("[data-system-shutdown]")?.addEventListener("click", () => powerDown());
  document.querySelector("[data-power-on]")?.addEventListener("click", () => window.location.reload());
  document.querySelector("[data-transmission-open]")?.addEventListener("click", () => {
    const stack = document.querySelector(".motivation-stack");
    if (!stack) return;
    localStorage.removeItem("ayush-os-transmission-dismissed");
    stack.classList.remove("closing");
    stack.hidden = false;
    toast("DAILY TRANSMISSION", "Back on the desk.");
  });
}
initSystemMenu();

function initKonami() {
  const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let pos = 0;
  window.addEventListener("keydown", event => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === code[pos]) {
      pos += 1;
      if (pos === code.length) {
        pos = 0;
        toast("CHEAT CODE ACCEPTED", "You found Founder Run. Now dodge everything real life throws at you.");
        openApp("run");
      }
    } else {
      pos = key === code[0] ? 1 : 0;
    }
  });
}
initKonami();

function initModeToggle() {
  const button = document.querySelector("[data-mode-toggle]");
  const label = document.querySelector("[data-mode-label]");
  if (!button) return;
  const stored = localStorage.getItem("ayush-os-mode");
  const startDark = stored === "dark";
  if (startDark) applyTheme("dark");
  if (label) label.textContent = startDark ? "LIGHT" : "DARK";
  button.addEventListener("click", () => {
    const goingDark = os.dataset.theme !== "dark";
    applyTheme(goingDark ? "dark" : "day");
    localStorage.setItem("ayush-os-mode", goingDark ? "dark" : "day");
    if (label) label.textContent = goingDark ? "LIGHT" : "DARK";
  });
}
initModeToggle();

function initWallpaperRotator() {
  const rotator = document.querySelector("[data-wallpaper-rotator]");
  if (!rotator) return;
  const layers = [...rotator.querySelectorAll("[data-wallpaper-layer]")];
  // all 4 video wallpapers rotate together, regardless of day/night theme
  // the previous light/dark split silently dropped deep-space out of rotation on the
  // default (light) theme, which read as "the space video never shows up"
  const set = ["cotton-candy-dawn", "anime-sky", "deep-space", "founder-window"];
  const base = "./assets/wallpapers/";
  const V = "?v=vid3";                      // cache-bust (1080p re-encode)
  const noFlip = { "founder-window": true }; // keeps its natural orientation
  // swap only fires the cross-fade once the incoming video can actually paint a frame,
  // so a slow-loading video never leaves a blank/transparent layer flashing the pink fallback
  const setLayer = (layer, name, onReady) => {
    const existing = layer.querySelector("video");
    if (existing) existing.remove();
    layer.style.backgroundImage = "";
    const v = document.createElement("video");
    v.className = "wallpaper-video is-active" + (noFlip[name] ? " no-flip" : "");
    v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
    v.preload = "auto";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.src = `${base}${name}.mp4${V}`;
    layer.appendChild(v);
    const fire = () => { v.play().catch(() => {}); onReady && onReady(); };
    if (v.readyState >= 2) fire();
    else v.addEventListener("canplay", fire, { once: true });
  };
  let index = 0;
  let activeLayer = 0;
  setLayer(layers[0], set[0], () => rotator.classList.add("wallpaper-on"));
  const advance = () => {
    index = (index + 1) % set.length;
    const next = (activeLayer + 1) % 2;
    setLayer(layers[next], set[index], () => {
      layers[next].classList.add("is-active");
      layers[activeLayer].classList.remove("is-active");
      activeLayer = next;
    });
  };
  setInterval(advance, 40000);
}
initWallpaperRotator();

function initDockAutoHide() {
  const dock = document.querySelector(".dock");
  if (!dock) return;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!hasFinePointer || window.innerWidth <= 760) return;
  dock.classList.add("dock-hoverable");
  let hideTimer;
  const reveal = () => {
    dock.classList.add("dock-visible");
    clearTimeout(hideTimer);
  };
  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => dock.classList.remove("dock-visible"), 600);
  };
  window.addEventListener("mousemove", event => {
    if (window.innerHeight - event.clientY < 64) reveal();
    else if (!dock.matches(":hover")) scheduleHide();
  });
  dock.addEventListener("mouseenter", reveal);
  dock.addEventListener("mouseleave", scheduleHide);
  reveal();
  scheduleHide();
}
initDockAutoHide();

function updateClock() {
  const now = new Date();
  document.querySelector("#clock").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  document.querySelector("#date").textContent = now.toLocaleDateString([], { day: "2-digit", month: "short" }).toUpperCase();
  const zone = Intl.DateTimeFormat([], { timeZoneName: "short" }).formatToParts(now).find(part => part.type === "timeZoneName");
  document.querySelector("#timezone").textContent = zone ? zone.value.toUpperCase() : "LOCAL";
}
updateClock();
applyTheme(localStorage.getItem("ayush-os-mode") === "dark" ? "dark" : "day");
syncWorld();
setInterval(updateClock, 30000);
runBootSequence();

function runBootSequence() {
  const console = document.querySelector("[data-boot-console]");
  const bar = document.querySelector("[data-boot-bar]");
  const pctEl = document.querySelector("[data-boot-pct]");
  const statusEl = document.querySelector("[data-boot-status]");
  if (!console || !bar) { setTimeout(finishBoot, 2200); return; }
  const steps = [
    { at: 12, log: "> mounting /projects/github ........ ok", status: "connecting GitHub API..." },
    { at: 28, log: "> verifying credentials & awards ... ok", status: "verifying credentials..." },
    { at: 45, log: "> initializing machine learning .... ok", status: "warming PyTorch & YOLO pipelines..." },
    { at: 62, log: "> checking sensor telemetry ........ ok", status: "polling IoT edge endpoints..." },
    { at: 78, log: "> mounting research & publications . ok", status: "loading research archives..." },
    { at: 90, log: "> syncing evidence vault ........... ok", status: "verifying career documents..." },
    { at: 100, log: "> AYUSH.OS v5.5 .................. ONLINE", status: "systems operational." },
  ];
  let pct = 0;
  let stepIndex = 0;
  const cursor = document.createElement("p");
  cursor.className = "boot-cursor";
  cursor.textContent = "root@ayushos:~$ ";
  const tick = () => {
    if (booted) return;
    pct = Math.min(100, pct + (2 + Math.random() * 5));
    const shown = Math.round(pct);
    bar.style.width = `${shown}%`;
    if (pctEl) pctEl.textContent = `${shown}%`;
    while (stepIndex < steps.length && shown >= steps[stepIndex].at) {
      const step = steps[stepIndex];
      const line = document.createElement("p");
      line.className = "boot-log-line" + (step.at === 100 ? " boot-log-final" : "");
      line.innerHTML = step.log.replace(/(ok|ONLINE|100%|blocked)/g, "<b>$1</b>");
      console.insertBefore(line, cursor);
      if (statusEl) statusEl.textContent = step.status;
      console.scrollTop = console.scrollHeight;
      stepIndex += 1;
    }
    if (shown >= 100) { setTimeout(finishBoot, 520); return; }
    setTimeout(tick, 130 + Math.random() * 120);
  };
  console.appendChild(cursor);
  setTimeout(tick, 260);
}


// ===== Avatar Live Presence & Hand Wave System =====
function initAvatarLivePresence() {
  const desktop = document.querySelector(".desktop");
  if (!desktop) return;
  const bubble = document.createElement("div");
  bubble.className = "avatar-speech-bubble";
  bubble.style.cssText = "position:absolute; right:min(270px, 20vw); bottom:280px; background:rgba(255,248,220,0.96); border:2px solid #17131b; padding:8px 12px; font-family:var(--pixel, monospace); font-size:11px; color:#17131b; box-shadow:3px 3px 0 rgba(23,19,27,0.25); border-radius:4px; max-width:200px; z-index:25; pointer-events:none; opacity:0; transform:translateY(8px); transition:opacity 0.25s ease, transform 0.25s ease; text-transform:uppercase;";
  desktop.appendChild(bubble);

  const greetings = [
    "Hey there! I'm Ayush 👋",
    "Welcome to AYUSH.OS! ✨",
    "Evidence over hype. Systems over screenshots ⚙️",
    "Check out INTELLIEMO in Projects! 🧠",
    "Studying CS at VU Pune 🎓",
    "Click me to cycle avatar modes! 🔄",
    "Full-stack AI & IoT Architect 🚀"
  ];
  let gIdx = 0;

  function triggerWave(customMsg) {
    if (!portraitButton || !portraitImage) return;
    portraitButton.classList.add("waving-avatar");
    portraitImage.src = "./assets/ayush-3d-wave.png";
    bubble.textContent = customMsg || greetings[gIdx % greetings.length];
    gIdx++;
    bubble.style.opacity = "1";
    bubble.style.transform = "translateY(0)";

    setTimeout(() => {
      portraitButton.classList.remove("waving-avatar");
      if (portraitPoses[portraitIndex]) {
        portraitImage.src = portraitPoses[portraitIndex].src;
      }
      bubble.style.opacity = "0";
      bubble.style.transform = "translateY(8px)";
    }, 3500);
  }

  // Periodic automatic wave every 22 seconds
  setInterval(triggerWave, 22000);
  // Initial wave greeting after boot
  setTimeout(() => triggerWave("Hey! I'm Ayush. Welcome to my AI OS! 👋"), 3000);

  // Click on avatar triggers immediate wave
  portraitButton?.addEventListener("click", () => {
    setTimeout(() => {
      triggerWave("Switched to " + portraitPoses[portraitIndex].label + "! ✨");
    }, 150);
  });
}
initAvatarLivePresence();
