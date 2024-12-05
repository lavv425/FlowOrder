import { FC, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NF404 from "../Pages/NF404/NF404";
import { EDIT_ORDER, INDEX, NEW_ORDER, VIEW_ORDER } from "./Routes";

const Index = lazy(() => import("../Pages/Index/Index"));
const NewOrder = lazy(() => import("../Pages/NewOrder/NewOrder"));
const ViewOrder = lazy(() => import("../Pages/ViewOrder/ViewOrder"));
const EditOrder = lazy(() => import("../Pages/EditOrder/EditOrder"));

const router = createBrowserRouter([
    {
        path: INDEX,
        element: <Index />,
    },
    {
        path: NEW_ORDER,
        element: <NewOrder />,
    },
    {
        path: VIEW_ORDER,
        element: <ViewOrder />,
    },
    {
        path: EDIT_ORDER,
        element: <EditOrder />,
    },
    {
        path: "*",
        element: <NF404 />,
    },
]);

const AppRouter: FC = () => {
    return <RouterProvider router={router} />
};

export default AppRouter;