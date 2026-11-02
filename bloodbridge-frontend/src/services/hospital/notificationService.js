import API from "../api.js";

export const hospitalNotifications = async () => {
    const response = await API.get("/notifications/hospital");
    return response.data;
}

export const markNotificationAsRead = async (id) => {
    const response = await API.put(`/notifications/${id}/read`);
    return response.data;
}

export const markAllNotificationsAsRead = async () => {
    const response = await API.put("/notifications/mark-all-read");
    return response.data;
}