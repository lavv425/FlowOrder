import styled from "styled-components";

export const StyledPagesWrapper = styled.div`
padding:0;
margin: 3%;`;

export const StyledInsidePagesWrapper = styled.div`
margin-top: 30px;`;

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
        margin-top: 30px;
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


export const StyledPageWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 2rem auto;
max-width: 800px;
padding: 1rem;
background: #f9f9f9;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
border-radius: 8px;
`;

export const StyledTitle = styled.h2`
font-size: 2rem;
margin-bottom: 1rem;
color: #333;
text-align: center;
`;

export const StyledOrderContainer = styled.div`
width: 90%;
padding: 1rem;
background: #fff;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
margin: auto;
@media screen and (max-width: 768px) {
    margin-top: 50px;
}
`;

export const StyledOrderInfo = styled.div`
margin-bottom: 1.5rem;
    & p {
        margin: 0.5rem 0;
        font-size: 1rem;
        color: #555;
        strong {
        color: #222;
        }
    }`;

export const StyledProductsTitle = styled.h3`
font-size: 1.5rem;
color: #444;
margin-bottom: 1rem;
`;

export const StyledProductList = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;
`;

export const StyledProductCard = styled.div`
padding: 1rem;
background: #fff;
border: 1px solid #ddd;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    & p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
        color: #555;
        strong {
        color: #222;
        }
    }
`;