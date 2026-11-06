import { useNavigate } from "react-router-dom";
import { donorDashboard } from "../../services/donor/dashboardService";
import { donorEligibility } from "../../services/donor/eligibilityService";
import { useState, useEffect } from "react";
import {
    IconBell,
    IconBloodDrop,
    IconUsers,
    IconClock,
    IconCheckCircle,
    IconX,
    IconAward
} from "../../components/icons/Icons";
import "../../styles/Dashboard.css";

function Dashboard() {

    const donor = JSON.parse(localStorage.getItem("donor"));
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [eligibility, setEligibility] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [dashboardResponse, eligibilityResponse] =
                await Promise.all([
                    donorDashboard(),
                    donorEligibility()
                ]);

            setDashboard(dashboardResponse);
            setEligibility(eligibilityResponse);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Unable to load your dashboard. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("donor");
        localStorage.removeItem("token");

        navigate("/donor/login");
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">

                <div className="dashboard-error">
                    <h2>Unable to load dashboard</h2>

                    <p>{error}</p>

                    <button
                        className="primary-button"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>
                </div>

            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <section className="dashboard-header">

                <div className="dashboard-heading">

                    <p className="dashboard-label">
                        DONOR DASHBOARD
                    </p>

                    <h1>
                        Welcome, {donor?.fullName}
                    </h1>

                    <p className="dashboard-subtitle">
                        Find blood requests, manage your applications,
                        and keep track of your donation eligibility.
                    </p>

                </div>

                <div className="dashboard-header-actions">

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/donor/notifications")
                        }
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <IconBell size={16} style={{ marginRight: "6px" }} />
                        Notifications
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/blood-requests")
                        }
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <IconBloodDrop size={16} style={{ marginRight: "6px" }} />
                        Find Blood Requests
                    </button>

                </div>

            </section>


            <section className="dashboard-section">

                <div className="section-title">

                    <h2>My Applications</h2>

                    <p>
                        Overview of your blood donation applications. Click any card to view your applications.
                    </p>

                </div>

                <div className="stats-grid">

                    <div
                        className="stat-card stat-blue"
                        onClick={() => navigate("/donor/my-applications")}
                        title="View all your applications"
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
                        onClick={() => navigate("/donor/my-applications")}
                        title="View pending applications"
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
                        onClick={() => navigate("/donor/my-applications")}
                        title="View accepted applications"
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
                        onClick={() => navigate("/donor/my-applications")}
                        title="View rejected applications"
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


            <section className="dashboard-section">

                <div className="section-title">

                    <h2>Donation Eligibility</h2>

                    <p>
                        Your current eligibility to donate blood.
                    </p>

                </div>

                <div className={`stat-card ${eligibility.eligible ? "stat-green" : "stat-amber"}`}>

                    {eligibility.eligible ? (

                        <>
                            <div className="stat-card-header">
                                <p className="stat-label">Eligibility Status</p>
                                <span className="stat-icon-badge">
                                    <IconCheckCircle size={18} color="#059669" />
                                </span>
                            </div>

                            <h3 style={{ fontSize: "22px", marginBottom: "8px", color: "var(--success-dark)" }}>
                                You are eligible to donate
                            </h3>

                            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                                You can apply for compatible blood requests in your area.
                            </p>
                        </>

                    ) : (

                        <>
                            <div className="stat-card-header">
                                <p className="stat-label">Cooldown Active</p>
                                <span className="stat-icon-badge">
                                    <IconClock size={18} color="#d97706" />
                                </span>
                            </div>

                            <h3 style={{ fontSize: "22px", marginBottom: "8px", color: "var(--warning-dark)" }}>
                                You are currently in recovery cooldown
                            </h3>

                            <p style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
                                Next eligible date: <strong>{eligibility.nextEligible}</strong>
                            </p>

                            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                                Days remaining: <strong>{eligibility.daysRemaining} days</strong>
                            </p>
                        </>

                    )}

                </div>

            </section>


            <section className="quick-actions">

                <div>

                    <p className="quick-actions-label">
                        QUICK ACTIONS
                    </p>

                    <h2>
                        Ready to help someone?
                    </h2>

                    <p>
                        Browse compatible blood requests and
                        apply to help patients in need.
                    </p>

                </div>

                <div className="dashboard-header-actions">

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/blood-requests")
                        }
                    >
                        View Blood Requests
                    </button>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/donor/my-applications")
                        }
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <IconAward size={16} style={{ marginRight: "6px" }} />
                        Certificates & Applications
                    </button>

                </div>

            </section>


            <div className="dashboard-footer">

                <button
                    className="secondary-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Dashboard;