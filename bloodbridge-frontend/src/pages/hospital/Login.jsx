import { useState } from "react";
import { hospitalLogin } from "../../services/hospital/loginService";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await hospitalLogin({
                email,
                password,
            });

            console.log(response);

            localStorage.setItem("token", response.token);

            localStorage.setItem(
                "hospital",
                JSON.stringify(response)
            );

            navigate("/hospital/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-brand-mark">♥</div>

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
                    >
                        Sign In
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