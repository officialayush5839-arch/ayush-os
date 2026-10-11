const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const githubService = require('../backend/githubService');
const imageService = require('../backend/imageService');
const cacheService = require('../backend/cacheService');
const app = require('../server');

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 2903,
      path,
      method: options.method || 'GET',
      headers: {
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
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

test('1. GitHub Service: Normalization preserves real fields and does not fabricate', () => {
  const rawRepo = {
    id: 12345678,
    name: 'test-real-system',
    full_name: 'officialayush5839-arch/test-real-system',
    description: 'Real production sensor network',
    html_url: 'https://github.com/officialayush5839-arch/test-real-system',
    private: false,
    default_branch: 'main',
    language: 'Python',
    topics: ['iot', 'ai'],
    stargazers_count: 5,
    forks_count: 2,
    open_issues_count: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
    pushed_at: '2026-01-02T00:00:00Z'
  };

  const normalized = githubService.normalizeRepository(rawRepo);
  assert.strictEqual(normalized.id, '12345678');
  assert.strictEqual(normalized.name, 'test-real-system');
  assert.strictEqual(normalized.language, 'Python');
  assert.strictEqual(normalized.isPrivate, false);
  assert.strictEqual(normalized.stars, 5);
  assert.strictEqual(normalized.forks, 2);
  assert.strictEqual(normalized.visibility, 'public');
});

test('2. GitHub Service: Relative markdown images are resolved to raw or proxy links', () => {
  const md = 'Here is a demo: ![Architecture](./assets/arch.png)\nAnd another: ![Flow](images/flow.jpg)';
  const resolved = githubService.resolveRelativeMarkdownAssets(md, 'officialayush5839-arch', 'INTELLIEMO', 'main', false);
  assert(resolved.includes('https://raw.githubusercontent.com/officialayush5839-arch/INTELLIEMO/main/assets/arch.png'));
  assert(resolved.includes('https://raw.githubusercontent.com/officialayush5839-arch/INTELLIEMO/main/images/flow.jpg'));
});

test('3. Image Service: Generates deterministic SVG with technical visual identity', () => {
  const svg = imageService.generateDeterministicSvg({
    name: 'MarineDebris-Sonar-AI',
    language: 'Python',
    description: 'Underwater sonar anomaly detection using YOLO',
    isPrivate: true
  });
  assert(svg.includes('<svg'));
  assert(svg.includes('MarineDebris-Sonar-AI'));
  assert(svg.includes('PRIVATE ARCHIVE'));
  assert(svg.includes('Python'));
});

test('4. Cache Service: Stores and retrieves with TTL', () => {
  cacheService.set('test_key', { ok: true }, 5000);
  const retrieved = cacheService.get('test_key');
  assert.deepStrictEqual(retrieved, { ok: true });
  cacheService.delete('test_key');
  assert.strictEqual(cacheService.get('test_key'), null);
});

test('5. API: GET /api/github/status returns valid connection state without credentials', async () => {
  const res = await makeRequest('/api/github/status');
  assert.strictEqual(res.status, 200);
  assert(typeof res.data.connected === 'boolean');
  assert(typeof res.data.privateAccess === 'boolean');
  assert.strictEqual(res.data.targetUsername, 'officialayush5839-arch');
  // Verify ZERO secret leaks
  assert.strictEqual(res.data.clientSecret, undefined);
  assert.strictEqual(res.data.privateKey, undefined);
  assert.strictEqual(res.data.token, undefined);
});

test('6. API: GET /api/projects returns normalized list of real repositories', async () => {
  const res = await makeRequest('/api/projects');
  assert.strictEqual(res.status, 200);
  assert(Array.isArray(res.data.projects));
  assert(res.data.projects.length > 0);
  
  const intelliemo = res.data.projects.find(p => p.name === 'INTELLIEMO');
  assert(intelliemo, 'INTELLIEMO project should be in repository list');
  assert.strictEqual(intelliemo.owner, 'officialayush5839-arch');
});

test('7. API: GET /api/projects/:id returns single project metadata', async () => {
  const res = await makeRequest('/api/projects/INTELLIEMO');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.name, 'INTELLIEMO');
});

test('8. API: GET /api/projects/:id/readme returns decoded, authentic README', async () => {
  const res = await makeRequest('/api/projects/INTELLIEMO/readme');
  assert.strictEqual(res.status, 200);
  assert(res.data.readme);
  assert(res.data.readme.content.includes('INTELLIEMO'));
  assert.strictEqual(res.data.repository.name, 'INTELLIEMO');
});

test('9. API: POST /api/github/disconnect clears session', async () => {
  const res = await makeRequest('/api/github/disconnect', { method: 'POST' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
});

test('10. API: POST /api/projects/refresh resets cache', async () => {
  const res = await makeRequest('/api/projects/refresh', { method: 'POST' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
});
