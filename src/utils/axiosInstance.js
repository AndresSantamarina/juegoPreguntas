import axios from "axios";
const URL_API = import.meta.env.VITE_API_URI;

const instance = axios.create({
  baseURL: URL_API, // Cambia esto según tu backend
});

instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
