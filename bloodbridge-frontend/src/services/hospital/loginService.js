import API from "../api.js"

export const hospitalLogin = (loginData) => {
    const response = API.post("/hospital",loginData);
    return response.data;
}
