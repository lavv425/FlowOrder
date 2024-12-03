type ErrorResponse = {
    data: {
        message: string;
    };
};

export type ErrorType = {
    response?: ErrorResponse;
    request?: unknown;
    message?: string;
};