import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getApplicationsByBloodRequest,
    acceptApplication,
    rejectApplication,
    completeApplication
} from "../../services/donationApplicationService";
import Toast from "../../components/Toast";
import { IconUser, IconCheck, IconX, IconCheckCircle } from "../../components/icons/Icons";
import "../../styles/BloodRequestApplicants.css";

function BloodRequestApplicants() {
    const [applications, setApplications] = useState([]);
    const [toast, setToast] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchApplications = async () => {
        try {
            const data = await getApplicationsByBloodRequest(id);
            setApplications(data || []);
        } catch (error) {
            console.error(error);
            showToast("Failed to load applicants.", "error");
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleAcceptance = async (applicationId, action) => {
        try {
            if (action === "accept") {
                await acceptApplication(applicationId);
                showToast("Donor application accepted!");
            } else {
                await rejectApplication(applicationId);
                showToast("Donor application rejected.");
            }

            await fetchApplications();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to update application status.", "error");
        }
    };

    const handleCompletion = async (applicationId) => {
        try {
            await completeApplication(applicationId);
            showToast("Donation marked as completed successfully!", "success");
            fetchApplications();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to complete application.", "error");
        }
    };

    return (
        <div className="applicants-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={toast} onClose={() => setToast(null)} />

            <section className="applicants-header">
                <div>
                    <p className="page-label">APPLICANT MANAGEMENT</p>

                    <h1>Blood Request Applicants</h1>

                    <p className="page-subtitle">
                        Review donors who have applied for this blood request
                        and manage their applications.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate("/hospital/my-blood-requests")
                    }
                >
                    ← Back to Requests
                </button>
            </section>

            <section className="applicants-summary">
                <div>
                    <span className="summary-label">
                        Total Applicants
                    </span>

                    <strong>
                        {applications.length}
                    </strong>
                </div>
            </section>

            {applications.length === 0 ? (
                <section className="applicants-empty">
                    <div className="empty-icon" style={{ display: "flex", justifyContent: "center", color: "var(--text-muted)" }}>
                        <IconUser size={44} />
                    </div>

                    <h2>No applicants yet</h2>

                    <p>
                        Donors who apply for this blood request will
                        appear here.
                    </p>
                </section>
            ) : (
                <section className="applicants-list">

                    {applications.map((application) => (
                        <article
                            className="applicant-card"
                            key={application.id}
                        >

                            <div className="applicant-card-top">

                                <div className="applicant-identity">

                                    <div className="applicant-avatar">
                                        {application.donorName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h2>
                                            {application.donorName}
                                        </h2>

                                        <p>
                                            Applied{" "}
                                            {application.appliedAt
                                                ? new Date(
                                                    application.appliedAt
                                                ).toLocaleString("en-IN")
                                                : "—"}
                                        </p>
                                    </div>

                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    {application.donorEligible === false && (
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "600",
                                                padding: "4px 8px",
                                                borderRadius: "6px",
                                                backgroundColor: "#fef3c7",
                                                color: "#92400e",
                                                border: "1px solid #fde68a"
                                            }}
                                            title={application.nextEligibleDate ? `Next eligible on: ${application.nextEligibleDate}` : "Donor in medical cooldown"}
                                        >
                                            Ineligible (Cooldown: {application.cooldownDaysRemaining}d left)
                                        </span>
                                    )}

                                    <span
                                        className={`application-status status-${application.status.toLowerCase()}`}
                                    >
                                        {application.status}
                                    </span>
                                </div>

                            </div>

                            {application.status === "PENDING" && (
                                <div className="applicant-actions">
                                    {application.donorEligible === false ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "0.82rem", color: "#b45309", fontWeight: "500" }}>
                                                ⚠️ Donor is in medical cooldown ({application.cooldownDaysRemaining || 0}d left, eligible on {application.nextEligibleDate || "later date"}). Cannot accept.
                                            </span>
                                            <button
                                                className="reject-button"
                                                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                                                onClick={() =>
                                                    handleAcceptance(
                                                        application.id,
                                                        "reject"
                                                    )
                                                }
                                            >
                                                <IconX size={14} />
                                                Reject / Dismiss
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className="accept-button"
                                                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                                                onClick={() =>
                                                    handleAcceptance(
                                                        application.id,
                                                        "accept"
                                                    )
                                                }
                                            >
                                                <IconCheck size={14} />
                                                Accept
                                            </button>

                                            <button
                                                className="reject-button"
                                                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                                                onClick={() =>
                                                    handleAcceptance(
                                                        application.id,
                                                        "reject"
                                                    )
                                                }
                                            >
                                                <IconX size={14} />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {application.status === "ACCEPTED" && (
                                <div className="applicant-actions">
                                    {application.donorEligible === false ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "0.82rem", color: "#b45309", fontWeight: "500" }}>
                                                ⚠️ Donor is currently in cooldown ({application.cooldownDaysRemaining || 0}d left).
                                            </span>
                                            <button
                                                className="reject-button"
                                                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                                                onClick={() =>
                                                    handleAcceptance(
                                                        application.id,
                                                        "reject"
                                                    )
                                                }
                                            >
                                                <IconX size={14} />
                                                Dismiss Application
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="complete-button"
                                            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                            onClick={() =>
                                                handleCompletion(
                                                    application.id
                                                )
                                            }
                                        >
                                            <IconCheckCircle size={15} />
                                            Mark Donation Complete
                                        </button>
                                    )}
                                </div>
                            )}

                            {application.status === "COMPLETED" && (
                                <div className="completed-message">
                                    Donation completed successfully.
                                </div>
                            )}

                            {application.status === "REJECTED" && (
                                <div className="rejected-message">
                                    {application.remarks || "This application was rejected."}
                                </div>
                            )}

                        </article>
                    ))}

                </section>
            )}

        </div>
    );
}

export default BloodRequestApplicants;