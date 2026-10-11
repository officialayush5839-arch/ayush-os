const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'cache_store.json');

class CacheService {
  constructor() {
    this.memoryStore = new Map();
    this.initDiskCache();
  }

  initDiskCache() {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
        const data = JSON.parse(raw);
        for (const [key, val] of Object.entries(data)) {
          // Check TTL if applicable
          if (!val.expiresAt || val.expiresAt > Date.now()) {
            this.memoryStore.set(key, val);
          }
        }
      }
    } catch (err) {
      console.warn('[CacheService] Disk cache init warning:', err.message);
    }
  }

  saveDiskCache() {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      const obj = {};
      for (const [key, val] of this.memoryStore.entries()) {
        if (!val.expiresAt || val.expiresAt > Date.now()) {
          obj[key] = val;
        }
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[CacheService] Disk cache save warning:', err.message);
    }
  }

  get(key) {
    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && item.expiresAt <= Date.now()) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs = 15 * 60 * 1000) { // default 15 min TTL
    const item = {
      value,
      expiresAt: ttlMs > 0 ? Date.now() + ttlMs : null,
      cachedAt: Date.now()
    };
    this.memoryStore.set(key, item);
    this.saveDiskCache();
    return value;
  }

  delete(key) {
    const deleted = this.memoryStore.delete(key);
    this.saveDiskCache();
    return deleted;
  }

  clear() {
    this.memoryStore.clear();
    this.saveDiskCache();
  }
}

module.exports = new CacheService();
