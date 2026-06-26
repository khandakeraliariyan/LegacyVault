import {
    createBrowserRouter,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export const router =
    createBrowserRouter([
        {
            path: "/",

            element: <Home />,
        },
        {
            path: "/login",

            element: <Login />,
        },
        {
            path: "/register",

            element: <Register />,
        },
        {
            path: "/dashboard",

            element: (
                <PrivateRoute>
                    <DashboardLayout />
                </PrivateRoute>
            ),

            children: [
                {
                    index: true,

                    element: <Dashboard />,
                },
            ],
        },
    ]);
