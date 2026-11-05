import "../styles/components/BloodRequestCard.css";
import { useNavigate } from "react-router-dom";
import { IconBloodDrop, IconClock, IconMapPin, IconPhone } from "./icons/Icons";

function BloodRequestCard({ request, children, onCardClick }) {
    const navigate = useNavigate();

    const formatBloodGroup = (group) => {
        if (!group) return "";
        return group
            .replace("_POSITIVE", "+")
            .replace("_NEGATIVE", "-");
    };

    const getUrgencyBadge = (urgency) => {
        const u = urgency?.toLowerCase() || "medium";
        const isCritical = urgency === "CRITICAL" || urgency === "EMERGENCY";
        return (
            <span className={`badge badge-${u}`}>
                {isCritical && <span className="pulse-dot"></span>}
                {urgency || "STANDARD"}
            </span>
        );
    };

    const formatExpiry = (expiresAt) => {
        if (!expiresAt) return null;
        const diff = new Date(expiresAt) - new Date();
        if (diff <= 0) return { text: "Expired", urgent: true };
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) {
            const mins = Math.max(1, Math.floor(diff / (1000 * 60)));
            return { text: `${mins}m left`, urgent: true };
        }
        if (hours < 24) return { text: `${hours}h left`, urgent: hours <= 6 };
        const days = Math.floor(hours / 24);
        return { text: `${days}d left`, urgent: false };
    };

    const expiryInfo = formatExpiry(request?.expiresAt);

    const handleClick = () => {
        if (onCardClick) {
            onCardClick(request);
        } else {
            navigate(`/blood-requests/${request.id}`);
        }
    };

    return (
        <div className={`request-card ${(request?.urgency === 'CRITICAL' || request?.urgency === 'EMERGENCY') ? 'request-card-critical' : ''}`} onClick={handleClick}>
            {/* Top Bar: Urgency & Expiry */}
            <div className="request-card-header">
                <div className="request-card-urgency">
                    {getUrgencyBadge(request?.urgency)}
                </div>
                {expiryInfo && (
                    <span className={`request-expiry ${expiryInfo.urgent ? 'request-expiry-urgent' : ''}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <IconClock size={12} />
                        {expiryInfo.text}
                    </span>
                )}
            </div>

            {/* Main Content Area */}
            <div className="request-card-body">
                <div className="request-blood-badge">
                    <span className="blood-drop-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <IconBloodDrop size={18} color="#e53e3e" />
                    </span>
                    <span className="blood-group-text">{formatBloodGroup(request?.bloodGroup)}</span>
                </div>

                <div className="request-card-info">
                    <h4 className="request-hospital-name">
                        {request?.hospitalName || "Partner Hospital"}
                    </h4>
                    {request?.hospitalCity && (
                        <p className="request-location" style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                            <IconMapPin size={13} color="var(--text-muted)" />
                            <span>{request.hospitalCity}</span>
                            {request?.hospitalContactNumber && (
                                <>
                                    <span style={{ margin: "0 2px" }}>•</span>
                                    <IconPhone size={12} color="var(--text-muted)" />
                                    <span>{request.hospitalContactNumber}</span>
                                </>
                            )}
                        </p>
                    )}
                    <p className="request-desc">
                        {request?.description || "Urgent donor required."}
                    </p>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="request-card-footer">
                <div className="request-metric">
                    <span className="metric-label">Required</span>
                    <span className="metric-value">{request?.unitsRequired} {request?.unitsRequired === 1 ? 'Unit' : 'Units'}</span>
                </div>

                {request?.status && (
                    <span className={`badge ${request.status === 'OPEN' ? 'badge-success' : 'badge-low'}`}>
                        {request.status}
                    </span>
                )}
            </div>

            {children && (
                <div className="request-card-actions" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default BloodRequestCard;
