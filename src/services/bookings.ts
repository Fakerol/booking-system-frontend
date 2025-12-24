/**
 * Bookings API Service
 */

import { apiRequest, ApiResponse } from "./api";

/**
 * Booking service data from API
 */
export interface BookingServiceData {
  id: number;
  booking_id: string;
  service_id: string;
  duration: number;
  duration_formatted: string;
  price: string;
  price_formatted: string;
  service: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
}

/**
 * Booking customer data from API
 */
export interface BookingCustomerData {
  id: string;
  name: string;
  phone: string;
  email: string;
}

/**
 * Booking staff data from API
 */
export interface BookingStaffData {
  id: string;
  name: string;
  phone: string;
  position: string;
}

/**
 * Booking data from API
 */
export interface BookingData {
  id: string;
  booking_number: string;
  corporation_id: string;
  customer_id: string;
  staff_id: string;
  booking_date: string;
  booking_date_formatted: string;
  start_time: string;
  end_time: string;
  time_range: string;
  total_price: string;
  total_price_formatted: string;
  status: number;
  status_label: string;
  notes: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  customer: BookingCustomerData;
  staff: BookingStaffData;
  services: BookingServiceData[];
  created_at: string;
  updated_at: string;
}

/**
 * Bookings list response data
 */
export interface BookingsResponseData {
  bookings: BookingData[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Get bookings query parameters
 */
export interface GetBookingsParams {
  per_page?: number;
  search?: string;
  status?: number;
  customer_id?: string;
  staff_id?: string;
  booking_date?: string; // YYYY-MM-DD
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  time_filter?: string; // upcoming, past, today
  page?: number;
}

/**
 * Get single booking by ID response data
 */
export interface GetBookingResponseData {
  booking: BookingData;
}

/**
 * Get list of bookings
 */
export async function getBookings(
  params?: GetBookingsParams
): Promise<ApiResponse<BookingsResponseData>> {
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
  if (params?.customer_id) {
    queryParams.append("customer_id", params.customer_id);
  }
  if (params?.staff_id) {
    queryParams.append("staff_id", params.staff_id);
  }
  if (params?.booking_date) {
    queryParams.append("booking_date", params.booking_date);
  }
  if (params?.start_date) {
    queryParams.append("start_date", params.start_date);
  }
  if (params?.end_date) {
    queryParams.append("end_date", params.end_date);
  }
  if (params?.time_filter) {
    queryParams.append("time_filter", params.time_filter);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/bookings${queryString ? `?${queryString}` : ""}`;
  
  return apiRequest<BookingsResponseData>(endpoint, {
    method: "GET",
  });
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(
  id: string
): Promise<ApiResponse<GetBookingResponseData>> {
  return apiRequest<GetBookingResponseData>(`/bookings/${id}`, {
    method: "GET",
  });
}

/**
 * Create booking payload
 */
export interface CreateBookingPayload {
  customer_id: string; // Required, Customer UUID
  staff_id: string; // Required, Staff UUID
  booking_date: string; // Required, Date (YYYY-MM-DD), must be today or future
  start_time: string; // Required, Time (HH:MM format)
  services: string[]; // Required, Array of service UUIDs (minimum 1)
  notes?: string; // Optional, Additional notes
  status?: number; // Optional, 1: Pending (default), 2: Confirmed
}

/**
 * Create booking response data
 */
export interface CreateBookingResponseData {
  booking: BookingData;
}

/**
 * Create a new booking
 * Note: corporation_id, booking_number, end_time, and total_price are auto-calculated
 */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<ApiResponse<CreateBookingResponseData>> {
  return apiRequest<CreateBookingResponseData>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Time slot data from API
 */
export interface TimeSlot {
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  formatted: string; // Formatted display string
}

/**
 * Working hours data from API
 */
export interface WorkingHours {
  start: string; // HH:MM:SS format
  end: string; // HH:MM:SS format
}

/**
 * Get time slots response data
 */
export interface GetTimeSlotsResponseData {
  available: boolean;
  total_duration?: number;
  working_hours?: WorkingHours;
  reason?: string; // Reason if not available (e.g., "Staff does not work on this day", "Staff is on leave")
  slots: TimeSlot[];
}

/**
 * Get time slots query parameters
 */
export interface GetTimeSlotsParams {
  staff_id: string; // Required, Staff UUID
  date: string; // Required, Date (YYYY-MM-DD, today or future)
  service_ids: string[]; // Required, Array of service IDs (min 1)
}

/**
 * Get available time slots for a staff member on a specific date
 */
export async function getTimeSlots(
  params: GetTimeSlotsParams
): Promise<ApiResponse<GetTimeSlotsResponseData>> {
  const queryParams = new URLSearchParams();
  
  queryParams.append("staff_id", params.staff_id);
  queryParams.append("date", params.date);
  
  // Add service_ids as array parameters
  params.service_ids.forEach((serviceId) => {
    queryParams.append("service_ids[]", serviceId);
  });

  const queryString = queryParams.toString();
  const endpoint = `/availability/time-slots?${queryString}`;
  
  return apiRequest<GetTimeSlotsResponseData>(endpoint, {
    method: "GET",
  });
}

/**
 * Update booking payload (all fields are optional)
 */
export interface UpdateBookingPayload {
  staff_id?: string; // Optional, Staff UUID
  booking_date?: string; // Optional, Date (YYYY-MM-DD), must be today or future
  start_time?: string; // Optional, Time (HH:MM format)
  services?: string[]; // Optional, Array of service UUIDs (minimum 1 if provided)
  notes?: string; // Optional, Additional notes
  status?: number; // Optional, 1: Pending, 2: Confirmed, etc.
}

/**
 * Update booking response data
 */
export interface UpdateBookingResponseData {
  booking: BookingData;
}

/**
 * Update an existing booking
 * Note: All fields are optional. Only provided fields will be updated.
 */
export async function updateBooking(
  id: string,
  payload: UpdateBookingPayload
): Promise<ApiResponse<UpdateBookingResponseData>> {
  return apiRequest<UpdateBookingResponseData>(`/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

