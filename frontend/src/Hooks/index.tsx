import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import withReactContent from "sweetalert2-react-content";
import Swal, { SweetAlertResult } from "sweetalert2";
import { FireProps, ToastProps } from "../Types/Hooks/Hooks";

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

// export const useReactSwal = () => {
//     const ReactSwal = withReactContent(Swal);
//     if (!ReactSwal) {
//         throw new Error("useReactSwal could not start properly");
//     }
//     const fire = async (options: SweetAlertOptions) => {
//         return await ReactSwal.fire(options);
//     };

//     return { ReactSwal, fire };
// };

// More complete version of useReactSwal
export const useSweetAlert = () => {
    const ReactSwal = withReactContent(Swal);

    // Fire method
    const fire = async ({ options, onConfirm, onDeny, onDismiss }: FireProps): Promise<SweetAlertResult> => {
        const result = await ReactSwal.fire(options);

        if (result.isConfirmed && onConfirm) {
            onConfirm();
        } else if (result.isDenied && onDeny) {
            onDeny();
        } else if (result.isDismissed && onDismiss) {
            onDismiss();
        }

        return result;
    };

    // Toasts configs
    const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    const showToast = ({ title, text, icon }: ToastProps) => {
        Toast.fire({ title, text, icon });
    };

    return { fire, showToast };
};