import { useState, createContext } from "react";
import { AppProviderProps, AppProviderReturn } from "../Types/Contexts/AppContext";

export const AppContext = createContext<AppProviderReturn | null>(null);

export const AppProvider = ({ children }: AppProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const providerData: AppProviderReturn = {
        isLoading,
        setIsLoading,
    };

    return (
        <AppContext.Provider value={providerData}>
            {children}
        </AppContext.Provider>
    );
}