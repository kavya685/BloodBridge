import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const donor = localStorage.getItem("donor");

    if (!donor) {
        return <Navigate to="/donor/login" />;
    }

    return children;
}

export default ProtectedRoute;
