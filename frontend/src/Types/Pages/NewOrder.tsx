import { TriggerErrorProps } from "../Components/Input";

export type FormErrors = {
    orderName: TriggerErrorProps;
    orderDescription: TriggerErrorProps;
    orderDate: TriggerErrorProps;
    products: { name: TriggerErrorProps; price: TriggerErrorProps }[];
}