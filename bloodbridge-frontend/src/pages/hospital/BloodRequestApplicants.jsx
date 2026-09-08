import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getApplicationsByBloodRequest,
    acceptApplication,
    rejectApplication,
    completeApplication
} from "../../services/donationApplicationService";
import "../../styles/BloodRequestApplicants.css";

function BloodRequestApplicants() {
    const [applications, setApplications] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            const data = await getApplicationsByBloodRequest(id);
            setApplications(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleAcceptance = async (applicationId, action) => {
        try {
            if (action === "accept") {
                await acceptApplication(applicationId);
            } else {
                await rejectApplication(applicationId);
            }

            await fetchApplications();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCompletion = async (applicationId) => {
        try {
            await completeApplication(applicationId);
            alert("Application completed!");
            fetchApplications();
        } catch (error) {
            console.log(error);
            alert("Failed to complete application.");
        }
    };

    return (
        <div className="applicants-page">

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
                    <div className="empty-icon">
                        👤
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

                                <span
                                    className={`application-status status-${application.status.toLowerCase()}`}
                                >
                                    {application.status}
                                </span>

                            </div>

                            {application.status === "PENDING" && (
                                <div className="applicant-actions">

                                    <button
                                        className="accept-button"
                                        onClick={() =>
                                            handleAcceptance(
                                                application.id,
                                                "accept"
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                    <button
                                        className="reject-button"
                                        onClick={() =>
                                            handleAcceptance(
                                                application.id,
                                                "reject"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>
                            )}

                            {application.status === "ACCEPTED" && (
                                <div className="applicant-actions">

                                    <button
                                        className="complete-button"
                                        onClick={() =>
                                            handleCompletion(
                                                application.id
                                            )
                                        }
                                    >
                                        Mark Donation Complete
                                    </button>

                                </div>
                            )}

                            {application.status === "COMPLETED" && (
                                <div className="completed-message">
                                    Donation completed successfully.
                                </div>
                            )}

                            {application.status === "REJECTED" && (
                                <div className="rejected-message">
                                    This application was rejected.
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