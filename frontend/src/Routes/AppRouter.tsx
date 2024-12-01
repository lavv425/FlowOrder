import { FC, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NF404 from "../Pages/NF404/NF404";
import { INDEX } from "./Routes";

const Index = lazy(() => import("../Pages/Index/Index"));

const router = createBrowserRouter([
    {
        path: INDEX,
        element: <Index />,
    },
    {
        path: '*',
        element: <NF404 />,
    },
]);

const AppRouter: FC = () => {
    return <RouterProvider router={router} />
};

export default AppRouter;