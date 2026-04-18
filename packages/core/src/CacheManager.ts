import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { ReviewResult } from './types.js';

export interface CacheEntry {
  hash: string;
  result: ReviewResult;
  timestamp: number;
}

export class CacheManager {
  private cachePath: string;
  private cache: Record<string, CacheEntry> = {};

  constructor(workspaceRoot: string) {
    this.cachePath = path.join(workspaceRoot, '.reviewer_cache.json');
    this.loadCache();
  }

  private loadCache() {
    if (existsSync(this.cachePath)) {
      try {
        const data = readFileSync(this.cachePath, 'utf-8');
        this.cache = JSON.parse(data);
      } catch (err) {
        this.cache = {};
      }
    }
  }

  saveCache() {
    try {
      writeFileSync(this.cachePath, JSON.stringify(this.cache, null, 2));
    } catch (err) {
      // Ignore save failures
    }
  }

  getFileHash(content: string): string {
    return createHash('md5').update(content).digest('hex');
  }

  getCachedResult(filePath: string, currentContent: string): ReviewResult | null {
    const entry = this.cache[filePath];
    if (!entry) return null;

    const currentHash = this.getFileHash(currentContent);
    if (entry.hash === currentHash) {
      return entry.result;
    }

    return null;
  }

  setCachedResult(filePath: string, content: string, result: ReviewResult) {
    this.cache[filePath] = {
      hash: this.getFileHash(content),
      result,
      timestamp: Date.now(),
    };
  }

  clear() {
    this.cache = {};
    if (existsSync(this.cachePath)) {
      try {
        writeFileSync(this.cachePath, '{}');
      } catch (err) {}
    }
  }
}
