import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem("authToken");
    const isAuthenticated = !!token;
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    return (
        isAuthenticated && user ? <>{children}</> : (
            <Navigate to="/login" state={{ from: location }} replace />
        )
    );

}