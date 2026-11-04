import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { hospitalRegister } from "../../services/hospital/registerService";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { IconHospital, IconClock, IconCheckCircle } from "../../components/icons/Icons";
import "../../styles/Auth.css";

function Register() {
    const [hospitalName, setHospitalName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [registrationPending, setRegistrationPending] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please re-enter them.");
            return;
        }

        setLoading(true);

        try {
            await hospitalRegister({
                hospitalName,
                contactNumber,
                email,
                password,
                confirmPassword,
                city,
                address,
                registrationNumber
            });

            // On success, show the pending approval screen — do NOT navigate away
            setRegistrationPending(true);
        } catch (err) {
            console.error("Hospital registration error:", err);

            // Extract the real error message from backend response
            const data = err.response?.data;

            if (data && typeof data === "object") {
                // Validation errors come back as { field: "message", ... }
                const messages = Object.values(data).join(" ");
                setError(messages);
            } else if (data && typeof data === "string") {
                setError(data);
            } else {
                setError("Registration failed. Please check your details and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Pending Approval Screen ──────────────────────────────────────────
    if (registrationPending) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ maxWidth: "520px", textAlign: "center" }}>

                    <div style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: "#fff3e0",
                        border: "2px solid #fed7aa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px"
                    }}>
                        <IconClock size={36} color="#d97706" />
                    </div>

                    <p className="auth-label" style={{ color: "#d97706" }}>
                        REGISTRATION SUBMITTED
                    </p>

                    <h1 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>
                        Awaiting Admin Approval
                    </h1>

                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "24px" }}>
                        Your hospital registration for <strong>{hospitalName}</strong> has been successfully received.
                        A BloodBridge administrator will review your application and verify your credentials.
                    </p>

                    <div style={{
                        background: "var(--success-light)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        borderRadius: "var(--radius-md)",
                        padding: "14px 18px",
                        marginBottom: "24px",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        color: "var(--success-dark)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <IconCheckCircle size={20} color="var(--success-dark)" style={{ flexShrink: 0 }} />
                        <span>Once approved, you will receive a confirmation email at <strong>{email}</strong> with instructions to log in.</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button
                            onClick={() => navigate("/hospital/login")}
                            className="btn-secondary"
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            Go to Hospital Login
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-muted)",
                                fontSize: "0.875rem",
                                cursor: "pointer"
                            }}
                        >
                            Return to Home
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    // ── Registration Form ────────────────────────────────────────────────
    return (
        <div className="auth-page auth-register-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={error ? { text: error, type: "error" } : null} onClose={() => setError("")} />

            <div className="auth-card auth-card-wide">

                <div className="auth-header">
                    <div className="auth-brand-mark" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconHospital size={24} color="var(--secondary)" />
                    </div>

                    <p className="auth-label">
                        HOSPITAL REGISTRATION
                    </p>

                    <h1>Create your account</h1>

                    <p>
                        Register your hospital to start managing blood requests through BloodBridge.
                        After submission, an administrator will review and approve your account.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-form-grid">

                        <div className="auth-field">
                            <label htmlFor="hospitalName">
                                Hospital Name
                            </label>

                            <input
                                id="hospitalName"
                                type="text"
                                placeholder="Enter hospital name"
                                value={hospitalName}
                                onChange={(event) =>
                                    setHospitalName(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="contactNumber">
                                Contact Number
                            </label>

                            <input
                                id="contactNumber"
                                type="text"
                                placeholder="Enter contact number"
                                value={contactNumber}
                                onChange={(event) =>
                                    setContactNumber(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">
                                Official Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="hospital@email.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                type="text"
                                placeholder="Enter your city"
                                value={city}
                                onChange={(event) =>
                                    setCity(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <PasswordInput
                                id="password"
                                placeholder="Min 8 chars, uppercase, number & symbol"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmpassword">
                                Confirm Password
                            </label>

                            <PasswordInput
                                id="confirmpassword"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="registrationNumber">
                                Hospital Registration Number
                            </label>

                            <input
                                id="registrationNumber"
                                type="text"
                                placeholder="Enter official registration number"
                                value={registrationNumber}
                                onChange={(event) =>
                                    setRegistrationNumber(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="auth-field auth-field-full">
                            <label htmlFor="address">
                                Hospital Address
                            </label>

                            <textarea
                                id="address"
                                placeholder="Enter full hospital address"
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                                required
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Submitting Application..." : "Submit Registration Request →"}
                    </button>

                </form>

                <div className="auth-footer">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/hospital/login")
                        }
                    >
                        Sign In
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Register;