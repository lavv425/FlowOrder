import T from "../Singletons/Typer";
import { TriggerErrorProps } from "../Types/Components/Input";
import { AxiosSettings, LoaderSettings, XLSXDownloadOptions } from "../Types/Constants/Constants";
import { BASE_URL } from "./Endpoints";

// Token for http requests
export const AUTH_TOKEN: string = "P(MWgK3D#Evu&4zbLnYt^d*XVk";

// Axios settings for axios.create()
export const AXIOS_SETTINGS: AxiosSettings = {
    baseURL: T.isURL(BASE_URL)!,
    timeout: T.isType("n", 60000),
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    responseType: "json",
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 400,
};

// Loader settings for react-spinners
export const LOADER_SETTINGS: LoaderSettings = {
    color: T.isType("s", "#4811ad"),
    size: T.isType("n", 75),
    speedMultiplier: T.isType("n", 1.2),
};


export const NO_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: false,
    message: "",
};

export const NAME_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "You must insert a valid name for the order.",
};

export const DESCRIPTION_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "You must insert a valid description for the order.",
};

export const DATE_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "You must insert a valid date for the order.",
};

export const NOT_FOUND_ERROR_INPUT = {
    isTriggered: true,
    message: "Nessun risultato!"
}

export const XLSX_DOWNLOAD_OPTIONS: XLSXDownloadOptions = { bookType: "xlsx", type: "file", compression: true };

// Cache options
export const CACHE_DB_NAME: string = "apiCache";
export const CACHE_STORE_NAME: string = "cacheStore";
export const CACHE_TTL: number = 15 * 1000; // 20SEC
export const CACHE_EXCLUDED_ENDPOINTS: string[] = []; // Insert here the endpoints you want to exclude from caching