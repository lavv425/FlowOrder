export type TriggerErrorProps = {
    isTriggered: boolean;
    message: string;
};

export type InputProps = {
    type?: string;
    name: string;
    value: string;
    placeholder?: string;
    label?: string;
    isTextArea?: boolean;
    customId?: string;
    customClass?: string;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    triggerError?: TriggerErrorProps;
    customContainerClass?: string; 
    disabled?: boolean;
    readOnly?: boolean;
};