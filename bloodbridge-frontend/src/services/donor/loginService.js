import API from "../api"

export const donorLogin = (loginData) => {
  // this returns response not response.data
  return API.post("/donors/login", loginData);
};
