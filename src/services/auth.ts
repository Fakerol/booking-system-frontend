/**
 * Authentication API Service
 */

import { apiRequest, ApiResponse } from "./api";

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



