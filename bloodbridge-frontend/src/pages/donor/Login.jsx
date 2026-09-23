import { useState } from "react";
import { donorLogin } from "../../services/donor/loginService";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await donorLogin({
                email,
                password,
            });

            console.log(response);

            localStorage.setItem("token", response.token);

            localStorage.setItem(
                "donor",
                JSON.stringify(response)
            );

            navigate("/donor/dashboard");

        } catch (error) {
            console.error(error);
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

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

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

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

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