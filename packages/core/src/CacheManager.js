import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
export class CacheManager {
    cachePath;
    cache = {};
    constructor(workspaceRoot) {
        this.cachePath = path.join(workspaceRoot, '.reviewer_cache.json');
        this.loadCache();
    }
    loadCache() {
        if (existsSync(this.cachePath)) {
            try {
                const data = readFileSync(this.cachePath, 'utf-8');
                this.cache = JSON.parse(data);
            }
            catch (err) {
                this.cache = {};
            }
        }
    }
    saveCache() {
        try {
            writeFileSync(this.cachePath, JSON.stringify(this.cache, null, 2));
        }
        catch (err) {
            // Ignore save failures
        }
    }
    getFileHash(content) {
        return createHash('md5').update(content).digest('hex');
    }
    getCachedResult(filePath, currentContent) {
        const entry = this.cache[filePath];
        if (!entry)
            return null;
        const currentHash = this.getFileHash(currentContent);
        if (entry.hash === currentHash) {
            return entry.result;
        }
        return null;
    }
    setCachedResult(filePath, content, result) {
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
            }
            catch (err) { }
        }
    }
}
//# sourceMappingURL=CacheManager.js.map