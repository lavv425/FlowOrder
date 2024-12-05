import { FC, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDatePickerProps } from "../../Types/Components/CustomDatePicker";
import { InputWrapper, StyledLabel } from "../../Styles/StyledComponents";
import { DATE_ERROR_INPUT, NO_ERROR_INPUT } from "../../Constants/Constants";

const CustomDatePicker: FC<CustomDatePickerProps> = ({ dateState, label, placeholder, triggerError = NO_ERROR_INPUT, onChange = null }) => {
    const [date, setDate] = dateState;
    const handleDatePickerChange = (val: Date | null) => {
        if (val) {
            const date = new Date(val);

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            setDate(formattedDate);

            if (onChange) {
                onChange();
            }
        } else {
            setDate(null);

            if (onChange) {
                onChange();
            }
        }
    };

    useEffect(()=> {
        if (date) {
            const parsedDate = new Date(date);
    
            if (!isNaN(parsedDate.getTime())) {
                triggerError = NO_ERROR_INPUT
            } else {
                triggerError = DATE_ERROR_INPUT
            }
        }
    }, [date]);

    return (
        <InputWrapper>
            <StyledLabel>{label}</StyledLabel>
            <DatePicker
                className={(
                    triggerError.isTriggered
                        ? "errored full-w react-datepicker-input"
                        : "full-w react-datepicker-input"
                ).trim()}
                shouldCloseOnSelect={true}
                todayButton="Today"
                selected={date ? new Date(date) : null}
                dateFormat="dd/MM/yyyy"
                withPortal={true}
                onChange={(val) => { handleDatePickerChange(val) }}
                placeholderText={placeholder}
            />
            {triggerError.isTriggered && (
                <span className="error">{triggerError.message}</span>
            )}
        </InputWrapper>
    );
}

export default CustomDatePicker;