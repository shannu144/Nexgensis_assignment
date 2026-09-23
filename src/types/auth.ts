export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  accessToken?: string;
  token?: string; // DummyJSON supports both token and accessToken
  refreshToken?: string;
}

export interface SignupResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  age?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
