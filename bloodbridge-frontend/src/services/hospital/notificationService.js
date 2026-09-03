import API from "../api.js";

export const hospitalNotifications = async () => {
    const response = await API.get("/notifications/hospital");
    return response.data;
}