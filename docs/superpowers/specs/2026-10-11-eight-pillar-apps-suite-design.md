# AYUSH.OS — Eight-Pillar Application Suite Specification

**Document Version:** 1.0.0  
**Date:** 2026-10-11  
**Status:** Approved with Revisions  
**Target:** AYUSH.OS Personal AI Operating System  

---

## 1. Executive Summary & Objective

This specification details the comprehensive transition of AYUSH.OS into an authentic, production-grade 8-pillar operating system architecture:
1. **Projects Explorer** (`projects`) — Verified GitHub App integration, README viewer, public & private repos.
2. **Internships Archive** (`internships`) — Document-driven career experience archive with original PDFs/images.
3. **Achievements & Results** (`achievements`) — Hackathons, competitions, academic honors, verified model evaluation metrics, and documentary proof.
4. **Tech Stack & Systems** (`techstack`) — Proficiency-categorized engineering tools (Production-Ready, Proficient, Familiar) with interactive systems pipeline visualizer.
5. **Research & Publications** (`research`) — Scholarly portal with formal state tracking (`WORK_IN_PROGRESS`, `SUBMITTED`, `UNDER_REVIEW`, `PREPRINT`, `PUBLISHED`), experimental datasets, and reproducible metrics.
6. **Certifications & Learning** (`certifications`) — Verified professional credentials (Deloitte, Goldman Sachs, Comtech, MIT-WPU, Binghamton/VU) with stable credential verification IDs.
7. **Journey & Story** (`journey`) — Authentic visual career timeline from 2023 fundamentals to 2026 intelligence systems and next horizon.
8. **Contact & Collaborate** (`contact`) — Functional, validated inquiry dispatcher with dedicated intents for research, internships, and engineering contracts.

---

## 2. Core Policies & Non-Negotiable Constraints

### 2.1 Strict Evidence & Data Integrity Policy
- **Zero Fabrication**: No unverified star counts, false awards, phantom publications, or fabricated credentials.
- **Explicit States**: Every entity without complete documentary proof must explicitly carry status `unverified` or `not_provided`.
- **Proof Traceability**: Every claim (award rank, metric, date, issuer) must link to a stable evidence asset ID or public verification URL.
- **Research Transparency**: Engineering projects must never be masqueraded as peer-reviewed papers. Research status must be rigorously differentiated:
  - `WORK_IN_PROGRESS`: Active exploratory or lab implementation.
  - `SUBMITTED`: Manuscript delivered to an editorial board/track.
  - `UNDER_REVIEW`: In active peer review.
  - `PREPRINT`: Accessible on open archives (e.g. arXiv).
  - `PUBLISHED`: Accepted and published in conference proceedings or journal.

### 2.2 Backward Compatibility & Central Alias Registry
- Central registry (`AppRegistry`) defines canonical IDs, titles, icons, and aliases.
- Old triggers (`data-open="revenue"`, `data-open="process"`, `data-open="testimonials"`, `data-open="learn"`, etc.) resolve deterministically via alias lookup.
- Search palette commands, keyboard shortcuts, window restore logic, and bookmarks preserve full compatibility without orphaned routes.

### 2.3 Modular Data Contract
- `js/data.js` remains clean and typed, maintaining its canonical export contract `window.ownerProfile`.
- Large binary/document assets are decoupled into stable document records identified by `docId` in an evidence store (`js/evidence-store.js` or `backend/data/`).
- Schemas strictly separate metadata from heavy text/blobs.

---

## 3. System Architecture

```mermaid
flowchart TD
    subgraph UI_Shell [AYUSH.OS Desktop Shell]
        DesktopGrid[Desktop Grid - 8 Primary Icons]
        DockBar[Responsive Dock - Touch/Keyboard/Scroll]
        CommandPalette[Search / Command Palette]
        WindowManager[Draggable / Stackable Window Manager]
    end

    subgraph App_Registry [Central App Registry & Alias Resolver]
        Registry[AppRegistry.resolve(id)]
    end

    subgraph Core_Apps [8 Dedicated Applications js/apps/]
        A1[1. projects-explorer.js]
        A2[2. internships-app.js]
        A3[3. achievements-app.js]
        A4[4. techstack-app.js]
        A5[5. research-app.js]
        A6[6. certifications-app.js]
        A7[7. journey-app.js]
        A8[8. contact-app.js]
    end

    subgraph Shared_Infrastructure [Shared Infrastructure]
        SharedViewer[Shared Evidence & Document Viewer Modal]
        SoundEngine[Web Audio Procedural Sound Engine]
        BackendAPI[Express Backend: Port 2903]
    end

    DesktopGrid -->|data-open| Registry
    DockBar -->|data-open| Registry
    CommandPalette -->|data-open| Registry
    Registry --> WindowManager
    WindowManager --> A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8
    A2 & A3 & A6 --> SharedViewer
    A1 & A2 & A8 --> BackendAPI
```

---

## 4. Component Details & Application Specifications

