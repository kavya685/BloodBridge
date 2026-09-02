import { useState, useEffect } from "react";
import { donorNotifications } from "../../services/donor/notificationService";

function Notifications() {
    
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await donorNotifications();
            setNotifications(response);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch notifications.");
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
        {
            notifications.map((notification) => (
                <div key={notification.id}>
                    <strong>{notification.createdAt}</strong>
                    <strong>Message: </strong> <p>{notification.message}</p>
                </div>
            ))
        }
        </div>
    );
}

export default Notifications;