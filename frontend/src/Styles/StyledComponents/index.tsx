import styled from "styled-components";

export const MainLogo = styled.img`
position: fixed;
bottom: 0;
right: 0;
width: 100px;
z-index: -1;`;

export const StyledH2Title = styled.h2`
text-align:center;
margin:1% 0 1% 0;`;

export const LoaderWrapper = styled.div`
position:fixed;
top: 0;
left: 0;
z-index:9999;
width:100%;
height:100%;
overflow:hidden;
display:flex;
justify-content:center;
align-items:center;
background: #8a8a8a8f;
backdrop-filter: blur(1px);`;


export const InputWrapper = styled.div`
width:100%;
position:relative;

    & .full-width {
        width: -webkit-fill-available;
    }`;

export const StyledLabel = styled.label`
color:#333;
margin-bottom:8px;
display:block;
text-align:center;`;

export const StyledInputContainer = styled.div`
display: flex;
align-items: center;
position: relative;
border-radius: 4px;
overflow: hidden;

    & .input-prefix {
        background-color: #f1f1f1;
        color: #333;
        padding: 10px 12px;
        font-size: 1rem;
        white-space: nowrap;
        margin-top: 5px;
        margin-bottom: 20px;
    }
`;

export const StyledInput = styled.input`
padding: 10px 12px;
margin-top: 5px;
margin-bottom: 20px;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
font-size: 16px;
color: #333;
transition:0.1s;
font-family: inherit;

    &:focus {
        border-color: #007BFF;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }`;

export const StyledTextArea = styled.textarea`
padding: 10px 12px;
margin-top: 5px;
margin-bottom: 20px;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
font-size: 16px;
color: #333;
transition: 0.1s;
resize: vertical;
min-height: 100px;
font-family: inherit;

    &:focus {
        border-color: #007BFF;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
`;

export const StyledButton = styled.button`
color: #fff;
font-size: 14px;
// background: #007BFF;
background:#0062cb;
border: none;
border-radius: 4px;
padding: 10px 20px;
cursor: pointer;
transition: 0.3s;
display: block;    
    &:hover{
        background: #0056b3;
    }
        
    &:focus{
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
        
    &:active{
        background: #1b2772;
    }`;


export const StyledTableWrapper = styled.div`
overflow-x: auto;
overflow-y: hidden;
white-space: nowrap;`;

export const TopSearchableWrapper = styled.div<{ $canDownload: boolean }>`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: end;

    & div {
        margin-bottom: ${({ $canDownload }) => ($canDownload ? "10px" : "0")};
        & svg {
            margin-left: 10px;
            cursor: pointer;
            transition: 0.2s;

            &:hover{
                scale: 1.1;
            }
        }
    }
    & span {
        transition: 0.2s;
        margin: 8px;
    }`;

export const SearchableInputWrapper = styled.div`
float:right;
position: relative;

    & .error{
        top: -25px;
        left: 205px;
    }
    & input{
        width:350px;
    }
    
    & svg{
        position: absolute;
        right: 12px;
        top: 29px;
        transform: translateY(-50%);
        transition:0.2s;
        cursor:pointer;
        color:#df0303;

        &:hover{
            color:#bf3a3a;
        }
    }`;

export const StyledTable = styled.table`
min-width: 100%;
margin-top:2%;
border-collapse: collapse;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
background: #ffffff;`;

export const StyledTableHead = styled.thead`
background: #2d378b;
color: white;
text-wrap: nowrap;

    & .table-filters-select{
        color: black;
        font-weight: normal;
    }`;

export const StyledTableRow = styled.tr`
transition: 0.2s all;
    &:hover:not(thead tr) {
        background: #ededed;
    }

    & > td:last-child{
        min-width:10%;

        & svg{
        margin:5%;
        cursor:pointer;
        opacity:0.7;
        transition: 0.2s all;

            &:hover{
            opacity:1;
            scale:1.3;
            }
        }
    }`;

export const StyledTableHeader = styled.th`
padding: 12px;
text-align: left;
font-weight: bold;
border-bottom: 1px solid #ddd;`;

export const StyledTableData = styled.td`
padding: 12px;
text-align: left;
border-bottom: 1px solid #ddd;`;

export const StyledModalDialogWrapper = styled.div`
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: #fff;
color: #fff;
padding: 20px;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);`;

export const StyledHelperIconContainer = styled.div`
width: 30px;
height: 30px;
background: #197ad2;
display: flex;
justify-content: center;
align-items: center;
border-radius: 50%;
cursor: pointer;
opacity: 0.8;
position: absolute;
top: 20px;
right: 25px;
transition: 0.2s;

    &:hover {
        opacity: 1;
    }`;