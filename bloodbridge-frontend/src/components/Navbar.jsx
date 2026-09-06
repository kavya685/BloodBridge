import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    const donor = localStorage.getItem("donor");
    const hospital = localStorage.getItem("hospital");

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">♥</span>
                    <span>BloodBridge</span>
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">

                    <Link to="/" className="navbar-link">
                        Home
                    </Link>

                    {/* Donor Navigation */}
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

                    {/* Hospital Navigation */}
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

                {/* Right Side */}
                <div className="navbar-actions">

                    {/* Logged Out */}
                    {!donor && !hospital && (
                        <>
                            {/* Login Dropdown */}
                            <div className="navbar-dropdown">

                                <button className="navbar-dropdown-button">
                                    Login
                                    <span className="dropdown-arrow">   ▾</span>
                                </button>

                                <div className="dropdown-menu">

                                    <Link to="/donor/login">
                                        Donor
                                    </Link>

                                    <Link to="/hospital/login">
                                        Hospital
                                    </Link>

                                </div>

                            </div>

                            {/* Register Dropdown */}
                            <div className="navbar-dropdown">

                                <button className="navbar-register">
                                    Register
                                    <span className="dropdown-arrow">▾</span>
                                </button>

                                <div className="dropdown-menu">

                                    <Link to="/donor/register">
                                        Donor
                                    </Link>

                                    <Link to="/hospital/register">
                                        Hospital
                                    </Link>

                                </div>

                            </div>
                        </>
                    )}

                    {/* Logged In - Donor */}
                    {donor && (
                        <span className="navbar-role">
                            Donor
                        </span>
                    )}

                    {/* Logged In - Hospital */}
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