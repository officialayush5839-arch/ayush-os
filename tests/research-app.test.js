const test = require('node:test');
const assert = require('node:assert');

// Mock browser global
global.window = {};
require('../js/data');
const ResearchApp = require('../js/apps/research-app');

test('Task 6: ResearchApp is defined with required methods', () => {
  assert.ok(ResearchApp, 'ResearchApp should exist');
  assert.strictEqual(typeof ResearchApp.getContent, 'function');
  assert.strictEqual(typeof ResearchApp.init, 'function');
});

test('Task 6: ResearchApp getContent displays formal research states and methodologies', () => {
  const html = ResearchApp.getContent();
  assert.ok(html.includes('WORK IN PROGRESS'), 'Should display formal status tag');
  assert.ok(html.includes('RESEARCH QUESTION'), 'Should display research question field');
  assert.ok(html.includes('METHODOLOGY'), 'Should display methodology field');
  assert.ok(html.includes('DATASET'), 'Should display dataset field');
  assert.ok(html.includes('Explainable Emotion Intelligence'), 'Should include INTELLIEMO research topic');
  assert.ok(html.includes('Automatic Weather Station Telemetry'), 'Should include SkyGuard research topic');
  assert.ok(html.toLowerCase().includes('reproducibility'), 'Should link to reproducible codebases');
});
