declare global {
    interface String {
        normalizeForSearch(): string;
    }
}

declare module "axios" {
    export interface AxiosRequestConfig {
        doNotCache?: boolean;
    }
}

export { };