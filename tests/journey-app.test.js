const test = require('node:test');
const assert = require('node:assert');

// Mock browser global
global.window = {};
require('../js/data');
const JourneyApp = require('../js/apps/journey-app');

test('Task 8: JourneyApp is defined with required methods', () => {
  assert.ok(JourneyApp, 'JourneyApp should exist');
  assert.strictEqual(typeof JourneyApp.getContent, 'function');
  assert.strictEqual(typeof JourneyApp.init, 'function');
});

test('Task 8: JourneyApp getContent renders timeline and next horizon', () => {
  const html = JourneyApp.getContent();
  assert.ok(html.includes('2023'), 'Should include 2023');
  assert.ok(html.includes('2025'), 'Should include 2025');
  assert.ok(html.includes('2026'), 'Should include 2026');
  assert.ok(html.includes('Vishwakarma University'), 'Should mention Vishwakarma University');
  assert.ok(html.includes('NEXT HORIZON'), 'Should mention Next Horizon');
});

test('Task 8: JourneyApp renders authentic academic journey extracted from certificates', () => {
  const html = JourneyApp.getContent();
  
  // 1. Schooling: Kroot Memorial School (10th SSC)
  assert.ok(html.includes('Kroot Memorial School'), 'Must mention Kroot Memorial School');
  assert.ok(html.includes('79.20%'), 'Must state authentic SSC percentage 79.20%');
  assert.ok(html.includes('396'), 'Must state authentic SSC marks 396');

  // 2. Junior College: College of Arts Science and Commerce (12th HSC Science)
  assert.ok(html.includes('College of Arts, Science and Commerce') || html.includes('College of Arts Science and Commerce'), 'Must mention College of Arts Science and Commerce');
  assert.ok(html.includes('81.67%'), 'Must state authentic HSC percentage 81.67%');
  assert.ok(html.includes('94'), 'Must state authentic IT mark 94/100');

  // 3. CET Exam: MAH-MHT CET 2025
  assert.ok(html.includes('CET') || html.includes('MHT-CET'), 'Must mention CET exam');
  assert.ok(html.includes('85.4179') || html.includes('85.42'), 'Must mention authentic CET percentile');
  assert.ok(html.includes('95.49'), 'Must mention authentic Chemistry percentile 95.49%ile');

  // 4. University & Hackathons at Vishwakarma University
  assert.ok(html.includes('Vishwakarma University'), 'Must mention Vishwakarma University');
  assert.ok(html.includes('NSD Hackathon'), 'Must mention NSD Hackathon won at VU');
  assert.ok(html.includes('AWS Hackathon'), 'Must mention AWS Hackathon at IIT Kanpur');
  assert.ok(html.includes('Eightfold.ai'), 'Must mention Eightfold.ai hackathon');
  assert.ok(html.includes('Game Jam 2K26'), 'Must mention Game Jam 2K26');
});
