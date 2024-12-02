import { FC, useState } from "react";
import { createPortal } from "react-dom";
import { useSweetAlert } from "../../Hooks";
import { SweetAlertPortalProps } from "../../Types/Components/SweetAlertPortal";
import Swal, { SweetAlertResult } from "sweetalert2";
import { StyledButton } from "../../Styles/StyledComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SweetAlertPortal: FC<SweetAlertPortalProps> = ({ buttonOptions, validationStates, options, children, onConfirm, onDismiss, onDeny }) => {
    const { fire } = useSweetAlert();
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

    const {
        text: buttonText,
        className: buttonClass,
        icon: buttonIcon,
        disabled: buttonDisabled,
    } = buttonOptions;

    const showAlert = async () => {
        // Create a div container for the portal
        const container = document.createElement("div");
        document.body.appendChild(container);
        setPortalContainer(container);

        const result: SweetAlertResult = await fire({
            options: {
                ...options,
                html: container,
                willClose: () => {
                    // CLean the portal when sweetalert is closed
                    if (onDismiss) onDismiss();
                    if (container.parentNode) {
                        container.remove();
                    }
                    setPortalContainer(null);
                }
            },
            onConfirm,
            onDeny,
            onDismiss
        });

        return result;
    };

    return (
        <>
            {/* Mount the childrend in the container */}
            {portalContainer && createPortal(children, portalContainer)}
            <StyledButton
                onClick={showAlert}
                className={`${buttonClass}`.trim()}
                disabled={buttonDisabled || false}
            >
                {buttonIcon && <FontAwesomeIcon icon={buttonIcon} />}
                {buttonText || "Open Modal"}
            </StyledButton>
        </>
    );
};

export default SweetAlertPortal;