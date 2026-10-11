const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

// Helper to make local API requests to port 2903
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 2903,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NodeTestAgent/1.0',
        ...options.headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

test('Task 9: POST /api/contact validates inputs and rejects invalid payload', async () => {
  // Empty body
  const resEmpty = await makeRequest('/api/contact', {
    method: 'POST',
    body: {}
  });
  assert.strictEqual(resEmpty.status, 400);
  assert.strictEqual(resEmpty.body.success, false);

  // Invalid email
  const resBadEmail = await makeRequest('/api/contact', {
    method: 'POST',
    body: {
      name: 'Dr. Jane Smith',
      email: 'not-an-email',
      message: 'Collaboration on emotion AI models.'
    }
  });
  assert.strictEqual(resBadEmail.status, 400);
  assert.strictEqual(resBadEmail.body.success, false);
});

test('Task 9: POST /api/contact accepts valid inquiry with intent', async () => {
  const resValid = await makeRequest('/api/contact', {
    method: 'POST',
    body: {
      name: 'Research Collaborator',
      email: 'researcher@university.edu',
      intent: 'RESEARCH',
      message: 'Interested in collaborating on transformer explainability benchmarks.'
    }
  });
  assert.strictEqual(resValid.status, 200);
  assert.strictEqual(resValid.body.success, true);
  assert.ok(resValid.body.message);
});

test('Task 9: ContactApp frontend exports required interface and renders intents', () => {
  global.window = {};
  require('../js/data');
  const ContactApp = require('../js/apps/contact-app');
  assert.ok(ContactApp, 'ContactApp must exist');
  assert.strictEqual(typeof ContactApp.getContent, 'function');
  assert.strictEqual(typeof ContactApp.init, 'function');

  const html = ContactApp.getContent();
  assert.ok(html.includes('RESEARCH'), 'Should have Research intent');
  assert.ok(html.includes('INTERNSHIP'), 'Should have Internship intent');
  assert.ok(html.includes('PROJECT'), 'Should have Project intent');
  assert.ok(html.includes('officialayush5839@gmail.com'), 'Should have verified email');
});
