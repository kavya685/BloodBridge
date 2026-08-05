import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

    const user = localStorage.getItem(role);

    if (!user) {
        return <Navigate to={`/${role}/login`} replace />;
    }

    return children;
}

export default ProtectedRoute;
