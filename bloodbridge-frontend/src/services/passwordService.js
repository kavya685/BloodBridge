import API from "./api.js";

export const sendOTP = async (email) => {
    const response = await API.post("/forgot-password/send-otp", null,
        {
            params: {email}
        });
    return response.data;
}

export const resetPassword = async (email) => {
    const response = await API.post("/forgot-password/reset-password");
    return response.data;
}

