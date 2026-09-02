import { useNavigate } from "react-router-dom";
import { donorDashboard } from "../../services/donor/dashboardService";
import { useState, useEffect } from "react";

function Dashboard() {

    const donor = JSON.parse(localStorage.getItem("donor"));
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async() => {
        try {
            const response = await donorDashboard();
            setDashboard(response);
        } catch (error) {
            console.error(error);
            alert("Failed to load dashboard.");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("donor");
        localStorage.removeItem("token");
        navigate("/donor/login");
    };

    if (!dashboard) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>Donor Dashboard</h1>

            <h3>Welcome {donor.fullName}</h3>

            <button onClick={handleLogout}>
                Logout
            </button>

            <button onClick={() => navigate("/blood-requests")}>
                View Blood Requests
            </button>

            <button onClick={() => navigate("/donor/my-applications")}>
                My Applications
            </button>

            <div>
                <h2>Dashboard Statistics</h2>

                <p>Total Applications: {dashboard.totalApplications}</p>
                <p>Pending Applications: {dashboard.pendingApplications}</p>
                <p>Accepted Applications: {dashboard.acceptedApplications}</p>
                <p>Rejected Applications: {dashboard.rejectedApplications}</p>
            </div>
        </div>
    );
}

export default Dashboard;
