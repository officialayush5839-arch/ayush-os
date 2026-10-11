require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./backend/routes');

const app = express();
const PORT = process.env.PORT || 2903;

// Security & Parsing Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.SESSION_SECRET || 'ayush_os_secret'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API endpoints
app.use('/api', apiRoutes);

// Serve static portfolio files (index.html, styles.css, app.js, assets)
app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  maxAge: 0,
  etag: false
}));

// Fallback to index.html for single-page application navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.'
  });
});

if (require.main === module) {
  const startServer = (retryCount = 0) => {
    const server = app.listen(PORT, () => {
      console.log(`[AYUSH.OS Server] Running on http://localhost:${PORT}`);
      console.log(`[AYUSH.OS Server] Projects API ready at http://localhost:${PORT}/api/projects`);
      console.log(`[AYUSH.OS Server] Internships API ready at http://localhost:${PORT}/api/internships`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (retryCount === 0) {
          console.warn(`[AYUSH.OS Server] Port ${PORT} busy. Clearing listening process and retrying...`);
          try {
            const clearPort = require('./backend/clearPort');
            clearPort(PORT);
            setTimeout(() => startServer(1), 500);
            return;
          } catch (clearErr) {
            console.error('[AYUSH.OS Server] Could not clear port:', clearErr.message);
          }
        }
        console.error(`[AYUSH.OS Server] Port ${PORT} is occupied by another application.`);
      } else {
        console.error('[AYUSH.OS Server] Error:', err.message);
      }
      process.exit(1);
    });

    process.on('SIGINT', () => {
      console.log('\n[AYUSH.OS Server] Shutting down cleanly...');
      server.close(() => {
        process.exit(0);
      });
    });
  };

  startServer();
}

module.exports = app;
