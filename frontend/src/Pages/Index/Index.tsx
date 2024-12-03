import { FC, useCallback, useEffect, useState } from "react";
import { StyledH2Title } from "../../Styles/StyledComponents";
import { StyledPagesWrapper } from "../../Styles/StyledPages";
import useError, { useAppContext } from "../../Hooks";
import { ErrorType } from "../../Types/Hooks/Hooks";
import ApiClient from "../../Services/ApiClient";
import { GET_ORDERS } from "../../Constants/Endpoints";
import FilterableTable from "../../Components/FilterableTable/FilterableTable";
import { TableBody } from "../../Types/Components/Table";

const Index: FC = () => {
    const { setIsLoading } = useAppContext();
    const { handleError } = useError();

    const [body, setBody] = useState<TableBody>([]);

    const headers = ["Name", "Description", "Date"];

    const handleGetOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await ApiClient.get(GET_ORDERS);
            console.log("Orders fetched successfully:", data);
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
            <FilterableTable headers={headers} body={body} />
        </StyledPagesWrapper>
    );
};

export default Index;
