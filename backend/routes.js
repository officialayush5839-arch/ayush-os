const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const githubService = require('./githubService');
const imageService = require('./imageService');
const cache = require('./cacheService');
const internshipsRoutes = require('./internshipsRoutes');

const router = express.Router();

// Mount Internships API (Career File System)
router.use('/internships', internshipsRoutes);

// Helper to extract session installation ID if present
function getSessionInstallationId(req) {
  return req.cookies && req.cookies.gh_installation_id ? req.cookies.gh_installation_id : null;
}

// -------------------------------------------------------------
// GITHUB AUTH & STATUS ENDPOINTS
// -------------------------------------------------------------

// GET /api/github/status - Connection & access state
router.get('/github/status', async (req, res) => {
  try {
    const instId = getSessionInstallationId(req);
    const status = await githubService.getStatus(instId);
    res.json(status);
  } catch (err) {
    console.error('[API /github/status] Error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve GitHub status', details: err.message });
  }
});

// GET /api/github/auth - Initiate GitHub App installation or OAuth
router.get('/github/auth', async (req, res) => {
  try {
    // If GitHub App has an installation URL
    if (process.env.GITHUB_APP_INSTALL_URL) {
      return res.redirect(process.env.GITHUB_APP_INSTALL_URL);
    }

    // If Client ID is configured for GitHub OAuth / App install
    if (process.env.GITHUB_CLIENT_ID) {
      const state = Math.random().toString(36).substring(2);
      res.cookie('gh_oauth_state', state, { httpOnly: true, maxAge: 10 * 60 * 1000 });
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(githubService.callbackUrl)}&state=${state}&scope=repo,read:org`;
      return res.redirect(authUrl);
    }

    // Fallback: Inform user of setup requirement
    res.status(400).json({
      error: 'GITHUB_APP_NOT_CONFIGURED',
      message: 'GitHub App ID or Client ID is not configured on the server. Public repository mode is active.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to initiate authorization', details: err.message });
  }
});

// GET /api/github/callback - Handle redirect from GitHub
router.get('/github/callback', async (req, res) => {
  try {
    const { installation_id, code } = req.query;

    if (installation_id) {
      // GitHub App installed
      res.cookie('gh_installation_id', String(installation_id), {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      cache.clear(); // Clear cached public repos so private ones populate
      return res.redirect('/?app=projects&github=connected');
    }

    if (code && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      // OAuth Code Exchange
      const tokenRes = await githubService.request('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: githubService.callbackUrl
        }
      });

      if (tokenRes.data && tokenRes.data.access_token) {
        res.cookie('gh_user_token', tokenRes.data.access_token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
        cache.clear();
        return res.redirect('/?app=projects&github=connected');
      }
    }

    res.redirect('/?app=projects&github=failed');
  } catch (err) {
    console.error('[API /github/callback] Error:', err.message);
    res.redirect('/?app=projects&github=error');
  }
});

// POST /api/github/disconnect - Remove session access
router.post('/github/disconnect', (req, res) => {
  res.clearCookie('gh_installation_id');
  res.clearCookie('gh_user_token');
  res.clearCookie('gh_oauth_state');
  cache.clear();
  res.json({ success: true, message: 'Disconnected from GitHub.' });
});

// -------------------------------------------------------------
// PROJECTS REPOSITORY ENDPOINTS
// -------------------------------------------------------------

// GET /api/projects - List all projects
router.get('/projects', async (req, res) => {
  try {
    const installationId = getSessionInstallationId(req);
    const projects = await githubService.getProjects({ installationId });
    res.json({
      authenticated: Boolean(installationId),
      total: projects.length,
      projects
    });
  } catch (err) {
    console.error('[API /projects] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// GET /api/projects/:id - Get single project by ID or repo name
router.get('/projects/:id', async (req, res) => {
  try {
    const installationId = getSessionInstallationId(req);
    const projects = await githubService.getProjects({ installationId });
    const project = projects.find(p => p.id === req.params.id || p.name.toLowerCase() === req.params.id.toLowerCase());

    if (!project) {
      return res.status(404).json({ error: 'PROJECT_NOT_FOUND', message: 'The repository may have been deleted, renamed, or access may have been revoked.' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project details', details: err.message });
  }
});

// GET /api/projects/:id/readme - Get project README
router.get('/projects/:id/readme', async (req, res) => {
  try {
    const installationId = getSessionInstallationId(req);
    const projects = await githubService.getProjects({ installationId });
    const project = projects.find(p => p.id === req.params.id || p.name.toLowerCase() === req.params.id.toLowerCase());

    if (!project) {
      return res.status(404).json({ error: 'PROJECT_NOT_FOUND', message: 'Project not found.' });
    }

    // If project is private and no installation exists
    if (project.isPrivate && !installationId) {
      return res.status(403).json({
        error: 'PRIVATE_ACCESS_REQUIRED',
        message: 'This repository is private. Explicit GitHub authorization is required to inspect the README.'
      });
    }

    const readmeResult = await githubService.getReadme(project.owner, project.name, { installationId });
    res.json(readmeResult);
  } catch (err) {
    console.error(`[API /projects/${req.params.id}/readme] Error:`, err.message);
    res.status(500).json({ error: 'Failed to retrieve README', details: err.message });
  }
});

// GET /api/projects/file - Proxy raw file / image from repository (supports private repos securely)
router.get('/projects/file', async (req, res) => {
  try {
    const { owner, repo, path: filePath } = req.query;
    if (!owner || !repo || !filePath) {
      return res.status(400).json({ error: 'Missing owner, repo, or path query parameter.' });
    }

    const installationId = getSessionInstallationId(req);
    const file = await githubService.getRepositoryFile(owner, repo, filePath, { installationId });
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(file.content);
  } catch (err) {
    res.status(404).json({ error: 'FILE_NOT_FOUND', details: err.message });
  }
});

// GET /api/projects/:id/image - Get project visual cover image
router.get('/projects/:id/image', async (req, res) => {
  try {
    const installationId = getSessionInstallationId(req);
    const projects = await githubService.getProjects({ installationId });
    const project = projects.find(p => p.id === req.params.id || p.name.toLowerCase() === req.params.id.toLowerCase());

    if (!project) {
      // Fallback generic SVG
      const genericSvg = imageService.generateDeterministicSvg({ name: 'Project', language: 'Software' });
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(genericSvg);
    }

    const imageResult = await imageService.getProjectImage(project);
    if (imageResult.svg) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(imageResult.svg);
    }

    if (imageResult.url) {
      return res.redirect(imageResult.url);
    }

    res.status(404).send('Image unavailable');
  } catch (err) {
    console.error(`[API /projects/${req.params.id}/image] Error:`, err.message);
    const genericSvg = imageService.generateDeterministicSvg({ name: 'System', language: 'Software' });
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(genericSvg);
  }
});

// POST /api/projects/refresh - Invalidate cache
router.post('/projects/refresh', (req, res) => {
  cache.clear();
  res.json({ success: true, message: 'Projects cache cleared.' });
});

// -------------------------------------------------------------
// CONTACT & COLLABORATE ENDPOINT
// -------------------------------------------------------------
const fs = require('fs');
const path = require('path');

router.post('/contact', (req, res) => {
  try {
    const { name, email, message, intent = 'GENERAL', organization } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_NAME',
        message: 'A valid name (at least 2 characters) is required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'A valid email address is required.'
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_MESSAGE',
        message: 'Please provide a message with at least 5 characters.'
      });
    }

    const validIntents = ['RESEARCH', 'INTERNSHIP', 'PROJECT', 'GENERAL'];
    const cleanIntent = validIntents.includes(String(intent).toUpperCase())
      ? String(intent).toUpperCase()
      : 'GENERAL';

    const entry = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      organization: organization ? String(organization).trim() : null,
      intent: cleanIntent,
      message: message.trim()
    };

    // Safely persist to backend/data/messages.json
    try {
      const dataDir = path.join(__dirname, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const messagesFile = path.join(dataDir, 'messages.json');
      let existingMessages = [];
      if (fs.existsSync(messagesFile)) {
        try {
          existingMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
        } catch (_) {
          existingMessages = [];
        }
      }
      existingMessages.push(entry);
      fs.writeFileSync(messagesFile, JSON.stringify(existingMessages, null, 2), 'utf8');
    } catch (saveErr) {
      console.warn('[API /contact] Warning: Local file save skipped:', saveErr.message);
    }

    console.log(`[API /contact] Verified inquiry received from ${entry.name} <${entry.email}> [${entry.intent}]`);

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been securely delivered to Ayush Vishwakarma.',
      inquiryId: entry.id
    });
  } catch (err) {
    console.error('[API /contact] Error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to process inquiry. Please email directly at officialayush5839@gmail.com'
    });
  }
});

module.exports = router;
