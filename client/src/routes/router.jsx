import {
    createBrowserRouter,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/dashboard/Dashboard";

export const router =
    createBrowserRouter([
        {
            path: "/dashboard",

            element: <DashboardLayout />,

            children: [
                {
                    index: true,

                    element: <Dashboard />,
                },
            ],
        },
    ]);