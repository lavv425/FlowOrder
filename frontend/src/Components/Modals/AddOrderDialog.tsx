import { useState } from "react";
import { OverlayContainer } from "@react-aria/overlays";
import { useOverlayTriggerState } from "@react-stately/overlays";
import ModalDialog from "../ModalDialog/ModalDialog";
import { Product } from "../../Types/Components/Modals/AddOrderDialog";
import Input from "../Input/Input";
import { StyledButton } from "../../Styles/StyledComponents";

const AddOrderModal = () => {
    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [productPrice, setProductPrice] = useState<string>("");

    const modalState = useOverlayTriggerState({});

    // Handler per aggiungere un prodotto
    const handleAddProduct = () => {
        if (productName && productPrice) {
            setProducts((prev) => [
                ...prev,
                { name: productName, price: productPrice },
            ]);
            setProductName("");
            setProductPrice("");
        }
    };

    // Handler per salvare l'ordine
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
        modalState.close();
    };

    return (
        <>
            <button onClick={() => modalState.open()}>Add Order</button>
            {modalState.isOpen && (
                <OverlayContainer>
                    <ModalDialog title="Add Order" onClose={modalState.close} isOpen={modalState.isOpen}>
                        <form>
                            <h2>Order Details</h2>
                            <Input type="text" name="name" label="Order name" placeholder="Insert the order name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input isTextArea name="description" label="Order description" placeholder="Insert the order description" value={name} onChange={(e) => setDescription(e.target.value)} />
                            <div>
                                <label>
                                    Date:
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </label>
                            </div>

                            <h3>Products</h3>
                            <Input type="text" name="product-name" label="Product name" placeholder="Insert a product name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                            <Input type="number" name="product-price" label="Product price" placeholder="Insert the product price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />

                            <StyledButton type="button" onClick={handleAddProduct}>
                                Add Product
                            </StyledButton>
                            <ul>
                                {products.map((product, index) => (
                                    <li key={index}>
                                        {product.name} - €{product.price}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ marginTop: "1rem" }}>
                                <button type="button" onClick={handleSaveOrder}>
                                    Save Order
                                </button>
                                <button type="button" onClick={modalState.close}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </ModalDialog>
                </OverlayContainer>
            )}
        </>
    );
};


export default AddOrderModal;