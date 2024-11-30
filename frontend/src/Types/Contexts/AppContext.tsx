export type AppProviderProps = {
    children: React.ReactNode;
};

export type AppProviderReturn = {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};