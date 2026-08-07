import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBloodRequest } from "../../services/bloodRequestService";

function CreateBloodRequest() {
    const [bloodGroup, setBloodGroup] = useState("");
    const [unitsRequired, setUnitsRequired] = useState("");
    const [description, setDescription] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [urgency, setUrgency] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !bloodGroup ||
            !unitsRequired ||
            !description ||
            !expiresAt ||
            !urgency
        ) {
            alert("Please fill all required fields.");
            return;
          }

        try {
            const response = await createBloodRequest({
                bloodGroup,
                unitsRequired,
                description,
                expiresAt,
                urgency
            });
            alert("New Blood Request Created!");
        } catch (error) {
            console.error(error);
            alert("Failed to create blood request!");
        }

        navigate("/hospital/dashboard");
    }
    return (
        <div>
            <h1>Create Blood Request</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Blood Group</label>
                    <br />
                    <select
                        value={bloodGroup}
                        onChange={(event) =>
                            setBloodGroup(event.target.value)
                        }
                    >
                        <option value="">Select Blood Group</option>
                        <option value="A_POSITIVE">A+</option>
                        <option value="A_NEGATIVE">A-</option>
                        <option value="B_POSITIVE">B+</option>
                        <option value="B_NEGATIVE">B-</option>
                        <option value="AB_POSITIVE">AB+</option>
                        <option value="AB_NEGATIVE">AB-</option>
                        <option value="O_POSITIVE">O+</option>
                        <option value="O_NEGATIVE">O-</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Units Required</label>
                    <br />
                    <input
                        type="number"
                        placeholder="Enter units required"
                        value={unitsRequired}
                        onChange={(event) =>
                            setUnitsRequired(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />
                    <textarea
                        placeholder="Enter request description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Expiry Date & Time</label>
                    <br />
                    <input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(event) =>
                            setExpiresAt(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Urgency</label>
                    <br />
                    <select
                        value={urgency}
                        onChange={(event) =>
                            setUrgency(event.target.value)
                        }
                    >
                        <option value="">Select Urgency</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="EMERGENCY">EMERGENCY</option>
                    </select>
                </div>

                <br />

                <button type="submit">
                    Create Blood Request
                </button>

            </form>
        </div>
    );
}

export default CreateBloodRequest;
