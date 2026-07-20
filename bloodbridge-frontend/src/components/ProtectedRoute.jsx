import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const user = localStorage.getItem("role");

    if (!user) {
        return <Navigate to={`/${role}/login`} />;
    }

    return children;
}

export default ProtectedRoute;