### 4.1 Application 1: Projects Explorer (`projects`)
- **Module**: `js/apps/projects-explorer.js` (Preserved and maintained).
- **Features**: Live GitHub App authorization, private repo toggle, README viewer with KaTeX/Markdown formatting, project search, technology tags, and reproducible model metrics.
- **Backend Service**: `backend/githubService.js`, `/api/projects`, `/api/projects/:id/readme`.

### 4.2 Application 2: Internships Archive (`internships`)
- **Module**: `js/apps/internships-app.js` (Preserved and maintained).
- **Features**: 5 verified career records (NullClass, VaultofCodes, Cognifyz, etc.), chronological timeline, company dossiers, skills gained, and direct offer/completion document inspection.
- **Backend Service**: `backend/internshipsService.js`, `/api/internships`, `/api/internships/documents/:docId`.

### 4.3 Application 3: Achievements & Results (`achievements`)
- **Module**: `js/apps/achievements-app.js` (New module).
- **Aliases**: `revenue`, `results`, `testimonials`, `proof`, `trophies`.
- **Authentic Verified Records**:
  1. **1st Prize** — *NSD Hackathon*, Vishwakarma University (VU, Pune).
  2. **Third Prize** — *NextGen Game Jam 2K26*, Game Development Hackathon, Faculty of Science & Technology (VU, Pune) in collaboration with Thomas J. Watson College of Engineering and Applied Science, Binghamton University, New York, USA. (Evidence: Certificate signed by Prof. Kailas Patil & Prof. Michael Testani).
  3. **2nd Place** — *AWS Hackathon*, IIT Kanpur.
  4. **Top 5 Finalist** — *Eightfold.ai National Hackathon*, IIT Kanpur.
  5. **Model Evaluation Results**: INTELLIEMO emotion intelligence benchmarks (90.0% Anger precision, 89.5% Fear F1), SkyGuard real-time telemetry inference (<1s).
- **Shared Evidence Integration**: One-click inspection of original certificates/scores using the Shared Document Viewer.

### 4.4 Application 4: Tech Stack & Systems (`techstack`)
- **Module**: `js/apps/techstack-app.js` (New module).
- **Aliases**: `systems`, `process`, `stack`, `skills`.
- **Proficiency Tiers**:
  - **Tier 1: Core / Production-Ready**: Python, PyTorch, FastAPI, OpenCV, REST APIs, Git. (Used in shipped, end-to-end architectures).
  - **Tier 2: Proficient / Actively Building**: TypeScript, React, Node.js, Express, Docker, YOLO, NLP Token Attribution. (Regularly applied in daily development).
  - **Tier 3: Familiar / Exploring**: C/C++, Time-Series Telemetry, AWS, IoT Hardware Sensors, SQL. (Used in labs, prototypes, or coursework).
- **Architecture Pipeline**: Interactive visualizer mapping data ingestion &rarr; preprocessing &rarr; PyTorch/ML inference &rarr; FastAPI service layer &rarr; reactive OS interface.

### 4.5 Application 5: Research & Publications (`research`)
- **Module**: `js/apps/research-app.js` (New module).
- **Aliases**: `papers`, `publications`, `lab`.
- **Scholarly Focus**:
  - Focus Area 1: *Explainable Emotion Intelligence & Token-Drop Attribution in Transformer Models* (Active experimental framework backing INTELLIEMO).
  - Focus Area 2: *Edge Telemetry Anomaly Detection & Sensor Health for Weather Stations* (Backing SkyGuard AI).
  - Focus Area 3: *Real-Time Spatial Occupancy Mapping via Computer Vision* (Backing Parking Assist).
- **State Labels**: Explicit differentiation between `WORK_IN_PROGRESS`, `SUBMITTED`, `UNDER_REVIEW`, `PREPRINT`, and `PUBLISHED`.
- **Experimental Rigor**: Each entry details Research Question, Methodology, Dataset/Telemetry used, Evaluation Metrics, and GitHub reproduction repository.

### 4.6 Application 6: Certifications & Learning (`certifications`)
- **Module**: `js/apps/certifications-app.js` (New module).
- **Aliases**: `learn`, `education`, `courses`.
- **Authentic Credentials Catalog**:
  1. *Deloitte Data Analytics Job Simulation* — Issued by Forage (Aug 2026), Practical tasks in Data Analysis & Forensic Technology, Verification Code: `6a72e8c586066446594f9e49`.
  2. *Goldman Sachs Operations Job Simulation* — Issued by Forage (Aug 2026), Practical tasks in Operations & Ultra-High Net Worth Transactions, Verification Code: `6a730a28125ca4556e14d0a6`.
  3. *Comtech Computer Institute: MS.OFFICE* — Grade A (May–Jul 2023), Certificate No: `CMT.500/2025`.
  4. *Comtech Computer Institute: TALLY ERP.9* — Grade A (Jul–Sep 2023), Certificate No: `CMT.500/2025`.
  5. *MIT World Peace University (MIT-WPU)* — Vishwanova 2026 National Level Project Competition (Entropy Vanguard).
  6. *Vishwakarma University × Binghamton University (USA)* — NextGen Game Jam 2K26 Certificate of Excellence (Third Prize).
