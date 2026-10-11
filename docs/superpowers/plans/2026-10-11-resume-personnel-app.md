# Resume / Personnel File Application Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a recruiter-friendly, fully functional Resume / Personnel File application (`resume`) into AYUSH.OS with embedded PDF preview, secure download, recruiter navigation shortcuts, desktop/dock icons, and full backward compatibility.

**Architecture:** The Resume application lives as an isolated module in `js/apps/resume-app.js`, configured via `window.ownerProfile.resume` in `js/data.js`, registered in `AppRegistry` (with aliases `cv`, `personnel`, `profile-file`), rendered in AYUSH.OS draggable/resizable window chrome, with full-view inspection linked to `EvidenceViewer`.

**Tech Stack:** Vanilla JavaScript (ES6+ / UMD), HTML5, CSS3 with AYUSH.OS retro-computing design tokens, Node.js test runner (`node --test`).

**Spec:** Prompt instructions for AYUSH.OS — RESUME / PERSONNEL FILE APPLICATION.

## Global Constraints
- Zero tokens/keys in client code, DOM, or localStorage.
- Authoritative document integrity: zero fabrication, authentic profile data.
- Never crash when resume PDF is not yet placed on disk; provide informative fallback and guidance.
- Adhere strictly to existing AYUSH.OS color palette and window manager conventions.
- Maintain existing 54 passing tests without regressions.

## Review Focus
1. `AppRegistry.resolve('resume')`, `AppRegistry.resolve('cv')`, `AppRegistry.resolve('personnel')`, `AppRegistry.resolve('profile-file')` must resolve correctly without altering `AppRegistry.getAll().length === 8`.
2. When the PDF file is absent from disk, the application must display a clear `PENDING UPLOAD` status and structured recruiter dossier rather than broken iframe or false download confirmation.
3. When the PDF is present, embedded preview iframe loads and download button triggers download of the exact file with clean filename `Ayush_Vishwakarma_Resume.pdf`.
4. Recruiter shortcuts (`data-open="projects"`, `internships`, `achievements`, `techstack`, `research`, `contact`) must work through existing OS navigation.
5. Desktop icon and dock icon in `index.html` open the Resume window cleanly with correct active indicator.

---

### Task 1: Resume Data Schema & Configuration in `js/data.js`

**Files:**
- Modify: `js/data.js`
- Test: `tests/resume-app.test.js`

**Interfaces:**
- Produces: `window.ownerProfile.resume` object containing file metadata, candidate summary, verified skills, experience, and hackathons.

- [ ] **Step 1: Write failing test in `tests/resume-app.test.js` for data schema**
- [ ] **Step 2: Run test to verify it fails (`node --test tests/resume-app.test.js`)**
- [ ] **Step 3: Add `resume` configuration to `window.ownerProfile` in `js/data.js`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 2: Application Registration & Aliases in `js/app-registry.js`

**Files:**
- Modify: `js/app-registry.js`
- Test: `tests/resume-app.test.js` and `tests/app-registry.test.js`

**Interfaces:**
- Produces: `AppRegistry.resolve('resume')`, `AppRegistry.resolve('cv')`, `AppRegistry.resolve('personnel')`, `AppRegistry.resolve('profile-file')`.
- Preserves: `AppRegistry.getAll()` returning the 8 canonical pillar apps for backward test compatibility.

- [ ] **Step 1: Write failing test in `tests/resume-app.test.js` for app registration and alias resolution**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Update `js/app-registry.js` to register `resume` and its aliases**
- [ ] **Step 4: Run tests to verify all pass (`node --test tests/app-registry.test.js tests/resume-app.test.js`)**

---

### Task 3: Resume Application Module `js/apps/resume-app.js`

**Files:**
- Create: `js/apps/resume-app.js`
- Test: `tests/resume-app.test.js`

**Interfaces:**
- Produces: `window.ResumeApp = { getContent(), init(container), checkFileStatus(url) }`

- [ ] **Step 1: Write failing test in `tests/resume-app.test.js` for ResumeApp interface and content**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/apps/resume-app.js` with header, identity panel, actions, embedded viewer / structured dossier, and recruiter shortcuts**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 4: Window Manager Integration & App Wiring in `app.js`

**Files:**
- Modify: `app.js`
- Test: `tests/resume-app.test.js`

**Interfaces:**
- Consumes: `window.ResumeApp`, `AppRegistry`
- Produces: `apps.resume` window definition with title `AYUSH.OS // PERSONNEL FILE` and chrome `#ffd95a`.

- [ ] **Step 1: Write failing test for `apps.resume` window registration in `tests/resume-app.test.js`**
- [ ] **Step 2: Update `app.js` with `apps.resume` entry and container init call**
- [ ] **Step 3: Run test to verify it passes**

---

### Task 5: Desktop Icon & Dock Shortcut in `index.html`

**Files:**
- Modify: `index.html`
- Test: `tests/resume-app.test.js` and `tests/e2e-desktop.test.js`

**Interfaces:**
- Produces: Desktop shortcut `<button class="desktop-app" data-open="resume">` and Dock item `<button data-open="resume">`. Includes `<script src="./js/apps/resume-app.js">`.

- [ ] **Step 1: Write failing test checking for script tag, desktop icon, and dock item in `tests/resume-app.test.js`**
- [ ] **Step 2: Update `index.html` with script tag, desktop app icon, and dock shortcut**
- [ ] **Step 3: Run all tests to verify (`npm test`)**

---

### Task 6: Visual Styling in `styles/portfolio-apps.css`

**Files:**
- Modify: `styles/portfolio-apps.css`
- Test: Manual visual check + test suite syntax/palette verification

**Interfaces:**
- Produces: `.resume-app-container`, `.resume-header-bar`, `.resume-identity-card`, `.resume-action-bar`, `.resume-preview-shell`, `.resume-recruiter-nav` with retro OS theme tokens.

- [ ] **Step 1: Add responsive styles for Resume application to `styles/portfolio-apps.css`**
- [ ] **Step 2: Verify styling and accessibility in live browser (`http://localhost:2903`)**

---

### Task 7: Full Suite Verification & Document Validation

**Files:**
- Test: `npm test`
- Verification: End-to-end checks of live server at `http://localhost:2903`

- [ ] **Step 1: Execute `npm test` and verify 100% pass across all test suites**
- [ ] **Step 2: Verify desktop icon opens Resume window, recruiter shortcuts work, EvidenceViewer modal opens**
- [ ] **Step 3: Report deliverables, paths, and instructions**
