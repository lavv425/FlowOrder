import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useError, { useAppContext } from "../../Hooks";
import ApiClient from "../../Services/ApiClient";
import { GET_ORDER_DETAILS } from "../../Constants/Endpoints";
import { StyledOrderContainer, StyledOrderInfo, StyledPagesWrapper, StyledProductCard, StyledProductList, StyledProductsTitle } from "../../Styles/StyledPages";
import { StyledH2Title } from "../../Styles/StyledComponents";
import GoToHome from "../../Components/GoToHome/GoToHome";
import { ErrorType } from "../../Types/Hooks/Hooks";
import { Product } from "../../Types/Components/NewOrder";

const ViewOrder = () => {
    const { uuid } = useParams();
    const { setIsLoading } = useAppContext();
    const { handleError, handleApiError } = useError();
    const [orderDetails, setOrderDetails] = useState<Record<string, any> | null>(null);

    const handleGetOrderDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await ApiClient.get(`${GET_ORDER_DETAILS}/${uuid}`);
            const { status, message, data: order } = data;

            if (!status) {
                handleApiError(message);
                return;
            }

            setOrderDetails(order);
        } catch (error) {
            handleError(error as ErrorType);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [uuid]);

    useEffect(() => {
        handleGetOrderDetails();
    }, [handleGetOrderDetails]);


    return (
        <StyledPagesWrapper>
            <StyledH2Title>Order Details</StyledH2Title>
            <GoToHome />
            <StyledOrderContainer>
                <StyledOrderInfo>
                    <p><strong>Order Name:</strong> {orderDetails?.name}</p>
                    <p><strong>Description:</strong> {orderDetails?.description}</p>
                    <p><strong>Order Date:</strong> {orderDetails?.date}</p>
                </StyledOrderInfo>
                <StyledProductsTitle>Associated Products</StyledProductsTitle>
                {orderDetails?.products.length > 0 ? (
                    <StyledProductList>
                        {orderDetails?.products.map((product: Product, index: number) => (
                            <StyledProductCard key={index}>
                                <p><strong>Product Name:</strong> {product.name}</p>
                                <p><strong>Price:</strong> €{product.price}</p>
                            </StyledProductCard>
                        ))}
                    </StyledProductList>
                ) : (
                    <p>No products associated with this order.</p>
                )}
            </StyledOrderContainer>
        </StyledPagesWrapper>
    );
};

export default ViewOrder;