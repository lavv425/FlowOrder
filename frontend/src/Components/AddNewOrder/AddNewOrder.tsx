import { useCallback, useState } from "react";
import Input from "../Input/Input";
import { StyledButton } from "../../Styles/StyledComponents";
import { TriggerErrorProps } from "../../Types/Components/Input";
import { NAME_ERROR_INPUT, NO_ERROR_INPUT } from "../../Constants/Constants";
import { Product } from "../../Types/Components/AddNewOrder";
import SweetAlertPortal from "../SweetAlertPortal/SweetAlertPortal";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddNewOrder = () => {
    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<TriggerErrorProps>(NO_ERROR_INPUT);
    const [description, setDescription] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState<TriggerErrorProps>(NO_ERROR_INPUT);
    const [date, setDate] = useState<string>("");
    const [dateError, setDateError] = useState<TriggerErrorProps>(NO_ERROR_INPUT);
    const [products, setProducts] = useState<Product[]>([{ name: "", price: "", disabled: false }]);

    const handleReset = () => {
        setName("");
        setNameError(NO_ERROR_INPUT);
        setDescription("");
        setDescriptionError(NO_ERROR_INPUT);
        setDate("");
        setDateError(NO_ERROR_INPUT);
        setProducts([{ name: "", price: "", disabled: false }]);
    };

    const handleAddProductRow = () => {
        if (!products[products.length - 1].name || !products[products.length - 1].price) {
            return; // If last row is incomplete, do nothing
        }

        setProducts((prev) =>
            prev.map((product) => ({ ...product, disabled: true })) // Disable last inserted row
        );

        setProducts((prev) => [
            ...prev,
            { name: "", price: "", disabled: false }, // Add a new row
        ]);
    };

    const handleRemoveProductRow = () => {
        if (products.length > 1) {
            setProducts((prev) => {
                const updatedProducts = prev.slice(0, -1); // Remove the last inserted product
                if (updatedProducts.length > 0) {
                    updatedProducts[updatedProducts.length - 1].disabled = false; // Riabiltates the new last row
                }
                return updatedProducts;
            });
        }
    };

    const handleProductChange = (index: number, field: "name" | "price", value: string) => {
        setProducts((prev) =>
            prev.map((product, i) =>
                i === index ? { ...product, [field]: value } : product
            )
        );
    };

    const handleSaveOrder = () => {
        const order = {
            name,
            description,
            date,
            products,
        };
        console.log("Order saved:", order);

        // Reset state dopo il salvataggio
        setName("");
        setDescription("");
        setDate("");
        setProducts([]);
    };

    const getCurrentState = () => ({
        name,
        description,
        date,
        products,
    });
    
    const handlePreConfirm = () => {
        const { name, description, date, products } = getCurrentState();
        console.log("preConfirm states:", name, description, date, products);
        if (!name || !description || !date || products.length === 0) {
            Swal.showValidationMessage("Please fill out all fields and add at least one product.");
            return null;
        }
        return true;
    };
    return (
        <SweetAlertPortal
            buttonOptions={
                { text: "Add Product", icon: faPlus }
            }
            validationStates={{
                name,
                description,
                date,
                products: products.length > 0, // Controlla che ci siano prodotti
            }}
            options={{
                title: "Add Order",
                showCancelButton: true,
                confirmButtonText: "Save Order",
                customClass: {
                    popup: "swal-wide"
                },
                preConfirm: handlePreConfirm
            }}
            onConfirm={handleSaveOrder}
            onDismiss={handleReset}
        >
            <div>
                <h2>Order Details</h2>
                <Input
                    type="text"
                    name="name"
                    label="Order name"
                    placeholder="Insert the order name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    customClass="full-width"
                />
                <Input
                    isTextArea
                    name="description"
                    label="Order description"
                    placeholder="Insert the order description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    customClass="full-width"
                />
                <Input
                    type="date"
                    name="date"
                    label="Order date"
                    placeholder="Insert the date of the order"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    customClass="full-width"
                />

                <h3>Products</h3>
                {products.map((product, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Input
                            type="text"
                            name={`product-name-${index}`}
                            placeholder="Product name"
                            value={product.name}
                            onChange={(e) =>
                                handleProductChange(index, "name", e.target.value)
                            }
                            customClass="small-width"
                            disabled={product.disabled}
                        />
                        <Input
                            type="number"
                            name={`product-price-${index}`}
                            placeholder="Product price"
                            value={product.price}
                            onChange={(e) =>
                                handleProductChange(index, "price", e.target.value)
                            }
                            customClass="small-width"
                            disabled={product.disabled}
                        />
                        {index === products.length - 1 && (
                            <>
                                <StyledButton
                                    type="button"
                                    onClick={handleAddProductRow}
                                    disabled={
                                        !product.name || !product.price // Disabilita se i campi non sono compilati
                                    }
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </StyledButton>
                                {products.length > 1 && (
                                    <StyledButton type="button" onClick={handleRemoveProductRow}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </StyledButton>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </SweetAlertPortal>
    );
};

export default AddNewOrder;