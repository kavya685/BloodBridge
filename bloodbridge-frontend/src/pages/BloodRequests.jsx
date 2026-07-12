import { useEffect, useState } from "react";
import { getAllBloodRequests } from "../services/bloodRequestService";
import BloodRequestCard from "../components/BloodRequestCard";

function BloodRequests() {

    const [bloodRequests, setBloodRequests] = useState([]);

    useEffect(() => {

        const fetchBloodRequests = async () => {

            try {
                const response = await getAllBloodRequests();
                setBloodRequests(response.data);
            } catch (error) {
                console.error(error);
            }

        };

        fetchBloodRequests();

    }, []);

    return (
        <div>
            <h1>Blood Requests</h1>

            {
                bloodRequests.map((request) => (
                    <BloodRequestCard
                        key={request.id}
                        request={request}
                    />
                ))
            }

        </div>
    );
}

export default BloodRequests;
