import { useNavigate } from "react-router-dom";
import { donorDashboard } from "../../services/donor/dashboardService";
import { donorEligibility } from "../../services/donor/eligibilityService";
import { useState, useEffect } from "react";
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
                    >
                        Notifications
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/blood-requests")
                        }
                    >
                        Find Blood Requests
                    </button>

                </div>

            </section>


            <section className="dashboard-section">

                <div className="section-title">

                    <h2>My Applications</h2>

                    <p>
                        Overview of your blood donation applications.
                    </p>

                </div>

                <div className="stats-grid">

                    <div className="stat-card">
                        <p className="stat-label">
                            Total Applications
                        </p>

                        <h3>
                            {dashboard.totalApplications}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p className="stat-label">
                            Pending
                        </p>

                        <h3>
                            {dashboard.pendingApplications}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p className="stat-label">
                            Accepted
                        </p>

                        <h3>
                            {dashboard.acceptedApplications}
                        </h3>
                    </div>

                    <div className="stat-card">
                        <p className="stat-label">
                            Rejected
                        </p>

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

                <div className="stat-card">

                    {eligibility.eligible ? (

                        <>
                            <h3>
                                You are eligible to donate
                            </h3>

                            <p>
                                You can apply for compatible blood requests.
                            </p>
                        </>

                    ) : (

                        <>
                            <h3>
                                You are currently not eligible
                            </h3>

                            <p>
                                Next eligible date:{" "}
                                {eligibility.nextEligible}
                            </p>

                            <p>
                                Days remaining:{" "}
                                {eligibility.daysRemaining}
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
                    >
                        My Applications
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