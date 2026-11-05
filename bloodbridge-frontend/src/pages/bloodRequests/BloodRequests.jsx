import { useEffect, useState, useMemo } from "react";
import { getAllBloodRequests } from "../../services/bloodRequestService";
import BloodRequestCard from "../../components/BloodRequestCard";
import { applyForBloodRequest } from "../../services/donationApplicationService";
import Toast from "../../components/Toast";
import { IconBloodDrop, IconSearch } from "../../components/icons/Icons";
import "../../styles/BloodRequests.css";

const BLOOD_GROUPS = [
    { label: "All Groups", value: "ALL" },
    { label: "O+", value: "O_POSITIVE" },
    { label: "O-", value: "O_NEGATIVE" },
    { label: "A+", value: "A_POSITIVE" },
    { label: "A-", value: "A_NEGATIVE" },
    { label: "B+", value: "B_POSITIVE" },
    { label: "B-", value: "B_NEGATIVE" },
    { label: "AB+", value: "AB_POSITIVE" },
    { label: "AB-", value: "AB_NEGATIVE" },
];

function BloodRequests() {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("ALL");
    const [selectedUrgency, setSelectedUrgency] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchBloodRequests = async () => {
        setLoading(true);
        try {
            const response = await getAllBloodRequests();
            setBloodRequests(response || []);
        } catch (error) {
            console.error("Failed to load blood requests:", error);
            showToast("Failed to fetch available blood requests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    const handleApply = async (e, bloodRequestId) => {
        e.stopPropagation();
        setApplyingId(bloodRequestId);

        try {
            await applyForBloodRequest(bloodRequestId);
            showToast("Application submitted successfully! The hospital has been notified.");
            fetchBloodRequests();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data || "Unable to submit application";
            showToast(typeof msg === "string" ? msg : "Application failed", "error");
        } finally {
            setApplyingId(null);
        }
    };

    // Filter and Sort requests (default sort: EMERGENCY > URGENT > NORMAL, then soonest expiry)
    const filteredRequests = useMemo(() => {
        return bloodRequests
            .filter((req) => {
                // Search match (hospital name, description, city)
                const search = searchTerm.toLowerCase();
                const matchesSearch =
                    !searchTerm ||
                    req.hospitalName?.toLowerCase().includes(search) ||
                    req.description?.toLowerCase().includes(search) ||
                    req.hospitalCity?.toLowerCase().includes(search);

                // Blood Group match
                const matchesGroup = selectedGroup === "ALL" || req.bloodGroup === selectedGroup;

                // Urgency match
                const matchesUrgency = selectedUrgency === "ALL" || req.urgency === selectedUrgency;

                return matchesSearch && matchesGroup && matchesUrgency;
            })
            .sort((a, b) => {
                const urgencyWeight = { EMERGENCY: 3, CRITICAL: 3, URGENT: 2, HIGH: 2, NORMAL: 1, MEDIUM: 1, LOW: 1 };
                const diff = (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
                if (diff !== 0) return diff;
                if (a.expiresAt && b.expiresAt) {
                    return new Date(a.expiresAt) - new Date(b.expiresAt);
                }
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
    }, [bloodRequests, searchTerm, selectedGroup, selectedUrgency]);

    const activeCount = bloodRequests.filter(r => r.status === "OPEN").length;
    const emergencyCount = bloodRequests.filter(r => (r.urgency === "EMERGENCY" || r.urgency === "CRITICAL") && r.status === "OPEN").length;

    return (
        <div className="requests-feed-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={toast} onClose={() => setToast(null)} />

            {/* Page Header */}
            <div className="requests-feed-header">
                <div className="requests-header-top">
                    <div className="requests-title-area">
                        <span className="badge badge-critical" style={{ marginBottom: "8px" }}>
                            {emergencyCount > 0 && <span className="pulse-dot"></span>}
                            {emergencyCount} Emergency Requests
                        </span>
                        <h1>Active Blood Requests</h1>
                        <p className="requests-subtitle">
                            Browse verified hospital blood demands. Your timely donation can save lives today.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <span className="badge badge-success">
                            {activeCount} Open Requests
                        </span>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="requests-filter-bar">
                    <div className="filter-search-group">
                        <span className="filter-search-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                            <IconSearch size={16} color="var(--text-muted)" />
                        </span>
                        <input
                            type="text"
                            className="filter-search-input"
                            placeholder="Search by hospital, city, or medical notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="filter-select"
                        value={selectedUrgency}
                        onChange={(e) => setSelectedUrgency(e.target.value)}
                    >
                        <option value="ALL">All Urgencies</option>
                        <option value="EMERGENCY">Emergency</option>
                        <option value="URGENT">Urgent</option>
                        <option value="NORMAL">Normal</option>
                    </select>
                </div>

                {/* Blood Group Quick Select Pills */}
                <div className="blood-group-pills">
                    {BLOOD_GROUPS.map((bg) => (
                        <button
                            key={bg.value}
                            className={`blood-pill ${selectedGroup === bg.value ? "active" : ""}`}
                            onClick={() => setSelectedGroup(bg.value)}
                        >
                            {bg.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="empty-state">
                    <p>Loading available requests...</p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                        <IconBloodDrop size={42} color="var(--primary)" />
                    </div>
                    <h3>No matching blood requests found</h3>
                    <p>Try adjusting your search query, selecting different blood groups, or clearing filters.</p>
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedGroup("ALL");
                            setSelectedUrgency("ALL");
                        }}
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="requests-grid">
                    {filteredRequests.map((request) => (
                        <BloodRequestCard key={request.id} request={request}>
                            {request.status === "OPEN" ? (
                                <button
                                    className="apply-button"
                                    onClick={(e) => handleApply(e, request.id)}
                                    disabled={applyingId === request.id}
                                >
                                    {applyingId === request.id ? "Submitting..." : "Apply to Donate →"}
                                </button>
                            ) : (
                                <button className="apply-button" disabled>
                                    Request {request.status}
                                </button>
                            )}
                        </BloodRequestCard>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BloodRequests;
