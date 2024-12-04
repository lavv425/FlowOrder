import { useNavigate } from "react-router-dom"
import { StyledButton } from "../../Styles/StyledComponents";
import { INDEX } from "../../Routes/Routes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
const GoToHome = () => {
    const nav = useNavigate();

    return <StyledButton className="go-to-home" onClick={() => nav(INDEX)}><FontAwesomeIcon icon={faBackward} /><span>Go back</span></StyledButton>
}

export default GoToHome;