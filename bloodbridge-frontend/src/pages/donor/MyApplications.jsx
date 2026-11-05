import { useEffect, useState } from "react";
import {
    getApplicationsByDonor,
    withdrawApplication
} from "../../services/donationApplicationService";
import DonationCertificateModal from "../../components/DonationCertificateModal";
import { IconAward, IconCheckCircle, IconFileText } from "../../components/icons/Icons";
import "../../styles/Dashboard.css";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedCertApp, setSelectedCertApp] = useState(null);
    const [donorInfo, setDonorInfo] = useState(null);

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

            setDonorInfo(donor);

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
                                {application.hospitalName ? application.hospitalName.toUpperCase() : `BLOOD REQUEST #${application.bloodRequestId}`}
                            </p>

                            <h3>
                                {application.status}
                            </h3>

                            {application.bloodGroup && (
                                <p style={{ fontWeight: "600", color: "var(--primary-accent)", margin: "4px 0" }}>
                                    Type: {application.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                                    {application.unitsRequired ? ` • ${application.unitsRequired} Unit(s)` : ""}
                                </p>
                            )}

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
                                <div style={{ marginTop: "10px" }}>
                                    <p style={{ color: "#2563eb", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <IconCheckCircle size={16} color="#2563eb" /> Application accepted! Please visit the hospital to donate.
                                    </p>
                                    <button
                                        className="primary-button"
                                        style={{ background: "#2563eb", borderColor: "#2563eb", padding: "7px 16px", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                        onClick={() => setSelectedCertApp(application)}
                                    >
                                        <IconFileText size={16} />
                                        View Donation Certificate
                                    </button>
                                </div>
                            )}

                            {application.status === "REJECTED" && (
                                <p style={{ color: "var(--text-secondary)" }}>
                                    {application.remarks || "This application was rejected by the hospital."}
                                </p>
                            )}

                            {application.status === "COMPLETED" && (
                                <div style={{ marginTop: "10px" }}>
                                    <p style={{ color: "#059669", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <IconCheckCircle size={16} color="#059669" /> Life-saving donation completed!
                                    </p>
                                    <button
                                        className="primary-button"
                                        style={{ background: "#059669", borderColor: "#059669", padding: "7px 16px", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                        onClick={() => setSelectedCertApp(application)}
                                    >
                                        <IconAward size={16} />
                                        Download Life-Saver Certificate
                                    </button>
                                </div>
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

            {selectedCertApp && (
                <DonationCertificateModal
                    application={selectedCertApp}
                    donorName={donorInfo?.fullName || donorInfo?.name}
                    onClose={() => setSelectedCertApp(null)}
                />
            )}

        </div>
    );
}

export default MyApplications;