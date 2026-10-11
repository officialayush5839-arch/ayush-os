const test = require('node:test');
const assert = require('node:assert');

// Mock browser global
global.window = {};
require('../js/data');
const TechStackApp = require('../js/apps/techstack-app');

test('Task 5: TechStackApp is defined with required methods', () => {
  assert.ok(TechStackApp, 'TechStackApp should exist');
  assert.strictEqual(typeof TechStackApp.getContent, 'function');
  assert.strictEqual(typeof TechStackApp.init, 'function');
});

test('Task 5: TechStackApp getContent renders proficiency tiers without arbitrary percentages', () => {
  const html = TechStackApp.getContent();
  assert.ok(html.includes('PRODUCTION-READY'), 'Should include production tier');
  assert.ok(html.includes('ACTIVELY BUILDING'), 'Should include proficient tier');
  assert.ok(html.includes('FAMILIAR / EXPLORING'), 'Should include familiar tier');
  assert.ok(html.includes('Python'), 'Should include Python');
  assert.ok(html.includes('PyTorch'), 'Should include PyTorch');
  assert.ok(html.includes('FastAPI'), 'Should include FastAPI');
  assert.ok(!html.includes('95% Python'), 'Must not have fake percentages');
});

test('Task 5: TechStackApp includes interactive systems pipeline nodes', () => {
  const html = TechStackApp.getContent();
  assert.ok(html.includes('systems-pipeline'), 'Should have systems pipeline');
  assert.ok(html.includes('INGESTION'), 'Should have Ingestion node');
  assert.ok(html.includes('PREPROCESSING'), 'Should have Preprocessing node');
  assert.ok(html.includes('MODEL INFERENCE'), 'Should have Model node');
  assert.ok(html.includes('FASTAPI SERVICE'), 'Should have FastAPI node');
  assert.ok(html.includes('AYUSH.OS SHELL'), 'Should have OS interface node');
});
