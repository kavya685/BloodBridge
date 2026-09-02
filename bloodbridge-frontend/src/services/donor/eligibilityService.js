import API from "../api"

export const donorEligibility = async () => {
    const response = await API.get("/donors/eligibility");
    return response.data;
}