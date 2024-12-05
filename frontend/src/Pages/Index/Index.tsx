import { FC, useCallback, useEffect, useState } from "react";
import { StyledButton, StyledH2Title } from "../../Styles/StyledComponents";
import { StyledInsidePagesWrapper, StyledPagesWrapper } from "../../Styles/StyledPages";
import useError, { useAppContext } from "../../Hooks";
import ApiClient from "../../Services/ApiClient";
import { DELETE_ORDER, GET_ORDERS } from "../../Constants/Endpoints";
import FilterableTable from "../../Components/FilterableTable/FilterableTable";
import { TableBody } from "../../Types/Components/Table";
import { ErrorType } from "../../Types/Hooks/Hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { NEW_ORDER, VIEW_ORDER_MIDDLEWARE, EDIT_ORDER_MIDDLEWARE } from "../../Routes/Routes";
import { Order } from "../../Types/Pages/Index";
import { invalidateCache } from "../../Services/Cache";

const Index: FC = () => {
    const nav = useNavigate();

    const { setIsLoading } = useAppContext();
    const { handleError } = useError();

    const [body, setBody] = useState<TableBody>([]);

    const headers = ["Actions", "Name", "Description", "Products", "Order Date"];

    const Icons = ({ uuid, orderName }: { uuid: string, orderName: string }) => {
        return (
            <>
                <FontAwesomeIcon icon={faEye} size="lg" style={{ color: "#005fa8" }} onClick={() => nav(`${VIEW_ORDER_MIDDLEWARE}/${uuid}`)} />
                <FontAwesomeIcon icon={faPencil} size="lg" style={{ color: "#db8b00" }} onClick={() => nav(`${EDIT_ORDER_MIDDLEWARE}/${uuid}`)} />
                <FontAwesomeIcon icon={faTrash} size="lg" style={{ color: "#972121", }} onClick={() => handleDeleteOrder(uuid, orderName)} />
            </>
        );
    };

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
                <Icons uuid={order.uuid} orderName={order.name} />,
                order.name,
                order.description,
                order.products_count,
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

    const handleDeleteOrder = useCallback(async (uuid: string, orderName: string) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "The selected order will be deleted permanently.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7f1111",
                cancelButtonColor: "#3085d6",
                confirmButtonText: `Delete <b>${orderName}</b>`
            }).then(async (res) => {
                if (res.isConfirmed) {
                    setIsLoading(true);
                    const { data } = await ApiClient.delete(`${DELETE_ORDER}/${uuid}`);
                    const { status, message } = data;
                    if (status) {
                        const cacheKey = JSON.stringify({ url: GET_ORDERS, method: "get" });
                        await invalidateCache(cacheKey);

                        await handleGetOrders();
                        Swal.fire({
                            title: "Done!",
                            text: "The order has been deleted!",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: message,
                            icon: "error"
                        });
                    }
                    setIsLoading(false);
                }
            });
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
            <StyledH2Title>Flow Order - <span style={{ color: "#C2252A" }}>Iliad</span>&#8482; Orders Manager</StyledH2Title>
            <StyledInsidePagesWrapper>
                <StyledButton className="flex-button" onClick={() => nav(NEW_ORDER)}><FontAwesomeIcon icon={faPlus} size="lg" />Insert a new order</StyledButton>
                <FilterableTable customClass="orders-table" headers={headers} body={body} canDownload exportFilename="Orders" />
            </StyledInsidePagesWrapper>
        </StyledPagesWrapper>
    );
};

export default Index;
