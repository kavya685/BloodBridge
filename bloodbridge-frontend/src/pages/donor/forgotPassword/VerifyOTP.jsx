import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../../services/passwordService.js";
import Toast from "../../../components/Toast.jsx";
import { IconBloodDrop } from "../../../components/icons/Icons.jsx";
import "../../../styles/Auth.css";

function VerifyOTP() {
    const location = useLocation();
    const navigate = useNavigate();

    const { email } = location.state || {};
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            navigate("/donor/forgot-password");
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOTP(email, otp);

            if (response === true) {
                navigate("/donor/reset-password", {
                    state: {
                        email
                    }
                });
            } else {
                showToast("Invalid OTP entered. Please try again.", "error");
            }

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Invalid or expired OTP.";
            showToast(typeof msg === "string" ? msg : "Invalid or expired OTP.", "error");
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

                    <h1>Verify OTP</h1>

                    <p>
                        We sent a 6-digit OTP code to <strong>{email || "your email"}</strong>.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(event) => setOtp(event.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Didn't receive code?</span>
                    <button
                        type="button"
                        onClick={() => navigate("/donor/forgot-password")}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;
