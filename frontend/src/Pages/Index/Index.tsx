import { FC } from "react";
import AddOrderModal from "../../Components/Modals/AddOrderDialog";

const Index: FC = () => {
    
    return (
        <div>
            <h1>Welcome to Iliad Orders Manager!</h1>
            <AddOrderModal />
        </div>
    );
};

export default Index;
