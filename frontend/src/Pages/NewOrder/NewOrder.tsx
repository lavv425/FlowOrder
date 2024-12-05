import { useCallback, useState } from "react";
import useError, { useAppContext } from "../../Hooks";
import { DATE_ERROR_INPUT, DESCRIPTION_ERROR_INPUT, DUPLICATE_PRODUCT_ERROR_INPUT, generateLengthError, NAME_ERROR_INPUT, NO_ERROR_INPUT, PRODUCT_NAME_ERROR_INPUT, PRODUCT_PRICE_ERROR_INPUT } from "../../Constants/Constants";
import { Product } from "../../Types/Components/NewOrder";
import { StyledButton, StyledH2Title } from "../../Styles/StyledComponents";
import { StyledOrderContainer, StyledPagesWrapper, StyledProductRow } from "../../Styles/StyledPages";
import Input from "../../Components/Input/Input";
import GoToHome from "../../Components/GoToHome/GoToHome";
import CustomDatePicker from "../../Components/CustomDatePicker/CustomDatePicker";
import HelperIcon from "../../Components/HelperIcon/HelperIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { ErrorType } from "../../Types/Hooks/Hooks";
import { FormErrors } from "../../Types/Pages/NewOrder";
import ApiClient from "../../Services/ApiClient";
import { SAVE_ORDER } from "../../Constants/Endpoints";
import Swal from "sweetalert2";

