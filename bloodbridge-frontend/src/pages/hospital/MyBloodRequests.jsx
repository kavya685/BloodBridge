import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getMyBloodRequests from "../../services/bloodRequestService";

function MyBloodRequests() {
    const [bloodRequest, setBloodRequest] = useState([]);
    useEffect(() => {
        fetchBloodRequests();
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

    return (
            <div>
                <h1>My Blood Requests</h1>
                bloodRequest.map((request) => (
                    <div key={request.id}>
                        <h3>Blood Group: {request.bloodGroup}</h3>
                        <p>Units Required: {request.unitsRequired}</p>
                    ))
            </div>
        );
}

export default MyBloodRequests;
