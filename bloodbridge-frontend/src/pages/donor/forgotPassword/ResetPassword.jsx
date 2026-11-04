import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/passwordService.js";
import PasswordInput from "../../../components/PasswordInput.jsx";
import Toast from "../../../components/Toast.jsx";
import { IconBloodDrop } from "../../../components/icons/Icons.jsx";
import "../../../styles/Auth.css";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const { email } = location.state || {};

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email, newPassword, confirmPassword);
            showToast("Password reset successfully! Redirecting to login...", "success");
            setTimeout(() => {
                navigate("/donor/login");
            }, 1200);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Password reset failed. Please try again.";
            showToast(typeof msg === "string" ? msg : "Password reset failed. Please try again.", "error");
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

                    <h1>Reset Password</h1>

                    <p>
                        Create a strong new password for your BloodBridge donor account.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="newPassword">New Password</label>
                        <PasswordInput
                            id="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
