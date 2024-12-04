import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { HelperIconProps } from "../../Types/Components/HelperIcon";
import { StyledHelperIconContainer } from "../../Styles/StyledComponents";

const HelperIcon: FC<HelperIconProps> = ({ helperContent }) => {

    return (
        <StyledHelperIconContainer data-tooltip-id="helper-tooltip" data-tooltip-content={helperContent}>
            <FontAwesomeIcon icon={faQuestion} color="white" />
        </StyledHelperIconContainer>
    )
};

export default HelperIcon;