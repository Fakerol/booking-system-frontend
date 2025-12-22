/**
 * Corporations API Service
 */

import { apiRequest, ApiResponse } from "./api";

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

