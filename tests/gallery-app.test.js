const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Mock browser window before loading modules
global.window = {};
require('../js/data');
const AppRegistry = require('../js/app-registry');

test('Task 1: ownerProfile.gallery data schema contains authentic media items', () => {
  const gallery = window.ownerProfile.gallery;
  assert.ok(gallery, 'ownerProfile.gallery must be defined');
  assert.ok(Array.isArray(gallery), 'ownerProfile.gallery must be an array');
  assert.ok(gallery.length >= 10, 'Must contain at least 10 authentic images');

  // Verify categories
  const categories = new Set(gallery.map(i => i.category));
  assert.ok(categories.has('3D_AVATAR'), 'Must have 3D_AVATAR category');
  assert.ok(categories.has('PORTRAIT'), 'Must have PORTRAIT category');
  assert.ok(categories.has('CREDENTIAL'), 'Must have CREDENTIAL category');
  assert.ok(categories.has('HACKATHON'), 'Must have HACKATHON category');

  // Verify 3D avatars exist
  const avatarIntro = gallery.find(i => i.id === 'avatar-3d-intro');
  assert.ok(avatarIntro, 'Must include avatar-3d-intro');
  assert.ok(avatarIntro.src.includes('ayush-3d-intro'));

  const avatarDashboard = gallery.find(i => i.id === 'avatar-3d-dashboard');
  assert.ok(avatarDashboard, 'Must include avatar-3d-dashboard');

  const avatarWave = gallery.find(i => i.id === 'avatar-3d-wave');
  assert.ok(avatarWave, 'Must include avatar-3d-wave');

  // Verify Hackathon wins exist
  const nsdWin = gallery.find(i => i.id === 'hackathon-nsd-1st-prize');
  assert.ok(nsdWin, 'Must include NSD Hackathon 1st prize image');

  const gamejamWin = gallery.find(i => i.id === 'hackathon-nextgen-gamejam');
  assert.ok(gamejamWin, 'Must include NextGen Game Jam win image');

  const awsWin = gallery.find(i => i.id === 'hackathon-aws-iitk');
  assert.ok(awsWin, 'Must include AWS Hackathon IIT Kanpur win image');

  // Verify Certificates exist
  const krootCert = gallery.find(i => i.id === 'cert-kroot-memorial');
  assert.ok(krootCert, 'Must include Kroot Memorial certificate');

  const deloitteCert = gallery.find(i => i.id === 'cert-deloitte-analytics');
  assert.ok(deloitteCert, 'Must include Deloitte Data Analytics certificate');

  const goldmanCert = gallery.find(i => i.id === 'cert-goldman-sachs');
  assert.ok(goldmanCert, 'Must include Goldman Sachs certificate');

  // Verify every image file exists on disk
  for (const item of gallery) {
    const filePath = path.join(__dirname, '../', item.src);
    assert.ok(fs.existsSync(filePath), `Media file must exist on disk: ${item.src}`);
  }
});

test('Task 2: AppRegistry resolves canonical gallery app and aliases', () => {
  const galleryApp = AppRegistry.resolve('gallery');
  assert.ok(galleryApp, 'AppRegistry must resolve gallery');
  assert.strictEqual(galleryApp.id, 'gallery');
  assert.strictEqual(galleryApp.title, 'AYUSH.OS // MEDIA GALLERY');
  assert.strictEqual(galleryApp.badge, 'GALLERY');

  // Aliases
  assert.strictEqual(AppRegistry.resolve('photos').id, 'gallery');
  assert.strictEqual(AppRegistry.resolve('media').id, 'gallery');
  assert.strictEqual(AppRegistry.resolve('album').id, 'gallery');

  // Core 8 pillars unchanged
  assert.strictEqual(AppRegistry.getAll().length, 8);
  assert.strictEqual(AppRegistry.isKnown('gallery'), true);
});

test('Task 3: GalleryApp module exports required methods and renders filterable grid', () => {
  const GalleryApp = require('../js/apps/gallery-app');
  assert.ok(GalleryApp, 'GalleryApp must be exported');
  assert.strictEqual(typeof GalleryApp.getContent, 'function');
  assert.strictEqual(typeof GalleryApp.init, 'function');

  const html = GalleryApp.getContent();
  assert.ok(html.includes('MEDIA GALLERY'), 'Must include header title');
  assert.ok(html.includes('data-gallery-app'), 'Must contain container hook');
  assert.ok(html.includes('data-filter="all"'), 'Must have ALL filter tab');
  assert.ok(html.includes('data-filter="3D_AVATAR"'), 'Must have 3D_AVATAR filter tab');
  assert.ok(html.includes('data-filter="PORTRAIT"'), 'Must have PORTRAIT filter tab');
  assert.ok(html.includes('data-filter="HACKATHON"'), 'Must have HACKATHON filter tab');
  assert.ok(html.includes('data-filter="CREDENTIAL"'), 'Must have CREDENTIAL filter tab');

  // Check card elements
  assert.ok(html.includes('gallery-card'), 'Must render gallery cards');
  assert.ok(html.includes('data-lightbox-trigger'), 'Must have lightbox inspection triggers');
  assert.ok(html.includes('gallery-lightbox-modal'), 'Must include lightbox modal markup');
});

test('Task 4: app.js contains gallery app window configuration', () => {
  const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  assert.ok(appJs.includes('gallery:'), 'apps object must define gallery');
  assert.ok(appJs.includes('AYUSH.OS // MEDIA GALLERY'), 'Window title must match');
  assert.ok(appJs.includes('GalleryApp.init'), 'Must initialize GalleryApp in openApp');
});

test('Task 5: index.html integrates Gallery desktop icon, dock button, and script tag', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(html.includes('js/apps/gallery-app.js'), 'index.html must include gallery-app.js script tag');
  assert.ok(html.includes('data-open="gallery"'), 'index.html must include data-open="gallery" trigger');

  // Desktop icon
  const hasDesktop = html.includes('data-open="gallery"') && html.includes('GALLERY');
  assert.ok(hasDesktop, 'Desktop grid must contain GALLERY launcher');

  // Dock button
  const hasDock = /<nav class="dock"[^>]*>[\s\S]*?data-open="gallery"[\s\S]*?<\/nav>/.test(html);
  assert.ok(hasDock, 'Dock must include Gallery launcher');
});
