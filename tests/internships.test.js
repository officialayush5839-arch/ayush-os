const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const http = require('http');

const internshipsService = require('../backend/internshipsService');
const app = require('../server');

function makeRequest(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 2903,
        path: urlPath,
        method: options.method || 'GET',
        headers: options.headers || {}
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = res.headers['content-type']?.includes('application/json')
              ? JSON.parse(data)
              : data;
            resolve({ status: res.statusCode, headers: res.headers, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

test('1. Internships: Initial seed data contains exactly 5 verified internship records', () => {
  const list = internshipsService.getInternships('all');
  assert.strictEqual(list.length, 5, 'Should have 5 verified internships');

  const companies = list.map(i => i.company);
  assert.ok(companies.includes('VaultofCodes'));
  assert.ok(companies.includes('Pinnacle Labs Pvt Ltd'));
  assert.ok(companies.includes('YuvaIntern / Henry Harvin Education'));
  assert.ok(companies.includes('YR NOVATECH'));
  assert.ok(companies.includes('Bleep Education'));
});

test('2. Internships: VaultofCodes merges Offer Letter and Completion Certificate into 1 record', () => {
  const voc = internshipsService.getInternshipById('internship_vaultofcodes');
  assert.ok(voc, 'VaultofCodes should exist');
  assert.strictEqual(voc.status, 'COMPLETED', 'Status should be COMPLETED');
  assert.strictEqual(voc.documents.length, 2, 'Should contain 2 official documents');

  const docTypes = voc.documents.map(d => d.documentType);
  assert.ok(docTypes.includes('OFFER_LETTER'));
  assert.ok(docTypes.includes('COMPLETION_CERTIFICATE'));
});

test('3. Internships: Status calculation identifies COMPLETED vs CURRENT based on dates and certificates', () => {
  const completedList = internshipsService.getInternships('completed');
  const currentList = internshipsService.getInternships('current');

  assert.strictEqual(completedList.length, 2, 'Should have 2 completed internships (VaultofCodes, Pinnacle Labs)');
  assert.strictEqual(currentList.length, 3, 'Should have 3 current internships (YuvaIntern, YR Novatech, Bleep)');
});

test('4. Internships: Evidence traceability links 100% of facts to authentic source documents', () => {
  const list = internshipsService.getInternships('all');
  for (const item of list) {
    const full = internshipsService.getInternshipById(item.id);
    assert.ok(full.evidenceTrace && full.evidenceTrace.length > 0, `${item.company} must have evidence trace`);
    for (const trace of full.evidenceTrace) {
      assert.ok(trace.fact, 'Fact name required');
      assert.ok(trace.value, 'Fact value required');
      assert.ok(trace.sourceDoc, 'Source document required');
      assert.ok(['VERIFIED', 'DERIVED', 'DECLARED'].includes(trace.level), 'Valid evidence level required');
    }
  }
});

test('5. Internships: Document duplicate detection rejects identical SHA-256 uploads', async () => {
  const samplePath = path.join(__dirname, '..', 'data', 'internships', 'documents', 'vaultofcodes-offer.jpg');
  const buffer = fs.readFileSync(samplePath);

  await assert.rejects(
    async () => {
      await internshipsService.ingestDocument({
        filename: 'duplicate_vaultofcodes.jpg',
        buffer,
        mimeType: 'image/jpeg'
      });
    },
    (err) => {
      assert.strictEqual(err.code, 'DOCUMENT_ALREADY_EXISTS');
      return true;
    }
  );
});

test('6. API: GET /api/internships returns verified list', async () => {
  const res = await makeRequest('/api/internships');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.count, 5);
});

test('7. API: GET /api/internships?status=completed filters correctly', async () => {
  const res = await makeRequest('/api/internships?status=completed');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.count, 2);
  res.body.internships.forEach(i => assert.strictEqual(i.status, 'COMPLETED'));
});

test('8. API: GET /api/internships/:id returns detailed career file', async () => {
  const res = await makeRequest('/api/internships/internship_vaultofcodes');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.internship.company, 'VaultofCodes');
  assert.strictEqual(res.body.internship.documents.length, 2);
});

test('9. API: GET /api/internships/documents/:docId serves document image', async () => {
  const res = await makeRequest('/api/internships/documents/doc_voc_cert');
  assert.strictEqual(res.status, 200);
  assert.ok(res.headers['content-type'].includes('image'));
  assert.strictEqual(res.headers['x-document-type'], 'COMPLETION_CERTIFICATE');
});
