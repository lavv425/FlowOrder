import { SweetAlertOptions } from "sweetalert2";

export type FireProps = {
    options: SweetAlertOptions;
    onConfirm?: () => void;
    onDeny?: () => void;
    onDismiss?: () => void;
};

export type ToastProps = {
    title: string;
    text?: string;
    icon: "success" | "error" | "warning" | "info" | "question";
};