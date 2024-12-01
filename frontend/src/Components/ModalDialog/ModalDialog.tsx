import { FC, useRef } from "react";
import { useDialog } from "@react-aria/dialog";
import { useOverlay } from "@react-aria/overlays";
import { FocusScope } from "@react-aria/focus";
import { ModalDialogProps } from "../../Types/Components/ModalDialog";
import { StyledModalDialogWrapper } from "../../Styles/StyledComponents";

const ModalDialog: FC<ModalDialogProps> = ({ title, children, onClose, isOpen }) => {

    const ref = useRef<HTMLDivElement>(null);

    const { overlayProps } = useOverlay(
        {
            onClose,
            isOpen,
            isDismissable: true,
        },
        ref
    );

    const { dialogProps, titleProps } = useDialog({}, ref);

    return (
        <FocusScope contain restoreFocus>
            <StyledModalDialogWrapper {...overlayProps}>
                <div {...dialogProps} ref={ref}>
                    <h1 {...titleProps}>{title}</h1>
                    {children}
                </div>
            </StyledModalDialogWrapper>
        </FocusScope>
    );
};

export default ModalDialog;