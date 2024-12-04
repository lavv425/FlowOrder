// Define the cache entry type
export type CacheEntry = {
    key: string;
    data: string | number | boolean | object | null;
    expiry: number;
};

// Define the invalidateCache key entry type
export type InvalidaCacheKeyType = string | "allCachedItems";