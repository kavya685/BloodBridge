import { useNavigate } from "react-router-dom";

function Dashboard() {

    const donor = JSON.parse(localStorage.getItem("donor"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("donor");
        navigate("/donor/login");
    };

    return (
        <div>
            <h1>Donor Dashboard</h1>

            <h3>Welcome {donor.fullName}</h3>

            <button onClick={handleLogout}>
                Logout
            </button>

            <button onClick={() => navigate("/blood-requests")}>
                View Blood Requests
            </button>
        </div>
    );
}

export default Dashboard;
