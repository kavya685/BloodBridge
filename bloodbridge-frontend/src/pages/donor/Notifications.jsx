import { useState, useEffect } from "react";
import { donorNotifications } from "../../services/donor/notificationService";
import "../../styles/Dashboard.css";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await donorNotifications();

            setNotifications(response || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Unable to load notifications. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {

        return (
            <div className="dashboard-loading">
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <section className="dashboard-header">

                <div className="dashboard-heading">

                    <p className="dashboard-label">
                        DONOR PORTAL
                    </p>

                    <h1>
                        Notifications
                    </h1>

                    <p className="dashboard-subtitle">
                        Stay updated about your applications and donations.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={fetchNotifications}
                >
                    Refresh
                </button>

            </section>


            {error && (

                <div className="dashboard-error">

                    <p>{error}</p>

                    <button
                        className="secondary-button"
                        onClick={fetchNotifications}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {!error && notifications.length === 0 && (

                <div className="stat-card">

                    <h3>
                        No notifications
                    </h3>

                    <p>
                        You're all caught up.
                    </p>

                </div>

            )}


            {!error && notifications.length > 0 && (

                <div className="stats-grid">

                    {notifications.map((notification) => (

                        <div
                            className="stat-card"
                            key={notification.id}
                        >

                            <p className="stat-label">
                                BLOODBRIDGE
                            </p>

                            <h3>
                                Notification
                            </h3>

                            <p>
                                {notification.message}
                            </p>

                            <p>
                                {notification.createdAt
                                    ? new Date(
                                        notification.createdAt
                                    ).toLocaleString()
                                    : ""
                                }
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Notifications;