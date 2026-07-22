import API from "../api"

export const hospitalRegister = async (hospitalDetails) => {
    const response = await API.post("/hospital", hospitalDetails);
    return response.data;
}
