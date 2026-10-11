const test = require('node:test');
const assert = require('node:assert');

// Load window.ownerProfile from js/data.js
global.window = {};
require('../js/data');
const profile = global.window.ownerProfile;

test('Task 3: ownerProfile data integrity and non-fabrication', () => {
  assert.ok(profile, 'ownerProfile must exist');
  assert.ok(profile.identity, 'identity must exist');
  assert.strictEqual(profile.identity.fullName, 'Ayush Vishwakarma');
});

test('Task 3: achievements schema contains verified hackathon records', () => {
  assert.ok(Array.isArray(profile.achievements), 'achievements must be an array');
  assert.strictEqual(profile.achievements.length >= 4, true, 'Must have at least 4 hackathon achievements');

  const nsd = profile.achievements.find(a => a.id === 'nsd-hackathon');
  assert.ok(nsd, 'NSD Hackathon must exist');
  assert.strictEqual(nsd.rank, '1st Prize');
  assert.strictEqual(nsd.status, 'verified');

  const gameJam = profile.achievements.find(a => a.id === 'nextgen-gamejam-2k26');
  assert.ok(gameJam, 'NextGen Game Jam must exist');
  assert.strictEqual(gameJam.rank, 'Third Prize');
  assert.strictEqual(gameJam.status, 'verified');

  const aws = profile.achievements.find(a => a.id === 'aws-hackathon-iitk');
  assert.ok(aws, 'AWS Hackathon must exist');
  assert.strictEqual(aws.rank, '2nd Place');

  const eightfold = profile.achievements.find(a => a.id === 'eightfold-ai-hackathon');
  assert.ok(eightfold, 'Eightfold.ai Hackathon must exist');
  assert.strictEqual(eightfold.rank, 'Top 5 Finalist');
});

test('Task 3: techStack schema contains proficiency tiers', () => {
  assert.ok(profile.techStack, 'techStack must exist');
  assert.ok(Array.isArray(profile.techStack.production), 'production tier must be an array');
  assert.ok(Array.isArray(profile.techStack.proficient), 'proficient tier must be an array');
  assert.ok(Array.isArray(profile.techStack.familiar), 'familiar tier must be an array');

  assert.ok(profile.techStack.production.some(t => t.name === 'Python'));
  assert.ok(profile.techStack.production.some(t => t.name === 'PyTorch'));
  assert.ok(profile.techStack.production.some(t => t.name === 'FastAPI'));
});

test('Task 3: research schema differentiates formal states with methodology and metrics', () => {
  assert.ok(Array.isArray(profile.research), 'research must be an array');
  assert.strictEqual(profile.research.length >= 2, true);

  for (const item of profile.research) {
    assert.ok(
      ['WORK_IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'PREPRINT', 'PUBLISHED'].includes(item.status),
      `Invalid research status: ${item.status}`
    );
    assert.ok(item.researchQuestion, 'Must specify research question');
    assert.ok(item.methodology, 'Must specify methodology');
  }
});

test('Task 3: certifications schema contains verified records from authentic documents', () => {
  assert.ok(Array.isArray(profile.certifications), 'certifications must be an array');
  assert.strictEqual(profile.certifications.length, 6, 'Must have exactly 6 verified credentials');

  const deloitte = profile.certifications.find(c => c.id === 'deloitte-data-analytics');
  assert.ok(deloitte, 'Deloitte certification must exist');
  assert.strictEqual(deloitte.verificationCode, '6a72e8c586066446594f9e49');

  const goldman = profile.certifications.find(c => c.id === 'goldman-sachs-operations');
  assert.ok(goldman, 'Goldman Sachs certification must exist');
  assert.strictEqual(goldman.verificationCode, '6a730a28125ca4556e14d0a6');
});
