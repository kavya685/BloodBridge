import { editBloodRequest } from "../../services/bloodRequestService.js";
import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Toast from "../../components/Toast";
import "../../styles/EditBloodRequest.css";

function EditBloodRequest() {
    const { state } = useLocation();
    const { id } = useParams();
    const request = state?.request;

    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    if (!request) {
        return (
            <div className="edit-request-page">
                <div className="edit-request-error">
                    <h2>Request data not found.</h2>
                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/hospital/my-blood-requests")
                        }
                    >
                        ← Back to Requests
                    </button>
                </div>
            </div>
        );
    }

    const [description, setDescription] = useState(request.description);
    const [urgency, setUrgency] = useState(request.urgency);
    const [expiresAt, setExpiresAt] = useState(request.expiresAt);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedExpiresAt = expiresAt && expiresAt.length === 16 ? `${expiresAt}:00` : expiresAt;
            await editBloodRequest(id, {
                description,
                urgency,
                expiresAt: formattedExpiresAt
            });

            navigate("/hospital/my-blood-requests", {
                state: { toastMessage: "Blood request updated successfully!" }
            });
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Failed to edit blood request.";
            showToast(typeof msg === "string" ? msg : "Failed to edit blood request.", "error");
        }
    };

    return (
        <div className="edit-request-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={toast} onClose={() => setToast(null)} />

            <section className="edit-request-header">
                <div>
                    <p className="page-label">REQUEST MANAGEMENT</p>

                    <h1>Edit Blood Request</h1>

                    <p className="page-subtitle">
                        Update the details of your blood request.
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

            <section className="edit-request-card">

                <div className="edit-request-card-header">
                    <div>
                        <h2>Request Details</h2>
                        <p>
                            Update the information below and save your
                            changes.
                        </p>
                    </div>

                    <span className="edit-blood-group">
                        {request.bloodGroup}
                    </span>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            placeholder="Enter request description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="urgency">
                                Urgency
                            </label>

                            <select
                                id="urgency"
                                value={urgency}
                                onChange={(event) =>
                                    setUrgency(event.target.value)
                                }
                            >
                                <option value="">
                                    Select Urgency
                                </option>
                                <option value="NORMAL">
                                    Normal
                                </option>
                                <option value="URGENT">
                                    Urgent
                                </option>
                                <option value="EMERGENCY">
                                    Emergency
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="expiresAt">
                                Expiry Date & Time
                            </label>

                            <input
                                id="expiresAt"
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(event) =>
                                    setExpiresAt(event.target.value)
                                }
                            />
                        </div>

                    </div>

                    <div className="edit-request-actions">

                        <button
                            type="button"
                            className="outline-button"
                            onClick={() =>
                                navigate("/hospital/my-blood-requests")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}

export default EditBloodRequest;