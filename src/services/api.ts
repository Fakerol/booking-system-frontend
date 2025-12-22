/**
 * Base API Service Utility
 * Shared types and API request function
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API || "http://localhost:8000/api/v1";

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiSuccess<T = any> {
  success: true;
  message: string;
  data?: T;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

/**
 * Make API request with error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem("token");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok && data.success) {
      return data as ApiSuccess<T>;
    } else {
      return data as ApiError;
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}
