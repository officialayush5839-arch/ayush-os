# AYUSH.OS — Projects Application Documentation

This document explains the technical architecture, security model, and setup instructions for the **PROJECTS** application within AYUSH.OS.

---

## 1. Overview

The **Projects Application** transforms your portfolio into a dynamic operating-system file explorer and interactive README viewer. Rather than hardcoding project lists, **GitHub serves as the single source of truth** for:
- Repository discovery (Public & authorized Private repositories)
- Real-time metadata (name, description, language, topics, stars, forks, updated dates)
- Authoritative `README.md` retrieval and secure markdown rendering
- Technical project visual covers with automatic deterministic fallbacks

**Scope Rule:** Only the PROJECTS app is managed by this dynamic subsystem. All other portfolio applications (Results, Systems, Proof, Journey, Socials, AI Voice Agent, Games, Founder.txt, Whiteboard, Browser, etc.) remain untouched and intact.

---

## 2. GitHub Authentication Architecture

### Zero Client-Side Secret Leakage
- **No tokens, OAuth client secrets, or private keys are ever sent to the browser.**
- All GitHub App authentication and token exchanges occur strictly within the Node.js backend (`server.js`).
- Session information is kept in secure `httpOnly` cookies.

### Public Repository Mode (Default)
When no GitHub App authorization has been completed:
- The backend queries public repositories for the configured account (`officialayush5839-arch`).
- Visitors can browse public projects and read their full `README.md` files without logging into GitHub.
- Private repositories are safely hidden from unauthenticated visitors.

### Private Repository Mode (GitHub App Integration)
When the portfolio owner connects their GitHub App:
- The backend exchanges the installation authorization for a short-lived GitHub App Installation Access Token (valid for 1 hour, cached for 50 minutes).
- The user can select which specific repositories the App can access (All or Selected).
- The Projects Explorer automatically populates both public and authorized private repositories with real-time `[PRIVATE]` badges and access controls.

---

## 3. GitHub App Setup Guide (Manual Steps)

To enable private repository access on your live deployment:

1. **Go to GitHub App settings:**
   - Visit: [https://github.com/settings/apps/new](https://github.com/settings/apps/new)
2. **App Details:**
   - **GitHub App name:** `AYUSH-OS-Projects` (or custom name)
   - **Homepage URL:** `https://your-domain.com` (or `http://localhost:2903`)
   - **Callback URL:** `https://your-domain.com/api/github/callback` (or `http://localhost:2903/api/github/callback`)
3. **Webhook:**
   - Uncheck "Active" (webhooks are not required for read-only polling).
4. **Permissions (Minimum Required):**
   - **Repository permissions:**
     - `Contents`: **Read-only**
     - `Metadata`: **Read-only**
5. **Where can this GitHub App be installed?**
   - "Only on this account"
6. **Generate Private Key & Client Secret:**
   - In the App settings, click **Generate a private key** (downloads a `.pem` file).
   - Click **Generate a new client secret**.
7. **Configure Server Environment (`.env`):**
   ```env
   GITHUB_APP_ID=123456
   GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_CALLBACK_URL=http://localhost:2903/api/github/callback
   GITHUB_TARGET_USERNAME=officialayush5839-arch
   PORT=2903
   ```

---

## 4. API Endpoints

All endpoints are hosted on the backend server:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/github/status` | `GET` | Returns connection state and access scope without exposing credentials. |
| `/api/github/auth` | `GET` | Initiates the GitHub App installation / authorization redirect. |
| `/api/github/callback` | `GET` | Handles the OAuth / installation callback and sets secure cookies. |
| `/api/github/disconnect` | `POST` | Clears stored authorization cookies and invalidates session cache. |
| `/api/projects` | `GET` | Returns normalized list of all accessible repositories (sorted by `updated_at DESC`). |
| `/api/projects/:id` | `GET` | Returns normalized metadata for a single project. |
| `/api/projects/:id/readme` | `GET` | Fetches, decodes base64, and resolves relative image paths for the repository's `README.md`. |
| `/api/projects/file` | `GET` | Authenticated proxy for repository images and assets (prevents private asset leaks). |
| `/api/projects/:id/image` | `GET` | Returns the project visual cover (Custom -> OpenGraph -> Deterministic SVG fallback). |
| `/api/projects/refresh` | `POST` | Invalidates in-memory and disk cache to force an immediate GitHub re-fetch. |

---

## 5. Visual Project Image System

Every project displays a visual technical cover following a 4-tier hierarchy:
1. **Level 1 (Custom):** Explicit configured project cover if defined in metadata.
2. **Level 2 (OpenGraph Preview):** GitHub social preview (`opengraph.githubassets.com`).
3. **Level 3 (Deterministic SVG):** Dynamic, technical circuit-board SVG generated from the repository's real name, language, and topics.
4. **Caching:** Project images are cached using `githubId + updatedAt + version` to eliminate redundant generation.

---

## 6. Development & Testing

Run the server:
```bash
node server.js
```
Open in browser:
```
http://localhost:2903
```

Run automated verification suite:
```bash
npm test
```
All 10 tests verify normalization, image generation, README decoding, API response codes, and credential isolation.
