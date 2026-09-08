import { useState, useEffect } from "react";
import { hospitalNotifications } from "../../services/hospital/notificationService.js";
import "../../styles/Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await hospitalNotifications();
            setNotifications(response);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch notifications.");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="notifications-page">

            <section className="notifications-header">
                <div>
                    <p className="page-label">UPDATES</p>

                    <h1>Notifications</h1>

                    <p className="page-subtitle">
                        Stay updated about activity related to your
                        blood requests.
                    </p>
                </div>
            </section>

            {notifications.length === 0 ? (
                <section className="notifications-empty">

                    <div className="notification-empty-icon">
                        🔔
                    </div>

                    <h2>No notifications</h2>

                    <p>
                        You don't have any notifications at the moment.
                    </p>

                </section>
            ) : (
                <section className="notifications-list">

                    {notifications.map((notification) => (
                        <article
                            className="notification-card"
                            key={notification.id}
                        >

                            <div className="notification-icon">
                                🔔
                            </div>

                            <div className="notification-content">

                                <div className="notification-top">

                                    <span className="notification-type">
                                        {notification.type
                                            ?.replaceAll("_", " ")}
                                    </span>

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

                            </div>

                        </article>
                    ))}

                </section>
            )}

        </div>
    );
}

export default Notifications;