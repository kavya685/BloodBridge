import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconBloodDrop, IconHospital, IconHeart, IconShield, IconClock } from "../components/icons/Icons";
import { getAllBloodRequests } from "../services/bloodRequestService";
import "../styles/Home.css";

// Comprehensive Medical Blood Compatibility Map
const COMPATIBILITY_MAP = {
    "O-": {
        canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        canReceiveFrom: ["O-"],
        type: "Universal Red Cell Donor",
        badge: "Critical Need",
    },
    "O+": {
        canDonateTo: ["O+", "A+", "B+", "AB+"],
        canReceiveFrom: ["O+", "O-"],
        type: "Most Common Blood Type",
        badge: "High Demand",
    },
    "A-": {
        canDonateTo: ["A-", "A+", "AB-", "AB+"],
        canReceiveFrom: ["A-", "O-"],
        type: "Rare & Crucial",
        badge: "Urgent",
    },
    "A+": {
        canDonateTo: ["A+", "AB+"],
        canReceiveFrom: ["A+", "A-", "O+", "O-"],
        type: "High Platelet Need",
        badge: "Frequent Demand",
    },
    "B-": {
        canDonateTo: ["B-", "B+", "AB-", "AB+"],
        canReceiveFrom: ["B-", "O-"],
        type: "Rare Blood Type",
        badge: "Critical Need",
    },
    "B+": {
        canDonateTo: ["B+", "AB+"],
        canReceiveFrom: ["B+", "B-", "O+", "O-"],
        type: "Widely Required",
        badge: "Active Need",
    },
    "AB-": {
        canDonateTo: ["AB-", "AB+"],
        canReceiveFrom: ["AB-", "A-", "B-", "O-"],
        type: "Rarest Blood Type",
        badge: "High Value",
    },
    "AB+": {
        canDonateTo: ["AB+"],
        canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        type: "Universal Red Cell Recipient",
        badge: "Universal Plasma Donor",
    },
};

function formatTimeLeft(expiresAt) {
    if (!expiresAt) return "Active";
    const diffMs = new Date(expiresAt) - new Date();
    if (diffMs <= 0) return "Expiring soon";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) {
        const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${mins} min${mins > 1 ? "s" : ""} left`;
    }
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} left`;
}

