const express = require('express');
const internshipsService = require('./internshipsService');

const router = express.Router();

/**
 * GET /api/internships
 * Returns list of verified internships for portfolio display.
 * Optional query: ?status=completed|current|all
 */
router.get('/', (req, res) => {
  try {
    const statusFilter = req.query.status || 'all';
    const list = internshipsService.getInternships(statusFilter);
    res.json({
      success: true,
      count: list.length,
      statusFilter,
      internships: list
    });
  } catch (err) {
    console.error('[API /internships] Error:', err);
    res.status(500).json({ error: 'FAILED_FETCH_INTERNSHIPS', message: err.message });
  }
});

/**
 * GET /api/internships/:id
 * Returns single internship detail with verified documents and evidence matrix.
 */
router.get('/:id', (req, res) => {
  try {
    const internship = internshipsService.getInternshipById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: 'INTERNSHIP_NOT_FOUND', message: 'Internship record does not exist.' });
    }
    res.json({
      success: true,
      internship
    });
  } catch (err) {
    console.error(`[API /internships/${req.params.id}] Error:`, err);
    res.status(500).json({ error: 'FAILED_FETCH_DETAIL', message: err.message });
  }
});

/**
 * GET /api/internships/documents/:docId
 * Serves the document file directly (image/PDF) with privacy checks.
 */
router.get('/documents/:docId', (req, res) => {
  try {
    const docInfo = internshipsService.getDocument(req.params.docId, Boolean(req.query.admin));
    if (!docInfo || !docInfo.filePath) {
      return res.status(404).json({ error: 'DOCUMENT_NOT_FOUND', message: 'Document file not found on server.' });
    }

    res.setHeader('Content-Type', docInfo.record.mimeType || 'image/jpeg');
    res.setHeader('X-Document-Type', docInfo.record.documentType);
    res.setHeader('X-Document-Hash', docInfo.record.fileHash);
    res.setHeader('X-Privacy-Mode', docInfo.record.privacyMode);
    res.setHeader('Content-Disposition', `inline; filename="${docInfo.record.filename}"`);
    res.sendFile(docInfo.filePath);
  } catch (err) {
    if (err.code === 'DOCUMENT_PRIVATE') {
      return res.status(403).json({
        error: 'DOCUMENT_PRIVATE',
        message: 'This document contains private personal/contractual information and is not exposed publicly.'
      });
    }
    console.error(`[API /internships/documents/${req.params.docId}] Error:`, err);
    res.status(500).json({ error: 'FAILED_FETCH_DOCUMENT', message: err.message });
  }
});

/**
 * POST /api/internships/ingest
 * Ingests a new document with SHA-256 duplicate detection and auto-extraction.
 */
router.post('/ingest', express.json({ limit: '15mb' }), async (req, res) => {
  try {
    const { filename, base64Data, mimeType, privacyMode } = req.body;

    if (!filename || !base64Data) {
      return res.status(400).json({
        error: 'INVALID_PAYLOAD',
        message: 'Both filename and base64Data are required for document ingestion.'
      });
    }

    const buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64');
    const docRecord = await internshipsService.ingestDocument({
      filename,
      buffer,
      mimeType: mimeType || 'image/jpeg',
      privacyMode: privacyMode || 'REDACTED_PUBLIC'
    });

    res.status(201).json({
      success: true,
      message: 'Document ingested successfully. Awaiting human verification.',
      document: docRecord
    });
  } catch (err) {
    if (err.code === 'DOCUMENT_ALREADY_EXISTS') {
      return res.status(409).json({
        error: 'DOCUMENT_ALREADY_EXISTS',
        message: err.message,
        existingDocumentId: err.existingDocumentId
      });
    }
    console.error('[API /internships/ingest] Error:', err);
    res.status(500).json({ error: 'INGESTION_FAILED', message: err.message });
  }
});

/**
 * POST /api/internships/reset-seed
 * Seeds verified initial data.
 */
router.post('/reset-seed', (req, res) => {
  try {
    const data = internshipsService.seedInitialData();
    res.json({
      success: true,
      message: 'Initial verified internship records and documents reset.',
      count: data.internships.length
    });
  } catch (err) {
    console.error('[API /internships/reset-seed] Error:', err);
    res.status(500).json({ error: 'SEED_FAILED', message: err.message });
  }
});

module.exports = router;
