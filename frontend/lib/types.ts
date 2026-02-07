/**
 * TypeScript type definitions for API requests and responses.
 * Ensures type safety across frontend application.
 */

/**
 * User account representation.
 */
export interface User {
  id: string; // UUID v4
  email: string;
  name?: string;
  created_at: string; // ISO 8601 datetime
}

/**
 * Task entity with all fields.
 */
export interface Task {
  id: number;
  user_id: string; // UUID v4
  title: string; // 1-100 characters
  description?: string; // Max 500 characters
  is_complete: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

/**
 * Request body for creating a new task.
 */
export interface TaskCreateRequest {
  title: string; // Required, 1-100 chars
  description?: string; // Optional, max 500 chars
}

/**
 * Request body for updating an existing task.
 */
export interface TaskUpdateRequest {
  title: string; // Required, 1-100 chars
  description?: string; // Optional, max 500 chars
}

/**
 * Request body for user signup.
 */
export interface SignupRequest {
  email: string;
  password: string; // Min 8 characters
  name?: string;
}

/**
 * Request body for user login.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response from signup endpoint.
 */
export interface SignupResponse {
  user: User;
  message: string;
}

/**
 * Response from login endpoint.
 */
export interface LoginResponse {
  token: string; // JWT token
  user: User;
  message: string;
}

/**
 * Response from GET /tasks endpoint.
 */
export interface TasksResponse {
  tasks: Task[];
  count: number;
}

/**
 * Generic API error response.
 */
export interface ApiError {
  detail: string;
  status_code?: number;
}

/**
 * Generic API success response.
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: ApiError;
}
