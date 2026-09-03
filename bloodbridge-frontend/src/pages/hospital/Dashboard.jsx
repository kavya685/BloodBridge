import { useNavigate } from "react-router-dom";
import { hospitalDashboard } from "../../services/hospital/dashboardService";
import { useEffect, useState } from "react";

function Dashboard() {

    const hospital = JSON.parse(localStorage.getItem("hospital"));
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await hospitalDashboard();
            setDashboard(response);
        } catch (error) {
            console.error(error);
            alert("Failed to load dashboard.");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("hospital");
        localStorage.removeItem("token");
        navigate("/hospital/login");
    };

    if (!dashboard) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>Hospital Dashboard</h1>
            <h3>Welcome {hospital.fullName}</h3>

            <button
              onClick={() =>
                  navigate("/hospital/create-blood-request")
              }
            >
                  Create Blood Request
            </button>

            <button
                onClick={() =>
                    navigate("/hospital/my-blood-requests")
                }
            >
                My Blood Requests
            </button>

            <button onClick={handleLogout}>
                Logout
            </button>

            <button
                onClick={() =>
                    navigate("/hospital/notifications")
                }
            >
                Notifications
            </button>

            <div>
                <h2>Dashboard Statistics</h2>

                <p>Total Requests: {dashboard.totalRequests}</p>
                <p>Open Requests: {dashboard.openRequests}</p>
                <p>Fulfilled Requests: {dashboard.fulfilledRequests}</p>
                <p>Deleted Requests: {dashboard.deletedRequests}</p>

                <p>Total Applications: {dashboard.totalApplications}</p>
                <p>Pending Applications: {dashboard.pendingApplications}</p>
                <p>Accepted Applications: {dashboard.acceptedApplications}</p>
                <p>Rejected Applications: {dashboard.rejectedApplications}</p>
            </div>
        </div>
    );
}

export default Dashboard;
