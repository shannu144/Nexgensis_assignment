import apiClient from "@/lib/axios";
import { LoginCredentials, LoginResponse, User } from "@/types/auth";

export const authService = {
  /**
   * Authenticate user with username and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: 120, // 2 hours
    });

    const data = response.data;
    const token = data.accessToken || data.token || "";

    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      accessToken: token,
      refreshToken: data.refreshToken,
    };

    return user;
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<LoginResponse>("/auth/me");
    const data = response.data;
    const token = data.accessToken || data.token || "";

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      accessToken: token,
      refreshToken: data.refreshToken,
    };
  },
};
