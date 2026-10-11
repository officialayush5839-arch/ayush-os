# Eight-Pillar Application Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the complete 8-pillar application suite for AYUSH.OS with strict evidence integrity, a central alias registry, a shared evidence modal viewer, and a validated contact backend.

**Architecture:** Each of the 8 pillars lives as an isolated module in `js/apps/` rendering inside AYUSH.OS draggable, resizable windows. A central `AppRegistry` resolves canonical IDs and legacy aliases. A shared `EvidenceViewer` modal handles document inspection, and `/api/contact` handles message validation.

**Tech Stack:** Vanilla JavaScript (ES6+), Express.js backend, HTML5/CSS3 desktop OS interface, Node.js test runner (`node:test`).

**Spec:** [`docs/superpowers/specs/2026-10-11-eight-pillar-apps-suite-design.md`](file:///c:/Users/ARYAN%20-%20AYUSH/OneDrive/Desktop/p%20antigravity/docs/superpowers/specs/2026-10-11-eight-pillar-apps-suite-design.md)

## Global Constraints
- Zero fabrication of credentials, rankings, or metrics.
- Every claim must have an authentic verification ID, certificate image, or explicit `unverified` / `not_provided` state.
- Preserve existing working applications (`projects-explorer.js`, `internships-app.js`) and all backend APIs.
- Existing legacy triggers (`data-open="revenue"`, `data-open="process"`, etc.) must resolve without 404s or errors.
- All 19 existing tests in `tests/*.test.js` must continue to pass 100%.

## Review Focus
1. Legacy alias resolution returns null or throws on undefined app IDs &rarr; Test with unknown/empty IDs.
2. Missing certificate image or PDF in evidence viewer throws error &rarr; Test fallback state and placeholder handling.
3. Contact form submitted with empty or invalid email &rarr; Test 400 validation on `/api/contact`.
4. Rapid double-clicking on desktop icons creates duplicate windows &rarr; Test window singleton focus behavior.
5. Window close leaves orphaned modal backdrops or audio loops &rarr; Test clean unmounting.

---

### Task 1: Central App Registry & Alias Resolver
**Files:**
- Create: `js/app-registry.js`
- Test: `tests/app-registry.test.js`

**Interfaces:**
- Produces: `window.AppRegistry = { resolve(id): AppConfig, getAll(): AppConfig[], isKnown(id): boolean }`

- [ ] **Step 1: Write failing test in `tests/app-registry.test.js`**
- [ ] **Step 2: Run test to verify it fails (`node --test tests/app-registry.test.js`)**
- [ ] **Step 3: Implement `js/app-registry.js` with canonical IDs and alias mappings (`revenue` &rarr; `achievements`, `process` &rarr; `techstack`, etc.)**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 2: Shared Evidence & Document Viewer Modal
**Files:**
- Create: `js/evidence-viewer.js`
- Modify: `index.html` (include script & modal container)
- Modify: `styles.css` (evidence modal styling)
- Test: `tests/evidence-viewer.test.js`

**Interfaces:**
- Produces: `window.EvidenceViewer = { open(docConfig): void, close(): void, isOpen(): boolean }`

- [ ] **Step 1: Write failing test in `tests/evidence-viewer.test.js`**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/evidence-viewer.js` with image zoom, verification code display, and accessible close (`ESC` key, backdrop click)**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 3: Data Integrity Layer & Profile Schemas
**Files:**
- Modify: `js/data.js`
- Test: `tests/data-integrity.test.js`

**Interfaces:**
- Produces: `window.ownerProfile.achievements`, `window.ownerProfile.techStack`, `window.ownerProfile.research`, `window.ownerProfile.certifications`, `window.ownerProfile.journey`

- [ ] **Step 1: Write test verifying schema types and authentic fields without fabrication**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Add authentic verified records for achievements, tech stack tiers, research topics, and certifications to `js/data.js`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 4: Achievements & Results Application (`achievements`)
**Files:**
- Create: `js/apps/achievements-app.js`
- Test: `tests/achievements-app.test.js`

**Interfaces:**
- Produces: `window.AchievementsApp = { getContent(): string, init(container): void }`
- Consumes: `window.ownerProfile.achievements`, `window.EvidenceViewer`

- [ ] **Step 1: Write failing test verifying HTML output and podium finish cards**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/apps/achievements-app.js` featuring VU NSD 1st, Binghamton Game Jam, AWS IIT Kanpur, Eightfold.ai, and model benchmarks**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 5: Tech Stack & Systems Application (`techstack`)
**Files:**
- Create: `js/apps/techstack-app.js`
- Test: `tests/techstack-app.test.js`

**Interfaces:**
- Produces: `window.TechStackApp = { getContent(): string, init(container): void }`
- Consumes: `window.ownerProfile.techStack`

- [ ] **Step 1: Write failing test verifying proficiency tiers and interactive architecture nodes**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/apps/techstack-app.js` with Core/Production-Ready, Proficient, and Familiar filters + interactive pipeline**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 6: Research & Publications Application (`research`)
**Files:**
- Create: `js/apps/research-app.js`
- Test: `tests/research-app.test.js`

**Interfaces:**
- Produces: `window.ResearchApp = { getContent(): string, init(container): void }`
- Consumes: `window.ownerProfile.research`

- [ ] **Step 1: Write failing test verifying formal research states and methodology blocks**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/apps/research-app.js` distinguishing `WORK_IN_PROGRESS` from published works with reproducible metrics**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 7: Certifications & Learning Application (`certifications`)
**Files:**
- Create: `js/apps/certifications-app.js`
- Test: `tests/certifications-app.test.js`

**Interfaces:**
- Produces: `window.CertificationsApp = { getContent(): string, init(container): void }`
- Consumes: `window.ownerProfile.certifications`, `window.EvidenceViewer`

- [ ] **Step 1: Write failing test verifying 6 authentic credential cards and verification codes**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/apps/certifications-app.js` with direct evidence modal triggers for Deloitte, Goldman Sachs, Comtech, MIT-WPU, Binghamton/VU**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 8: Journey & Story Application (`journey`)
**Files:**
- Create: `js/apps/journey-app.js`
- Test: `tests/journey-app.test.js`

**Interfaces:**
- Produces: `window.JourneyApp = { getContent(): string, init(container): void }`
- Consumes: `window.ownerProfile.journey`

- [ ] **Step 1: Write failing test verifying chronological timeline elements**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/apps/journey-app.js` with visual timeline milestones from 2023 to 2026 + Next Horizon**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 9: Contact & Collaborate Application + Verified Backend
**Files:**
- Create: `js/apps/contact-app.js`
- Modify: `backend/routes.js` (add validated `/api/contact` endpoint)
- Test: `tests/contact.test.js`

**Interfaces:**
- Produces: `POST /api/contact`, `window.ContactApp = { getContent(): string, init(container): void }`

- [ ] **Step 1: Write failing test for `/api/contact` validation (reject invalid email, accept valid submission)**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement backend contact handler in `backend/routes.js` and frontend form with intent selector in `js/apps/contact-app.js`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 10: Desktop Grid & Responsive Dock Integration
**Files:**
- Modify: `index.html` (reconfigure desktop grid and dock to exactly 8 apps + script tags)
- Modify: `app.js` (integrate AppRegistry, window spawning, and alias routing)
- Modify: `styles.css` (uncluttered desktop grid and responsive dock styling)
- Test: `tests/e2e-desktop.test.js`

**Interfaces:**
- Unifies: All 8 applications with draggable windows, dock magnification, command palette search, and alias fallbacks.

- [ ] **Step 1: Write e2e test checking that all 8 desktop icons and dock triggers resolve cleanly**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Update `index.html`, `app.js`, and `styles.css`**
- [ ] **Step 4: Run full test suite (`npm test`) and verify all tests pass 100%**
