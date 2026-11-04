import { useState, useEffect } from "react";
import { getHospitalProfile, updateHospitalProfile, changeHospitalPassword } from "../../services/hospital/profileService";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { IconHospital } from "../../components/icons/Icons";
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

function HospitalProfile() {
    // Read cached hospital details from localStorage so form is immediately filled
    const getCachedHospital = () => {
        try {
            return JSON.parse(localStorage.getItem("hospital") || "null");
        } catch {
            return null;
        }
    };

    const cached = getCachedHospital();
    const [profile, setProfile] = useState(cached);
    const [loading, setLoading] = useState(!cached);
    const [message, setMessage] = useState(null);

    // Profile form state - immediately pre-populated from cached login data
    const [hospitalName, setHospitalName] = useState(cached?.hospitalName || "");
    const [contactNumber, setContactNumber] = useState(cached?.contactNumber || "");
    const [city, setCity] = useState(cached?.city || "");
    const [address, setAddress] = useState(cached?.address || "");
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
            const data = await getHospitalProfile();
            if (data) {
                setProfile(data);
                if (data.hospitalName) setHospitalName(data.hospitalName);
                if (data.contactNumber) setContactNumber(data.contactNumber);
                if (data.city) setCity(data.city);
                if (data.address) setAddress(data.address);

                // Keep localStorage in sync with latest backend values
                const currentStored = getCachedHospital() || {};
                localStorage.setItem("hospital", JSON.stringify({ ...currentStored, ...data }));
            }
        } catch (err) {
            console.error("Error loading fresh hospital profile from backend:", err);
            // If we have cached data, don't show an intrusive error
            if (!cached) {
                showNotification("Failed to load hospital profile", "error");
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
            const updated = await updateHospitalProfile({
                hospitalName,
                contactNumber,
                city,
                address
            });
            setProfile(updated);

            // Sync updated info into localStorage so Dashboard/Header also see the changes
            const currentStored = getCachedHospital() || {};
            localStorage.setItem("hospital", JSON.stringify({ ...currentStored, ...updated }));

            showNotification("Hospital details updated successfully!", "success", "profile");
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
            await changeHospitalPassword({
                currentPassword,
                newPassword,
                confirmPassword
            });
            showNotification("Password changed successfully!", "success", "password");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Password change error:", err);
            showNotification(extractErrorMessage(err, "Failed to update password"), "error", "password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page" style={{ textAlign: "center", paddingTop: "80px" }}>
                <p>Loading hospital profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={message} onClose={() => setMessage(null)} />

            {/* Profile Overview Header */}
            <div className="profile-header">
                <div className="profile-avatar" style={{ background: "var(--info-light)", borderColor: "var(--urgency-medium-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconHospital size={26} color="var(--secondary)" />
                </div>

                <div className="profile-meta">
                    <h1>{profile?.hospitalName}</h1>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span className="profile-role-badge">Verified Healthcare Center</span>
                        {profile?.registrationNumber && (
                            <span className="badge badge-low">
                                Reg #{profile.registrationNumber}
                            </span>
                        )}
                        <span className={`badge ${profile?.registrationStatus === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                            {profile?.registrationStatus || "ACTIVE"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hospital Details Card */}
            <div className="profile-card">
                <h2 className="profile-card-title">Hospital Information</h2>
                <p className="profile-card-subtitle">Manage facility registration details and public contact lines for donor communications.</p>

                <form onSubmit={handleProfileSubmit}>
                    <div className="profile-grid">
                        <div className="form-group">
                            <label>Hospital / Clinic Name</label>
                            <input
                                type="text"
                                value={hospitalName}
                                onChange={(e) => setHospitalName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Official Email</label>
                            <input
                                type="email"
                                value={profile?.email || ""}
                                disabled
                                style={{ background: "var(--surface-muted)", cursor: "not-allowed" }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Emergency Contact Number</label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "12px" }}>
                        <label>Physical Address</label>
                        <textarea
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "12px" }} disabled={updatingProfile}>
                        {updatingProfile ? "Saving Details..." : "Update Hospital Details"}
                    </button>
                </form>
            </div>

            {/* Security & Password Card */}
            <div className="profile-card">
                <h2 className="profile-card-title">Security & Password</h2>
                <p className="profile-card-subtitle">Update hospital account credentials.</p>

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

export default HospitalProfile;
