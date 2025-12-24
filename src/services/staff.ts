/**
 * Staff API Service
 */

import { apiRequest, ApiResponse } from "./api";

/**
 * Staff data from API
 */
export interface StaffData {
  id: string;
  corporation_id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  is_active: boolean;
  status_label: string;
  created_at: string;
  updated_at: string;
}

/**
 * Staff list response data
 */
export interface StaffsResponseData {
  staffs: StaffData[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Get staff query parameters
 */
export interface GetStaffsParams {
  per_page?: number;
  search?: string;
  is_active?: boolean | number | string;
  position?: string;
  page?: number;
}

/**
 * Get single staff by ID response data
 */
export interface GetStaffResponseData {
  staff: StaffData;
}

/**
 * Get list of staff
 */
export async function getStaffs(
  params?: GetStaffsParams
): Promise<ApiResponse<StaffsResponseData>> {
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
  if (params?.position) {
    queryParams.append("position", params.position);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/staffs${queryString ? `?${queryString}` : ""}`;
  
  return apiRequest<StaffsResponseData>(endpoint, {
    method: "GET",
  });
}

/**
 * Get a single staff by ID
 */
export async function getStaffById(
  id: string
): Promise<ApiResponse<GetStaffResponseData>> {
  return apiRequest<GetStaffResponseData>(`/staffs/${id}`, {
    method: "GET",
  });
}

/**
 * Create staff payload
 */
export interface CreateStaffPayload {
  name: string; // Required, max: 255
  phone?: string; // Optional, max: 20
  email?: string; // Optional, must be unique
  position?: string; // Optional, max: 255
  is_active?: boolean; // Optional, default: true
}

/**
 * Create staff response data
 */
export interface CreateStaffResponseData {
  staff: StaffData;
}

/**
 * Update staff payload (all fields optional with PATCH)
 */
export interface UpdateStaffPayload {
  name?: string; // Optional, max: 255
  phone?: string; // Optional, max: 20
  email?: string; // Optional, must be unique
  position?: string; // Optional, max: 255
  is_active?: boolean; // Optional
}

/**
 * Update staff response data
 */
export interface UpdateStaffResponseData {
  staff: StaffData;
}

/**
 * Create a new staff
 * Note: corporation_id is automatically set from the authenticated user's corporation
 */
export async function createStaff(
  payload: CreateStaffPayload
): Promise<ApiResponse<CreateStaffResponseData>> {
  return apiRequest<CreateStaffResponseData>("/staffs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a staff
 */
export async function updateStaff(
  id: string,
  payload: UpdateStaffPayload
): Promise<ApiResponse<UpdateStaffResponseData>> {
  return apiRequest<UpdateStaffResponseData>(`/staffs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a staff
 * Note: This performs a soft delete
 */
export async function deleteStaff(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/staffs/${id}`, {
    method: "DELETE",
  });
}

