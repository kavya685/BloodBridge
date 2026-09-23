import API from "./api.js";

export const sendOTP = async (email) => {
    const response = await API.post(
        "/forgot-password/send-otp",
        null,
        {
            params: { email }
        }
    );

    return response.data;
};

export const verifyOTP = async (email, otp) => {
    const response = await API.post(
        "/forgot-password/verify-otp",
        null,
        {
            params: {
                email,
                otp
            }
        }
    );

    return response.data;
};

export const resetPassword = async (
    email,
    newPassword,
    confirmPassword
) => {
    const response = await API.post(
        "/forgot-password/reset-password",
        {
            email,
            newPassword,
            confirmPassword
        }
    );

    return response.data;
};