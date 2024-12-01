import styled from "styled-components";

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