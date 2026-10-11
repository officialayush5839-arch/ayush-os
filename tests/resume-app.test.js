const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Mock browser window before loading modules
global.window = {};
require('../js/data');
const AppRegistry = require('../js/app-registry');

test('Task 1: ownerProfile.resume data schema contains authentic candidate resume data', () => {
  const resume = window.ownerProfile.resume;
  assert.ok(resume, 'ownerProfile.resume must be defined');
  assert.strictEqual(resume.id, 'resume');
  assert.strictEqual(resume.fileName, 'Ayush_Vishwakarma_Resume.pdf');
  assert.strictEqual(resume.fileUrl, 'assets/documents/Ayush_Vishwakarma_Resume.pdf');
  assert.strictEqual(resume.mimeType, 'application/pdf');
  assert.strictEqual(resume.format, 'PDF');

  assert.ok(resume.candidate, 'resume.candidate must be defined');
  assert.strictEqual(resume.candidate.fullName, 'Ayush Vishwakarma');
  assert.ok(resume.candidate.degree.includes('Computer Science'));
  assert.ok(resume.candidate.education.includes('Vishwakarma University'));
  assert.strictEqual(resume.candidate.cgpa, '8.6 / 10');
  assert.strictEqual(resume.candidate.expectedGraduation, '2029');
  assert.strictEqual(resume.candidate.phone, '+91 8983233911');

  assert.ok(Array.isArray(resume.skills.languages), 'skills.languages must be array');
  assert.ok(resume.skills.languages.includes('Python'));
  assert.ok(resume.skills.frameworks.includes('TensorFlow'));
  assert.ok(resume.skills.frameworks.includes('PyTorch'));

  assert.ok(Array.isArray(resume.experience), 'experience must be array');
  assert.ok(resume.experience[0].role.includes('Production Manager'));

  assert.ok(Array.isArray(resume.honors), 'honors must be array');
  assert.ok(resume.honors.some(h => h.includes('IIT Kanpur')));
});

test('Task 2: AppRegistry resolves canonical resume app and backward-compatible aliases', () => {
  const resumeApp = AppRegistry.resolve('resume');
  assert.ok(resumeApp, 'AppRegistry must resolve resume');
  assert.strictEqual(resumeApp.id, 'resume');
  assert.strictEqual(resumeApp.title, 'AYUSH.OS // PERSONNEL FILE');
  assert.strictEqual(resumeApp.badge, 'PERSONNEL FILE');

  // Backward compatible aliases
  assert.strictEqual(AppRegistry.resolve('cv').id, 'resume');
  assert.strictEqual(AppRegistry.resolve('personnel').id, 'resume');
  assert.strictEqual(AppRegistry.resolve('profile-file').id, 'resume');

  // Canonical 8 pillars remain for getAll()
  assert.strictEqual(AppRegistry.getAll().length, 8);
  assert.strictEqual(AppRegistry.isKnown('resume'), true);
  assert.strictEqual(AppRegistry.isKnown('cv'), true);
});

test('Task 3: ResumeApp module exports required methods and renders authentic recruiter file', () => {
  const ResumeApp = require('../js/apps/resume-app');
  assert.ok(ResumeApp, 'ResumeApp must be exported');
  assert.strictEqual(typeof ResumeApp.getContent, 'function', 'getContent must be a function');
  assert.strictEqual(typeof ResumeApp.init, 'function', 'init must be a function');

  const html = ResumeApp.getContent();
  assert.ok(html.includes('PERSONNEL FILE // RESUME'), 'Must include header title');
  assert.ok(html.includes('Professional Profile • Experience • Technical Capabilities'), 'Must include subtitle');
  assert.ok(html.includes('Ayush Vishwakarma'), 'Must include candidate name');
  assert.ok(html.includes('Vishwakarma University'), 'Must include university');
  assert.ok(html.includes('8.6 / 10'), 'Must include CGPA');
  assert.ok(html.includes('Ayush_Vishwakarma_Resume.pdf'), 'Must reference canonical resume filename');

  // Primary Action triggers
  assert.ok(html.includes('data-resume-action="view"'), 'Must have View Resume button');
  assert.ok(html.includes('data-resume-action="download"'), 'Must have Download PDF button');
  assert.ok(html.includes('data-resume-action="fullview"'), 'Must have Open Full View button');

  // Recruiter Navigation shortcuts
  const recruiterApps = ['projects', 'internships', 'achievements', 'techstack', 'research', 'contact'];
  for (const appId of recruiterApps) {
    assert.ok(html.includes(`data-open="${appId}"`), `Must include recruiter shortcut data-open="${appId}"`);
  }
});

