const test = require('node:test');
const assert = require('node:assert');

// Mock browser global
global.window = {};
require('../js/data');
const CertificationsApp = require('../js/apps/certifications-app');

test('Task 7: CertificationsApp is defined with required methods', () => {
  assert.ok(CertificationsApp, 'CertificationsApp should exist');
  assert.strictEqual(typeof CertificationsApp.getContent, 'function');
  assert.strictEqual(typeof CertificationsApp.init, 'function');
});

test('Task 7: CertificationsApp getContent renders all 6 authentic certificates', () => {
  const html = CertificationsApp.getContent();
  assert.ok(html.includes('Deloitte'), 'Should include Deloitte');
  assert.ok(html.includes('6a72e8c586066446594f9e49'), 'Should include Deloitte verification code');
  assert.ok(html.includes('Goldman Sachs'), 'Should include Goldman Sachs');
  assert.ok(html.includes('6a730a28125ca4556e14d0a6'), 'Should include Goldman Sachs verification code');
  assert.ok(html.includes('Comtech Computer Institute'), 'Should include Comtech');
  assert.ok(html.includes('MS.OFFICE'), 'Should include MS.OFFICE');
  assert.ok(html.includes('TALLY ERP.9'), 'Should include TALLY');
  assert.ok(html.includes('Vishwanova 2026'), 'Should include MIT-WPU Vishwanova');
  assert.ok(html.includes('NextGen Game Jam 2K26'), 'Should include Binghamton/VU certificate');
});

test('Task 7: CertificationsApp includes inspect credential triggers', () => {
  const html = CertificationsApp.getContent();
  assert.ok(html.includes('data-inspect-cert'), 'Should have inspect triggers');
  assert.ok(html.includes('VERIFIED'), 'Should have verified status');
});
