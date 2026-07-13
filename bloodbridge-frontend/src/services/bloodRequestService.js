import API from "./api";

export const getAllBloodRequests = async () => {
    const response = await API.get("/blood-requests");
    return response.data;
};

export const getBloodRequestById = async (id) => {
    const response = await API.get(`/blood-requests/${id}`);
    return response.data;
};
