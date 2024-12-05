export type TriggerErrorProps = {
    isTriggered: boolean;
    message: string;
};

export type InputProps = {
    type?: string;
    name: string;
    value: string | number | Date | null;
    placeholder?: string;
    label?: string;
    isTextArea?: boolean;
    customId?: string;
    customClass?: string;
    onClick?: (event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    maxChars?: number
    triggerError?: TriggerErrorProps;
    customContainerClass?: string; 
    disabled?: boolean;
    readOnly?: boolean;
    prefix?: string;
};