import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicationsByBloodRequest } from "../../services/donationApplicationService";

function BloodRequestApplicants()
{
  const[applications, setApplications] = useState([]);
  const {id} = useParams();

  const fetchApplications = async () => {
    try {
      const data = await getApplicationsByBloodRequest(id);
      setApplications = data;
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

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

                <button>
                    Accept
                </button>

                <button>
                    Reject
                </button>

                <hr />

            </div>
        ))}
    </div>
  );
}

export default BloodRequestApplicants;
