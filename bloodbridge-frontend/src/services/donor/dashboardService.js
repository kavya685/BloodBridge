import API from "../api.js"

export const donorDashboard = async () => {
    const response = await API.get("/donors/dashboard");
    return response.data;
}