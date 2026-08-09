import { useEffect, useState } from "react";
import { getAllBloodRequests } from "../../services/bloodRequestService";
import BloodRequestCard from "../../components/BloodRequestCard";
import { applyForBloodRequest } from "../../services/donationApplicationService";

function BloodRequests() {

    const [bloodRequests, setBloodRequests] = useState([]);

    useEffect(() => {

        const fetchBloodRequests = async () => {

            try {
                const response = await getAllBloodRequests();
                setBloodRequests(response);
            } catch (error) {
                console.error(error);
            }

        };

        fetchBloodRequests();

    }, []);

    const handleApply = async (bloodRequestId) => {
        try {
            await applyForBloodRequest(bloodRequestId);
            alert("Applied successfully!");
        } catch(error) {
            console.log(error);
            alert("Failed to apply!")
        }
    }

    return (
        <div>
            <h1>Blood Requests</h1>

            {
                bloodRequests.map((request) => (
                    <div key={request.id}>
                        <BloodRequestCard request={request}>
                            <button onClick={handleApply}>Apply</button>
                        </BloodRequestCard>
                    </div>
                )
            )
            }

        </div>
    );
}

export default BloodRequests;
