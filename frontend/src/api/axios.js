import axios from "axios";

const api = axios.create({
// baseURL: "http://localhost:8000/api",
baseURL:"https://qr-restaurant-menu.onrender.com/api",
});

export default api;