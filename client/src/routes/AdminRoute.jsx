import { Navigate } from "react-router-dom";

import Loading from "../components/common/Loading";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
    const { profile, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (profile?.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
