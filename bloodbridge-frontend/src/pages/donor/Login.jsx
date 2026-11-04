import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { donorLogin } from "../../services/donor/loginService";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { IconBloodDrop } from "../../components/icons/Icons";
import "../../styles/Auth.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const registered = location.state?.registered;

    const [toast, setToast] = useState(
        registered
            ? { text: "Account registered successfully! You can now log in.", type: "success" }
            : null
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setToast(null);
        setLoading(true);

        try {
            const response = await donorLogin({
                email,
                password,
            });

            localStorage.setItem("token", response.token);

            localStorage.setItem(
                "donor",
                JSON.stringify(response)
            );

            navigate("/donor/dashboard");

        } catch (err) {
            console.error(err);
            const msg = err.response?.data;
            if (typeof msg === "string" && msg.length > 0) {
                setToast({ text: msg, type: "error" });
            } else {
                setToast({ text: "Invalid email or password. Please try again.", type: "error" });
            }
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

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Sign in to find blood requests
                        and manage your donations.
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
                                navigate("/donor/forgot-password")
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
                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Don't have a donor account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/donor/register")
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