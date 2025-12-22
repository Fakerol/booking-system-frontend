/**
 * API Service Utility
 * Centralized API configuration and helper functions
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
 * Register user payload
 */
export interface RegisterPayload {
  name: string;
  email: string;
  phone: string | null;
  password: string;
  password_confirmation: string;
}

/**
 * Register user response data
 */
export interface RegisterResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    corporation_id: string | null;
    status: number;
    created_at: string;
    updated_at: string;
  };
  message: string;
}

/**
 * Make API request with error handling
 */
async function apiRequest<T = any>(
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

/**
 * Register a new user
 */
export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResponse<RegisterResponseData>> {
  return apiRequest<RegisterResponseData>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


/**
 * Login payload
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponseData {
  user: {
    id: string;
    corporation_id: string | null;
    name: string;
    email: string;
    phone: string;
    email_verified_at: string | null;
    role: string;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    corporation: any | null;
  };
  token: string;
  expires_in: number;
  needs_corporation_setup: boolean;
}

/**
 * Login a user
 */
export async function loginUser(
  payload: LoginPayload
): Promise<ApiResponse<LoginResponseData>> {
  return apiRequest<LoginResponseData>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Corporation setup payload
 */
export interface CorporationPayload {
  name: string;
  email: string;
  phone: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  zip?: number | string;
  state?: string;
  country?: string;
  logo?: string;
}

/**
 * Corporation response data
 */
export interface CorporationResponseData {
  corporation: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    zip: number;
    state: string;
    country: string;
    logo: string | null;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create a corporation
 */
export async function createCorporation(
  payload: CorporationPayload
): Promise<ApiResponse<CorporationResponseData>> {
  return apiRequest<CorporationResponseData>("/corporations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
