import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../../services/passwordService.js";
import Toast from "../../../components/Toast.jsx";
import { IconHospital } from "../../../components/icons/Icons.jsx";
import "../../../styles/Auth.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await sendOTP(email);

            navigate("/hospital/verify-otp", {
                state: {
                    email,
                    expiresAt: response
                }
            });

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "OTP not sent. Please try again.";
            showToast(typeof msg === "string" ? msg : "OTP not sent. Please try again.", "error");
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

                    <h1>Forgot password?</h1>

                    <p>
                        Enter your registered email and
                        we'll send you an OTP to reset
                        your password.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Send OTP
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

export default ForgotPassword;