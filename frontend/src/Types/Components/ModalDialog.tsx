export type ModalDialogProps = {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
};