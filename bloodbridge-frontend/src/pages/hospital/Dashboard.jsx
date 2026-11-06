import { useNavigate } from "react-router-dom";
import { hospitalDashboard } from "../../services/hospital/dashboardService";
import { useEffect, useState } from "react";
import {
    IconBloodDrop,
    IconClock,
    IconCheckCircle,
    IconX,
    IconUsers,
    IconBell,
    IconPlus
} from "../../components/icons/Icons";
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

            {/* Dashboard Header */}
            <section className="dashboard-header">

                <div className="dashboard-heading">

                    <p className="dashboard-label">
                        HOSPITAL DASHBOARD
                    </p>

                    <h1>
                        Welcome, {hospital?.hospitalName || hospital?.fullName || "Hospital"}
                    </h1>

                    <p className="dashboard-subtitle">
                        Monitor your blood requests and donor applications
                        from one place.
                    </p>

                </div>

                <div className="dashboard-header-actions">

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/hospital/notifications")
                        }
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <IconBell size={16} style={{ marginRight: "6px" }} />
                        Notifications
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/hospital/create-blood-request")
                        }
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <IconPlus size={16} style={{ marginRight: "6px" }} />
                        Create Request
                    </button>

                </div>

            </section>


            {/* Blood Request Statistics */}
            <section className="dashboard-section">

                <div className="section-title">
                    <h2>Blood Requests</h2>

                    <p>
                        Overview of your blood requests. Click any card to view your requests.
                    </p>
                </div>

                <div className="stats-grid">

                    <div
                        className="stat-card stat-blue"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="View all your blood requests"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Total Requests</p>
                            <span className="stat-icon-badge">
                                <IconBloodDrop size={18} color="#2563eb" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.totalRequests}
                        </h3>
                    </div>

                    <div
                        className="stat-card stat-amber"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="View open blood requests"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Open Requests</p>
                            <span className="stat-icon-badge">
                                <IconClock size={18} color="#d97706" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.openRequests}
                        </h3>
                    </div>

                    <div
                        className="stat-card stat-green"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="View fulfilled requests"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Fulfilled</p>
                            <span className="stat-icon-badge">
                                <IconCheckCircle size={18} color="#059669" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.fulfilledRequests}
                        </h3>
                    </div>

                    <div
                        className="stat-card stat-red"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="View deleted requests"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Deleted</p>
                            <span className="stat-icon-badge">
                                <IconX size={18} color="#dc2626" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.deletedRequests}
                        </h3>
                    </div>

                </div>

            </section>


            {/* Application Statistics */}
            <section className="dashboard-section">

                <div className="section-title">
                    <h2>Donation Applications</h2>

                    <p>
                        Track applications received for your requests. Click to review applicants.
                    </p>
                </div>

                <div className="stats-grid">

                    <div
                        className="stat-card stat-blue"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="Review all applications"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Total Applications</p>
                            <span className="stat-icon-badge">
                                <IconUsers size={18} color="#2563eb" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.totalApplications}
                        </h3>
                    </div>

                    <div
                        className="stat-card stat-amber"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="Review pending applications"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Pending</p>
                            <span className="stat-icon-badge">
                                <IconClock size={18} color="#d97706" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.pendingApplications}
                        </h3>
                    </div>

                    <div
                        className="stat-card stat-green"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="Review accepted applications"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Accepted</p>
                            <span className="stat-icon-badge">
                                <IconCheckCircle size={18} color="#059669" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.acceptedApplications}
                        </h3>
                    </div>

                    <div
                        className="stat-card stat-red"
                        onClick={() => navigate("/hospital/my-blood-requests")}
                        title="Review rejected applications"
                    >
                        <div className="stat-card-header">
                            <p className="stat-label">Rejected</p>
                            <span className="stat-icon-badge">
                                <IconX size={18} color="#dc2626" />
                            </span>
                        </div>

                        <h3>
                            {dashboard.rejectedApplications}
                        </h3>
                    </div>

                </div>

            </section>


            {/* Quick Actions */}
            <section className="quick-actions">

                <div>
                    <p className="quick-actions-label">
                        QUICK ACTIONS
                    </p>

                    <h2>
                        Manage your hospital activity
                    </h2>

                    <p>
                        Create new blood requests or review the requests
                        you've already created.
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