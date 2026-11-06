import { useState, useEffect } from "react";
import {
    getAdminDashboard,
    getAllHospitals,
    getAllDonors,
    getAllBloodRequests,
    acceptHospitalRegistration,
    rejectHospitalRegistration,
    suspendHospital,
    reactivateHospital,
    suspendDonor,
    reactivateDonor,
    closeBloodRequest
} from "../../services/adminService";
import Toast from "../../components/Toast";
import {
    IconShield,
    IconUsers,
    IconHospital,
    IconBloodDrop,
    IconHeart,
    IconCheck,
    IconCheckCircle,
    IconX,
    IconSearch
} from "../../components/icons/Icons";
import "../../styles/Admin.css";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [donors, setDonors] = useState([]);
    const [bloodRequests, setBloodRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("verifications");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const [closeModalOpen, setCloseModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [closeReason, setCloseReason] = useState("");

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, hospitalsRes, donorsRes, requestsRes] = await Promise.all([
                getAdminDashboard().catch(() => null),
                getAllHospitals().catch(() => []),
                getAllDonors().catch(() => []),
                getAllBloodRequests().catch(() => [])
            ]);

            setStats(statsRes);
            setHospitals(hospitalsRes || []);
            setDonors(donorsRes || []);
            setBloodRequests(requestsRes || []);
        } catch (error) {
            console.error("Failed to load admin data:", error);
            showMessage("Failed to load dashboard data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Hospital Verification Handlers
    const handleAcceptHospital = async (id, name) => {
        try {
            await acceptHospitalRegistration(id);
            showMessage(`Approved registration for ${name}`);
            loadData();
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to approve hospital", "error");
        }
    };

    const handleRejectHospital = async (id, name) => {
        if (!window.confirm(`Are you sure you want to reject registration for ${name}?`)) return;
        try {
            await rejectHospitalRegistration(id);
            showMessage(`Rejected registration for ${name}`);
            loadData();
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to reject hospital", "error");
        }
    };

    // Hospital Moderation
    const handleToggleHospitalStatus = async (hospital) => {
        try {
            if (hospital.accountStatus === "ACTIVE" || !hospital.accountStatus) {
                await suspendHospital(hospital.id);
                showMessage(`Suspended ${hospital.hospitalName}`);
            } else {
                await reactivateHospital(hospital.id);
                showMessage(`Reactivated ${hospital.hospitalName}`);
            }
            loadData();
        } catch (err) {
            showMessage(err.response?.data?.message || "Action failed", "error");
        }
    };

    // Donor Moderation
    const handleToggleDonorStatus = async (donor) => {
        try {
            if (donor.accountStatus === "SUSPENDED") {
                await reactivateDonor(donor.id);
                showMessage(`Reactivated ${donor.fullName}`);
            } else {
                await suspendDonor(donor.id);
                showMessage(`Suspended ${donor.fullName}`);
            }
            loadData();
        } catch (err) {
            showMessage(err.response?.data?.message || "Action failed", "error");
        }
    };

    // Close Blood Request
    const handleConfirmClose = async () => {
        if (!closeReason.trim()) {
            showMessage("Please provide a reason for closing the request", "error");
            return;
        }
        try {
            await closeBloodRequest(selectedRequestId, closeReason);
            showMessage("Blood request closed successfully");
            setCloseModalOpen(false);
            setCloseReason("");
            setSelectedRequestId(null);
            loadData();
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to close blood request", "error");
        }
    };

    const pendingHospitals = hospitals.filter(h => h.registrationStatus === "PENDING");

    return (
        <div className="admin-dashboard">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={message} onClose={() => setMessage(null)} />

            {/* Header */}
            <div className="admin-header">
                <div className="admin-title-area">
                    <span className="admin-badge">
                        <IconShield size={13} style={{ marginRight: "5px" }} />
                        ADMIN CONSOLE
                    </span>
                    <h1>System Administration & Oversight</h1>
                    <p className="admin-subtitle">
                        Monitor platform health, verify medical institutions, and moderate accounts.
                    </p>
                </div>
            </div>

            {/* Metric Tiles */}
            <div className="admin-stats-grid">
                <div
                    className="admin-stat-card stat-blue"
                    onClick={() => setActiveTab("donors")}
                    title="Click to view donors"
                >
                    <div className="admin-stat-header">
                        <span className="admin-stat-title">Registered Donors</span>
                        <span className="admin-stat-icon">
                            <IconUsers size={22} color="#2563eb" />
                        </span>
                    </div>
                    <div className="admin-stat-value">{stats?.totalDonors ?? donors.length}</div>
                    <span className="admin-stat-subtitle">Ready to donate</span>
                </div>

                <div
                    className="admin-stat-card stat-purple"
                    onClick={() => setActiveTab(pendingHospitals.length > 0 ? "verifications" : "hospitals")}
                    title="Click to view hospitals"
                >
                    <div className="admin-stat-header">
                        <span className="admin-stat-title">Partner Hospitals</span>
                        <span className="admin-stat-icon">
                            <IconHospital size={22} color="#7c3aed" />
                        </span>
                    </div>
                    <div className="admin-stat-value">{stats?.totalHospitals ?? hospitals.length}</div>
                    <span className="admin-stat-subtitle">
                        {pendingHospitals.length > 0 ? (
                            <strong style={{ color: "var(--warning-dark)" }}>{pendingHospitals.length} pending review</strong>
                        ) : "All verified"}
                    </span>
                </div>

                <div
                    className="admin-stat-card stat-red"
                    onClick={() => setActiveTab("requests")}
                    title="Click to view active requests"
                >
                    <div className="admin-stat-header">
                        <span className="admin-stat-title">Active Requests</span>
                        <span className="admin-stat-icon">
                            <IconBloodDrop size={22} color="#dc2626" />
                        </span>
                    </div>
                    <div className="admin-stat-value">{stats?.openRequests ?? bloodRequests.filter(r => r.status === "OPEN").length}</div>
                    <span className="admin-stat-subtitle">Urgent hospital needs</span>
                </div>

                <div
                    className="admin-stat-card stat-green"
                    onClick={() => setActiveTab("requests")}
                    title="Click to view requests"
                >
                    <div className="admin-stat-header">
                        <span className="admin-stat-title">Fulfilled Requests</span>
                        <span className="admin-stat-icon">
                            <IconHeart size={22} color="#10b981" fill="#10b981" />
                        </span>
                    </div>
                    <div className="admin-stat-value">{stats?.fulfilledRequests ?? 0}</div>
                    <span className="admin-stat-subtitle">Lives impacted</span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === "verifications" ? "active" : ""}`}
                    onClick={() => setActiveTab("verifications")}
                >
                    Pending Verifications
                    {pendingHospitals.length > 0 && (
                        <span className="tab-badge">{pendingHospitals.length}</span>
                    )}
                </button>
                <button
                    className={`admin-tab ${activeTab === "hospitals" ? "active" : ""}`}
                    onClick={() => setActiveTab("hospitals")}
                >
                    All Hospitals ({hospitals.length})
                </button>
                <button
                    className={`admin-tab ${activeTab === "donors" ? "active" : ""}`}
                    onClick={() => setActiveTab("donors")}
                >
                    All Donors ({donors.length})
                </button>
                <button
                    className={`admin-tab ${activeTab === "requests" ? "active" : ""}`}
                    onClick={() => setActiveTab("requests")}
                >
                    Blood Requests ({bloodRequests.length})
                </button>
            </div>

            {/* TAB CONTENT: 1. PENDING VERIFICATIONS */}
            {activeTab === "verifications" && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Hospital Verification Queue</h3>
                    </div>

                    {pendingHospitals.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ color: "var(--success)" }}>
                                <IconCheckCircle size={44} />
                            </div>
                            <h3>Queue Cleared</h3>
                            <p>No hospital registrations are currently pending administrative review.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Hospital Name</th>
                                        <th>Reg. Number</th>
                                        <th>Location</th>
                                        <th>Contact Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingHospitals.map((h) => (
                                        <tr key={h.id}>
                                            <td><strong>{h.hospitalName}</strong></td>
                                            <td><code>{h.registrationNumber || "N/A"}</code></td>
                                            <td>{h.city || "N/A"}</td>
                                            <td>{h.email}</td>
                                            <td>{h.contactNumber}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: "6px" }}>
                                                    <button
                                                        onClick={() => handleAcceptHospital(h.id, h.hospitalName)}
                                                        className="admin-btn admin-btn-approve"
                                                        style={{ display: "inline-flex", alignItems: "center" }}
                                                    >
                                                        <IconCheck size={14} style={{ marginRight: "4px" }} />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectHospital(h.id, h.hospitalName)}
                                                        className="admin-btn admin-btn-reject"
                                                        style={{ display: "inline-flex", alignItems: "center" }}
                                                    >
                                                        <IconX size={14} style={{ marginRight: "4px" }} />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: 2. ALL HOSPITALS */}
            {activeTab === "hospitals" && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Registered Hospitals</h3>
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder="Search by name, city, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hospital Name</th>
                                    <th>City</th>
                                    <th>Email</th>
                                    <th>Verification</th>
                                    <th>Account Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hospitals
                                    .filter(h =>
                                        h.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        h.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        h.email?.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((h) => (
                                        <tr key={h.id}>
                                            <td>#{h.id}</td>
                                            <td><strong>{h.hospitalName}</strong></td>
                                            <td>{h.city}</td>
                                            <td>{h.email}</td>
                                            <td>
                                                <span className={`badge ${h.registrationStatus === 'APPROVED' || h.registrationStatus === 'ACCEPTED' ? 'badge-success' : h.registrationStatus === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                                                    {h.registrationStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${h.accountStatus === 'SUSPENDED' ? 'badge-danger' : 'badge-success'}`}>
                                                    {h.accountStatus === 'SUSPENDED' ? '● Suspended' : '● Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleHospitalStatus(h)}
                                                    className={`admin-btn ${h.accountStatus === 'SUSPENDED' ? 'admin-btn-approve' : 'admin-btn-reject'}`}
                                                >
                                                    {h.accountStatus === 'SUSPENDED' ? '↺ Undo Suspend' : 'Suspend'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 3. ALL DONORS */}
            {activeTab === "donors" && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Donor Directory</h3>
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder="Search donors by name, blood group, or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Blood Group</th>
                                    <th>City</th>
                                    <th>Contact</th>
                                    <th>Account Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donors
                                    .filter(d =>
                                        d.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        d.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        d.city?.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((d) => (
                                        <tr key={d.id}>
                                            <td>#{d.id}</td>
                                            <td><strong>{d.fullName}</strong></td>
                                            <td>
                                                <span className="badge badge-critical" style={{ fontWeight: "800" }}>
                                                    {d.bloodGroup?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                                                </span>
                                            </td>
                                            <td>{d.city}</td>
                                            <td>{d.contactNumber}</td>
                                            <td>
                                                <span className={`badge ${d.accountStatus === 'SUSPENDED' ? 'badge-danger' : 'badge-success'}`}>
                                                    {d.accountStatus === 'SUSPENDED' ? '● Suspended' : '● Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleDonorStatus(d)}
                                                    className={`admin-btn ${d.accountStatus === 'SUSPENDED' ? 'admin-btn-approve' : 'admin-btn-reject'}`}
                                                >
                                                    {d.accountStatus === 'SUSPENDED' ? '↺ Undo Suspend' : 'Suspend'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 4. BLOOD REQUESTS */}
            {activeTab === "requests" && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Emergency Requests Monitor</h3>
                    </div>

                    <div className="table-container">
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hospital</th>
                                    <th>Blood Group</th>
                                    <th>Units</th>
                                    <th>Urgency</th>
                                    <th>Status</th>
                                    <th>Expires</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bloodRequests.map((r) => (
                                    <tr key={r.id}>
                                        <td>#{r.id}</td>
                                        <td><strong>{r.hospitalName}</strong></td>
                                        <td>
                                            <span className="badge badge-critical">
                                                {r.bloodGroup?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                                            </span>
                                        </td>
                                        <td>{r.unitsRequired}</td>
                                        <td>
                                            <span className={`badge badge-${r.urgency?.toLowerCase() || 'medium'}`}>
                                                {r.urgency}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${r.status === 'OPEN' ? 'badge-success' : 'badge-low'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>{new Date(r.expiresAt).toLocaleDateString()}</td>
                                        <td>
                                            {r.status === "OPEN" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequestId(r.id);
                                                        setCloseModalOpen(true);
                                                    }}
                                                    className="admin-btn admin-btn-reject"
                                                >
                                                    Close Request
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Close Request Modal */}
            {closeModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1100
                }}>
                    <div style={{
                        background: "var(--surface)",
                        padding: "28px",
                        borderRadius: "var(--radius-lg)",
                        maxWidth: "440px",
                        width: "100%",
                        boxShadow: "var(--shadow-xl)"
                    }}>
                        <h3 style={{ marginBottom: "8px" }}>Close Blood Request #{selectedRequestId}</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "16px" }}>
                            Specify the administrative reason for closing this request early:
                        </p>
                        <textarea
                            rows={3}
                            value={closeReason}
                            onChange={(e) => setCloseReason(e.target.value)}
                            placeholder="e.g. Fulfilled externally, invalid data, or hospital request"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-sm)",
                                marginBottom: "16px"
                            }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setCloseModalOpen(false);
                                    setCloseReason("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleConfirmClose}
                            >
                                Confirm Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
