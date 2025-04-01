import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    localStorage.setItem("jwtToken", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("jwtToken");
    
    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export { apiClient, refreshAccessToken };
