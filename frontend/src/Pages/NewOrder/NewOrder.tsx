import { useCallback, useState } from "react";
import useError, { useAppContext } from "../../Hooks";
import { NO_ERROR_INPUT } from "../../Constants/Constants";
import { TriggerErrorProps } from "../../Types/Components/Input";
import { Product } from "../../Types/Components/NewOrder";
import { StyledButton, StyledH2Title, StyledLabel } from "../../Styles/StyledComponents";
import { StyledOrderFormContainer, StyledPagesWrapper, StyledProductRow } from "../../Styles/StyledPages";
import Input from "../../Components/Input/Input";
import GoToHome from "../../Components/GoToHome/GoToHome";
import CustomDatePicker from "../../Components/CustomDatePicker/CustomDatePicker";
import HelperIcon from "../../Components/HelperIcon/HelperIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const NewOrder = () => {
    const { setIsLoading } = useAppContext();
    const { handleError } = useError();

    const [orderName, setOrderName] = useState<string>("");
    const [orderNameError, setOrderNameError] = useState<TriggerErrorProps>(NO_ERROR_INPUT);
    const [orderDescription, setOrderDescription] = useState<string>("");
    const [orderDescriptionError, setOrderDescriptionError] = useState<TriggerErrorProps>(NO_ERROR_INPUT);
    const [orderDate, setOrderDate] = useState<string | null>("");
    const [orderDateError, setOrderDateError] = useState<TriggerErrorProps>(NO_ERROR_INPUT);
    const [products, setProducts] = useState<Product[]>([{ name: "", price: "" }]);

    const handleErrorsReset = () => {
        setOrderNameError(NO_ERROR_INPUT);
        setOrderDescriptionError(NO_ERROR_INPUT);
        setOrderDateError(NO_ERROR_INPUT);
    };

    const handleProductChange = (index: number, field: keyof Product, value: string) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    const canAddProduct = products.every(product => product.name.trim() && product.price.trim());

    const addProduct = () => {
        if (!canAddProduct) return;
        setProducts([...products, { name: "", price: "" }]);
    };

    const removeProduct = (index: number) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index));
        }
    };
    return (
        <StyledPagesWrapper>
            <StyledH2Title>Insert a new order</StyledH2Title>
            <HelperIcon helperContent="Fill in all the fields to create a new order." />
            <GoToHome />
            <StyledOrderFormContainer>
                <StyledH2Title className="margined-title">Order details</StyledH2Title>
                <Input customClass="full-w-input" name="order-name" type="text" label="Order name" placeholder="Enter the order name" value={orderName} onChange={(e) => setOrderName(e.target.value)} triggerError={orderNameError} />
                <Input customClass="full-w-input" isTextArea name="order-description" type="text" label="Order description" placeholder="Enter the order description" value={orderDescription} onChange={(e) => setOrderDescription(e.target.value)} triggerError={orderDescriptionError} />
                {/* <Input customClass="full-w-input" name="order-date" type="date" label="Insert the order date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} triggerError={orderDateError} /> */}
                <CustomDatePicker label="Order date" placeholder="Enter the order date" dateState={[orderDate, setOrderDate]} triggerError={orderDateError} />
                <StyledH2Title className="margined-title">Associated products</StyledH2Title>
                {products.map((product, index) => (
                    <StyledProductRow key={index}>
                        <Input
                            customClass="product-name-input"
                            name={`product-name-${index}`}
                            type="text"
                            label={`Product ${product.name || index + 1}`}
                            placeholder="Enter product name"
                            value={product.name}
                            onChange={(e) => handleProductChange(index, "name", e.target.value)}
                        />
                        <Input
                            customClass="product-price-input margin-auto"
                            name={`product-price-${index}`}
                            type="number"
                            label={`Price ${product.price} (€)`}
                            placeholder="Enter price"
                            value={product.price}
                            onChange={(e) => handleProductChange(index, "price", e.target.value)}
                            prefix="€"
                        />
                        <div className="button-container">
                            <StyledButton className="remove-product-button" onClick={() => removeProduct(index)} disabled={products.length === 1} >
                                <FontAwesomeIcon icon={faMinus} />
                            </StyledButton>
                            {index === products.length - 1 && (
                                <StyledButton className="add-product-button" onClick={addProduct} disabled={!canAddProduct} >
                                    <FontAwesomeIcon icon={faPlus} />
                                </StyledButton>
                            )}
                        </div>
                    </StyledProductRow>
                ))}
            </StyledOrderFormContainer>
        </StyledPagesWrapper>
    );
};

export default NewOrder;