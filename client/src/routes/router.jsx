import {
    createBrowserRouter,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

import {
    AdminAuditLogs,
    AdminDashboard,
    AdminDocuments,
    AdminSettings,
    AdminSuccessors,
    AdminSystemHealth,
} from "../pages/admin/AdminPages";
import ClaimsManagement from "../pages/admin/ClaimsManagement";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ClaimPortal from "../pages/claim/ClaimPortal";
import Claims from "../pages/dashboard/Claims";
import Dashboard from "../pages/dashboard/Dashboard";
import Documents from "../pages/dashboard/Documents";
import FinalWishes from "../pages/dashboard/FinalWishes";
import FutureMessages from "../pages/dashboard/FutureMessages";
import Settings from "../pages/dashboard/Settings";
import Successors from "../pages/dashboard/Successors";
import Verification from "../pages/dashboard/Verification";
import Home from "../pages/public/Home";
import VaultAccess from "../pages/successor/VaultAccess";

export const router =
    createBrowserRouter([
        {
            element: <MainLayout />,
            children: [
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
            ],
        },
        {
            path: "/claim",
            element: <ClaimPortal />,
        },
        {
            path: "/vault-access",
            element: <VaultAccess />,
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
                {
                    path: "documents",
                    element: <Documents />,
                },
                {
                    path: "successors",
                    element: <Successors />,
                },
                {
                    path: "verification",
                    element: <Verification />,
                },
                {
                    path: "final-wishes",
                    element: <FinalWishes />,
                },
                {
                    path: "future-messages",
                    element: <FutureMessages />,
                },
                {
                    path: "claims",
                    element: <Claims />,
                },
                {
                    path: "settings",
                    element: <Settings />,
                },
            ],
        },
        {
            path: "/admin",
            element: (
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            ),
            children: [
                {
                    index: true,
                    element: <ClaimsManagement />,
                },
                {
                    path: "dashboard",
                    element: <AdminDashboard />,
                },
                {
                    path: "documents",
                    element: <AdminDocuments />,
                },
                {
                    path: "successors",
                    element: <AdminSuccessors />,
                },
                {
                    path: "audit-logs",
                    element: <AdminAuditLogs />,
                },
                {
                    path: "system-health",
                    element: <AdminSystemHealth />,
                },
                {
                    path: "settings",
                    element: <AdminSettings />,
                },
            ],
        },
    ]);
