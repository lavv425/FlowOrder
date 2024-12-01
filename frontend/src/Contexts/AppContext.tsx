import { createContext } from "react";
import { AppProviderReturn } from "../Types/Contexts/AppProvider";

export const AppContext = createContext<AppProviderReturn | null>(null);
