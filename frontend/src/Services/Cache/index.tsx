import { CACHE_DB_NAME, CACHE_STORE_NAME, CACHE_TTL } from "../../Constants/Constants";
import { CacheEntry, InvalidaCacheKeyType } from "../../Types/Services/Cache";

// Open IndexedDB, returns a promise with the database instance
const openIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            return reject(new Error("IndexedDB is not supported, use localStorage instead"));
        }

        const request = indexedDB.open(CACHE_DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        // Creates the database and the store obj, if not existing
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
                db.createObjectStore(CACHE_STORE_NAME, { keyPath: "key" });
            }
        };
    });
};

// Wait for a transaction to complete
const waitForTransactionComplete = (tx: IDBTransaction): Promise<void> => {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error("Transaction aborted"));
    });
};

// Stores the new data into the cache
export const saveToCache = async (key: string, data: CacheEntry): Promise<void> => {
    const cacheEntry: CacheEntry = { key, data, expiry: Date.now() + CACHE_TTL };

    try {
        const db = await openIndexedDB();
        const tx = db.transaction(CACHE_STORE_NAME, "readwrite");
        const store = tx.objectStore(CACHE_STORE_NAME);
        store.put(cacheEntry);

        await waitForTransactionComplete(tx);
    } catch (error) {
        // Fallback a localStorage
        localStorage.setItem(key, JSON.stringify(cacheEntry));
    }
};

// Retrieves data from the cache
export const getFromCache = async (key: string): Promise<CacheEntry["data"] | null> => {
    try {
        const db = await openIndexedDB();
        const tx = db.transaction(CACHE_STORE_NAME, "readonly");
        const store = tx.objectStore(CACHE_STORE_NAME);
        const cacheEntry: CacheEntry = await new Promise((resolve) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null as any);
        });

        if (cacheEntry && Date.now() < cacheEntry.expiry) {
            return cacheEntry.data;
        }

        // Expired or not found cache
        return null;
    } catch (error) {
        // Fallback to localStorage
        const cacheEntry: CacheEntry = JSON.parse(localStorage.getItem(key) || "null");
        if (cacheEntry && Date.now() < cacheEntry.expiry) {
            return cacheEntry.data;
        }
        return null;
    }
};

// Invalidates a specific key or clears all cache
export const invalidateCache = async (key: InvalidaCacheKeyType) => {
    try {
        const db = await openIndexedDB();
        const tx = db.transaction(CACHE_STORE_NAME, "readwrite");
        const store = tx.objectStore(CACHE_STORE_NAME);

        if (key === "allCachedItems") {
            store.clear();
        } else {
            store.delete(key);
        }

        await waitForTransactionComplete(tx);
    } catch (error) {
        if (key === "allCachedItems") {
            localStorage.clear();
        } else {
            localStorage.removeItem(key);
        }
    }
};