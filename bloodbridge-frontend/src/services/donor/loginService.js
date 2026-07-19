import API from "../api"

export const donorLogin = (loginData) => {
  return API.post("/donors/login", loginData);
};
