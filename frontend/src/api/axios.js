import axios from "axios";

const api = axios.create({
  baseURL: "https://yoyos-club-backend.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        window.location.href = "/login";
        return;
      }
      try {
        const res = await axios.post(
          "https://yoyos-club-backend.onrender.com/auth/refresh",
          {
            refresh,
          },
        );
        localStorage.setItem("access", res.data.access);
        error.config.headers.Authorization = `Bearer ${res.data.access}`;
        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return error;
  },
);

export default api;
