import { BookType } from "xlsx";

export type AxiosSettings = {
    baseURL: string;
    timeout: number;
    headers: {
        'Content-Type': string;
        'Accept': string;
    };
    responseType: 'json';
    withCredentials: boolean;
    validateStatus: (status: number) => boolean;
};

export type LoaderSettings = {
    color: string;
    size: number;
    speedMultiplier: number;
};

export type XLSXDownloadOptions = {
    bookType: BookType | undefined;
    type: "string" | "file" | "binary" | "buffer" | "base64" | "array" | undefined;
    compression: boolean;
};