import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const donorLogin = (loginData) => {
  return API.post("/donors/login", loginData);
};
