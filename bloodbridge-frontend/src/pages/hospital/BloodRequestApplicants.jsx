import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getApplicationsByBloodRequest,
    acceptApplication,
    rejectApplication,
    completeApplication
} from "../../services/donationApplicationService";

function BloodRequestApplicants()
{
  const[applications, setApplications] = useState([]);
  const {id} = useParams();

  const fetchApplications = async () => {
    try {
      const data = await getApplicationsByBloodRequest(id);
      setApplications(data);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAcceptance = async (applicationId, action) => {
    try{
        if(action === "accept") {
            await acceptApplication(applicationId);
        }

        else await rejectApplication(applicationId);

        await fetchApplications();
    } catch(error) {
        console.log(error);
    }
  }

  const handleCompletion = async (applicationId) => {
    try {
        const response = await completeApplication(applicationId);
        alert("Application completed!");
        fetchApplications();
    } catch (error) {
        console.log(error);
        alert("Failed to complete application.");
    }
  }

  return (
    <div>
        <h1>Blood Request Applicants</h1>

        {applications.map((application) => (
            <div key={application.id}>

                <h3>{application.donorName}</h3>

                <p>
                    Status: {application.status}
                </p>

                <p>
                    Applied At: {application.appliedAt}
                </p>

                {
                  application.status === "PENDING" && (
                    <>
                      <button
                            onClick={() => handleAcceptance(application.id, "accept")}
                        >
                            Accept
                        </button>

                        <button
                            onClick={() => handleAcceptance(application.id, "reject")}
                        >
                            Reject
                        </button>
                    </>
                  )}

                {application.status === "ACCEPTED" && (
                    <button
                        onClick={() => handleCompletion(application.id)}
                    >
                        Complete
                    </button>
                )}
            </div>
         ))}
    </div>
  );
}

export default BloodRequestApplicants;
