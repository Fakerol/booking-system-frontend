/**
 * Customers API Service
 */

import { apiRequest, ApiResponse } from "./api";

/**
 * Customer data from API
 */
export interface CustomerData {
  id: string;
  corporation_id: string;
  name: string;
  phone: string;
  email: string;
  total_completed_bookings: number;
  loyalty_program_id: string | null;
  status: number;
  status_label: string;
  loyalty_program: {
    id: string;
    name: string;
    description: string;
    reward_type: string;
    reward_value: number;
  } | null;
  created_at: string;
  updated_at: string;
}

/**
 * Customers list response data
 */
export interface CustomersResponseData {
  customers: CustomerData[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Get customers query parameters
 */
export interface GetCustomersParams {
  per_page?: number;
  search?: string;
  status?: number;
  loyalty_program_id?: string;
  page?: number;
}

/**
 * Create customer payload
 */
export interface CreateCustomerPayload {
  name: string; // Required, max: 255
  phone?: string; // Optional, max: 20
  email?: string; // Optional, must be unique
  total_completed_bookings?: number; // Optional, min: 0, default: 0
  loyalty_program_id?: string | null; // Optional, UUID
  status?: number; // Optional, 0 or 1, default: 1
}

/**
 * Create customer response data
 */
export interface CreateCustomerResponseData {
  customer: CustomerData;
}

/**
 * Update customer payload (all fields optional with PATCH)
 */
export interface UpdateCustomerPayload {
  name?: string; // Optional, max: 255
  phone?: string; // Optional, max: 20
  email?: string; // Optional, must be unique
  status?: number; // Optional, 0 or 1
  loyalty_program_id?: string | null; // Optional, UUID
}

/**
 * Update customer response data
 */
export interface UpdateCustomerResponseData {
  customer: CustomerData;
}

/**
 * Get single customer by ID response data
 */
export interface GetCustomerResponseData {
  customer: CustomerData;
}

/**
 * Get list of customers
 */
export async function getCustomers(
  params?: GetCustomersParams
): Promise<ApiResponse<CustomersResponseData>> {
  const queryParams = new URLSearchParams();
  
  if (params?.per_page) {
    queryParams.append("per_page", params.per_page.toString());
  }
  if (params?.search) {
    queryParams.append("search", params.search);
  }
  if (params?.status !== undefined) {
    queryParams.append("status", params.status.toString());
  }
  if (params?.loyalty_program_id) {
    queryParams.append("loyalty_program_id", params.loyalty_program_id);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/customers${queryString ? `?${queryString}` : ""}`;
  
  return apiRequest<CustomersResponseData>(endpoint, {
    method: "GET",
  });
}

/**
 * Create a new customer
 * Note: corporation_id is automatically set from the authenticated user's corporation
 */
export async function createCustomer(
  payload: CreateCustomerPayload
): Promise<ApiResponse<CreateCustomerResponseData>> {
  return apiRequest<CreateCustomerResponseData>("/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a customer
 */
export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload
): Promise<ApiResponse<UpdateCustomerResponseData>> {
  return apiRequest<UpdateCustomerResponseData>(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(
  id: string
): Promise<ApiResponse<GetCustomerResponseData>> {
  return apiRequest<GetCustomerResponseData>(`/customers/${id}`, {
    method: "GET",
  });
}

/**
 * Delete a customer
 * Note: This performs a soft delete
 */
export async function deleteCustomer(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/customers/${id}`, {
    method: "DELETE",
  });
}



