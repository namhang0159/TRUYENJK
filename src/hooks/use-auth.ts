import { useAuthStore, User } from "../store/auth-store";
import axiosInstance from "../lib/axios";

export const useAuth = () => {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout, updateUser } = useAuthStore();

  const login = async (data: any) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { accessToken, refreshToken, user: userData } = response.data.data;
      
      // If backend returns refreshToken, we might want to store it as well (handled in store if needed, but currently just localStorage)
      if (typeof window !== "undefined" && refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      storeLogin(userData, accessToken);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const response = await axiosInstance.post("/auth/google", { credential });
      const { accessToken, refreshToken, user: userData } = response.data.data;
      
      if (typeof window !== "undefined" && refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      storeLogin(userData, accessToken);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập Google thất bại");
    }
  };

  const sendRegisterOtp = async (email: string) => {
    try {
      const response = await axiosInstance.post("/auth/send-register-otp", { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể gửi mã OTP qua email");
    }
  };

  const sendAuthorZaloOtp = async (phone: string) => {
    try {
      const response = await axiosInstance.post("/auth/send-author-zalo-otp", { phone });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể gửi mã OTP qua Zalo");
    }
  };

  const register = async (data: any) => {
    try {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const registerAuthor = async (pen_name: string, bio: string = "", phone: string, facebook_link: string = "", otp: string = "") => {
    try {
      const response = await axiosInstance.post("/auth/register-author", { pen_name, bio, phone, facebook_link, otp });
      const { accessToken, refreshToken, user: userData } = response.data.data;
      
      if (typeof window !== "undefined" && refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      storeLogin(userData, accessToken);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng ký tác giả thất bại");
    }
  };

  const logout = () => {
    storeLogout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    googleLogin,
    sendRegisterOtp,
    sendAuthorZaloOtp,
    register,
    registerAuthor,
    logout,
    updateUser
  };
};
