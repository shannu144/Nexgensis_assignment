import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = "https://dummyjson.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error normalization and 401 handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    // Check if error is due to request cancellation (e.g. AbortController for race condition prevention)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Unauthorized (401): Session expired or invalid token
    if (status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login")) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = `/login?expired=true&redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    const normalizedMessage =
      serverMessage ||
      error.message ||
      "An unexpected error occurred. Please try again.";

    // Attach normalized human-readable message
    const enrichedError = new Error(normalizedMessage);
    (enrichedError as unknown as { status?: number; originalError: AxiosError }).status = status;
    (enrichedError as unknown as { status?: number; originalError: AxiosError }).originalError = error;

    return Promise.reject(enrichedError);
  }
);

export default apiClient;
