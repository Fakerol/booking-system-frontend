/**
 * Services API Service
 */

import { apiRequest, ApiResponse } from "./api";

/**
 * Service data from API
 */
export interface ServiceData {
  id: string;
  corporation_id: string;
  name: string;
  description: string;
  price: string | number; // API returns as string, but can be number in forms
  price_formatted: string;
  duration: number;
  duration_formatted: string;
  category: string;
  is_active: boolean;
  status_label: string;
  created_at: string;
  updated_at: string;
}

/**
 * Services list response data
 */
export interface ServicesResponseData {
  services: ServiceData[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Get services query parameters
 */
export interface GetServicesParams {
  per_page?: number;
  search?: string;
  is_active?: boolean | number | string;
  category?: string;
  min_price?: number;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  page?: number;
}

/**
 * Get service categories response data
 */
export interface ServiceCategoriesResponseData {
  categories: string[];
}

/**
 * Get list of services
 */
export async function getServices(
  params?: GetServicesParams
): Promise<ApiResponse<ServicesResponseData>> {
  const queryParams = new URLSearchParams();
  
  if (params?.per_page) {
    queryParams.append("per_page", params.per_page.toString());
  }
  if (params?.search) {
    queryParams.append("search", params.search);
  }
  if (params?.is_active !== undefined) {
    // Convert boolean to 1/0 or keep as string if already 1/0
    let isActiveValue: string;
    if (typeof params.is_active === 'boolean') {
      isActiveValue = params.is_active ? '1' : '0';
    } else if (typeof params.is_active === 'number') {
      isActiveValue = params.is_active.toString();
    } else {
      // If it's already a string like "true"/"false", convert to 1/0
      const str = params.is_active.toString().toLowerCase();
      isActiveValue = (str === 'true' || str === '1') ? '1' : '0';
    }
    queryParams.append("is_active", isActiveValue);
  }
  if (params?.category) {
    queryParams.append("category", params.category);
  }
  if (params?.min_price !== undefined) {
    queryParams.append("min_price", params.min_price.toString());
  }
  if (params?.max_price !== undefined) {
    queryParams.append("max_price", params.max_price.toString());
  }
  if (params?.min_duration !== undefined) {
    queryParams.append("min_duration", params.min_duration.toString());
  }
  if (params?.max_duration !== undefined) {
    queryParams.append("max_duration", params.max_duration.toString());
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/services${queryString ? `?${queryString}` : ""}`;
  
  return apiRequest<ServicesResponseData>(endpoint, {
    method: "GET",
  });
}

/**
 * Get single service by ID response data
 */
export interface GetServiceResponseData {
  service: ServiceData;
}

/**
 * Get a single service by ID
 */
export async function getServiceById(
  id: string
): Promise<ApiResponse<GetServiceResponseData>> {
  return apiRequest<GetServiceResponseData>(`/services/${id}`, {
    method: "GET",
  });
}

/**
 * Create service payload
 */
export interface CreateServicePayload {
  name: string; // Required, max: 255
  description?: string; // Optional, max: 2000
  price: number | string; // Required, >= 0
  duration: number; // Required, in minutes, 1-1440
  category?: string; // Optional
  is_active?: number; // Optional, 0 or 1, defaults to 1 if omitted
}

/**
 * Create service response data
 */
export interface CreateServiceResponseData {
  service: ServiceData;
}

/**
 * Update service payload (all fields optional with PATCH)
 */
export interface UpdateServicePayload {
  name?: string; // Optional, max: 255
  description?: string; // Optional
  price?: number | string; // Optional
  duration?: number; // Optional, in minutes
  category?: string; // Optional
  is_active?: boolean; // Optional
}

/**
 * Update service response data
 */
export interface UpdateServiceResponseData {
  service: ServiceData;
}

/**
 * Create a new service
 * Note: corporation_id is automatically set from the authenticated user's corporation
 */
export async function createService(
  payload: CreateServicePayload
): Promise<ApiResponse<CreateServiceResponseData>> {
  return apiRequest<CreateServiceResponseData>("/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a service
 */
export async function updateService(
  id: string,
  payload: UpdateServicePayload
): Promise<ApiResponse<UpdateServiceResponseData>> {
  return apiRequest<UpdateServiceResponseData>(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a service
 * Note: This performs a soft delete
 */
export async function deleteService(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/services/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get service categories
 */
export async function getServiceCategories(): Promise<ApiResponse<ServiceCategoriesResponseData>> {
  return apiRequest<ServiceCategoriesResponseData>("/services/categories", {
    method: "GET",
  });
}

