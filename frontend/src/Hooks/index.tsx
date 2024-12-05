import { useCallback, useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import T from "../Singletons/Typer";
import Swal from "sweetalert2";
import { ErrorType } from "../Types/Hooks/Hooks";
import { useNavigate } from "react-router-dom";
import { INDEX } from "../Routes/Routes";

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export const useToday = (): string => {
    const date = new Date();
    const gg = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const aaaa = date.getFullYear();
    return `${aaaa}-${mm}-${gg}`;
}

const useError = () => {
    const nav = useNavigate();
    const handleError = useCallback((error: ErrorType) => {
        // Validate the error object using Typer
        const typedError = T.isType("o", error);

        console.error("An error occurred during the request:", typedError);

        if (typedError.response) {
            T.isType("o", typedError.response);
            T.isType("s", typedError.response.data.message);

            Swal.fire("Error", `An error occurred during the request: ${typedError.response.data.message}`, "error");
        } else if (typedError.request) {
            T.isType("o", typedError.request);

            Swal.fire("Error", "No response was received from the server. Please try again later.", "error");
        } else {
            Swal.fire("Error", "An error occurred in the request configuration.", "error");
        }
    }, []);

    const handleApiError = useCallback((message: string, backTo: string = INDEX) => {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
        }).then((_) => nav(backTo));
    }, [nav]);

    return { handleError, handleApiError };
};

export default useError;