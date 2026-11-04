import { useState, useEffect } from "react";
import { getDonorProfile, updateDonorProfile, changeDonorPassword } from "../../services/donor/profileService";
import { donorEligibility } from "../../services/donor/eligibilityService";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { IconBloodDrop, IconUser, IconCheckCircle, IconClock } from "../../components/icons/Icons";
import "../../styles/Profile.css";
import "../../styles/Auth.css";

const extractErrorMessage = (err, defaultMsg = "An error occurred") => {
    if (!err?.response?.data) return err?.message || defaultMsg;
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (typeof data === "object") {
        const values = Object.values(data);
        if (values.length > 0 && typeof values[0] === "string") {
            return values[0];
        }
    }
    return defaultMsg;
};

function DonorProfile() {
    const getCachedDonor = () => {
        try {
            return JSON.parse(localStorage.getItem("donor") || "null");
        } catch {
            return null;
        }
    };

    const cached = getCachedDonor();
    const [profile, setProfile] = useState(cached);
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(!cached);
    const [message, setMessage] = useState(null);

    // Profile form state
    const [fullName, setFullName] = useState(cached?.fullName || "");
    const [contactNumber, setContactNumber] = useState(cached?.contactNumber || "");
    const [city, setCity] = useState(cached?.city || "");
    const [available, setAvailable] = useState(cached?.available ?? true);
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    const showNotification = (text, type = "success", source = "general") => {
        setMessage({ text, type, source });
        setTimeout(() => setMessage(null), 4000);
    };

    const loadProfileData = async () => {
        try {
            const [profileRes, eligibilityRes] = await Promise.all([
                getDonorProfile(),
                donorEligibility().catch(() => null)
            ]);

            if (profileRes) {
                setProfile(profileRes);
                if (profileRes.fullName) setFullName(profileRes.fullName);
                if (profileRes.contactNumber) setContactNumber(profileRes.contactNumber);
                if (profileRes.city) setCity(profileRes.city);
                if (profileRes.available !== undefined) setAvailable(profileRes.available);

                const currentStored = getCachedDonor() || {};
                localStorage.setItem("donor", JSON.stringify({ ...currentStored, ...profileRes }));
            }
            setEligibility(eligibilityRes);
        } catch (err) {
            console.error("Error loading donor profile:", err);
            if (!cached) {
                showNotification("Failed to load profile data", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const updated = await updateDonorProfile({
                fullName,
                contactNumber,
                city,
                available
            });
            setProfile(updated);

            const currentStored = getCachedDonor() || {};
            localStorage.setItem("donor", JSON.stringify({ ...currentStored, ...updated }));

            showNotification("Profile details updated successfully!", "success", "profile");
        } catch (err) {
            console.error("Failed to update profile:", err);
            showNotification(err.response?.data?.message || "Failed to update profile", "error", "profile");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showNotification("New passwords do not match", "error", "password");
            return;
        }

        setChangingPassword(true);
        try {
            await changeDonorPassword({
                currentPassword,
                newPassword,
                confirmPassword
            });
            showNotification("Password changed successfully!", "success", "password");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Password update error:", err);
            showNotification(extractErrorMessage(err, "Failed to change password"), "error", "password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page" style={{ textAlign: "center", paddingTop: "80px" }}>
                <p>Loading donor profile...</p>
            </div>
        );
    }

    const bloodGroupFormatted = profile?.bloodGroup?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "N/A";

    return (
        <div className="profile-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={message} onClose={() => setMessage(null)} />

            {/* Profile Overview Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    <span className="profile-avatar-icon">
                        <IconBloodDrop size={26} color="#e53e3e" />
                    </span>
                    <span className="profile-avatar-blood">{bloodGroupFormatted}</span>
                </div>

                <div className="profile-meta">
                    <h1>{profile?.fullName}</h1>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span className="profile-role-badge" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <IconUser size={14} />
                            Verified Blood Donor
                        </span>
                        <span className={`badge ${available ? 'badge-success' : 'badge-low'}`}>
                            {available ? "● Active & Available" : "○ Temporarily Unavailable"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Eligibility Widget */}
            {eligibility && (
                <div className={`eligibility-banner ${eligibility.eligible ? 'eligible' : 'cooldown'}`}>
                    <div className="eligibility-info">
                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {eligibility.eligible ? (
                                <IconCheckCircle size={20} color="#059669" />
                            ) : (
                                <IconClock size={20} color="#d97706" />
                            )}
                            {eligibility.eligible ? "Eligible to Donate Blood" : "Donation Cooldown Active"}
                        </h3>
                        <p>
                            {eligibility.eligible
                                ? "You meet the standard cooldown requirements and can accept emergency blood requests."
                                : `Medical guidelines require recovery between donations. You will be eligible on ${eligibility.nextEligible} (${eligibility.daysRemaining} days remaining).`}
                        </p>
                    </div>
                    <div>
                        <span className={`badge ${eligibility.eligible ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                            {eligibility.eligible ? "Eligible Now" : `${eligibility.daysRemaining}d Left`}
                        </span>
                    </div>
                </div>
            )}

            {/* Details Form Card */}
            <div className="profile-card">
                <h2 className="profile-card-title">Personal & Contact Information</h2>
                <p className="profile-card-subtitle">Keep your contact details up to date so hospitals can reach you quickly.</p>

                <form onSubmit={handleProfileSubmit}>
                    <div className="profile-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={profile?.email || ""}
                                disabled
                                style={{ background: "var(--surface-muted)", cursor: "not-allowed" }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>City / Location</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: "16px", marginBottom: "24px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600" }}>
                            <input
                                type="checkbox"
                                checked={available}
                                onChange={(e) => setAvailable(e.target.checked)}
                                style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                            />
                            Available to receive emergency donation requests
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "12px" }} disabled={updatingProfile}>
                        {updatingProfile ? "Saving..." : "Save Profile Changes"}
                    </button>
                </form>
            </div>

            {/* Security & Password Card */}
            <div className="profile-card">
                <h2 className="profile-card-title">Security & Password</h2>
                <p className="profile-card-subtitle">Ensure your account is protected with a strong, updated password.</p>

                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group" style={{ maxWidth: "420px" }}>
                        <label>Current Password</label>
                        <PasswordInput
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                        />
                    </div>

                    <div className="profile-grid" style={{ maxWidth: "700px" }}>
                        <div className="form-group">
                            <label>New Password</label>
                            <PasswordInput
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                                required
                            />
                            <small style={{ color: "var(--secondary-text)", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                                Must be 8+ characters with uppercase, lowercase, number & special character.
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-secondary" style={{ marginTop: "12px" }} disabled={changingPassword}>
                        {changingPassword ? "Updating Password..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DonorProfile;
