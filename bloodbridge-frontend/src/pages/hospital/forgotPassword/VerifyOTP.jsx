import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../../services/passwordService.js";
import "../../../styles/Auth.css";

function VerifyOTP() {

    const location = useLocation();
    const navigate = useNavigate();

    const { email } = location.state || {};

    const [otp, setOtp] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            alert("Invalid password reset request.");
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
                alert("Invalid OTP.");
            }

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data ||
                "Invalid or expired OTP."
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-brand-mark">
                        ♥
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