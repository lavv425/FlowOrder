import { TriggerErrorProps } from "./Input";

export type CustomDatePickerProps = {
    // dateRef: MutableRefObject<string | null>; // MutableRefObject allows direct modifications to ref.current
    dateState: [string | null, React.Dispatch<React.SetStateAction<string | null>>]; // State tuple
    label: string;
    placeholder: string;
    triggerError?: TriggerErrorProps;
    onChange?: () => void;
};