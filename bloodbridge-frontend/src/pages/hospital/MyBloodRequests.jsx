import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBloodRequests } from "../../services/bloodRequestService";
import { deleteBloodRequest } from "../../services/bloodRequestService";
import "../../styles/MyBloodRequests.css";

function MyBloodRequests() {
    const [bloodRequest, setBloodRequest] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchBloodRequest();
    }, []);

    const fetchBloodRequest = async () => {
        try {
            const response = await getMyBloodRequests();
            setBloodRequest(response);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch blood requests.");
        }
    };

    const handleDelete = async (bloodRequestId) => {
        try {
            await deleteBloodRequest(bloodRequestId);
            alert("Blood Request deleted!");
            fetchBloodRequest();
        } catch (error) {
            alert("Failed to delete blood request.");
        }
    };

    return (
        <div className="my-requests-page">

            {/* Page Header */}
            <section className="my-requests-header">

                <div>
                    <p className="page-label">
                        HOSPITAL REQUESTS
                    </p>

                    <h1>
                        My Blood Requests
                    </h1>

                    <p className="page-subtitle">
                        Manage the blood requests created by your hospital.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("/hospital/create-blood-request")
                    }
                >
                    + Create Request
                </button>

            </section>


            {/* Requests */}
            {bloodRequest.length === 0 ? (

                <section className="empty-state">

                    <div className="empty-state-mark">
                        +
                    </div>

                    <h2>
                        No blood requests yet
                    </h2>

                    <p>
                        Create a blood request when your hospital needs
                        blood from eligible donors.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/hospital/create-blood-request")
                        }
                    >
                        Create Blood Request
                    </button>

                </section>

            ) : (

                <section className="request-list">

                    {bloodRequest.map((request) => (

                        <article
                            className="blood-request-card"
                            key={request.id}
                        >

                            {/* Request Header */}
                            <div className="request-card-header">

                                <div className="blood-group-block">

                                    <span className="blood-group">
                                        {request.bloodGroup}
                                    </span>

                                    <div>
                                        <p className="request-units">
                                            {request.unitsRequired}{" "}
                                            {request.unitsRequired === 1
                                                ? "unit"
                                                : "units"}{" "}
                                            required
                                        </p>

                                        <p className="request-created">
                                            Blood request
                                        </p>
                                    </div>

                                </div>

                                <span className="request-status">
                                    {request.status}
                                </span>

                            </div>


                            {/* Description */}
                            {request.description && (
                                <p className="request-description">
                                    {request.description}
                                </p>
                            )}


                            {/* Request Details */}
                            <div className="request-details">

                                <div className="request-detail">
                                    <span>
                                        Urgency
                                    </span>

                                    <strong>
                                        {request.urgency || "—"}
                                    </strong>
                                </div>

                                <div className="request-detail">
                                    <span>
                                        Expires
                                    </span>

                                    <strong>
                                        {request.expiresAt
                                            ? new Date(
                                                request.expiresAt
                                            ).toLocaleString("en-IN")
                                            : "—"}
                                    </strong>
                                </div>

                            </div>


                            {/* Actions */}
                            <div className="request-card-actions">

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            `/hospital/blood-requests/${request.id}/applicants`
                                        )
                                    }
                                >
                                    View Applicants
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(
                                            `/hospital/edit-blood-request/${request.id}`,
                                            {
                                                state: { request }
                                            }
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(request.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </article>

                    ))}

                </section>
            )}

        </div>
    );
}

export default MyBloodRequests;