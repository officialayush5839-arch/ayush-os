const test = require('node:test');
const assert = require('node:assert');
const AppRegistry = require('../js/app-registry');

test('Task 1: AppRegistry resolves canonical IDs directly', () => {
  const canonicalIds = [
    'projects',
    'internships',
    'achievements',
    'techstack',
    'research',
    'certifications',
    'journey',
    'contact'
  ];

  for (const id of canonicalIds) {
    const app = AppRegistry.resolve(id);
    assert.ok(app, `App ${id} must resolve`);
    assert.strictEqual(app.id, id);
    assert.ok(app.title, `App ${id} must have a title`);
    assert.ok(app.icon, `App ${id} must have an icon`);
  }
});

test('Task 1: AppRegistry resolves legacy aliases without breaking', () => {
  assert.strictEqual(AppRegistry.resolve('revenue').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('results').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('testimonials').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('proof').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('process').id, 'techstack');
  assert.strictEqual(AppRegistry.resolve('systems').id, 'techstack');
  assert.strictEqual(AppRegistry.resolve('stack').id, 'techstack');
  assert.strictEqual(AppRegistry.resolve('papers').id, 'research');
  assert.strictEqual(AppRegistry.resolve('lab').id, 'research');
  assert.strictEqual(AppRegistry.resolve('learn').id, 'certifications');
  assert.strictEqual(AppRegistry.resolve('education').id, 'certifications');
  assert.strictEqual(AppRegistry.resolve('about').id, 'journey');
  assert.strictEqual(AppRegistry.resolve('story').id, 'journey');
  assert.strictEqual(AppRegistry.resolve('collaborate').id, 'contact');
  assert.strictEqual(AppRegistry.resolve('messages').id, 'contact');
});

test('Task 1: AppRegistry handles invalid or unknown IDs gracefully', () => {
  assert.strictEqual(AppRegistry.resolve('non-existent-xyz'), null);
  assert.strictEqual(AppRegistry.resolve(''), null);
  assert.strictEqual(AppRegistry.resolve(null), null);
  assert.strictEqual(AppRegistry.resolve(undefined), null);
});

test('Task 1: AppRegistry returns all 8 canonical applications in ordered list', () => {
  const allApps = AppRegistry.getAll();
  assert.strictEqual(allApps.length, 8);
  const ids = allApps.map(a => a.id);
  assert.deepStrictEqual(ids, [
    'projects',
    'internships',
    'achievements',
    'techstack',
    'research',
    'certifications',
    'journey',
    'contact'
  ]);
});
