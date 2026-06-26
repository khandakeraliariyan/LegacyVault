import axios from "axios";

import { auth } from "../firebase/firebase.config";
import { getToken, removeToken } from "../utils/storage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
});

async function resolveAuthToken() {
    if (auth.currentUser) {
        return auth.currentUser.getIdToken();
    }

    return getToken();
}

api.interceptors.request.use(
    async (config) => {
        const token = await resolveAuthToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
        }

        return Promise.reject(error);
    }
);

export default api;

export function getApiErrorMessage(error, fallback = "Something went wrong") {
    return error.response?.data?.message || error.message || fallback;
}
