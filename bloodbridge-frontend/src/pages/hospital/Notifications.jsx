import { useState, useEffect } from "react";
import {
    hospitalNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../../services/hospital/notificationService.js";
import Toast from "../../components/Toast";
import { IconBell, IconCheck } from "../../components/icons/Icons";
import "../../styles/Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);

    const showToast = (text, type = "success") => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchNotifications = async () => {
        try {
            const response = await hospitalNotifications();
            setNotifications(response || []);
        } catch (error) {
            console.error(error);
            showToast("Failed to fetch notifications.", "error");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const checkIsRead = (n) => {
        if (typeof n.isRead === "boolean") return n.isRead;
        if (typeof n.read === "boolean") return n.read;
        return false;
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n)
            );
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true, read: true }))
            );
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const unreadCount = notifications.filter(n => !checkIsRead(n)).length;

    return (
        <div className="notifications-page">
            {/* Floating Top-Right Toast Notification */}
            <Toast message={toast} onClose={() => setToast(null)} />

            <section className="notifications-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p className="page-label">UPDATES</p>

                    <h1>Notifications</h1>

                    <p className="page-subtitle">
                        Stay updated about activity related to your
                        blood requests.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    {unreadCount > 0 && (
                        <button
                            className="secondary-btn"
                            style={{ padding: "8px 14px", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                            onClick={handleMarkAllAsRead}
                        >
                            <IconCheck size={14} />
                            Mark All as Read
                        </button>
                    )}
                    <button
                        className="secondary-btn"
                        style={{ padding: "8px 14px", fontSize: "0.85rem", cursor: "pointer" }}
                        onClick={fetchNotifications}
                    >
                        Refresh
                    </button>
                </div>
            </section>

            {notifications.length === 0 ? (
                <section className="notifications-empty">

                    <div className="notification-empty-icon" style={{ display: "flex", justifyContent: "center", color: "var(--text-muted)" }}>
                        <IconBell size={42} />
                    </div>

                    <h2>No notifications</h2>

                    <p>
                        You don't have any notifications at the moment.
                    </p>

                </section>
            ) : (
                <section className="notifications-list">

                    {notifications.map((notification) => {
                        const isUnread = !checkIsRead(notification);
                        return (
                        <article
                            className="notification-card"
                            key={notification.id}
                            style={{
                                borderLeft: isUnread ? "4px solid var(--primary-accent)" : "1px solid var(--border-color)",
                                background: isUnread ? "rgba(229, 62, 62, 0.02)" : "var(--card-bg)"
                            }}
                        >

                            <div className="notification-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconBell size={18} color="var(--primary)" />
                            </div>

                            <div className="notification-content" style={{ width: "100%" }}>

                                <div className="notification-top">

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="notification-type">
                                            {notification.type
                                                ?.replaceAll("_", " ")}
                                        </span>
                                        {isUnread && (
                                            <span style={{
                                                fontSize: "0.7rem",
                                                fontWeight: "600",
                                                background: "rgba(229, 62, 62, 0.12)",
                                                color: "var(--primary-accent)",
                                                padding: "1px 6px",
                                                borderRadius: "10px"
                                            }}>
                                                Unread
                                            </span>
                                        )}
                                    </div>

                                    <span className="notification-date">
                                        {notification.createdAt
                                            ? new Date(
                                                notification.createdAt
                                            ).toLocaleString("en-IN")
                                            : "—"}
                                    </span>

                                </div>

                                <p className="notification-message">
                                    {notification.message}
                                </p>

                                {isUnread && (
                                    <button
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "var(--medical-blue)",
                                            fontSize: "0.8rem",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            padding: 0,
                                            marginTop: "6px"
                                        }}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        Mark as read
                                    </button>
                                )}

                            </div>

                        </article>
                    );
                    })}

                </section>
            )}

        </div>
    );
}

export default Notifications;