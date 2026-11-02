import API from "../api";

export const getDonorProfile = async () => {
    const response = await API.get("/donors/my");
    return response.data;
};

export const updateDonorProfile = async (data) => {
    const response = await API.put("/donors/me", data);
    return response.data;
};

export const changeDonorPassword = async (data) => {
    const response = await API.put("/donors/change-password", data);
    return response.data;
};
