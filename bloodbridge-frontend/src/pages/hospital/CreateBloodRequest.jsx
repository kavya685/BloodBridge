import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBloodRequest } from "../../services/bloodRequestService";
import "../../styles/CreateBloodRequest.css";

function CreateBloodRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bloodGroup: "",
        unitsRequired: "",
        description: "",
        expiresAt: "",
        urgency: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createBloodRequest(formData);

            alert("Blood request created successfully.");

            navigate("/hospital/my-blood-requests");
        } catch (error) {
            console.error(error);
            alert("Failed to create blood request.");
        }
    };

    return (
        <div className="create-request-page">

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
                        />

                    </div>


                    {/* Expiry */}
                    <div className="form-group">

                        <label htmlFor="expiresAt">
                            Expiry Date & Time
                        </label>

                        <input
                            id="expiresAt"
                            type="datetime-local"
                            name="expiresAt"
                            value={formData.expiresAt}
                            onChange={handleChange}
                            required
                        />

                        <span className="field-hint">
                            The request will no longer be available after
                            this time.
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