import axios from "axios";
import T from "../../Singletons/Typer";
import { AUTH_TOKEN, AXIOS_SETTINGS } from "../../Constants/Constants";

const ApiClient = axios.create(T.isType("o", AXIOS_SETTINGS));

ApiClient.interceptors.request.use(
    async (config) => {
        try {
            config.url = T.isType("s", config.url);
            config.headers.Authorization = `Bearer ${T.isType("s", AUTH_TOKEN)}`;
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

export default ApiClient;