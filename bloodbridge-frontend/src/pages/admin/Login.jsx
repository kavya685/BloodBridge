import { useState } from "react";
import { loginAdmin } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { IconShield } from "../../components/icons/Icons";
import "../../styles/Auth.css";

function AdminLogin() {
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
            const response = await loginAdmin({
                email,
                password,
            });

            localStorage.setItem("token", response.token);
            localStorage.setItem("admin", JSON.stringify(response));

            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Admin login error:", err);
            const message = err.response?.data?.message || err.response?.data || "Invalid admin credentials";
            setError(typeof message === "string" ? message : "Authentication failed");
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
                    <div className="auth-brand-mark" style={{ background: "var(--surface-muted)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconShield size={24} color="var(--text-primary)" />
                    </div>

                    <p className="auth-label" style={{ color: "var(--secondary)" }}>
                        ADMINISTRATION PORTAL
                    </p>

                    <h1>Admin Console</h1>

                    <p>
                        Authorized personnel only. Access system metrics, verify hospitals, and manage platform security.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="admin-email">Admin Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            placeholder="admin@bloodbridge.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="admin-password">Password</label>
                        <PasswordInput
                            id="admin-password"
                            placeholder="Enter master password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
