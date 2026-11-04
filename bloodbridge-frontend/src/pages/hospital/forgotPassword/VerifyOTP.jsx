import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../../services/passwordService.js";
import Toast from "../../../components/Toast.jsx";
import { IconHospital } from "../../../components/icons/Icons.jsx";
import "../../../styles/Auth.css";

function VerifyOTP() {

    const location = useLocation();
    const navigate = useNavigate();

    const { email } = location.state || {};

    const [otp, setOtp] = useState("");
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

        try {
            const response = await verifyOTP(email, otp);

            if (response === true) {

                navigate("/hospital/reset-password", {
                    state: {
                        email
                    }
                });

            } else {
                showToast("Invalid OTP. Please check and try again.", "error");
            }

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Invalid or expired OTP.";
            showToast(typeof msg === "string" ? msg : "Invalid or expired OTP.", "error");
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

                    <h1>Verify OTP</h1>

                    <p>
                        Enter the 6-digit OTP sent to your
                        registered email address.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label htmlFor="otp">
                            OTP
                        </label>

                        <input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(event) =>
                                setOtp(event.target.value)
                            }
                            maxLength="6"
                            inputMode="numeric"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Verify OTP
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Didn't receive the OTP?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/hospital/forgot-password")
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        </div>
    );
}

export default VerifyOTP;