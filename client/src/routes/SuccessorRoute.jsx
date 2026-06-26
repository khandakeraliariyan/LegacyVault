import { Navigate } from "react-router-dom";

export default function SuccessorRoute({ children }) {
    return children;
}

export function SuccessorRedirect() {
    return <Navigate to="/vault-access" replace />;
}
