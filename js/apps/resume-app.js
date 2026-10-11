/**
 * AYUSH.OS — Resume / Personnel File Application Module
 * 
 * Recruiter-friendly personnel dossier and professional resume manager.
 * Features:
 *  - Professional identity summary with verified academic & engineering focus
 *  - Real-time document availability status check
 *  - Primary actions: View Resume, Download PDF, and Full-View Evidence Modal
 *  - Embedded responsive PDF viewer with graceful structured fallback
 *  - Direct recruiter navigation shortcuts into supporting OS applications
 * 
 * Export: window.ResumeApp = { getContent, init, checkFileStatus }
 */

(function (root, factory) {
  'use strict';
  const mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (typeof window !== 'undefined') {
    window.ResumeApp = mod;
  }
  if (root) {
    root.ResumeApp = mod;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getProfileResume() {
    const p = (typeof window !== 'undefined' && window.ownerProfile) ? window.ownerProfile : {};
    return p.resume || {
      id: 'resume',
      title: 'Ayush Vishwakarma — Professional Resume',
      fileName: 'Ayush_Vishwakarma_Resume.pdf',
      fileUrl: 'assets/documents/Ayush_Vishwakarma_Resume.pdf',
      docxFileName: 'Ayush_Vishwakarma_Resume.docx',
      docxUrl: 'assets/documents/Ayush_Vishwakarma_Resume.docx',
      mimeType: 'application/pdf',
      format: 'PDF',
      candidate: {
        fullName: 'Ayush Vishwakarma',
        headline: 'Aspiring AI/ML Engineer | B.Tech – CS & Engineering (AI & ML)',
        location: 'Pune, India',
        email: 'ayush.vishwakarma251@vupune.ac.in',
        altEmail: 'officialayush5839@gmail.com',
        phone: '+91 8983233911',
        education: 'Vishwakarma University, Pune',
        degree: 'B.Tech – Computer Science & Engineering (AI & ML)',
        expectedGraduation: '2029',
        cgpa: '8.6 / 10',
        summary: 'Motivated Computer Science undergraduate specializing in AI & ML at Vishwakarma University. Hands-on experience building intelligent systems with Python, TensorFlow, and PyTorch. Achieved 3rd place at the IIT Kanpur AWS Hackathon. Passionate about fintech, fraud detection, and AI-driven solutions.'
      },
      skills: {
        languages: ['Python', 'HTML', 'CSS', 'C/C++'],
        frameworks: ['TensorFlow', 'PyTorch', 'Scikit-learn'],
        domains: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Fraud Detection', 'Predictive Analytics']
      },
      projects: [
        {
          title: 'AI-Powered Attendance System',
          description: 'Face-recognition system eliminating manual roll calls; reduced recording time by 80% using Python & deep learning.'
        },
        {
          title: 'Online Fraud Detection System',
          description: 'ML classification model detecting fraudulent financial transactions using Scikit-learn — fintech focused.'
        },
        {
          title: 'Smart Farm AI',
          description: 'AI advisory system for crop recommendations and yield predictions using environmental and soil data.'
        }
      ],
      experience: [
        {
          role: 'Production Manager',
          type: 'Part-time (alongside studies)',
          description: 'Gained practical exposure to teamwork, operational management, and decision-making in a professional environment. Developed leadership, time management, and financial documentation skills including invoicing and account handling.'
        }
      ],
      honors: [
        '3rd Place – IIT Kanpur AWS Hackathon (national-level competition)',
        'Completed AI Journalist Program by Outskill – AI-based content creation, research methods & media communication',
        '1st Place – NSD Hackathon',
        '2nd Place – Game Jam Hackathon'
      ],
      interests: [
        'Cryptocurrency & blockchain',
        'Mutual funds & investment strategies',
        'Financial planning',
        'AI tools and their real-world applications in productivity and decision-making'
      ]
    };
  }

  function getContent() {
    const resume = getProfileResume();
    const c = resume.candidate || {};
    const skills = resume.skills || { languages: [], frameworks: [], domains: [] };
    const projects = resume.projects || [];
    const experience = resume.experience || [];
    const honors = resume.honors || [];

    return `
      <div class="resume-app-container app-content" data-resume-app>
        <!-- A. Application Header -->
        <header class="resume-header-bar">
          <div class="resume-title-wrap">
            <span class="app-kicker">PERSONNEL FILE // RESUME</span>
            <h2 class="app-heading">Professional<br><em>Dossier.</em></h2>
            <p class="app-deck">Professional Profile • Experience • Technical Capabilities</p>
          </div>
          <div class="resume-status-badge-wrap">
            <button type="button" class="resume-status-tag" data-resume-status data-resume-action="status-view" title="Click to view resume PDF">
              <i class="status-dot"></i> <span data-resume-status-text>CHECKING ASSET...</span>
            </button>
          </div>
        </header>

        <!-- B. Candidate Identity Summary Panel -->
        <section class="resume-identity-card">
          <div class="identity-photo-col">
            <div class="identity-avatar-frame">
              <img src="./assets/ayush-front.png" alt="${c.fullName || 'Candidate'}" />
            </div>
            <span class="identity-role-tag">CANDIDATE // AI/ML</span>
          </div>
          <div class="identity-details-col">
            <div class="identity-name-line">
              <h3>${c.fullName || 'Ayush Vishwakarma'}</h3>
              <span class="identity-location">📍 ${c.location || 'Pune, India'}</span>
            </div>
            <p class="identity-headline">${c.headline || 'Aspiring AI/ML Engineer'}</p>
            <div class="identity-meta-grid">
              <div class="identity-meta-item">
                <small>INSTITUTION</small>
                <strong>${c.education || 'Vishwakarma University, Pune'}</strong>
              </div>
              <div class="identity-meta-item">
                <small>PROGRAMME</small>
                <strong>${c.degree || 'B.Tech – CS (AI & ML)'}</strong>
              </div>
              <div class="identity-meta-item">
                <small>ACADEMIC STANDING</small>
                <strong class="highlight-val">CGPA: ${c.cgpa || '8.6 / 10'}</strong>
              </div>
              <div class="identity-meta-item">
                <small>GRADUATION</small>
                <strong>Expected ${c.expectedGraduation || '2029'}</strong>
              </div>
            </div>
            <div class="identity-contact-row">
              <a href="mailto:${c.email}" class="identity-contact-pill">✉ ${c.email}</a>
              <a href="tel:${c.phone}" class="identity-contact-pill">📞 ${c.phone}</a>
              <a href="https://github.com/officialayush5839-arch" target="_blank" rel="noopener noreferrer" class="identity-contact-pill">💻 GitHub</a>
              <a href="https://www.linkedin.com/in/ayush-vishwakarama-7a79803ba/" target="_blank" rel="noopener noreferrer" class="identity-contact-pill">🔗 LinkedIn</a>
            </div>
          </div>
        </section>

        <!-- C. Document Metadata Strip & D. Primary Actions -->
        <section class="resume-action-bar">
          <div class="resume-file-meta">
            <span class="meta-label">DOCUMENT:</span>
            <code class="meta-filename">${resume.fileName || 'Ayush_Vishwakarma_Resume.pdf'}</code>
            <span class="meta-format">[PDF &amp; DOCX]</span>
          </div>
          <div class="resume-button-group">
            <button type="button" class="resume-btn btn-primary" data-resume-action="view">
              <span>👁 VIEW RESUME</span>
            </button>
            <button type="button" class="resume-btn btn-secondary" data-resume-action="download-docx">
              <span>⬇ DOWNLOAD RESUME (.DOCX)</span>
            </button>
            <button type="button" class="resume-btn btn-secondary" data-resume-action="download">
              <span>⬇ DOWNLOAD PDF</span>
            </button>
            <a href="${resume.fileUrl || 'assets/documents/Ayush_Vishwakarma_Resume.pdf'}" target="_blank" rel="noopener noreferrer" class="resume-btn btn-accent" data-resume-action="external-view">
              <span>↗ VIEW ORIGINAL (WEB)</span>
            </a>
            <button type="button" class="resume-btn btn-outline" data-resume-action="fullview">
              <span>⛶ OPEN FULL VIEW</span>
            </button>
          </div>
        </section>

        <!-- Notification Banner if PDF is missing or checking -->
        <div class="resume-notice-banner" data-resume-notice hidden>
          <div class="notice-icon">ℹ</div>
          <div class="notice-text">
            <strong>OFFICIAL PDF STATUS:</strong>
            <span data-notice-message>To enable direct 1-click PDF download, place your compiled PDF at <code>assets/documents/Ayush_Vishwakarma_Resume.pdf</code>. Full structured dossier is rendered below.</span>
          </div>
        </div>

        <!-- E. Embedded Viewer Shell & Structured Dossier -->
        <section class="resume-viewer-shell" data-resume-viewer-shell>
          <!-- Live PDF embed frame (hidden initially until status verified or user toggles view) -->
          <div class="resume-pdf-frame-wrapper" data-resume-frame-wrapper hidden>
            <iframe class="resume-pdf-frame" data-resume-iframe title="Ayush Vishwakarma Resume PDF Preview"></iframe>
          </div>

          <!-- Structured Recruiter Dossier (Authoritative Content) -->
          <div class="resume-structured-dossier" data-resume-dossier>
            <!-- Professional Summary -->
            <div class="dossier-section">
              <h4 class="dossier-heading"><span>01</span> PROFESSIONAL SUMMARY</h4>
              <p class="dossier-summary-text">${c.summary || ''}</p>
            </div>

            <!-- Technical Capabilities -->
            <div class="dossier-section">
              <h4 class="dossier-heading"><span>02</span> TECHNICAL CAPABILITIES & RADAR</h4>
              <div class="dossier-skills-grid">
                <div class="dossier-skill-block">
                  <small>LANGUAGES</small>
                  <div class="dossier-tag-list">
                    ${(skills.languages || []).map(l => `<span class="dossier-tag">${l}</span>`).join('')}
                  </div>
                </div>
                <div class="dossier-skill-block">
                  <small>AI / ML FRAMEWORKS</small>
                  <div class="dossier-tag-list">
                    ${(skills.frameworks || []).map(f => `<span class="dossier-tag highlight">${f}</span>`).join('')}
                  </div>
                </div>
                <div class="dossier-skill-block">
                  <small>SPECIALIZED DOMAINS</small>
                  <div class="dossier-tag-list">
                    ${(skills.domains || []).map(d => `<span class="dossier-tag domain">${d}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Flagship Systems & Projects -->
            <div class="dossier-section">
              <div class="dossier-section-head">
                <h4 class="dossier-heading"><span>03</span> FLAGSHIP PROJECTS & AI SYSTEMS</h4>
                <button type="button" class="dossier-nav-btn" data-open="projects">VIEW FULL CODE REPOSITORIES ↗</button>
              </div>
              <div class="dossier-items-list">
                ${projects.map(p => `
                  <div class="dossier-card">
                    <div class="dossier-card-title">${p.title}</div>
                    <p class="dossier-card-desc">${p.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Professional Experience -->
            <div class="dossier-section">
              <div class="dossier-section-head">
                <h4 class="dossier-heading"><span>04</span> PROFESSIONAL EXPERIENCE</h4>
                <button type="button" class="dossier-nav-btn" data-open="internships">VIEW INTERNSHIP ARCHIVE ↗</button>
              </div>
              <div class="dossier-items-list">
                ${experience.map(exp => `
                  <div class="dossier-card">
                    <div class="dossier-card-header">
                      <strong>${exp.role}</strong>
                      <span class="dossier-badge">${exp.type}</span>
                    </div>
                    <p class="dossier-card-desc">${exp.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Honors & Hackathons -->
            <div class="dossier-section">
              <div class="dossier-section-head">
                <h4 class="dossier-heading"><span>05</span> AWARDS & HONORS</h4>
                <button type="button" class="dossier-nav-btn" data-open="achievements">INSPECT VERIFIED EVIDENCE ↗</button>
              </div>
              <ul class="dossier-bullet-list">
                ${honors.map(h => `<li><strong>●</strong> <span>${h}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        </section>

        <!-- F. Recruiter Quick Navigation Bar -->
        <section class="resume-recruiter-nav">
          <div class="recruiter-nav-title">
            <span class="shield-mini">🛡️</span>
            <strong>VERIFIED CAREER EVIDENCE // CROSS-SYSTEM NAVIGATION</strong>
          </div>
          <div class="recruiter-shortcuts">
            <button type="button" class="recruiter-pill" data-open="projects">
              <span>📁</span> <strong>Projects Explorer</strong> <small>GitHub Repos</small>
            </button>
            <button type="button" class="recruiter-pill" data-open="internships">
              <span>💼</span> <strong>Internships</strong> <small>5 Verified Files</small>
            </button>
            <button type="button" class="recruiter-pill" data-open="achievements">
              <span>🏆</span> <strong>Achievements</strong> <small>Trophies & Metrics</small>
            </button>
            <button type="button" class="recruiter-pill" data-open="techstack">
              <span>⚙️</span> <strong>Tech Stack</strong> <small>Systems Radar</small>
            </button>
            <button type="button" class="recruiter-pill" data-open="research">
              <span>🔬</span> <strong>Research</strong> <small>Lab & Preprints</small>
            </button>
            <button type="button" class="recruiter-pill" data-open="contact">
              <span>✉️</span> <strong>Contact & Collaborate</strong> <small>Direct Dispatch</small>
            </button>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Checks whether the target fileUrl is reachable via network / static server
   */
  async function checkFileStatus(url) {
    if (typeof fetch === 'undefined') return false;
    try {
      const resp = await fetch(url, { method: 'HEAD' });
      return resp.ok;
    } catch {
      try {
        const resp2 = await fetch(url, { method: 'GET' });
        return resp2.ok;
      } catch {
        return false;
      }
    }
  }

  function init(container) {
    if (!container) return;
    const resume = getProfileResume();
    const fileUrl = resume.fileUrl || 'assets/documents/Ayush_Vishwakarma_Resume.pdf';
    const fileName = resume.fileName || 'Ayush_Vishwakarma_Resume.pdf';

    const statusTag = container.querySelector('[data-resume-status]');
    const statusText = container.querySelector('[data-resume-status-text]');
    const noticeBanner = container.querySelector('[data-resume-notice]');
    const frameWrapper = container.querySelector('[data-resume-frame-wrapper]');
    const iframe = container.querySelector('[data-resume-iframe]');
    const dossier = container.querySelector('[data-resume-dossier]');

    let fileAvailable = false;

    // Async check file availability
    checkFileStatus(fileUrl).then(isAvailable => {
      fileAvailable = isAvailable;
      if (statusTag && statusText) {
        if (isAvailable) {
          statusTag.className = 'resume-status-tag ready';
          statusText.textContent = 'PDF READY';
          if (iframe) iframe.src = fileUrl;
        } else {
          statusTag.className = 'resume-status-tag pending';
          statusText.textContent = 'PENDING UPLOAD';
          if (noticeBanner) noticeBanner.hidden = false;
        }
      }
    });

    // Status badge click action (clicking PDF READY opens preview)
    const statusBtn = container.querySelector('[data-resume-action="status-view"]');
    if (statusBtn) {
      statusBtn.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
        if (fileAvailable) {
          if (frameWrapper) {
            frameWrapper.hidden = false;
            if (iframe && !iframe.src) {
              iframe.src = fileUrl;
            }
            if (viewBtn) {
              const span = viewBtn.querySelector('span');
              if (span) span.textContent = '▲ HIDE PDF';
            }
            frameWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (typeof window !== 'undefined' && typeof window.toast === 'function') {
              window.toast('PDF READY', 'Displaying official resume PDF preview.');
            }
          }
        } else {
          if (noticeBanner) noticeBanner.hidden = false;
          if (dossier) dossier.scrollIntoView({ behavior: 'smooth' });
          if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast('ASSET PENDING', `Place ${fileName} in assets/documents/ to activate direct preview.`);
          }
        }
      });
    }

    // View action
    const viewBtn = container.querySelector('[data-resume-action="view"]');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
        if (fileAvailable) {
          if (frameWrapper) {
            const isHidden = frameWrapper.hidden;
            frameWrapper.hidden = !isHidden;
            if (!frameWrapper.hidden && iframe && !iframe.src) {
              iframe.src = fileUrl;
            }
            viewBtn.querySelector('span').textContent = frameWrapper.hidden ? '👁 VIEW RESUME' : '▲ HIDE PDF';
          }
        } else {
          // Scroll smoothly to dossier
          if (dossier) {
            dossier.scrollIntoView({ behavior: 'smooth' });
          }
          if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast('PERSONNEL FILE', 'Displaying authoritative structured dossier.');
          }
        }
      });
    }

    // Download action
    const downloadBtn = container.querySelector('[data-resume-action="download"]');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
        if (fileAvailable) {
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = fileName;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          a.remove();
          if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast('DOWNLOAD STARTED', `Downloading ${fileName}`);
          }
        } else {
          if (noticeBanner) noticeBanner.hidden = false;
          if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast('ASSET PENDING', `Place ${fileName} in assets/documents/ to activate direct download.`);
          }
        }
      });
    }

    // Download Word (.docx) action
    const docxUrl = resume.docxUrl || 'assets/documents/Ayush_Vishwakarma_Resume.docx';
    const docxFileName = resume.docxFileName || 'Ayush_Vishwakarma_Resume.docx';
    const downloadDocxBtn = container.querySelector('[data-resume-action="download-docx"]');
    if (downloadDocxBtn) {
      downloadDocxBtn.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
        const a = document.createElement('a');
        a.href = docxUrl;
        a.download = docxFileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
          window.toast('DOWNLOAD STARTED', `Downloading ${docxFileName}`);
        }
      });
    }

    // External view link sound hook
    const externalLink = container.querySelector('[data-resume-action="external-view"]');
    if (externalLink) {
      externalLink.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
      });
    }

    // Full view action (EvidenceViewer integration)
    const fullviewBtn = container.querySelector('[data-resume-action="fullview"]');
    if (fullviewBtn) {
      fullviewBtn.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
        if (typeof window !== 'undefined' && window.EvidenceViewer && typeof window.EvidenceViewer.open === 'function') {
          window.EvidenceViewer.open({
            id: 'resume',
            title: resume.title || 'Ayush Vishwakarma — Professional Resume',
            institution: 'Vishwakarma University, Pune',
            issuer: 'Academic & Professional Dossier',
            date: '2026',
            docType: 'CURRICULUM_VITAE',
            fileUrl: fileAvailable ? fileUrl : null,
            grade: 'CGPA 8.6 / 10'
          });
        }
      });
    }

    // Recruiter shortcut sounds
    container.querySelectorAll('[data-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.SoundEngine && typeof window.SoundEngine.click === 'function') {
          window.SoundEngine.click();
        }
      });
    });
  }

  return {
    getContent,
    init,
    checkFileStatus
  };
});
