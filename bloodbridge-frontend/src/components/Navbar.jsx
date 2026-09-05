import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    const donor = localStorage.getItem("donor");
    const hospital = localStorage.getItem("hospital");

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">♥</span>
                    <span>BloodBridge</span>
                </Link>

                <div className="navbar-links">

                    <Link to="/" className="navbar-link">
                        Home
                    </Link>

                    {donor && (
                        <>
                            <Link
                                to="/donor/dashboard"
                                className="navbar-link"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/blood-requests"
                                className="navbar-link"
                            >
                                Blood Requests
                            </Link>

                            <Link
                                to="/donor/my-applications"
                                className="navbar-link"
                            >
                                My Applications
                            </Link>

                            <Link
                                to="/donor/notifications"
                                className="navbar-link"
                            >
                                Notifications
                            </Link>
                        </>
                    )}

                    {hospital && (
                        <>
                            <Link
                                to="/hospital/dashboard"
                                className="navbar-link"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/hospital/my-blood-requests"
                                className="navbar-link"
                            >
                                My Requests
                            </Link>

                            <Link
                                to="/hospital/create-blood-request"
                                className="navbar-link"
                            >
                                Create Request
                            </Link>

                            <Link
                                to="/hospital/notifications"
                                className="navbar-link"
                            >
                                Notifications
                            </Link>
                        </>
                    )}

                </div>

                <div className="navbar-actions">

                    {!donor && !hospital && (
                        <>
                            <Link
                                to="/donor/login"
                                className="navbar-login"
                            >
                                Donor Login
                            </Link>

                            <Link
                                to="/donor/register"
                                className="navbar-login"
                            >
                                Donor Register
                            </Link>

                            <Link
                                to="/hospital/login"
                                className="navbar-login"
                            >
                                Hospital Login
                            </Link>

                            <Link
                                to="/hospital/register"
                                className="navbar-register"
                            >
                                Hospital Register
                            </Link>
                        </>
                    )}

                    {donor && (
                        <span className="navbar-role">
                            Donor
                        </span>
                    )}

                    {hospital && (
                        <span className="navbar-role">
                            Hospital
                        </span>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;