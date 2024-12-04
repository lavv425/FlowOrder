import styled from "styled-components";

export const StyledPagesWrapper = styled.div`
padding:0;
margin: 3%;`;

export const Styled404Container = styled.div`
width:40%;
height:40%;
display: flex;
flex-direction: column;
gap:15px;
justify-content: center;
align-items:center;
position: absolute;
left: 50%;
top:50%;
transform: translate(-50%,-50%);

    & button {
        padding:10px;
        background:black;
        color:white;
        transition: 0.2s;
        cursor:pointer;
        border:1px solid black;
        border-radius:4px;

        &:hover{
            background:white;
            color:black;
        }
    }`;

export const StyledOrderFormContainer = styled.div`
margin: 3%;`;

export const StyledProductRow = styled.div`
display: flex;
align-items: center;
gap: 1rem;

    & .product-name-input,
    & .product-price-input {
        flex: 1;
        width: -webkit-fill-available;
    }

    & .button-container {
        display: flex;
        gap: 0.5rem;
        justify-content: center; /* Center buttons horizontally */
        min-width: 80px; /* Ensure consistent space */
    }

    & .add-product-button,
    & .remove-product-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: #007bff;
    }

    & .add-product-button:disabled,
    & .remove-product-button:disabled {
        color: #ccc;
        cursor: not-allowed;
    }
        
    @media screen and (max-width: 768px) {
        width: 35%;
        gap: 10px;
        align-items: self-end;
    }`;