const test = require('node:test');
const assert = require('node:assert');

// Mock browser global
global.window = {};
require('../js/data');
const AchievementsApp = require('../js/apps/achievements-app');

test('Task 4: AchievementsApp is defined with required methods', () => {
  assert.ok(AchievementsApp, 'AchievementsApp should exist');
  assert.strictEqual(typeof AchievementsApp.getContent, 'function');
  assert.strictEqual(typeof AchievementsApp.init, 'function');
});

test('Task 4: AchievementsApp getContent renders authentic hackathons and benchmarks', () => {
  const html = AchievementsApp.getContent();
  assert.ok(html.includes('NSD Hackathon'), 'Should include NSD Hackathon');
  assert.ok(html.includes('1st Prize'), 'Should include 1st Prize');
  assert.ok(html.includes('NextGen Game Jam 2K26'), 'Should include Game Jam 2K26');
  assert.ok(html.includes('Third Prize'), 'Should include Third Prize');
  assert.ok(html.includes('AWS Hackathon'), 'Should include AWS Hackathon');
  assert.ok(html.includes('2nd Place'), 'Should include 2nd Place');
  assert.ok(html.includes('Eightfold.ai National Hackathon'), 'Should include Eightfold.ai');
  assert.ok(html.includes('Top 5 Finalist'), 'Should include Top 5 Finalist');
  assert.ok(html.includes('INTELLIEMO'), 'Should include INTELLIEMO');
  assert.ok(html.includes('90.0%'), 'Should include 90.0% metric');
});

test('Task 4: AchievementsApp contains evidence inspection triggers', () => {
  const html = AchievementsApp.getContent();
  assert.ok(html.includes('data-inspect-achievement'), 'Should have evidence inspection triggers');
  assert.ok(html.includes('VERIFIED'), 'Should include verified status badges');
});

test('Task 4: Achievements schema links valid evidence files on disk', () => {
  const fs = require('fs');
  const path = require('path');
  const list = window.ownerProfile.achievements.filter(a => a.category !== 'MODEL_BENCHMARK');
  for (const item of list) {
    assert.ok(item.fileUrl, `Achievement ${item.id} must have fileUrl defined`);
    const filePath = path.join(__dirname, '../', item.fileUrl);
    assert.ok(fs.existsSync(filePath), `Evidence file must exist on disk: ${item.fileUrl}`);
  }
});
