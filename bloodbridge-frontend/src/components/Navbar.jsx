import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconBloodDrop, IconUser, IconHospital, IconShield } from "./icons/Icons";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const donor = localStorage.getItem("donor");
    const hospital = localStorage.getItem("hospital");
    const admin = localStorage.getItem("admin");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("donor");
        localStorage.removeItem("hospital");
        localStorage.removeItem("admin");
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <span className="brand-logo-mark" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <IconBloodDrop size={20} color="#dc2626" />
                    </span>
                    <span className="brand-text">
                        Blood<span className="brand-accent">Bridge</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${isActive("/") ? "active" : ""}`}
                    >
                        Home
                    </Link>

                    {/* Donor Navigation */}
                    {donor && (
                        <>
                            <Link
                                to="/donor/dashboard"
                                className={`navbar-link ${isActive("/donor/dashboard") ? "active" : ""}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/blood-requests"
                                className={`navbar-link ${isActive("/blood-requests") ? "active" : ""}`}
                            >
                                Blood Requests
                            </Link>
                            <Link
                                to="/donor/my-applications"
                                className={`navbar-link ${isActive("/donor/my-applications") ? "active" : ""}`}
                            >
                                My Applications
                            </Link>
                            <Link
                                to="/donor/profile"
                                className={`navbar-link ${isActive("/donor/profile") ? "active" : ""}`}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/donor/notifications"
                                className={`navbar-link ${isActive("/donor/notifications") ? "active" : ""}`}
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
                                className={`navbar-link ${isActive("/hospital/dashboard") ? "active" : ""}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/hospital/my-blood-requests"
                                className={`navbar-link ${isActive("/hospital/my-blood-requests") ? "active" : ""}`}
                            >
                                My Requests
                            </Link>
                            <Link
                                to="/hospital/create-blood-request"
                                className={`navbar-link ${isActive("/hospital/create-blood-request") ? "active" : ""}`}
                            >
                                + Create Request
                            </Link>
                            <Link
                                to="/hospital/profile"
                                className={`navbar-link ${isActive("/hospital/profile") ? "active" : ""}`}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/hospital/notifications"
                                className={`navbar-link ${isActive("/hospital/notifications") ? "active" : ""}`}
                            >
                                Notifications
                            </Link>
                        </>
                    )}

                    {/* Admin Navigation */}
                    {admin && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className={`navbar-link ${isActive("/admin/dashboard") ? "active" : ""}`}
                            >
                                Admin Dashboard
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    {/* Logged Out State */}
                    {!donor && !hospital && !admin && (
                        <div className="auth-buttons">
                            {/* Login Dropdown */}
                            <div className="navbar-dropdown">
                                <button className="navbar-dropdown-button">
                                    Login
                                    <span className="dropdown-arrow">▾</span>
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/donor/login" className="dropdown-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <IconUser size={16} color="var(--primary)" /> Donor Login
                                    </Link>
                                    <Link to="/hospital/login" className="dropdown-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <IconHospital size={16} color="var(--secondary)" /> Hospital Login
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/admin/login" className="dropdown-item dropdown-admin" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <IconShield size={16} color="var(--text-primary)" /> Admin Portal
                                    </Link>
                                </div>
                            </div>

                            {/* Register Dropdown */}
                            <div className="navbar-dropdown">
                                <button className="navbar-register-button">
                                    Get Started
                                    <span className="dropdown-arrow">▾</span>
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/donor/register" className="dropdown-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <IconUser size={16} color="var(--primary)" /> Register as Donor
                                    </Link>
                                    <Link to="/hospital/register" className="dropdown-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <IconHospital size={16} color="var(--secondary)" /> Register Hospital
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logged In State */}
                    {(donor || hospital || admin) && (
                        <div className="user-menu">
                            <span className="role-tag" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                {donor && (
                                    <>
                                        <IconUser size={13} /> Donor
                                    </>
                                )}
                                {hospital && (
                                    <>
                                        <IconHospital size={13} /> Hospital
                                    </>
                                )}
                                {admin && (
                                    <>
                                        <IconShield size={13} /> Admin
                                    </>
                                )}
                            </span>
                            <button onClick={handleLogout} className="navbar-logout-button" title="Log out">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;