const NewOrder = () => {
    const { setIsLoading } = useAppContext();
    const { handleError } = useError();

    const [orderName, setOrderName] = useState<string>("");
    const [orderDescription, setOrderDescription] = useState<string>("");
    const [orderDate, setOrderDate] = useState<string | null>("");
    const [products, setProducts] = useState<Product[]>([{ name: "", price: "" }]);

    const defaultErrors: FormErrors = {
        orderName: NO_ERROR_INPUT,
        orderDescription: NO_ERROR_INPUT,
        orderDate: NO_ERROR_INPUT,
        products: [{ name: NO_ERROR_INPUT, price: NO_ERROR_INPUT }]
    };

    const [errors, setErrors] = useState<FormErrors>(defaultErrors);

    const handleFormReset = () => {
        setOrderName("");
        setOrderDescription("");
        setOrderDate("");
        setProducts([{ name: "", price: "" }]);
        setErrors(defaultErrors);
    };

    const handleErrorsReset = useCallback(() => {
        setErrors({
            ...defaultErrors,
            products: products.map(() => ({ name: NO_ERROR_INPUT, price: NO_ERROR_INPUT }))
        })
    }, [products]);

    const handleProductChange = useCallback((index: number, field: keyof Product, value: string) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    }, [products]);

    const canAddProduct = products.every(product => product.name.trim() && product.price.trim());

    const addProduct = useCallback(() => {
        if (!canAddProduct) return;
        setProducts([...products, { name: "", price: "" }]);
    }, [products]);

    const removeProduct = useCallback((index: number) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index));
        }
    }, [products]);

    const handleAddOrder = useCallback(async () => {
        try {
            setIsLoading(true);

            handleErrorsReset();

            const newErrors: FormErrors = {
                orderName: NO_ERROR_INPUT,
                orderDescription: NO_ERROR_INPUT,
                orderDate: NO_ERROR_INPUT,
                products: products.map(() => ({ name: NO_ERROR_INPUT, price: NO_ERROR_INPUT })),
            };
            let hasErrors: boolean = false;

            // Name validation
            if (!orderName.trim()) {
                newErrors.orderName = NAME_ERROR_INPUT;
                hasErrors = true;
            }
            if (orderName.length > 250) {
                newErrors.orderName = generateLengthError(250, "Order name");
                hasErrors = true;
            }

            // Description validation
            if (!orderDescription.trim()) {
                newErrors.orderDescription = DESCRIPTION_ERROR_INPUT;
                hasErrors = true;
            }
            if (orderDescription.length > 500) {
                newErrors.orderDescription = generateLengthError(500, "Order description");
                hasErrors = true;
            }

            // OrderDate validation
            if (!orderDate) {
                newErrors.orderDate = DATE_ERROR_INPUT;
                hasErrors = true;
            }
            // console.log(orderDate?.length);
            if (orderDate && orderDate.length > 10) {
                newErrors.orderDate = generateLengthError(10, "Order date");
                hasErrors = true;
            }

            // Products price and name and length validation
            products.forEach((product, index) => {
                if (!product.name.trim()) {
                    newErrors.products[index] = { ...newErrors.products[index], name: PRODUCT_NAME_ERROR_INPUT };
                    hasErrors = true;
                }
                if (!product.price.trim()) {
                    newErrors.products[index] = { ...newErrors.products[index], price: PRODUCT_PRICE_ERROR_INPUT };
                    hasErrors = true;
                }

                if (product.name.length > 50) {
                    newErrors.products[index] = { ...newErrors.products[index], name: generateLengthError(50, `Product names`) };
                    hasErrors = true;
                }
                if (product.price.length > 15) {
                    newErrors.products[index] = { ...newErrors.products[index], price: generateLengthError(15, `Product prices`) };
                    hasErrors = true;
                }
            });

            // Check if there are duplicate product names
            const nameOccurrences: Record<string, number[]> = {};
            products.forEach((product, index) => {
                const name = product.name.trim().toLowerCase();
                if (name) {
                    if (!nameOccurrences[name]) {
                        nameOccurrences[name] = [];
                    }
                    nameOccurrences[name].push(index);
                }
            });

            // Set errors for duplicate product names
            Object.values(nameOccurrences).forEach((indexes: number[]) => {
                if (indexes.length > 1) {
                    indexes.forEach((index) => {
                        newErrors.products[index] = {
                            ...newErrors.products[index],
                            name: DUPLICATE_PRODUCT_ERROR_INPUT,
                        };
                        hasErrors = true;
                    });
                }
            });
            setErrors(newErrors);

            if (hasErrors) {
                return;
            };

            // Prepare the data to be sent to the server
            const saveObj = {
                name: orderName.trim(),
                description: orderDescription.trim(),
                date: orderDate!.trim(),
                products: products.map(({ name, price }) => ({ name: name.trim(), price: price.trim() })),
            };

            const { data } = await ApiClient.post(SAVE_ORDER, saveObj);
            const { status, message } = data;

            if (!status) {
                Swal.fire("Error", message, "error");
                return;
            }

            handleFormReset();

            Swal.fire("Success", "Order saved successfully!", "success");
        } catch (error) {
            handleError(error as ErrorType);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [orderName, orderDescription, orderDate, products]);
    return (
        <StyledPagesWrapper>
            <StyledH2Title>Insert a new order</StyledH2Title>
            <HelperIcon helperContent="Fill in all the fields to create a new order." />
            <GoToHome />
            <StyledOrderContainer>
                <StyledH2Title className="margined-title">Order details</StyledH2Title>
                <Input customClass="full-w" name="order-name" type="text" label="Order name" placeholder="Enter the order name" value={orderName} onChange={(e) => setOrderName(e.target.value)} triggerError={errors.orderName} />
                <Input customClass="full-w" isTextArea name="order-description" type="text" label="Order description" placeholder="Enter the order description" value={orderDescription} onChange={(e) => setOrderDescription(e.target.value)} triggerError={errors.orderDescription} />
                {/* <Input customClass="full-w" name="order-date" type="date" label="Insert the order date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} triggerError={orderDateError} /> */}
                <CustomDatePicker label="Order date" placeholder="Enter the order date" dateState={[orderDate, setOrderDate]} triggerError={errors.orderDate} />
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
                            triggerError={errors.products[index]?.name}
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
                            triggerError={errors.products[index]?.price}
                        />
                        <div className="button-container">
                            <StyledButton className="remove-product-button" onClick={() => removeProduct(index)} disabled={products.length === 1} >
                                <FontAwesomeIcon icon={faMinus} color="#a10000"/>
                            </StyledButton>
                            {index === products.length - 1 && (
                                <StyledButton className="add-product-button" onClick={addProduct} disabled={!canAddProduct} >
                                    <FontAwesomeIcon icon={faPlus} />
                                </StyledButton>
                            )}
                        </div>
                    </StyledProductRow>
                ))}

                <StyledButton className="flex-button order-submit-button" onClick={handleAddOrder}><FontAwesomeIcon icon={faSave} size="lg" />Save order</StyledButton>
            </StyledOrderContainer>
        </StyledPagesWrapper>
    );
};

export default NewOrder;