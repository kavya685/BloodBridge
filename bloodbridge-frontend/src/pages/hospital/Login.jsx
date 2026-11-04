import { useState } from "react";
import { hospitalLogin } from "../../services/hospital/loginService";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { IconHospital } from "../../components/icons/Icons";
import "../../styles/Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await hospitalLogin({
                email,
                password,
            });

            localStorage.setItem("token", response.token);

            localStorage.setItem(
                "hospital",
                JSON.stringify(response)
            );

            navigate("/hospital/dashboard");
        } catch (err) {
            console.error(err);

            const msg = err.response?.data;

            // Specific case: registration not yet approved
            if (
                typeof msg === "string" &&
                msg.toLowerCase().includes("not been accepted")
            ) {
                setError(
                    "Your registration is still pending admin approval. " +
                    "You will receive an email once your account is approved."
                );
            } else if (typeof msg === "string" && msg.length > 0) {
                setError(msg);
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={error ? { text: error, type: "error" } : null} onClose={() => setError("")} />

            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-brand-mark" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconHospital size={24} color="var(--secondary)" />
                    </div>

                    <p className="auth-label">
                        HOSPITAL PORTAL
                    </p>

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to manage your blood requests
                        and donor applications.
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

                    <div className="auth-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <PasswordInput
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/hospital/forgot-password")
                            }
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                <div className="auth-footer">
                    <span>
                        Don't have a hospital account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/hospital/register")
                        }
                    >
                        Register
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Login;