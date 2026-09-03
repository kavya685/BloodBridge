import { useState, useEffect } from "react";
import { hospitalNotifications } from "../../services/hospital/notificationService.js";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await hospitalNotifications();
            setNotifications(response);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch notifications.")
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    if(!notifications) {
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <h2>Notifications</h2>
            {
                notifications.map((notification) => (
                    <div key={notification.id}>
                        <strong>{notification.createdAt}</strong> <br/>
                        <strong>Message: </strong> <p>{notification.message}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default Notifications;