function Home() {
    const [selectedGroup, setSelectedGroup] = useState("O-");
    const [liveRequests, setLiveRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const compatData = COMPATIBILITY_MAP[selectedGroup];

    useEffect(() => {
        let isMounted = true;
        getAllBloodRequests()
            .then((data) => {
                if (isMounted && Array.isArray(data)) {
                    const openReqs = data.filter((r) => r.status === "OPEN");
                    setLiveRequests(openReqs);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch live requests for home:", err);
            })
            .finally(() => {
                if (isMounted) setLoadingRequests(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="home-container">

            {/* Emergency Top Broadcast Banner */}
            <div className="emergency-ticker">
                <div className="emergency-ticker-content">
                    <span className="ticker-pulse">●</span>
                    <span className="ticker-label">EMERGENCY NETWORK:</span>
                    <span>Verified hospital requests are actively looking for eligible donors. Check compatibility and donate today.</span>
                    <Link to="/blood-requests" className="ticker-link">
                        View Live Feed →
                    </Link>
                </div>
            </div>

            {/* =========================================================
                HERO SECTION
               ========================================================= */}
            <section className="home-hero">
                <div className="hero-grid">
                    
                    {/* Left Column: Mission & Actions */}
                    <div className="hero-left">
                        <div className="hero-badge">
                            <span className="pulse-dot" />
                            <span>REAL-TIME BLOOD MATCHING NETWORK</span>
                        </div>

                        <h1 className="hero-title">
                            Connecting <span className="highlight-red">Urgent Blood Needs</span> with Lifesaving Donors.
                        </h1>

                        <p className="hero-subtitle">
                            BloodBridge is a mission-critical platform linking verified hospitals
                            with eligible donors in seconds. Safe, automated, and strictly regulated
                            for emergency medical care.
                        </p>

                        <div className="hero-cta-group">
                            <Link to="/blood-requests" className="btn-primary hero-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                <IconBloodDrop size={18} color="#ffffff" />
                                View Urgent Blood Requests
                            </Link>
                            <Link to="/donor/register" className="btn-secondary hero-btn">
                                Become a Donor
                            </Link>
                        </div>

                        <div className="hero-hospital-prompt">
                            <span>Are you a registered healthcare provider?</span>
                            <Link to="/hospital/register" className="hospital-prompt-link">
                                Register Hospital Portal →
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Live Feed Real Requests Card */}
                    <div className="hero-right">
                        <div className="live-feed-card">
                            <div className="feed-header">
                                <div className="feed-header-title">
                                    <span className="feed-dot">●</span>
                                    <h4>Live Emergency Requests</h4>
                                </div>
                                <span className="feed-count">
                                    {liveRequests.length > 0 ? `${liveRequests.length} Active Request${liveRequests.length > 1 ? "s" : ""}` : "Live Feed"}
                                </span>
                            </div>

                            <div className="feed-list">
                                {liveRequests.length > 0 ? (
                                    liveRequests.slice(0, 3).map((req) => (
                                        <div key={req.id} className={`feed-item feed-item-${(req.urgency || "NORMAL").toLowerCase()}`}>
                                            <div className="feed-blood-badge">
                                                <span>{req.bloodGroup}</span>
                                            </div>
                                            <div className="feed-info">
                                                <div className="feed-top-row">
                                                    <strong>{req.unitsRequired} Unit{req.unitsRequired > 1 ? "s" : ""} Required</strong>
                                                    <span className={`feed-urgency-pill urgency-${(req.urgency || "NORMAL").toLowerCase()}`}>
                                                        {req.urgency}
                                                    </span>
                                                </div>
                                                <div className="feed-bottom-row">
                                                    <span>{req.hospitalName} • {req.hospitalCity}</span>
                                                    <span className="feed-time" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                        <IconClock size={12} />
                                                        {formatTimeLeft(req.expiresAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                        {loadingRequests ? "Loading live emergency requests..." : "No active blood requests currently. Check back soon!"}
                                    </div>
                                )}
                            </div>

                            <div className="feed-footer">
                                <Link to="/blood-requests" className="feed-cta-button">
                                    Browse All Emergency Requests →
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* =========================================================
                IMPACT METRICS STRIP
               ========================================================= */}
            <section className="impact-strip">
                <div className="impact-grid">
                    <div className="impact-item">
                        <div className="impact-number highlight-red">Verified</div>
                        <div className="impact-label">Admin-Approved Hospitals</div>
                        <div className="impact-desc">Strict verification prevents fraudulent requests</div>
                    </div>
                    <div className="impact-item">
                        <div className="impact-number highlight-blue">8 Types</div>
                        <div className="impact-label">Smart Blood Compatibility</div>
                        <div className="impact-desc">Automated medical matching algorithms</div>
                    </div>
                    <div className="impact-item">
                        <div className="impact-number highlight-green">&lt; 60s</div>
                        <div className="impact-label">Instant Notification Dispatch</div>
                        <div className="impact-desc">Real-time alerts to available registered donors</div>
                    </div>
                    <div className="impact-item">
                        <div className="impact-number">24 / 7</div>
                        <div className="impact-label">Critical Emergency Readiness</div>
                        <div className="impact-desc">Automated expiry timers & status management</div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                INTERACTIVE BLOOD COMPATIBILITY CHECKER
               ========================================================= */}
            <section className="compat-section">
                <div className="section-head text-center">
                    <p className="section-eyebrow">MEDICAL COMPATIBILITY TOOL</p>
                    <h2 className="section-title">Know Your Blood Compatibility</h2>
                    <p className="section-desc">
                        Select a blood group below to see who you can donate to and receive blood from.
                    </p>
                </div>

                <div className="compat-card">
                    {/* Blood Group Selectors */}
                    <div className="compat-selector-bar">
                        {Object.keys(COMPATIBILITY_MAP).map((group) => (
                            <button
                                key={group}
                                type="button"
                                className={`compat-pill ${selectedGroup === group ? "active" : ""}`}
                                onClick={() => setSelectedGroup(group)}
                            >
                                {group}
                            </button>
                        ))}
                    </div>

                    {/* Compatibility Result Box */}
                    <div className="compat-result-box">
                        <div className="compat-header">
                            <div className="compat-header-left">
                                <span className="compat-large-badge">{selectedGroup}</span>
                                <div>
                                    <h3>Blood Group {selectedGroup}</h3>
                                    <p className="compat-type-label">{compatData.type}</p>
                                </div>
                            </div>
                            <span className="compat-urgency-badge">{compatData.badge}</span>
                        </div>

                        <div className="compat-details-grid">
                            <div className="compat-column">
                                <div className="compat-column-title">
                                    <span className="icon-give" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        <IconHeart size={16} color="#dc2626" fill="#dc2626" />
                                        Can Give Blood To:
                                    </span>
                                </div>
                                <div className="compat-pills-list">
                                    {compatData.canDonateTo.map((g) => (
                                        <span key={g} className="badge-pill badge-give">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="compat-column">
                                <div className="compat-column-title">
                                    <span className="icon-receive" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        <IconShield size={16} color="var(--primary)" />
                                        Can Receive Blood From:
                                    </span>
                                </div>
                                <div className="compat-pills-list">
                                    {compatData.canReceiveFrom.map((g) => (
                                        <span key={g} className="badge-pill badge-receive">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="compat-footer">
                            <span>Ready to save lives with blood group <strong>{selectedGroup}</strong>?</span>
                            <Link to="/donor/register" className="compat-act-btn">
                                Register as a {selectedGroup} Donor →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                DUAL PLATFORM PILLARS (DONOR vs HOSPITAL)
               ========================================================= */}
            <section className="pillars-section">
                <div className="section-head text-center">
                    <p className="section-eyebrow">EMPOWERING BOTH SIDES</p>
                    <h2 className="section-title">A Secure, Coordinated Medical Ecosystem</h2>
                    <p className="section-desc">
                        Designed from the ground up for healthcare professionals and community donors.
                    </p>
                </div>

                <div className="pillars-grid">
                    {/* Donor Card */}
                    <div className="pillar-card donor-pillar">
                        <div className="pillar-icon-box donor-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconBloodDrop size={32} color="#dc2626" />
                        </div>
                        <span className="pillar-tag donor-tag">FOR INDIVIDUAL DONORS</span>
                        <h3 className="pillar-title">Be A Ready Lifesaver</h3>
                        <p className="pillar-desc">
                            Receive real-time alerts whenever a patient or hospital in your city requires
                            your specific blood group.
                        </p>
                        <ul className="pillar-features">
                            <li>Instant matching with verified urgent hospital requests</li>
                            <li>Automated 90-day medical donation cooldown tracking</li>
                            <li>Complete history of applications and accepted donations</li>
                            <li>Direct notifications when your blood request is accepted</li>
                        </ul>
                        <Link to="/donor/register" className="btn-primary pillar-btn">
                            Register as Donor →
                        </Link>
                    </div>

                    {/* Hospital Card */}
                    <div className="pillar-card hospital-pillar">
                        <div className="pillar-icon-box hospital-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconHospital size={32} color="var(--secondary)" />
                        </div>
                        <span className="pillar-tag hospital-tag">FOR REGISTERED HOSPITALS</span>
                        <h3 className="pillar-title">Fulfill Critical Demands Fast</h3>
                        <p className="pillar-desc">
                            Post time-sensitive blood requirements, broadcast to compatible donors,
                            and manage incoming donor applications effortlessly.
                        </p>
                        <ul className="pillar-features">
                            <li>Publish surgical and trauma blood requests in seconds</li>
                            <li>Verified donor pool with eligibility tracking</li>
                            <li>Accept or reject applicant donors with 1-click controls</li>
                            <li>Automatic 60-second request expiry scheduler</li>
                        </ul>
                        <Link to="/hospital/register" className="btn-secondary pillar-btn hospital-btn">
                            Register Hospital →
                        </Link>
                    </div>
                </div>
            </section>

            {/* =========================================================
                HOW IT WORKS (4-STEP WORKFLOW)
               ========================================================= */}
            <section className="workflow-section">
                <div className="section-head text-center">
                    <p className="section-eyebrow">SIMPLE 4-STEP LIFECYCLE</p>
                    <h2 className="section-title">How BloodBridge Saves Lives</h2>
                    <p className="section-desc">
                        Streamlined, audited, and transparent from request to completed donation.
                    </p>
                </div>

                <div className="workflow-grid">
                    <div className="workflow-card">
                        <div className="workflow-number">01</div>
                        <h4>Hospital Posts Request</h4>
                        <p>
                            Verified hospital specifies units needed, blood group, urgency, and deadline.
                        </p>
                    </div>

                    <div className="workflow-card">
                        <div className="workflow-number">02</div>
                        <h4>Smart Dispatch</h4>
                        <p>
                            Compatible donors in the city are matched and notified immediately.
                        </p>
                    </div>

                    <div className="workflow-card">
                        <div className="workflow-number">03</div>
                        <h4>Donor Applies</h4>
                        <p>
                            Eligible donor reviews hospital details and submits a donation application.
                        </p>
                    </div>

                    <div className="workflow-card">
                        <div className="workflow-number">04</div>
                        <h4>Donation & Fulfillment</h4>
                        <p>
                            Hospital confirms donation, units are fulfilled, and donor cooldown begins.
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================================================
                FINAL CALL TO ACTION BANNER
               ========================================================= */}
            <section className="cta-banner">
                <div className="cta-inner">
                    <span className="cta-badge">EVERY SECOND COUNTS</span>
                    <h2>Ready to Make an Impact?</h2>
                    <p>
                        Join dedicated community donors and trusted healthcare institutions
                        working together to ensure no patient waits for lifesaving blood.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/donor/register" className="btn-primary cta-primary">
                            Register as a Donor
                        </Link>
                        <Link to="/hospital/register" className="btn-secondary cta-secondary">
                            Register Your Hospital
                        </Link>
                    </div>
                </div>
            </section>

            {/* =========================================================
                CLEAN FOOTER
               ========================================================= */}
            <footer className="home-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="brand-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="drop-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                                <IconBloodDrop size={20} color="#dc2626" />
                            </span>
                            <span>Blood<strong>Bridge</strong></span>
                        </div>
                        <p>
                            Emergency Blood Donation & Hospital Fulfillment Infrastructure.
                        </p>
                    </div>

                    <div className="footer-links-group">
                        <div className="footer-col">
                            <h5>Explore</h5>
                            <Link to="/blood-requests">Blood Requests Feed</Link>
                            <Link to="/donor/register">Donor Registration</Link>
                            <Link to="/hospital/register">Hospital Onboarding</Link>
                        </div>
                        <div className="footer-col">
                            <h5>Portals</h5>
                            <Link to="/donor/login">Donor Login</Link>
                            <Link to="/hospital/login">Hospital Portal</Link>
                            <Link to="/admin/login">Admin Center</Link>
                        </div>
                        <div className="footer-col">
                            <h5>Safety & Mission</h5>
                            <span>Verified Medical Standards</span>
                            <span>Strict Cooldown Rules</span>
                            <span>Non-Profit Community</span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} BloodBridge Platform. Dedicated to saving lives.</span>
                </div>
            </footer>

        </div>
    );
}

export default Home;