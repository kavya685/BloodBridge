import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getBloodRequestById } from "../../services/bloodRequestService";
import { applyForBloodRequest } from "../../services/donationApplicationService";


function BloodRequestDetails() {
    const {id} = useParams();

    const [bloodRequest, setBloodRequest] = useState(null);
    useEffect(() => {
        const fetchBloodRequest = async () => {
            try {
                const data = await getBloodRequestById(id);
                 setBloodRequest(data);
                 } catch (error) {
                     console.error(error);
                     }
                 };
             fetchBloodRequest();
             }, [id]);

        const handleApply = async() => {
            try {
                await applyForBloodRequest(bloodRequest.id);
                alert("Application Submitted Successfully!")
            } catch(error) {
                alert(error.response?.data?.message || "Failed to apply.");
            }
        }

    if (!bloodRequest) {
        return <h2>Loading...</h2>;
    }

    return (
            <div>
                <h1>Blood Request Details</h1>

                <p><strong>Blood Group:</strong> {bloodRequest.bloodGroup}</p>

                <p><strong>Units Required:</strong> {bloodRequest.unitsRequired}</p>

                <p><strong>Description:</strong> {bloodRequest.description}</p>

                <p><strong>Hospital:</strong> {bloodRequest.hospitalName}</p>

                <p><strong>Urgency:</strong> {bloodRequest.urgency}</p>

                <p><strong>Status:</strong> {bloodRequest.status}</p>

                <p><strong>Created At:</strong> {bloodRequest.createdAt}</p>

                <p><strong>Expires At:</strong> {bloodRequest.expiresAt}</p>

                <button onClick={handleApply}>
                    Apply
                </button>
            </div>
        );
}

export default BloodRequestDetails;
