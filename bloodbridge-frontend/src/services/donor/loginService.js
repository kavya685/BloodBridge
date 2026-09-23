import API from "../api";

export const donorLogin = async (loginData) => {
  const response = await API.post("/donors/login", loginData);

  return response.data;
};