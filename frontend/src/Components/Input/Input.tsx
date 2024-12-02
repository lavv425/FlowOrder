import { FC } from "react";
import { InputWrapper, StyledInput, StyledLabel, StyledTextArea } from "../../Styles/StyledComponents";
import { InputProps } from "../../Types/Components/Input";
import { NO_ERROR_INPUT } from "../../Constants/Constants";

const Input: FC<InputProps> = ({ type, name, value, placeholder, label, isTextArea = false, customId, customClass, onKeyDown, onChange, triggerError = NO_ERROR_INPUT, customContainerClass, disabled = false, readOnly = false }) => {
    const InputComponent: React.ElementType = isTextArea ? StyledTextArea : StyledInput;

    return (
        <InputWrapper className={customContainerClass}>
            {label && <StyledLabel htmlFor={customId}>{label}</StyledLabel>}
            <InputComponent
                type={!isTextArea ? type || "text" : undefined}
                name={name}
                value={value}
                placeholder={placeholder}
                className={(
                    triggerError.isTriggered
                        ? `errored ${customClass || ""}`
                        : customClass || ""
                ).trim()}
                id={customId}
                disabled={disabled}
                onKeyDown={onKeyDown}
                onChange={onChange}
                readOnly={readOnly}
            />
            {triggerError.isTriggered && (
                <span className="error">{triggerError.message}</span>
            )}
        </InputWrapper>
    );
}

export default Input;