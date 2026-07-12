import "../styles/components/BloodRequestCard.css";

function BloodRequestCard({ request }) {
    return (
        <div className="card">
            <h3>{request.bloodGroup}</h3>

            <p>Units Required: {request.unitsRequired}</p>

            <p>{request.description}</p>

            <hr />
        </div>
    );
}

export default BloodRequestCard;
