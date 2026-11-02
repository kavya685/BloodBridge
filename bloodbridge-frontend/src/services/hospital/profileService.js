import API from "../api";

export const getHospitalProfile = async () => {
    const response = await API.get("/hospitals/my");
    return response.data;
};

export const updateHospitalProfile = async (data) => {
    const response = await API.put("/hospitals/me", data);
    return response.data;
};

export const changeHospitalPassword = async (data) => {
    const response = await API.put("/hospitals/change-password", data);
    return response.data;
};
