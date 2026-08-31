import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.namhang0159.io.vn/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Tuỳ chọn: bật credentials nếu backend dùng cookie
  // withCredentials: true,
});

// Giả lập lấy token từ local storage hoặc cookie (Tùy chiến lược của bạn)
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bắt lỗi 401 Unauthorized, ngoại trừ các route auth/login và auth/register
    const isAuthRoute = originalRequest.url?.endsWith('/auth/login') || originalRequest.url?.endsWith('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // Không có refresh token -> Redirect to login
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Gọi API lấy lại token mới
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Backend trả về token mới
        const { accessToken, refreshToken: newRefreshToken } = data;

        setTokens(accessToken, newRefreshToken || refreshToken);

        // Đính kèm token mới vào request bị lỗi và gửi lại
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng lỗi/hết hạn -> Xoá trạng thái và đẩy về login
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
