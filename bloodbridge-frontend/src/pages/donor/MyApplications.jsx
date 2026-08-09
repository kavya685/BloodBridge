import { useEffect, useState } from "react";
import { getApplicationsByDonor } from "../../services/donationApplicationService";

function MyApplications() {

    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const donor = JSON.parse(localStorage.getItem("donor"));

            const data = await getApplicationsByDonor(donor.id);
            setApplications(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div>
            <h1>My Applications</h1>

            {
                applications.map((application) => (
                    <div key={application.id}>

                        <p>
                            <strong>Blood Request ID:</strong> {application.bloodRequestId}
                        </p>

                        <p>
                            <strong>Status:</strong> {application.status}
                        </p>

                        <p>
                            <strong>Applied At:</strong> {application.appliedAt}
                        </p>

                        <hr />
                    </div>
                ))
            }

        </div>
    );
}

export default MyApplications;
