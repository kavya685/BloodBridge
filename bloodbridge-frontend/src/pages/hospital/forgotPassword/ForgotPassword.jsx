import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../../services/passwordService.js";
import "../../../styles/Auth.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

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
            console.log(error);

            alert(
                error.response?.data ||
                "OTP not sent. Please try again."
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