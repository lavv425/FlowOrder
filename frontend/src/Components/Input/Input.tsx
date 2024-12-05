import { FC, useCallback } from "react";
import { InputWrapper, StyledInput, StyledInputContainer, StyledLabel, StyledTextArea } from "../../Styles/StyledComponents";
import { InputProps } from "../../Types/Components/Input";
import { NO_ERROR_INPUT } from "../../Constants/Constants";

const Input: FC<InputProps> = ({ type, name, value, placeholder, label, isTextArea = false, customId, customClass, onClick, onKeyDown, onChange, triggerError = NO_ERROR_INPUT, customContainerClass, disabled = false, readOnly = false, prefix }) => {
    const InputComponent: React.ElementType = isTextArea ? StyledTextArea : StyledInput;

    const handleDecimalInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        if (type === "number" && inputValue) {
            const [_, decimalPart] = inputValue.split(".");
            if (decimalPart && decimalPart.length > 2) {
                const formattedValue = parseFloat(inputValue).toFixed(2);
                if (onChange) {
                    onChange({
                        ...event,
                        target: { ...event.target, value: formattedValue }
                    });
                }
            } else if (onChange) {
                onChange(event);
            }
        } else if (onChange) {
            onChange(event);
        }
    }, [onChange, type]);

    return (
        <InputWrapper className={customContainerClass}>
            {label && <StyledLabel htmlFor={customId}>{label}</StyledLabel>}
            <StyledInputContainer>
                {prefix && <span className="input-prefix">{prefix}</span>}
                <InputComponent
                    type={!isTextArea ? type || "text" : undefined}
                    step={type === "number" ? "0.01" : undefined}
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
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onChange={type === "number" ? handleDecimalInput : onChange}
                    readOnly={readOnly}
                />
            </StyledInputContainer>
            {triggerError.isTriggered && (
                <span className="error">{triggerError.message}</span>
            )}
        </InputWrapper>
    );
}

export default Input;