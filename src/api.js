import axios from "axios";

const api = axios.create({
  baseURL: "https://sistemabackend-i5uj.onrender.com/api",
});

export default api;
