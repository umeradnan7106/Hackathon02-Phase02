/**
 * API client with axios for backend communication.
 * Handles authentication, error handling, and automatic token injection.
 */

import axios, { AxiosError } from "axios";
import type {
  User,
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  SignupRequest,
  LoginRequest,
  SignupResponse,
  LoginResponse,
  TasksResponse,
} from "./types";

// API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login?error=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>("/api/auth/signup", data);
  // Store token and user in localStorage
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  // Also set cookie for middleware authentication check
  if (typeof document !== "undefined") {
    document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  }

  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/auth/login", data);
  // Store token and user in localStorage
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  // Also set cookie for middleware authentication check
  if (typeof document !== "undefined") {
    document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  }

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Also remove cookie
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0"; // Delete cookie
  }

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Task API calls
 */

export const getTasks = async (userId: string): Promise<TasksResponse> => {
  const response = await api.get<TasksResponse>(`/api/${userId}/tasks`);
  return response.data;
};

export const createTask = async (
  userId: string,
  data: TaskCreateRequest
): Promise<Task> => {
  const response = await api.post<Task>(`/api/${userId}/tasks`, data);
  return response.data;
};

export const updateTask = async (
  userId: string,
  taskId: number,
  data: TaskUpdateRequest
): Promise<Task> => {
  const response = await api.put<Task>(`/api/${userId}/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (
  userId: string,
  taskId: number
): Promise<void> => {
  await api.delete(`/api/${userId}/tasks/${taskId}`);
};

export const toggleTaskComplete = async (
  userId: string,
  taskId: number
): Promise<Task> => {
  const response = await api.patch<Task>(
    `/api/${userId}/tasks/${taskId}/complete`
  );
  return response.data;
};

/**
 * Error message extraction helper
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail[0]?.msg || "An error occurred";
    return error.message || "Network error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};
