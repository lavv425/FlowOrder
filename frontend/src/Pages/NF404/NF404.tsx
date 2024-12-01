import { useNavigate } from "react-router-dom";
import { INDEX } from "../../Routes/Routes";
import { Styled404Container } from "../../Styles/StyledPages";
import { StyledButton } from "../../Styles/StyledComponents";

export default function NF404() {
    const nav = useNavigate();
    return (
        <Styled404Container>
            <h1>404 - Page not found!</h1>
            <h3>The page you're searching for doesn't exist or has been moved</h3>
            <StyledButton onClick={() => nav(INDEX)}>Back to home</StyledButton>
        </Styled404Container>
    );
}