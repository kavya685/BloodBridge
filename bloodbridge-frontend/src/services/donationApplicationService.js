import API from "./api"

export const applyForBloodRequest = async (bloodRequestId) => {
    const response = await API.post("/donation-applications", {bloodRequestId});
    return response.data;
};

export const getApplicationsByBloodRequest = async (bloodRequestId) => {
    const response = await API.get(`/donation-applications/blood-requests/${bloodRequestId}`);
    return response.data;
}

export const rejectApplication = async(applicationId) => {
    const response = await API.put(`/donation-applications/${applicationId}/reject`);
    return response.data;
}

export const acceptApplication = async(applicationId) => {
    const response = await API.put(`/donation-applications/${applicationId}/accept`);
    return response.data;
}

export const getApplicationsByDonor = async(donorId) => {
    const response = await API.get(`/donation-applications/applications/${donorId}`);
    return response.data;
}

export const withdrawApplication = async(id) => {
    const response = await API.delete(`/donation-applications/${id}`);
    return response.data;
}

export const completeApplication = async(id) => {
    const response = await API.put(`/donation-applications/${id}/completed`);
    return response.data;
}
