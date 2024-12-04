import axios from "axios";
import T from "../../Singletons/Typer";
import { AUTH_TOKEN, AXIOS_SETTINGS, CACHE_EXCLUDED_ENDPOINTS } from "../../Constants/Constants";
import { getFromCache, saveToCache } from "../Cache";

const ApiClient = axios.create(T.isType("o", AXIOS_SETTINGS));

ApiClient.interceptors.request.use(
    async (config) => {
        try {
            config.url = T.isType("s", config.url);
            config.headers.Authorization = `Bearer ${T.isType("s", AUTH_TOKEN)}`;

            if (!(T.isArrayOf("s", CACHE_EXCLUDED_ENDPOINTS) as string[]).includes(config.url!)) {
                const cacheKey = JSON.stringify({
                    url: config.url,
                    method: config.method,
                    params: config.params,
                    data: config.data,
                });

                const cachedData = await getFromCache(cacheKey);

                if (cachedData) {
                    // console.log("Cache hit:", config.url);
                    return Promise.reject({ config, cached: true, data: cachedData });
                }
                config.doNotCache = false;
            } else {
                config.doNotCache = true;
            }
            // console.log("Cache miss:", config.url);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return Promise.reject(new Error(`URL non valido: ${error.message}`));
            } else {
                return Promise.reject(new Error('URL non valido: errore sconosciuto'));
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to save in cache
ApiClient.interceptors.response.use(
    async (response) => {
        const { config } = response;
        if (!config.doNotCache && !(T.isArrayOf("s", CACHE_EXCLUDED_ENDPOINTS) as string[]).includes(config.url!)) {
            const cacheKey = JSON.stringify({
                url: response.config.url,
                method: response.config.method,
                params: response.config.params,
                data: response.config.data,
            });

            await saveToCache(cacheKey, response.data);
        }
        return response;
    },
    (error) => {
        if (error.cached) {
            return Promise.resolve({ data: error.data, config: error.config });
        }
        return Promise.reject(error);
    }
);
export default ApiClient;