import T from "../Singletons/Typer";
import { AxiosSettings, LoaderSettings } from "../Types/Constants/Constants";
import { BASE_URL } from "./Endpoints";

// Token for http requests
export const AUTH_TOKEN: string = "P(MWgK3D#Evu&4zbLnYt^d*XVk";

// Axios settings for axios.create()
export const AXIOS_SETTINGS: AxiosSettings = {
    baseURL: T.isURL(BASE_URL)!,
    timeout: T.isType("n", 60000),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    responseType: 'json',
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 400,
};

// Loader settings for react-spinners
export const LOADER_SETTINGS: LoaderSettings = {
    color: T.isType("s", "#4811ad"),
    size: T.isType("n", 75),
    speedMultiplier: T.isType("n", 1.2),
};