import { useNavigate } from "react-router-dom";
import { hospitalDashboard } from "../../services/hospital/dashboardService";
import { useEffect, useState } from "react";
import "../../styles/Dashboard.css";

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
    };

    const handleLogout = () => {
        localStorage.removeItem("hospital");
        localStorage.removeItem("token");
        navigate("/hospital/login");
    };

    if (!dashboard) {
        return (
            <div className="dashboard-loading">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* Header */}
            <section className="dashboard-header">

                <div>
                    <p className="dashboard-label">
                        HOSPITAL DASHBOARD
                    </p>

                    <h1>
                        Welcome, {hospital.fullName}
                    </h1>

                    <p className="dashboard-subtitle">
                        Here's an overview of your blood requests and
                        applications.
                    </p>
                </div>

                <div className="dashboard-header-actions">

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/hospital/notifications")
                        }
                    >
                        Notifications
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/hospital/create-blood-request")
                        }
                    >
                        + Create Request
                    </button>

                </div>

            </section>


            {/* Request Statistics */}
            <section className="dashboard-section">

                <div className="section-title">
                    <div>
                        <h2>Blood Requests</h2>
                        <p>Overview of your blood requests.</p>
                    </div>
                </div>


                <div className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon">
                            🩸
                        </div>

                        <p className="stat-label">
                            Total Requests
                        </p>

                        <h3>
                            {dashboard.totalRequests}
                        </h3>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">
                            ⏳
                        </div>

                        <p className="stat-label">
                            Open Requests
                        </p>

                        <h3>
                            {dashboard.openRequests}
                        </h3>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">
                            ✓
                        </div>

                        <p className="stat-label">
                            Fulfilled
                        </p>

                        <h3>
                            {dashboard.fulfilledRequests}
                        </h3>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">
                            ×
                        </div>

                        <p className="stat-label">
                            Deleted
                        </p>

                        <h3>
                            {dashboard.deletedRequests}
                        </h3>
                    </div>

                </div>

            </section>


            {/* Application Statistics */}
            <section className="dashboard-section">

                <div className="section-title">
                    <div>
                        <h2>Donation Applications</h2>
                        <p>
                            Track applications received for your requests.
                        </p>
                    </div>
                </div>


                <div className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon">
                            👥
                        </div>

                        <p className="stat-label">
                            Total Applications
                        </p>

                        <h3>
                            {dashboard.totalApplications}
                        </h3>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">
                            ⏳
                        </div>

                        <p className="stat-label">
                            Pending
                        </p>

                        <h3>
                            {dashboard.pendingApplications}
                        </h3>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">
                            ✓
                        </div>

                        <p className="stat-label">
                            Accepted
                        </p>

                        <h3>
                            {dashboard.acceptedApplications}
                        </h3>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">
                            ×
                        </div>

                        <p className="stat-label">
                            Rejected
                        </p>

                        <h3>
                            {dashboard.rejectedApplications}
                        </h3>
                    </div>

                </div>

            </section>


            {/* Quick Actions */}
            <section className="quick-actions">

                <div>
                    <h2>Quick Actions</h2>

                    <p>
                        Manage your blood requests and applications.
                    </p>
                </div>

                <div className="quick-action-buttons">

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/hospital/create-blood-request")
                        }
                    >
                        Create Blood Request
                    </button>

                    <button
                        className="outline-button"
                        onClick={() =>
                            navigate("/hospital/my-blood-requests")
                        }
                    >
                        View My Requests
                    </button>

                </div>

            </section>


            {/* Logout */}
            <div className="logout-container">

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Dashboard;