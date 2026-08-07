import API from "./api"

export const applyForBloodRequest = async (bloodRequestId) => {
    const response = await API.post("donation-applications", {bloodRequestId});
    return response.data;
};

export const getApplicationsByBloodRequest = async (bloodRequestId) => {
    const response = await API.get(`/donation-applications/blood-requests/${bloodRequestId}`);
    return response.data;
}
