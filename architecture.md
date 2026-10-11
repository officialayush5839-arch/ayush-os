# Architecture: Projects Application (GitHub Dynamic Source of Truth)

## Overview
The Projects application inside AYUSH.OS is an operating-system-grade Project File Explorer and README viewer. It fetches live repository data directly from GitHub via a dedicated, secure backend service (`server.js`).

## Security Architecture
- **Zero Token Leakage**: No GitHub App private keys, Personal Access Tokens, or OAuth client secrets are ever sent to the browser or stored in frontend code, localStorage, or query params.
- **GitHub App & Installation Flow**: The backend handles GitHub App JWT creation, installation token generation, and OAuth callbacks.
- **Repository Access Scopes**: Minimal permissions (`contents: read`, `metadata: read`).
- **Private Repository Protection**: Private repository endpoints (`/api/projects/:id`, `/api/projects/:id/readme`, `/api/projects/:id/file`) verify installation authorization before returning data.

## Backend Architecture (`server.js` on port 3000 / proxy)
- `GET /api/github/status`: Returns `{ connected: boolean, privateAccess: boolean, account: string, installationsCount: number }`
- `GET /api/github/auth`: Initiates GitHub App installation / authorization redirect URL.
- `GET /api/github/callback`: Receives GitHub authorization/installation code, exchanges and stores installation ID securely.
- `POST /api/github/disconnect`: Clears stored authorization and session tokens.
- `GET /api/projects`: Returns normalized list of projects (all public repos, plus private repos if authorized).
- `GET /api/projects/:id`: Returns normalized single project metadata.
- `GET /api/projects/:id/readme`: Retrieves `README.md`, decodes base64 content, resolves relative image paths against GitHub raw URLs, returns sanitized Markdown & HTML.
- `GET /api/projects/:id/file?path=...`: Safely proxies repository files/images (especially for private repos).
- `GET /api/projects/:id/image`: Serves cached visual project artwork (repo image -> readme hero -> generated SVG/canvas fallback).
- `POST /api/projects/refresh`: Invalidates memory/file cache and re-fetches from GitHub.

## Caching Strategy
- In-memory & disk cache (`.cache/projects.json`, `.cache/readmes/`, `.cache/images/`).
- Cache key: `repoId + pushedAt + defaultBranch`.
- ETag / conditional requests used with GitHub API to minimize rate limits.

## Frontend UI Architecture
- **Retro OS File Explorer**: Retro titlebar, breadcrumb navigation, search bar, topic/language filter chips.
- **Project Items**: Real repository names, descriptions, languages, topics, visibility badge (PUBLIC / PRIVATE), and deterministic visual covers.
- **README Viewer**: Clicking a project name navigates into the project view, fetches `/api/projects/:id/readme`, renders sanitized GitHub Markdown with tables, code blocks, and resolved image links.
- **OS States**: CONNECT GITHUB screen, loading progress bar (`PROJECTS.EXE`), empty states, and offline/error states.
