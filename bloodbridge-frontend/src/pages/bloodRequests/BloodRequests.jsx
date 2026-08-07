import { useEffect, useState } from "react";
import { getAllBloodRequests } from "../../services/bloodRequestService";
import BloodRequestCard from "../../components/BloodRequestCard";

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

    return (
        <div>
            <h1>Blood Requests</h1>

            {
                bloodRequests.map((request) => (
                    <div key={request.id}>
                        <BloodRequestCard request={request}>
                            <button>Apply</button>
                        </BloodRequestCard>
                    </div>
                )
            )
            }

        </div>
    );
}

export default BloodRequests;
