import API from "../api"

export const hospitalRegister = async (hospitalDetails) => {
    const response = await API.post("/hospitals", hospitalDetails);
    return response.data;
}
