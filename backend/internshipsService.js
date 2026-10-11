const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Internships Service for AYUSH.OS
 * Document-Driven, Evidence-Backed Career File System.
 * Zero-fabrication: All data traced to official documents.
 */
class InternshipsService {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data', 'internships');
    this.docsDir = path.join(this.dataDir, 'documents');
    this.recordsFile = path.join(this.dataDir, 'records.json');

    this.ensureDirectories();
    this.initDatabase();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }
  }

  computeHash(bufferOrPath) {
    const buffer = Buffer.isBuffer(bufferOrPath) 
      ? bufferOrPath 
      : fs.readFileSync(bufferOrPath);
    return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
  }

  getDatabase() {
    try {
      if (fs.existsSync(this.recordsFile)) {
        const raw = fs.readFileSync(this.recordsFile, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[InternshipsService] Error reading database:', err);
    }
    return { internships: [], documents: [], auditLogs: [] };
  }

  saveDatabase(data) {
    try {
      fs.writeFileSync(this.recordsFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[InternshipsService] Error saving database:', err);
      throw err;
    }
  }

  /**
   * Determine status based on dates and documents
   */
  calculateStatus(startDateStr, endDateStr, documents = []) {
    const hasCompletionDoc = documents.some(d => 
      ['COMPLETION_CERTIFICATE', 'COMPLETION_LETTER', 'EXPERIENCE_CERTIFICATE', 'INTERNSHIP_CERTIFICATE'].includes(d.documentType)
    );

    const now = new Date();
    const start = startDateStr ? new Date(startDateStr) : null;
    const end = endDateStr ? new Date(endDateStr) : null;

    if (hasCompletionDoc && end && now >= end) {
      return 'COMPLETED';
    }
    if (end && now >= end) {
      return 'COMPLETED';
    }
    if (start && now >= start && (!end || now < end)) {
      return 'CURRENT';
    }
    if (start && now < start) {
      return 'UPCOMING';
    }
    return 'CURRENT';
  }

  /**
   * Calculate duration string from dates
   */
  calculateCalendarDuration(startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) return 'Not available';
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    if (isNaN(s) || isNaN(e)) return 'Not available';

    const diffDays = Math.round((e - s) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Invalid range';
    if (diffDays <= 32) return '1 month';
    if (diffDays <= 65) return '2 months';
    if (diffDays <= 95) return '3 months';
    if (diffDays <= 185) return '6 months';
    const months = Math.round(diffDays / 30.4);
    return `${months} months`;
  }

  /**
   * Classify document type from text content and keywords
   */
  classifyDocument(text = '', filename = '') {
    const t = (text + ' ' + filename).toLowerCase();

    if (t.includes('certificate of internship') || t.includes('completion certificate') || t.includes('has successfully completed')) {
      return 'COMPLETION_CERTIFICATE';
    }
    if (t.includes('completion letter')) {
      return 'COMPLETION_LETTER';
    }
    if (t.includes('experience certificate') || t.includes('experience letter')) {
      return 'EXPERIENCE_CERTIFICATE';
    }
    if (t.includes('offer letter') || t.includes('pleased to offer') || t.includes('formal offer') || t.includes('internship offer')) {
      return 'OFFER_LETTER';
    }
    if (t.includes('joining letter')) {
      return 'JOINING_LETTER';
    }
    if (t.includes('appointment letter')) {
      return 'APPOINTMENT_LETTER';
    }
    return 'OTHER';
  }

  /**
   * Ingest and register a document
   */
  async ingestDocument({ filename, buffer, mimeType, privacyMode = 'REDACTED_PUBLIC' }) {
    const fileHash = this.computeHash(buffer);
    const db = this.getDatabase();

    // Check duplicate detection
    const existingDoc = db.documents.find(d => d.fileHash === fileHash);
    if (existingDoc) {
      const err = new Error('DOCUMENT_ALREADY_EXISTS: A document with identical SHA-256 hash is already registered.');
      err.code = 'DOCUMENT_ALREADY_EXISTS';
      err.existingDocumentId = existingDoc.id;
      throw err;
    }

    const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const ext = path.extname(filename) || (mimeType.includes('pdf') ? '.pdf' : '.jpg');
    const diskFilename = `${docId}${ext}`;
    const targetPath = path.join(this.docsDir, diskFilename);

    fs.writeFileSync(targetPath, buffer);

    // Document extraction logic
    const docType = this.classifyDocument('', filename);

    const newDoc = {
      id: docId,
      internshipId: null,
      filename,
      diskFilename,
      documentType: docType,
      mimeType: mimeType || 'image/jpeg',
      fileHash,
      uploadedAt: new Date().toISOString(),
      extractionStatus: 'PENDING_EXTRACTION',
      extractedText: '',
      privacyMode, // 'PUBLIC', 'PRIVATE', 'REDACTED_PUBLIC'
      pageCount: 1,
      version: 1
    };

    db.documents.push(newDoc);
    db.auditLogs.push({
      action: 'INGEST_DOCUMENT',
      documentId: docId,
      timestamp: new Date().toISOString(),
      fileHash
    });

    this.saveDatabase(db);
    return newDoc;
  }

  /**
   * Get all verified internships for public portfolio
   */
  getInternships(statusFilter = null) {
    const db = this.getDatabase();
    let list = db.internships.filter(item => item.verificationState === 'VERIFIED');

    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Attach document summaries to internships
    return list.map(internship => {
      const docs = db.documents.filter(d => internship.documentIds.includes(d.id)).map(d => ({
        id: d.id,
        filename: d.filename,
        documentType: d.documentType,
        mimeType: d.mimeType,
        fileHash: d.fileHash,
        privacyMode: d.privacyMode
      }));

      return {
        ...internship,
        documents: docs,
        documentCount: docs.length
      };
    });
  }

  /**
   * Get single internship with full evidence matrix
   */
  getInternshipById(id) {
    const db = this.getDatabase();
    const internship = db.internships.find(item => item.id === id);
    if (!internship) return null;

    const docs = db.documents.filter(d => internship.documentIds.includes(d.id));

    return {
      ...internship,
      documents: docs.map(d => ({
        id: d.id,
        filename: d.filename,
        documentType: d.documentType,
        mimeType: d.mimeType,
        fileHash: d.fileHash,
        uploadedAt: d.uploadedAt,
        privacyMode: d.privacyMode,
        url: `/api/internships/documents/${d.id}`
      }))
    };
  }

  /**
   * Get document record & file path with privacy checks
   */
  getDocument(docId, isAdmin = false) {
    const db = this.getDatabase();
    const doc = db.documents.find(d => d.id === docId);
    if (!doc) return null;

    if (doc.privacyMode === 'PRIVATE' && !isAdmin) {
      const err = new Error('DOCUMENT_PRIVATE: This document is marked private by owner.');
      err.code = 'DOCUMENT_PRIVATE';
      throw err;
    }

    const filePath = path.join(this.docsDir, doc.diskFilename);
    return {
      record: doc,
      filePath: fs.existsSync(filePath) ? filePath : null
    };
  }

  /**
   * Seed/Reset initial verified internships from the user's authentic documents
   */
  seedInitialData() {
    const defaultData = this.getInitialSeedData();
    this.saveDatabase(defaultData);
    return defaultData;
  }

  initDatabase() {
    const db = this.getDatabase();
    if (!db.internships || db.internships.length === 0) {
      this.seedInitialData();
    }
  }

  getInitialSeedData() {
    const docs = [
      {
        id: 'doc_voc_offer',
        internshipId: 'internship_vaultofcodes',
        filename: 'VaultofCodes_Offer_Letter.jpg',
        diskFilename: 'vaultofcodes-offer.jpg',
        documentType: 'OFFER_LETTER',
        mimeType: 'image/jpeg',
        fileHash: 'CC14B676F5CD5CB560372222588E1DD6DFEA78C33A8E3419AAE08B23468D7CAF',
        uploadedAt: '2026-06-25T10:00:00.000Z',
        extractionStatus: 'EXTRACTED',
        privacyMode: 'REDACTED_PUBLIC',
        pageCount: 1,
        version: 1
      },
      {
        id: 'doc_voc_cert',
        internshipId: 'internship_vaultofcodes',
        filename: 'VaultofCodes_Internship_Certificate.jpg',
        diskFilename: 'vaultofcodes-certificate.jpg',
        documentType: 'COMPLETION_CERTIFICATE',
        mimeType: 'image/jpeg',
        fileHash: '02FBEBF80579B0568248F86275BD0492396505E42CF7434B6006C8847B01E28B',
        uploadedAt: '2026-08-26T12:00:00.000Z',
        extractionStatus: 'EXTRACTED',
        privacyMode: 'PUBLIC',
        pageCount: 1,
        version: 1
      },
      {
        id: 'doc_pinnacle_offer',
        internshipId: 'internship_pinnacle_labs',
        filename: 'Pinnacle_Labs_Offer_Letter.jpg',
        diskFilename: 'pinnacle-labs-offer.jpg',
        documentType: 'OFFER_LETTER',
        mimeType: 'image/jpeg',
        fileHash: '11837CC2F57E0FB0AAF5F20AA847DDAB4B1DC52942C43725E7EA270E429732FC',
        uploadedAt: '2026-08-08T09:00:00.000Z',
        extractionStatus: 'EXTRACTED',
        privacyMode: 'REDACTED_PUBLIC',
        pageCount: 1,
        version: 1
      },
      {
        id: 'doc_yuva_offer',
        internshipId: 'internship_yuva_henry_harvin',
        filename: 'YuvaIntern_Henry_Harvin_Offer_Letter.png',
        diskFilename: 'yuva-henry-harvin-offer.png',
        documentType: 'OFFER_LETTER',
        mimeType: 'image/png',
        fileHash: '004E97A61C284615A4F9447AF0D84B3DAD4055B978C52F2190F286DEE047339D',
        uploadedAt: '2026-09-17T08:30:00.000Z',
        extractionStatus: 'EXTRACTED',
        privacyMode: 'REDACTED_PUBLIC',
        pageCount: 1,
        version: 1
      },
      {
        id: 'doc_yr_offer',
        internshipId: 'internship_yr_novatech',
        filename: 'YR_Novatech_Offer_Letter.jpg',
        diskFilename: 'yr-novatech-offer.jpg',
        documentType: 'OFFER_LETTER',
        mimeType: 'image/jpeg',
        fileHash: 'FC69013E72BE51DF057C48BC53CCD5FA24659EF42ABF6B918819D56232843459',
        uploadedAt: '2026-09-12T11:15:00.000Z',
        extractionStatus: 'EXTRACTED',
        privacyMode: 'REDACTED_PUBLIC',
        pageCount: 1,
        version: 1
      },
      {
        id: 'doc_bleep_offer',
        internshipId: 'internship_bleep_education',
        filename: 'Bleep_Education_Offer_Letter.jpg',
        diskFilename: 'bleep-education-offer.jpg',
        documentType: 'OFFER_LETTER',
        mimeType: 'image/jpeg',
        fileHash: 'F4B31F7ED86401099013B6D8372193F371091D65E825973C3C05D03676817C7C',
        uploadedAt: '2026-06-22T14:20:00.000Z',
        extractionStatus: 'EXTRACTED',
        privacyMode: 'REDACTED_PUBLIC',
        pageCount: 1,
        version: 1
      }
    ];

    const internships = [
      {
        id: 'internship_vaultofcodes',
        company: 'VaultofCodes',
        officialOrganization: 'VaultofCodes.in',
        role: 'AI & Prompt Engineering Intern',
        category: 'Artificial Intelligence / Prompt Engineering',
        status: 'COMPLETED',
        startDate: '2026-06-25',
        endDate: '2026-08-25',
        officialDuration: '2 Months',
        calendarDuration: '2 months',
        location: 'Online/Remote',
        workMode: 'Remote',
        department: 'Not specified',
        signatory: 'Kartik Ahlawat (Founder), Varshita Singh (HR Manager)',
        identifiers: {
          msmeUdyam: 'UDYAM-UP-15-0041308',
          aicteCorpId: 'CORPORATE6511252d7c3271695622445',
          aicteStudentId: 'STU6a266226b5b451780900390',
          universityStudentId: '3125057010981'
        },
        website: 'https://www.vaultofcodes.in',
        associatedProject: {
          title: 'PromptMaster AI',
          repo: 'https://github.com/officialayush5839-arch/promptmaster-ai-project',
          type: 'github_repository'
        },
        responsibilities: [
          'Participated in hands-on Training & Internship Program enhancing practical knowledge in AI & Prompt Engineering.',
          'Developed real-world prompts, prompt chains, and agentic workflows adhering to production standards.',
          'Successfully completed 2-month curriculum verified by AICTE and MSME credential standards.'
        ],
        technologies: ['Prompt Engineering', 'Artificial Intelligence', 'LLM Prompt Design', 'AI Optimization'],
        verificationState: 'VERIFIED',
        documentIds: ['doc_voc_offer', 'doc_voc_cert'],
        evidenceTrace: [
          { fact: 'Organization Name', value: 'VaultofCodes.in', sourceDoc: 'VaultofCodes_Internship_Certificate.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Role', value: 'AI & Prompt Engineering Intern', sourceDoc: 'VaultofCodes_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Start Date', value: '2026-06-25', sourceDoc: 'VaultofCodes_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'End Date / Completion', value: '2026-08-25', sourceDoc: 'VaultofCodes_Internship_Certificate.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Duration', value: '2 Months', sourceDoc: 'VaultofCodes_Internship_Certificate.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Completion Evidence', value: 'Certificate of Internship with QR Code Verification', sourceDoc: 'VaultofCodes_Internship_Certificate.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'AICTE Student ID', value: 'STU6a266226b5b451780900390', sourceDoc: 'VaultofCodes_Internship_Certificate.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Status', value: 'COMPLETED', sourceDoc: 'Dates Passed + Completion Certificate Exists', page: 1, level: 'DERIVED' }
        ]
      },
      {
        id: 'internship_pinnacle_labs',
        company: 'Pinnacle Labs Pvt Ltd',
        officialOrganization: 'Pinnacle Labs Pvt Ltd',
        role: 'Artificial Intelligence Internship',
        category: 'Artificial Intelligence / Software Development',
        status: 'COMPLETED',
        startDate: '2026-08-13',
        endDate: '2026-09-13',
        officialDuration: '1 month',
        calendarDuration: '1 month',
        location: 'Kolkata, India / Remote',
        workMode: 'Remote',
        department: 'Software Development',
        signatory: 'TEAM Pinnacle Labs',
        identifiers: {
          referenceNumber: 'PL/2026/AUGP4/009',
          isoCertification: 'ISO 9001:2015',
          corporateAffairs: 'Ministry of Corporate Affairs Government of India',
          msme: 'MSME Certified'
        },
        website: 'https://pinnaclelabs.tech',
        associatedProject: null,
        responsibilities: [
          'Focused and immersive experience in Artificial Intelligence and software development.',
          'Enhanced practical engineering skills under intensive month-long industry curriculum.'
        ],
        technologies: ['Artificial Intelligence', 'Software Development', 'Python'],
        verificationState: 'VERIFIED',
        documentIds: ['doc_pinnacle_offer'],
        evidenceTrace: [
          { fact: 'Organization Name', value: 'Pinnacle Labs Pvt Ltd', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Role', value: 'Artificial Intelligence Internship', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Reference Number', value: 'PL/2026/AUGP4/009', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Start Date', value: '2026-08-13', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'End Date', value: '2026-09-13', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'DERIVED' },
          { fact: 'Official Duration', value: '1 month', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Location', value: 'Kolkata, India', sourceDoc: 'Pinnacle_Labs_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Status', value: 'COMPLETED', sourceDoc: 'End date (2026-09-13) elapsed relative to current date', page: 1, level: 'DERIVED' }
        ]
      },
      {
        id: 'internship_yuva_henry_harvin',
        company: 'YuvaIntern / Henry Harvin Education',
        officialOrganization: 'YuvaIntern (Henry Harvin Education & NSDC)',
        role: 'Pharmaceutical Research Assistant',
        category: 'Pharmaceutical Research / Data Science',
        status: 'CURRENT',
        startDate: '2026-09-17',
        endDate: '2026-10-15',
        officialDuration: '4 weeks',
        calendarDuration: '4 weeks',
        location: 'Remote',
        workMode: 'Remote',
        department: 'Pharmaceutical Research',
        signatory: 'Kounal Gupta (Founder, YuvaIntern.com)',
        identifiers: {
          nsdcAccreditation: 'National Skill Development Corporation (N.S.D.C)',
          usOffice: '8 The Green, #19614 Dover, DE 19901, USA',
          indiaOffice: 'B-12, Sector-6, Noida(UP), India-201301',
          dubaiOffice: '2703, Blue Matrix, 27th floor The Prime Tower, Business Bay, Dubai, UAE'
        },
        website: 'https://yuvaintern.com',
        associatedProject: {
          title: 'Post-Marketing Pharmacovigilance and Safety Profiling of Semaglutide (FDA FAERS)',
          repo: 'https://github.com/officialayush5839-arch/Henry-Harvin-intership',
          type: 'github_repository'
        },
        responsibilities: [
          'Assisting with research projects in the pharmaceutical field.',
          'Conducting systematic literature reviews and evidence synthesis.',
          'Collecting and analyzing adverse drug reaction telemetry (OpenFDA FAERS pipeline).',
          'Assisting with experimental design and automated QA compliance suites.'
        ],
        technologies: ['Pharmaceutical Data Analysis', 'Python', 'OpenFDA FAERS', 'Biostatistics', 'ICH GCP'],
        verificationState: 'VERIFIED',
        documentIds: ['doc_yuva_offer'],
        evidenceTrace: [
          { fact: 'Organization Name', value: 'YuvaIntern / Henry Harvin Education', sourceDoc: 'YuvaIntern_Henry_Harvin_Offer_Letter.png', page: 1, level: 'VERIFIED' },
          { fact: 'Official Role', value: 'Pharmaceutical Research Assistant', sourceDoc: 'YuvaIntern_Henry_Harvin_Offer_Letter.png', page: 1, level: 'VERIFIED' },
          { fact: 'Start Date', value: '2026-09-17', sourceDoc: 'YuvaIntern_Henry_Harvin_Offer_Letter.png', page: 1, level: 'VERIFIED' },
          { fact: 'End Date', value: '2026-10-15', sourceDoc: 'YuvaIntern_Henry_Harvin_Offer_Letter.png', page: 1, level: 'VERIFIED' },
          { fact: 'Official Duration', value: '4 weeks', sourceDoc: 'YuvaIntern_Henry_Harvin_Offer_Letter.png', page: 1, level: 'VERIFIED' },
          { fact: 'Work Mode', value: 'Remote', sourceDoc: 'YuvaIntern_Henry_Harvin_Offer_Letter.png', page: 1, level: 'VERIFIED' },
          { fact: 'Status', value: 'CURRENT', sourceDoc: 'Current date (2026-09-21) within 2026-09-17 to 2026-10-15 window', page: 1, level: 'DERIVED' }
        ]
      },
      {
        id: 'internship_yr_novatech',
        company: 'YR NOVATECH',
        officialOrganization: 'YR NOVATECH',
        role: 'Artificial Intelligence & Machine Learning – Remote Based Internship',
        category: 'Artificial Intelligence & Machine Learning',
        status: 'CURRENT',
        startDate: '2026-09-12',
        endDate: '2026-12-12',
        officialDuration: '3 Months',
        calendarDuration: '3 months',
        location: 'Tamil Nadu, India / Remote',
        workMode: 'Remote Based Internship',
        department: 'Artificial Intelligence & Machine Learning',
        signatory: 'S. Fizal Mohamed (Founder & CEO, YR NOVATECH)',
        identifiers: {
          internshipId: 'YRN202600190',
          referenceNumber: 'YRN-OL-72486AA5',
          udyamRegistration: 'UDYAM-TN-17-0077694'
        },
        website: 'https://www.yrnovatech.online',
        associatedProject: null,
        responsibilities: [
          'Practical industry exposure and project experience in AI & Machine Learning.',
          'Professional skill development through remote-based technical milestones.'
        ],
        technologies: ['Artificial Intelligence', 'Machine Learning', 'Python'],
        verificationState: 'VERIFIED',
        documentIds: ['doc_yr_offer'],
        evidenceTrace: [
          { fact: 'Organization Name', value: 'YR NOVATECH', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Role', value: 'Artificial Intelligence & Machine Learning – Remote Based Internship', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Internship ID', value: 'YRN202600190', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Reference Number', value: 'YRN-OL-72486AA5', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Start Date', value: '2026-09-12', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'End Date', value: '2026-12-12', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Duration', value: '3 Months', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Udyam Registration', value: 'UDYAM-TN-17-0077694', sourceDoc: 'YR_Novatech_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Status', value: 'CURRENT', sourceDoc: 'Active engagement within 2026-09-12 to 2026-12-12', page: 1, level: 'DERIVED' }
        ]
      },
      {
        id: 'internship_bleep_education',
        company: 'Bleep Education',
        officialOrganization: 'Bleep Education',
        role: 'Artificial Intelligence - Agentic AI Intern',
        category: 'Agentic AI & Systems Engineering',
        status: 'CURRENT',
        startDate: '2026-07-07',
        endDate: '2026-10-07',
        officialDuration: '3 months (tentative)',
        calendarDuration: '3 months',
        location: 'Agartala, Tripura, India / Remote',
        workMode: 'Remote / Two-Phase Training & Hands-On',
        department: 'Artificial Intelligence',
        signatory: 'Pratiksha Singha (HR Manager)',
        identifiers: {
          officeAddress: '8 Ramnagr, Agartala, India, 799002',
          phone: '+91-8729805250',
          email: 'operations@bleepeducation.in'
        },
        website: 'https://www.bleepeducation.in',
        associatedProject: null,
        responsibilities: [
          'Phase 1 (First Two Months): Instructor-led training and skill development in Agentic AI architectures.',
          'Phase 2 (Final One Month): Hands-on internship involving real-time project work and cross-functional team collaboration.',
          'Completing assigned tasks/projects efficiently while maintaining strict confidentiality.'
        ],
        technologies: ['Agentic AI', 'Autonomous Agents', 'Artificial Intelligence', 'Python'],
        verificationState: 'VERIFIED',
        documentIds: ['doc_bleep_offer'],
        evidenceTrace: [
          { fact: 'Organization Name', value: 'Bleep Education', sourceDoc: 'Bleep_Education_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Role', value: 'Artificial Intelligence - Agentic AI Intern', sourceDoc: 'Bleep_Education_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Start Date', value: '2026-07-07 (tentative)', sourceDoc: 'Bleep_Education_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'End Date', value: '2026-10-07 (tentative)', sourceDoc: 'Bleep_Education_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Official Duration', value: '3 months (tentative)', sourceDoc: 'Bleep_Education_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Structure', value: 'Phase 1: Training (2 Mo), Phase 2: Live Project (1 Mo)', sourceDoc: 'Bleep_Education_Offer_Letter.jpg', page: 1, level: 'VERIFIED' },
          { fact: 'Status', value: 'CURRENT', sourceDoc: 'Active engagement within 2026-07-07 to 2026-10-07 window', page: 1, level: 'DERIVED' }
        ]
      }
    ];

    return {
      internships,
      documents: docs,
      auditLogs: [
        {
          action: 'SEED_INITIAL_CAREER_DOCUMENTS',
          timestamp: new Date().toISOString(),
          recordCount: internships.length,
          documentCount: docs.length
        }
      ]
    };
  }
}

module.exports = new InternshipsService();
