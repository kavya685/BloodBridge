import API from "./api"

export const applyForBloodRequest = async (bloodRequestId) => {
    const response = await API.post("donation-application", {bloodRequestId});
    return response.data;
};
