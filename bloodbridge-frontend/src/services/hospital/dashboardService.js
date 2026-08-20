import API from "../api.js"

export const hospitalDashboard = async () => {
    const response = await API.get("/hospitals/dashboard");
    return response.data;
}