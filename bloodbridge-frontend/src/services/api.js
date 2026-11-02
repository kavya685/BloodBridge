import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});


API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);


API.interceptors.response.use(
    (response) => response,

    (error) => {
        const url = error.config?.url || "";
        const isAuthCheck = url.includes("/login") || url.includes("/change-password");

        if (error.response?.status === 401 && !isAuthCheck) {
            localStorage.removeItem("token");
            localStorage.removeItem("donor");
            localStorage.removeItem("hospital");
            localStorage.removeItem("admin");

            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);


export default API;