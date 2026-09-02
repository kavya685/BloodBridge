import API from "../api.js"

export const donorNotifications = async () => {
    const response = await API.get("/notifications/donor");
    return response.data;
}