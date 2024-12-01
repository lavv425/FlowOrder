import { useState } from "react";
import { AppContext } from "./AppContext";
import { AppProviderProps, AppProviderReturn } from "../Types/Contexts/AppProvider";
import Loader from "../Components/Loader/Loader";

export const AppProvider = ({ children }: AppProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const providerData: AppProviderReturn = {
        isLoading,
        setIsLoading,
    };

    return (
        <AppContext.Provider value={providerData}>
            {isLoading && <Loader />}
            {children}
        </AppContext.Provider>
    );
}