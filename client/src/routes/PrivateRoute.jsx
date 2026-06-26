import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

import Loading from "../components/common/Loading";

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}