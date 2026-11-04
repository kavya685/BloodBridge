import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../../services/passwordService.js";
import Toast from "../../../components/Toast.jsx";
import { IconBloodDrop } from "../../../components/icons/Icons.jsx";
import "../../../styles/Auth.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await sendOTP(email);

            navigate("/donor/verify-otp", {
                state: {
                    email,
                    expiresAt: response
                }
            });

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Failed to send OTP. Please check your email.";
            showToast(typeof msg === "string" ? msg : "Failed to send OTP. Please check your email.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={toast} onClose={() => setToast(null)} />

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-brand-mark" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconBloodDrop size={24} color="var(--primary)" />
                    </div>

                    <p className="auth-label">
                        DONOR PORTAL
                    </p>

                    <h1>Forgot password?</h1>

                    <p>
                        Enter your registered email and we'll send you an OTP to reset your password.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Remember your password?</span>
                    <button
                        type="button"
                        onClick={() => navigate("/donor/login")}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
