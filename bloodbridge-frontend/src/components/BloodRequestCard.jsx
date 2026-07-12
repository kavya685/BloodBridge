import "../styles/components/BloodRequestCard.css";
import { useNavigate } from "react-router-dom";

function BloodRequestCard({ request }) {
    const navigate = useNavigate();

    return (
        <div className="card"
        onClick={() => navigate(`/blood-requests/${request.id}`)}
        >
            <h3>{request.bloodGroup}</h3>

            <p>Units Required: {request.unitsRequired}</p>

            <p>{request.description}</p>

            <hr />
        </div>
    );
}

export default BloodRequestCard;
