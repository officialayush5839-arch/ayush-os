const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const AppRegistry = require('../js/app-registry');

test('Task 10: AppRegistry covers all 8 canonical apps and all legacy aliases', () => {
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

  canonicalIds.forEach(id => {
    assert.strictEqual(AppRegistry.resolve(id).id, id);
  });

  // Backward compatibility alias checks
  assert.strictEqual(AppRegistry.resolve('revenue').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('results').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('proof').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('testimonials').id, 'achievements');
  assert.strictEqual(AppRegistry.resolve('process').id, 'techstack');
  assert.strictEqual(AppRegistry.resolve('systems').id, 'techstack');
  assert.strictEqual(AppRegistry.resolve('learn').id, 'certifications');
  assert.strictEqual(AppRegistry.resolve('education').id, 'certifications');
  assert.strictEqual(AppRegistry.resolve('about').id, 'journey');
  assert.strictEqual(AppRegistry.resolve('story').id, 'journey');
  assert.strictEqual(AppRegistry.resolve('collaborate').id, 'contact');
});

test('Task 10: index.html includes scripts for all 8 applications and shared modules', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  assert.ok(html.includes('js/data.js'), 'Must include data.js');
  assert.ok(html.includes('js/app-registry.js'), 'Must include app-registry.js');
  assert.ok(html.includes('js/evidence-viewer.js'), 'Must include evidence-viewer.js');
  assert.ok(html.includes('js/apps/projects-explorer.js'), 'Must include projects-explorer.js');
  assert.ok(html.includes('js/apps/internships-app.js'), 'Must include internships-app.js');
  assert.ok(html.includes('js/apps/achievements-app.js'), 'Must include achievements-app.js');
  assert.ok(html.includes('js/apps/techstack-app.js'), 'Must include techstack-app.js');
  assert.ok(html.includes('js/apps/research-app.js'), 'Must include research-app.js');
  assert.ok(html.includes('js/apps/certifications-app.js'), 'Must include certifications-app.js');
  assert.ok(html.includes('js/apps/journey-app.js'), 'Must include journey-app.js');
  assert.ok(html.includes('styles/portfolio-apps.css'), 'Must include portfolio-apps.css');
});

test('Task 10: styles/portfolio-apps.css strictly adheres to retro OS color palette matching internships & projects', () => {
  const css = fs.readFileSync(path.join(__dirname, '../styles/portfolio-apps.css'), 'utf8');

  assert.ok(css.includes('var(--sand'), 'Must use sand/paper background palette');
  assert.ok(css.includes('var(--ink'), 'Must use ink for borders and text');
  assert.ok(css.includes('var(--wine'), 'Must use wine for accents');
  assert.ok(css.includes('var(--cream'), 'Must use cream for highlight boxes');
  assert.ok(css.includes('var(--pixel'), 'Must use pixel font for badges');
});

test('Task 10: All frontend scripts in index.html have valid syntax (no SyntaxError)', () => {
  const { execSync } = require('child_process');
  const scripts = [
    'js/data.js',
    'js/app-registry.js',
    'js/evidence-viewer.js',
    'js/markdown.js',
    'js/apps/projects-explorer.js',
    'js/apps/internships-app.js',
    'js/apps/achievements-app.js',
    'js/apps/techstack-app.js',
    'js/apps/research-app.js',
    'js/apps/certifications-app.js',
    'js/apps/journey-app.js',
    'js/apps/contact-app.js',
    'js/apps/resume-app.js',
    'app.js'
  ];

  for (const script of scripts) {
    const fullPath = path.join(__dirname, '..', script);
    assert.doesNotThrow(() => {
      execSync(`node -c "${fullPath}"`, { stdio: 'pipe' });
    }, `Script ${script} must compile cleanly without syntax errors`);
  }
});

test('Task 10: index.html desktop grid and dock contain the 8 canonical apps', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  const requiredDataOpens = [
    'data-open="projects"',
    'data-open="internships"',
    'data-open="achievements"',
    'data-open="techstack"',
    'data-open="research"',
    'data-open="certifications"',
    'data-open="journey"',
    'data-open="contact"'
  ];

  for (const trigger of requiredDataOpens) {
    assert.ok(html.includes(trigger), `index.html must include ${trigger}`);
  }
});
