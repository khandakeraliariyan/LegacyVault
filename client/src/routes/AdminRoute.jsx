import PrivateRoute from "./PrivateRoute";

export default function AdminRoute({ children }) {
    return <PrivateRoute>{children}</PrivateRoute>;
}
