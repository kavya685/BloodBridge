import API from '../api'

export const donorRegister = async (donorDetails) => {
    const response = await API.post("/donors", donorDetails);
    return response.data;
}
