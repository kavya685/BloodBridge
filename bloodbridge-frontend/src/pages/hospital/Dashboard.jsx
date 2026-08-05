import { useNavigate } from "react-router-dom";

function Dashboard() {

    const hospital = JSON.parse(localStorage.getItem("hospital"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("hospital");
        navigate("/hospital/login");
    };

    return (
        <div>
            <h1>Hospital Dashboard</h1>

            <h3>Welcome {hospital.fullName}</h3>

            <button
              onClick={() =>
                  navigate("/hospital/create-blood-request")
              }
            >
                  Create Blood Request
            </button>

            <button
                onClick={() =>
                    navigate("/hospital/my-blood-requests")
                }
            >
                My Blood Requests
            </button>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;
