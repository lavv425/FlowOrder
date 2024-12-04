import { FC, useCallback, useEffect, useState } from "react";
import { StyledButton, StyledH2Title } from "../../Styles/StyledComponents";
import { StyledPagesWrapper } from "../../Styles/StyledPages";
import useError, { useAppContext } from "../../Hooks";
import ApiClient from "../../Services/ApiClient";
import { GET_ORDERS } from "../../Constants/Endpoints";
import FilterableTable from "../../Components/FilterableTable/FilterableTable";
import { TableBody } from "../../Types/Components/Table";
import { ErrorType } from "../../Types/Hooks/Hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { NEW_ORDER } from "../../Routes/Routes";
import { Order } from "../../Types/Pages/Index";

const Index: FC = () => {
    const nav = useNavigate();
    
    const { setIsLoading } = useAppContext();
    const { handleError } = useError();

    const [body, setBody] = useState<TableBody>([]);

    const headers = ["Name", "Description", "Date"];

    const handleGetOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await ApiClient.get(GET_ORDERS);
            const { status, message, data: orders } = data;

            if (!status) {
                Swal.fire("Error", message, "error");
                return;
            }

            const tableBody = orders?.map((order: Order) => [
                order.name,
                order.description,
                order.date,
            ]);

            setBody(tableBody);
        } catch (error) {
            handleError(error as ErrorType);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        handleGetOrders();
    }, [handleGetOrders]);

    return (
        <StyledPagesWrapper>
            <StyledH2Title>Flow Order - Iliad Orders Manager</StyledH2Title>
            <StyledButton className="flex-button" onClick={() => nav(NEW_ORDER)}><FontAwesomeIcon icon={faPlus} size="lg" />Insert a new order</StyledButton>
            <FilterableTable headers={headers} body={body} canDownload exportFilename="Orders" />
        </StyledPagesWrapper>
    );
};

export default Index;