test('Task 4: app.js contains resume app window configuration', () => {
  const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  assert.ok(appJs.includes('resume:'), 'apps object must define resume');
  assert.ok(appJs.includes('AYUSH.OS // PERSONNEL FILE'), 'Window title must be AYUSH.OS // PERSONNEL FILE');
  assert.ok(appJs.includes('ResumeApp.init'), 'Must wire ResumeApp.init inside openApp');
});

test('Task 5: index.html integrates Resume desktop icon, dock button, and script tag', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(html.includes('js/apps/resume-app.js'), 'index.html must include resume-app.js script tag');
  assert.ok(html.includes('data-open="resume"'), 'index.html must include data-open="resume" trigger');
  
  // Must be in desktop app grid
  const hasDesktopIcon = html.includes('data-open="resume"') && html.includes('PERSONNEL FILE');
  assert.ok(hasDesktopIcon, 'Must have desktop icon labeled PERSONNEL FILE');

  // Must be in dock
  const hasDockIcon = /<nav class="dock"[^>]*>[\s\S]*?data-open="resume"[\s\S]*?<\/nav>/.test(html);
  assert.ok(hasDockIcon, 'Must have Resume shortcut in dock');
});

test('Task 6: ResumeApp provides download of original Word (.docx) file and external resume view', () => {
  const resume = window.ownerProfile.resume;
  assert.strictEqual(resume.docxUrl, 'assets/documents/Ayush_Vishwakarma_Resume.docx');
  assert.strictEqual(resume.docxFileName, 'Ayush_Vishwakarma_Resume.docx');

  // Verify physical files exist on disk
  const docxDiskPath = path.join(__dirname, '../', resume.docxUrl);
  const pdfDiskPath = path.join(__dirname, '../', resume.fileUrl);
  assert.ok(fs.existsSync(docxDiskPath), 'Physical Word resume file must exist on disk');
  assert.ok(fs.existsSync(pdfDiskPath), 'Physical PDF resume file must exist on disk');

  const ResumeApp = require('../js/apps/resume-app');
  const html = ResumeApp.getContent();

  // Action for downloading Word resume
  assert.ok(html.includes('data-resume-action="download-docx"'), 'Must have download-docx action button');
  assert.ok(html.includes('.DOCX'), 'Button label must mention .DOCX');

  // Action for viewing external resume in new tab / web
  assert.ok(html.includes('data-resume-action="external-view"'), 'Must have external-view action button or link');
  assert.ok(html.includes('target="_blank"'), 'External view must open in new tab (target="_blank")');
  assert.ok(html.includes('rel="noopener noreferrer"'), 'External view link must have secure rel="noopener noreferrer"');
});

test('Task 7: PDF Ready status badge is clickable and triggers PDF view', () => {
  const ResumeApp = require('../js/apps/resume-app');
  const html = ResumeApp.getContent();

  // Status badge should be an interactive button with data-resume-action="status-view"
  assert.ok(html.includes('<button type="button" class="resume-status-tag"'), 'Status badge must be an interactive button');
  assert.ok(html.includes('data-resume-action="status-view"'), 'Status badge must have status-view action hook');
});



