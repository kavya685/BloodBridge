import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/passwordService.js";
import PasswordInput from "../../../components/PasswordInput.jsx";
import Toast from "../../../components/Toast.jsx";
import { IconHospital } from "../../../components/icons/Icons.jsx";
import "../../../styles/Auth.css";

function ResetPassword() {

    const location = useLocation();
    const navigate = useNavigate();

    const { email } = location.state || {};

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            navigate("/hospital/forgot-password");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        try {

            await resetPassword(
                email,
                newPassword,
                confirmPassword
            );

            showToast("Password reset successfully! Redirecting to login...", "success");

            setTimeout(() => {
                navigate("/hospital/login");
            }, 1200);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Password reset failed. Please try again.";
            showToast(typeof msg === "string" ? msg : "Password reset failed. Please try again.", "error");
        }
    };

    return (
        <div className="auth-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={toast} onClose={() => setToast(null)} />

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-brand-mark" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconHospital size={24} color="var(--secondary)" />
                    </div>

                    <p className="auth-label">
                        HOSPITAL PORTAL
                    </p>

                    <h1>Reset Password</h1>

                    <p>
                        Create a new password for your
                        BloodBridge account.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">
                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <PasswordInput
                            id="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Reset Password
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Remember your password?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/hospital/login")
                        }
                    >
                        Back to Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;