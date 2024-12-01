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