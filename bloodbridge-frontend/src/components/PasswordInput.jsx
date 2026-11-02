import { useState } from "react";

function PasswordInput({
    id,
    placeholder = "Enter password",
    value,
    onChange,
    required = false,
    className = "",
    name,
    autoComplete,
    style = {},
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
            <input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                autoComplete={autoComplete}
                className={className}
                style={{ paddingRight: "44px", width: "100%", ...style }}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--secondary-text, #718096)",
                }}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    // Eye slash icon (Hide)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    // Eye icon (Show)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default PasswordInput;
