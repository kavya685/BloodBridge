import { useEffect, useState } from "react";
import {
    getApplicationsByDonor,
    withdrawApplication
} from "../../services/donationApplicationService";
import "../../styles/Dashboard.css";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const donor = JSON.parse(
                localStorage.getItem("donor")
            );

            if (!donor) {
                setError("Donor information not found.");
                return;
            }

            const data =
                await getApplicationsByDonor(donor.id);

            setApplications(data || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Unable to load your applications. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleWithdraw = async (applicationId) => {

        try {

            setActionLoading(true);
            setError("");

            await withdrawApplication(applicationId);

            await fetchApplications();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Failed to withdraw application."
            );

        } finally {

            setActionLoading(false);
        }
    };

    if (loading) {

        return (
            <div className="dashboard-loading">
                <p>Loading your applications...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <section className="dashboard-header">

                <div className="dashboard-heading">

                    <p className="dashboard-label">
                        DONOR PORTAL
                    </p>

                    <h1>
                        My Applications
                    </h1>

                    <p className="dashboard-subtitle">
                        Track the blood requests you have applied for.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={fetchApplications}
                >
                    Refresh
                </button>

            </section>


            {error && (

                <div className="dashboard-error">
                    <p>{error}</p>

                    <button
                        className="secondary-button"
                        onClick={fetchApplications}
                    >
                        Try Again
                    </button>
                </div>

            )}


            {!error && applications.length === 0 && (

                <div className="stat-card">

                    <h3>
                        No applications yet
                    </h3>

                    <p>
                        You haven't applied to any blood requests.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            window.location.href =
                                "/blood-requests"
                        }
                    >
                        Browse Blood Requests
                    </button>

                </div>

            )}


            {applications.length > 0 && (

                <div className="stats-grid">

                    {applications.map((application) => (

                        <div
                            className="stat-card"
                            key={application.id}
                        >

                            <p className="stat-label">
                                BLOOD REQUEST #{application.bloodRequestId}
                            </p>

                            <h3>
                                {application.status}
                            </h3>

                            <p>
                                Applied At:{" "}
                                {application.appliedAt
                                    ? new Date(
                                        application.appliedAt
                                    ).toLocaleString()
                                    : "N/A"
                                }
                            </p>

                            {application.status === "PENDING" && (

                                <button
                                    className="secondary-button"
                                    disabled={actionLoading}
                                    onClick={() =>
                                        handleWithdraw(
                                            application.id
                                        )
                                    }
                                >
                                    {actionLoading
                                        ? "Withdrawing..."
                                        : "Withdraw Application"
                                    }
                                </button>

                            )}

                            {application.status === "ACCEPTED" && (
                                <p>
                                    Your application has been accepted.
                                </p>
                            )}

                            {application.status === "REJECTED" && (
                                <p>
                                    This application was rejected by the hospital.
                                </p>
                            )}

                            {application.status === "COMPLETED" && (
                                <p>
                                    Your donation has been completed.
                                </p>
                            )}

                            {application.status === "WITHDRAWN" && (
                                <p>
                                    You withdrew this application.
                                </p>
                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyApplications;