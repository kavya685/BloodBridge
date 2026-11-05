import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBloodRequest } from "../../services/bloodRequestService";
import Toast from "../../components/Toast";
import { IconPlus, IconClock } from "../../components/icons/Icons";
import "../../styles/CreateBloodRequest.css";

const extractErrorMessage = (err, defaultMsg = "Failed to create blood request.") => {
    if (!err?.response?.data) return err?.message || defaultMsg;
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (typeof data === "object") {
        const values = Object.values(data).filter(v => typeof v === "string");
        if (values.length > 0) {
            return values.join(". ");
        }
    }
    return defaultMsg;
};

// Returns YYYY-MM-DDTHH:mm formatted for datetime-local input
const getFutureDateTime = (hoursAhead = 24) => {
    const d = new Date();
    d.setHours(d.getHours() + hoursAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${mins}`;
};

function CreateBloodRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bloodGroup: "",
        unitsRequired: "",
        description: "",
        expiresAt: getFutureDateTime(24), // Default to 24h ahead
        urgency: "NORMAL"
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const showNotification = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const setExpiryPreset = (hours) => {
        setFormData(prev => ({
            ...prev,
            expiresAt: getFutureDateTime(hours)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validations
        if (!formData.bloodGroup) {
            showNotification("Please select a blood group.", "error");
            return;
        }

        const units = parseInt(formData.unitsRequired, 10);
        if (isNaN(units) || units < 1) {
            showNotification("Units required must be at least 1 unit.", "error");
            return;
        }

        if (!formData.urgency) {
            showNotification("Please select an urgency level.", "error");
            return;
        }

        if (!formData.expiresAt) {
            showNotification("Please select an expiry date and time.", "error");
            return;
        }

        const expiryDate = new Date(formData.expiresAt);
        if (expiryDate <= new Date()) {
            showNotification("Expiry date and time must be in the future.", "error");
            return;
        }

        setSubmitting(true);
        setMessage(null);

        // Format expiresAt to have seconds (ISO LocalDateTime format: YYYY-MM-DDTHH:mm:ss)
        let formattedExpiresAt = formData.expiresAt;
        if (formattedExpiresAt && formattedExpiresAt.length === 16) {
            formattedExpiresAt = `${formattedExpiresAt}:00`;
        }

        const payload = {
            bloodGroup: formData.bloodGroup,
            unitsRequired: units,
            urgency: formData.urgency,
            description: (formData.description || "").trim(),
            expiresAt: formattedExpiresAt
        };

        try {
            await createBloodRequest(payload);
            showNotification("Blood request created successfully!", "success");

            setTimeout(() => {
                navigate("/hospital/my-blood-requests");
            }, 1200);
        } catch (error) {
            console.error("Create request error:", error);
            showNotification(extractErrorMessage(error, "Failed to create blood request."), "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-request-page">
            <Toast message={message} onClose={() => setMessage(null)} />

            {/* Page Header */}
            <section className="create-request-header">

                <p className="page-label">
                    HOSPITAL REQUESTS
                </p>

                <h1>
                    Create Blood Request
                </h1>

                <p className="page-subtitle">
                    Submit a request for blood needed by your hospital.
                </p>

            </section>


            {/* Form */}
            <section className="create-request-card">

                <div className="form-section-header">

                    <h2>
                        Request Details
                    </h2>

                    <p>
                        Provide the blood type, quantity, urgency and
                        expiry information.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* Blood Group + Units */}
                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="bloodGroup">
                                Blood Group
                            </label>

                            <select
                                id="bloodGroup"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select blood group
                                </option>

                                <option value="A_POSITIVE">
                                    A+
                                </option>

                                <option value="A_NEGATIVE">
                                    A-
                                </option>

                                <option value="B_POSITIVE">
                                    B+
                                </option>

                                <option value="B_NEGATIVE">
                                    B-
                                </option>

                                <option value="AB_POSITIVE">
                                    AB+
                                </option>

                                <option value="AB_NEGATIVE">
                                    AB-
                                </option>

                                <option value="O_POSITIVE">
                                    O+
                                </option>

                                <option value="O_NEGATIVE">
                                    O-
                                </option>
                            </select>

                        </div>


                        <div className="form-group">

                            <label htmlFor="unitsRequired">
                                Units Required
                            </label>

                            <input
                                id="unitsRequired"
                                type="number"
                                name="unitsRequired"
                                value={formData.unitsRequired}
                                onChange={handleChange}
                                min="1"
                                placeholder="Enter number of units"
                                required
                            />

                        </div>

                    </div>


                    {/* Urgency */}
                    <div className="form-group">

                        <label htmlFor="urgency">
                            Urgency
                        </label>

                        <select
                            id="urgency"
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select urgency
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


                    {/* Description */}
                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add any important information about this request..."
                            required
                        />

                    </div>


                    {/* Expiry */}
                    <div className="form-group">

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <label htmlFor="expiresAt" style={{ margin: 0 }}>
                                Expiry Date & Time
                            </label>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                    type="button"
                                    onClick={() => setExpiryPreset(24)}
                                    style={{
                                        background: "var(--surface-muted)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-sm)",
                                        padding: "3px 8px",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    +24h
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setExpiryPreset(48)}
                                    style={{
                                        background: "var(--surface-muted)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-sm)",
                                        padding: "3px 8px",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    +48h
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setExpiryPreset(168)}
                                    style={{
                                        background: "var(--surface-muted)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-sm)",
                                        padding: "3px 8px",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    +7 Days
                                </button>
                            </div>
                        </div>

                        <input
                            id="expiresAt"
                            type="datetime-local"
                            name="expiresAt"
                            value={formData.expiresAt}
                            min={getFutureDateTime(1)}
                            onChange={handleChange}
                            required
                        />

                        <span className="field-hint">
                            The request will automatically expire and deactivate after this timestamp.
                        </span>

                    </div>


                    {/* Actions */}
                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
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
                            Create Request
                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}

export default CreateBloodRequest;