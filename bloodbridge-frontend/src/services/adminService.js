import API from "./api";

export const loginAdmin = async (data) => {
    const response = await API.post("/admin/login", data);
    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await API.get("/admin/dashboard");
    return response.data;
};

export const getAllDonors = async () => {
    const response = await API.get("/admin/donors");
    return response.data;
};

export const getDonorById = async (id) => {
    const response = await API.get(`/admin/donors/${id}`);
    return response.data;
};

export const getAllHospitals = async () => {
    const response = await API.get("/admin/hospitals");
    return response.data;
};

export const getHospitalById = async (id) => {
    const response = await API.get(`/admin/hospitals/${id}`);
    return response.data;
};

export const getAllBloodRequests = async () => {
    const response = await API.get("/admin/blood-requests");
    return response.data;
};

export const getBloodRequestById = async (id) => {
    const response = await API.get(`/admin/blood-requests/${id}`);
    return response.data;
};

export const acceptHospitalRegistration = async (hospitalId) => {
    const response = await API.put(`/admin/hospitals/${hospitalId}/accept`);
    return response.data;
};

export const rejectHospitalRegistration = async (hospitalId) => {
    const response = await API.put(`/admin/hospitals/${hospitalId}/reject`);
    return response.data;
};

export const suspendDonor = async (donorId) => {
    const response = await API.put(`/admin/donors/${donorId}/suspend`);
    return response.data;
};

export const reactivateDonor = async (donorId) => {
    const response = await API.put(`/admin/donors/${donorId}/reactivate`);
    return response.data;
};

export const suspendHospital = async (hospitalId) => {
    const response = await API.put(`/admin/hospitals/${hospitalId}/suspend`);
    return response.data;
};

export const reactivateHospital = async (hospitalId) => {
    const response = await API.put(`/admin/hospitals/${hospitalId}/reactivate`);
    return response.data;
};

export const closeBloodRequest = async (requestId, reason) => {
    const response = await API.put(`/admin/blood-requests/${requestId}/close`, { reason });
    return response.data;
};
