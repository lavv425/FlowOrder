import T from "../Singletons/Typer";
import { TriggerErrorProps } from "../Types/Components/Input";
import { AxiosSettings, LoaderSettings, XLSXDownloadOptions } from "../Types/Constants/Constants";
import { BASE_URL } from "./Endpoints";

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

export const generateLengthError = (length: number, fieldName: string): TriggerErrorProps => ({
    isTriggered: true,
    message: `${fieldName} should not exceed ${length} characters`
});

export const NAME_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "You must provide a valid name for the order."
};

export const DESCRIPTION_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "You must provide a valid description for the order."
};

export const DATE_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "You must provide a valid date for the order."
};

export const PRODUCT_NAME_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "Product name is required!"
};

export const PRODUCT_PRICE_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "Product name is required!"
};

export const DUPLICATE_PRODUCT_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "Product names cannot be duplicated!"
};

export const NOT_FOUND_ERROR_INPUT: TriggerErrorProps = {
    isTriggered: true,
    message: "No results found!"
}

export const XLSX_DOWNLOAD_OPTIONS: XLSXDownloadOptions = { bookType: "xlsx", type: "file", compression: true };

// Cache options
export const CACHE_DB_NAME: string = "apiCache";
export const CACHE_STORE_NAME: string = "cacheStore";
export const CACHE_TTL: number = 15 * 1000; // 20SEC
export const CACHE_EXCLUDED_ENDPOINTS: string[] = []; // Insert here the endpoints you want to exclude from caching