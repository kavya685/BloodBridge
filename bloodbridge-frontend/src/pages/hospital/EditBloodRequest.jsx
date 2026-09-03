import { editBloodRequest } from "../../services/bloodRequestService.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";

function EditBloodRequest () {

    const { state } = useLocation();
    const { id } = useParams();
    const request = state?.request;

    if (!request) {
        return <h2>Request data not found.</h2>;
    }


    const [description, setDescription] = useState(request.description);
    const [urgency, setUrgency] = useState(request.urgency);
    const [expiresAt, setExpiresAt] = useState(request.expiresAt);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await editBloodRequest(
                id, {
                description,
                urgency,
                expiresAt
            });
            alert("Blood request edited!");
            navigate("/hospital/my-blood-requests");
        } catch (error) {
            console.log(error);
            alert("Failed to edit blood request.");
        }
    }

    return (
        <div>
            <h2>Edit Blood Request:</h2>
            <form onSubmit={handleSubmit}>
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
                </div> <br/>

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
                </div> <br/>

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
                </div> <br/>

                <button type="submit">Edit</button>
            </form>
        </div>
    );
}

export default EditBloodRequest;