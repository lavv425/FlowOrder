import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { SweetAlertOptions } from "sweetalert2";

type ButtonOptions = {
    text: string;
    className?: string;
    icon?: IconProp | IconDefinition;
    disabled?: boolean;
};
export type SweetAlertPortalProps = {
    buttonOptions: ButtonOptions;
    validationStates?: Record<string, any>;
    options: SweetAlertOptions;
    children: JSX.Element;
    onConfirm?: () => void;
    onDismiss?: () => void;
    onDeny?: () => void;
};
