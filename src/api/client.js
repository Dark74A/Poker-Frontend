import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ledger_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ledger_token");
      localStorage.removeItem("ledger_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