- **Shared Evidence Integration**: Live modal preview of certificate scans with full document zoom, metadata verification, and issuer details.

### 4.7 Application 7: Journey & Story (`journey`)
- **Module**: `js/apps/journey-app.js` (New module).
- **Aliases**: `about`, `story`, `bio`.
- **Visual Career Timeline**:
  - **2023**: Engineering fundamentals (Python, OOP, web systems) + Early technical certifications.
  - **2024**: Deep exploration of AI/ML, computer vision pipelines, and deep neural architectures.
  - **2025**: Formal Computer Science education at Vishwakarma University (VU, Pune); full-stack microservices & IoT telemetry.
  - **2026**: Podiums at national hackathons, production explainable AI platforms (INTELLIEMO, SkyGuard), corporate industry simulations, and professional internships.
  - **Next Horizon**: Autonomous agentic reasoning, edge computer vision architectures, and research collaborations.

### 4.8 Application 8: Contact & Collaborate (`contact`)
- **Module**: `js/apps/contact-app.js` (New module).
- **Aliases**: `collaborate`, `messages`, `inbox`.
- **Verified Communication Channels**:
  - Email: `officialayush5839@gmail.com`
  - GitHub: `https://github.com/officialayush5839-arch`
  - LinkedIn: `https://www.linkedin.com/in/ayush-vishwakarama-7a79803ba/`
- **Collaboration Intent Selector**:
  - `RESEARCH`: Co-authoring, experimental replication, lab inquiry.
  - `INTERNSHIP`: Full-time / internship engineering opportunities.
  - `PROJECT`: Production systems architecture or contract work.
  - `GENERAL`: General technical inquiry.
- **Backend Transmission**: Validated POST `/api/contact` endpoint with CSRF protection, input sanitation, local persistence/file dispatch, and user feedback toast (no silent discard).

---

## 5. Shared Infrastructure & Design Improvements

### 5.1 Shared Evidence & Document Viewer Modal
- Implemented as a reusable singleton: `window.EvidenceViewer.open({ title, docType, issuer, date, fileUrl, verificationCode, notes })`.
- Supports image zoom/pan, PDF rendering fallback, download, and copy verification code.
- Eliminates duplicate modal logic across Internships, Achievements, and Certifications.

### 5.2 Central Alias Registry (`js/app-registry.js`)
```javascript
const APP_REGISTRY = {
  projects: { id: 'projects', title: 'Projects Explorer', module: 'ProjectsExplorer', icon: './assets/icons-v4/projects.png' },
  internships: { id: 'internships', title: 'Internships Archive', module: 'InternshipsApp', icon: './assets/icons-v4/internships.png' },
  achievements: { id: 'achievements', title: 'Achievements & Results', module: 'AchievementsApp', icon: './assets/icons-v4/revenue.png', aliases: ['revenue', 'results', 'testimonials', 'proof'] },
  techstack: { id: 'techstack', title: 'Tech Stack & Systems', module: 'TechStackApp', icon: './assets/icons-v4/systems.png', aliases: ['systems', 'process', 'stack'] },
  research: { id: 'research', title: 'Research & Publications', module: 'ResearchApp', icon: './assets/icons-v4/browser.png', aliases: ['papers', 'lab'] },
  certifications: { id: 'certifications', title: 'Certifications & Learning', module: 'CertificationsApp', icon: './assets/icons-v4/learn.svg', aliases: ['learn', 'education'] },
  journey: { id: 'journey', title: 'Journey & Story', module: 'JourneyApp', icon: './assets/icons-v4/journey.png', aliases: ['about', 'story'] },
  contact: { id: 'contact', title: 'Contact & Collaborate', module: 'ContactApp', icon: './assets/icons-v4/contact.png', aliases: ['collaborate', 'messages'] }
};
```

### 5.3 Responsive Dock & Desktop Layout
- Desktop displays exactly the 8 primary icons in an uncluttered retro-computing desktop layout.
- Dock provides touch scroll and overflow protection on mobile/narrow viewports while preserving Mac-style magnification and active-app dot indicators.

---

## 6. Comprehensive Test & Verification Plan

1. **Alias Resolution Tests**: Verify every legacy ID (`revenue`, `process`, `learn`, etc.) maps to its target application without 404s or unhandled exceptions.
2. **Window Lifecycle Tests**: Verify all 8 apps can open, minimize, maximize, bring to front, cascade, and cleanly close without memory/DOM leaks.
3. **Data Integrity Tests**: Unit test `data.js` and evidence records to ensure 100% of claims match authentic certificates with zero fabricated fields.
4. **Shared Viewer Tests**: Verify evidence modal correctly renders both PNG/JPG images and verification badges.
5. **Contact Dispatch Tests**: Verify `/api/contact` validates incoming email, rejects spam/malformed payloads, and returns 200 with persistent confirmation.
6. **Responsive & Accessibility Tests**: Keyboard `Tab` / `ESC` navigation, screen-reader aria labels, and mobile dock overflow check.
