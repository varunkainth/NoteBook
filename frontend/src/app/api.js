import axios from "axios";

const api = axios.create({

    //use hardcoded url here ONLY!!!!!!!!!!!!!!!!!!!!!!!!!!
  baseURL: "https://notebook-fppr.onrender.com",
  // baseURL: "https://supreme-space-goldfish-vgwjr44x77p2pq45-5000.app.github.dev/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Config:", config); // Log request config
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;