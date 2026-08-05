import API from "../api.js"

export const hospitalLogin = async (loginData) => {
    const response = await API.post("/hospitals/login",loginData);
    return response.data;
}
