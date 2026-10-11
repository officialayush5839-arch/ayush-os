const test = require('node:test');
const assert = require('node:assert');

// Mock browser DOM environment for testing EvidenceViewer
class MockElement {
  constructor(tag) {
    this.tagName = tag;
    this.classList = {
      _set: new Set(),
      add: (c) => this.classList._set.add(c),
      remove: (c) => this.classList._set.delete(c),
      contains: (c) => this.classList._set.has(c)
    };
    this.children = [];
    this.innerHTML = '';
    this.style = {};
    this.hidden = true;
    this._listeners = {};
    this.attributes = {};
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  }
  removeEventListener(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(h => h !== handler);
  }
  dispatchEvent(event) {
    if (this._listeners[event.type]) {
      this._listeners[event.type].forEach(h => h(event));
    }
  }
  querySelector(sel) {
    if (sel === '[data-evidence-close]') return new MockElement('button');
    if (sel === '[data-evidence-body]') return new MockElement('div');
    return null;
  }
  querySelectorAll() { return []; }
  appendChild(child) { this.children.push(child); }
  remove() {}
}

const mockDocument = {
  body: new MockElement('body'),
  createElement: (tag) => new MockElement(tag),
  getElementById: (id) => null,
  querySelector: (sel) => null,
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.document = mockDocument;
global.window = { document: mockDocument };

const EvidenceViewer = require('../js/evidence-viewer');

test('Task 2: EvidenceViewer is defined and initial state is closed', () => {
  assert.ok(EvidenceViewer, 'EvidenceViewer should exist');
  assert.strictEqual(typeof EvidenceViewer.open, 'function');
  assert.strictEqual(typeof EvidenceViewer.close, 'function');
  assert.strictEqual(typeof EvidenceViewer.isOpen, 'function');
  assert.strictEqual(EvidenceViewer.isOpen(), false);
});

test('Task 2: EvidenceViewer open and close lifecycle', () => {
  EvidenceViewer.open({
    title: 'Deloitte Job Simulation',
    issuer: 'Deloitte',
    date: 'August 5, 2026',
    docType: 'CERTIFICATE_OF_COMPLETION',
    verificationCode: '6a72e8c586066446594f9e49',
    fileUrl: './assets/certificates/deloitte.png'
  });

  assert.strictEqual(EvidenceViewer.isOpen(), true);
  const current = EvidenceViewer.getCurrent();
  assert.strictEqual(current.title, 'Deloitte Job Simulation');
  assert.strictEqual(current.verificationCode, '6a72e8c586066446594f9e49');

  EvidenceViewer.close();
  assert.strictEqual(EvidenceViewer.isOpen(), false);
  assert.strictEqual(EvidenceViewer.getCurrent(), null);
});

test('Task 2: EvidenceViewer handles missing fileUrl gracefully without throw', () => {
  assert.doesNotThrow(() => {
    EvidenceViewer.open({
      title: 'Missing File Test',
      issuer: 'Test Org',
      verificationCode: 'TEST1234'
    });
  });
  assert.strictEqual(EvidenceViewer.isOpen(), true);
  EvidenceViewer.close();
});

test('Task 2: EvidenceViewer resolves string ID via ownerProfile and renders PDF iframe', () => {
  require('../js/data');
  EvidenceViewer.open('deloitte-data-analytics');
  assert.strictEqual(EvidenceViewer.isOpen(), true);
  const current = EvidenceViewer.getCurrent();
  assert.strictEqual(current.id, 'deloitte-data-analytics');
  assert.strictEqual(current.fileUrl, 'assets/documents/deloitte-data-analytics.pdf');
  assert.strictEqual(current.verificationCode, '6a72e8c586066446594f9e49');
  EvidenceViewer.close();
  assert.strictEqual(EvidenceViewer.isOpen(), false);
});

