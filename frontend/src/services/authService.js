import api from "../api/axios";

export const registerUser = async (userData) => {
    return await api.post("/user/register", userData);
};

export const loginUser = async (userData) => {
    return await api.post("/user/login", userData);
};
