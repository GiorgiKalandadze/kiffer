const cache = new Map();
export class QueryCache {
    static getCacheValue(key) {
        if(cache.has(key)){
            return cache.get(key);
        }
        return null;
    }

    static setCacheValue(key, value) {
        cache.set(key, value);
    }

    static clearCache() {
        cache.clear();
    }


    static deleteCacheValue(key) {
        cache.delete(key);
    }

    static hasCacheValue(key) {
        return cache.has(key);
    }
}