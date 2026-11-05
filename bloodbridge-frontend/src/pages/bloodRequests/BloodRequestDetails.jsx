import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBloodRequestById } from "../../services/bloodRequestService";
import { applyForBloodRequest } from "../../services/donationApplicationService";
import Toast from "../../components/Toast";
import { IconMapPin, IconPhone, IconCalendar, IconClock, IconHeart } from "../../components/icons/Icons";
import "../../styles/BloodRequestDetails.css";

const BLOOD_GROUP_MAP = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
};

function BloodRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bloodRequest, setBloodRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const showFeedback = (message, type = "success") => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 4000);
    };

    const isDonor = !!localStorage.getItem("donor");

    useEffect(() => {
        const fetchBloodRequest = async () => {
            try {
                const data = await getBloodRequestById(id);
                setBloodRequest(data);
            } catch (error) {
                console.error("Failed to fetch request:", error);
                showFeedback("Failed to load request details.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchBloodRequest();
    }, [id]);

    const handleApply = async () => {
        if (!isDonor) {
            navigate("/donor/login", { state: { returnUrl: `/blood-requests/${id}` } });
            return;
        }

        setApplying(true);
        setFeedback(null);
        try {
            await applyForBloodRequest(bloodRequest.id);
            showFeedback("Application submitted successfully! The hospital has been notified.", "success");
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data || "Failed to submit donation application.";
            showFeedback(typeof msg === "string" ? msg : "An error occurred.", "error");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="request-details-page text-center" style={{ paddingTop: "80px" }}>
                <p style={{ color: "var(--text-muted)" }}>Loading blood request details...</p>
            </div>
        );
    }

    if (!bloodRequest) {
        return (
            <div className="request-details-page text-center" style={{ paddingTop: "80px" }}>
                <h3>Blood request not found.</h3>
                <Link to="/blood-requests" className="btn-secondary" style={{ marginTop: "16px" }}>
                    ← Back to Blood Requests
                </Link>
            </div>
        );
    }

    const bloodGroupFormatted = BLOOD_GROUP_MAP[bloodRequest.bloodGroup] || bloodRequest.bloodGroup;
    const isCritical = bloodRequest.urgency === "CRITICAL";

    return (
        <div className="request-details-page">
            <Link to="/blood-requests" className="request-details-back">
                ← Back to All Requests
            </Link>

            {/* Floating Top-Right Toast Notification */}
            <Toast message={feedback ? { text: feedback.message, type: feedback.type } : null} onClose={() => setFeedback(null)} />

            <div className="request-details-card">
                {/* Header */}
                <div className="request-details-header">
                    <div className="details-header-left">
                        <div className="details-blood-badge">
                            <span>{bloodGroupFormatted}</span>
                        </div>
                        <div className="details-title-area">
                            <h1>{bloodRequest.hospitalName}</h1>
                            <p className="details-location" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                <IconMapPin size={15} color="var(--text-muted)" />
                                <span>{bloodRequest.hospitalCity || "City Hospital"}</span>
                                {bloodRequest.hospitalAddress && ` • ${bloodRequest.hospitalAddress}`}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                        <span className={`badge ${isCritical ? "badge-critical" : "badge-medium"}`}>
                            {isCritical && <span className="pulse-dot" />}
                            {bloodRequest.urgency} URGENCY
                        </span>
                        {bloodRequest.hospitalContactNumber && (
                            <a
                                href={`tel:${bloodRequest.hospitalContactNumber}`}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: "var(--medical-blue)",
                                    background: "#ebf8ff",
                                    padding: "6px 12px",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid rgba(43, 108, 176, 0.2)"
                                }}
                            >
                                <IconPhone size={14} />
                                Call {bloodRequest.hospitalContactNumber}
                            </a>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="request-details-body">
                    <div className="details-metrics-grid">
                        <div className="details-metric-item">
                            <div className="metric-label">Units Needed</div>
                            <div className="metric-value highlight-red">{bloodRequest.unitsRequired}</div>
                        </div>
                        <div className="details-metric-item">
                            <div className="metric-label">Status</div>
                            <div className="metric-value" style={{ fontSize: "1.1rem" }}>
                                <span className={`badge ${bloodRequest.status === "OPEN" ? "badge-success" : "badge-low"}`}>
                                    {bloodRequest.status}
                                </span>
                            </div>
                        </div>
                        <div className="details-metric-item">
                            <div className="metric-label">Blood Type</div>
                            <div className="metric-value highlight-blue">{bloodGroupFormatted}</div>
                        </div>
                    </div>

                    {bloodRequest.description && (
                        <div className="details-section">
                            <h4>Medical Details & Notes</h4>
                            <p>{bloodRequest.description}</p>
                        </div>
                    )}

                    <div className="details-timestamps">
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <IconCalendar size={14} color="var(--text-muted)" />
                            <strong>Posted:</strong> {new Date(bloodRequest.createdAt).toLocaleDateString()}
                        </span>
                        {bloodRequest.expiresAt && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                <IconClock size={14} color="var(--text-muted)" />
                                <strong>Deadline:</strong> {new Date(bloodRequest.expiresAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {bloodRequest.status === "OPEN" && (
                        <div className="details-actions">
                            <button
                                type="button"
                                className="btn-primary details-apply-btn"
                                onClick={handleApply}
                                disabled={applying}
                                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                            >
                                {applying ? (
                                    "Submitting Application..."
                                ) : isDonor ? (
                                    <>
                                        <IconHeart size={16} fill="currentColor" />
                                        Apply to Donate Blood
                                    </>
                                ) : (
                                    "Sign In as Donor to Apply"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BloodRequestDetails;
