import { IconCheckCircle, IconAlertTriangle, IconBell, IconInfo, IconX } from "./icons/Icons";

function Toast({ message, onClose }) {
    if (!message) return null;

    const type = message.type || "success";
    const text = typeof message === "string" ? message : message.text;

    const renderIcon = () => {
        switch (type) {
            case "error":
                return <IconAlertTriangle size={20} color="#b91c1c" />;
            case "warning":
                return <IconBell size={20} color="#b45309" />;
            case "info":
                return <IconInfo size={20} color="#1d4ed8" />;
            case "success":
            default:
                return <IconCheckCircle size={20} color="#047857" />;
        }
    };

    return (
        <div className="toast-container" role="alert" aria-live="assertive">
            <div className={`toast-notification ${type}`}>
                <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                    {renderIcon()}
                </span>
                <span style={{ flexGrow: 1 }}>{text}</span>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="toast-close-btn"
                        aria-label="Close notification"
                    >
                        <IconX size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Toast;
