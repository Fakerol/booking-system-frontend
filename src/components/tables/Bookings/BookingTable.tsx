import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { ChevronLeftIcon, AngleRightIcon } from "../../../icons";
import Toast from "../../ui/toast/Toast";
import { getBookings, BookingData, GetBookingsParams } from "../../../services/bookings";

// Export BookingData as Booking for backward compatibility with other components
// TODO: Update other components to use BookingData from services/bookings directly
export type Booking = BookingData;

const ITEMS_PER_PAGE = 25;

export default function BookingTable() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [staffFilter, setStaffFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch bookings when filters or page change
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, staffFilter, customerFilter, dateFilter, startDateFilter, endDateFilter, timeFilter, debouncedSearchTerm]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    const params: GetBookingsParams = {
      per_page: ITEMS_PER_PAGE,
      page: currentPage,
    };

    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }

    if (statusFilter !== "") {
      params.status = parseInt(statusFilter);
    }

    if (staffFilter) {
      params.staff_id = staffFilter;
    }

    if (customerFilter) {
      params.customer_id = customerFilter;
    }

    if (dateFilter) {
      params.booking_date = dateFilter;
    }

    if (startDateFilter) {
      params.start_date = startDateFilter;
    }

    if (endDateFilter) {
      params.end_date = endDateFilter;
    }

    if (timeFilter) {
      params.time_filter = timeFilter;
    }

    const response = await getBookings(params);

    if (response.success && response.data) {
      // Sort by created_at descending (latest first)
      const sortedBookings = [...response.data.bookings].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      setBookings(sortedBookings);
      setTotalPages(response.data.pagination.last_page);
      setTotal(response.data.pagination.total);
    } else {
      setError(response.message || "Failed to fetch bookings");
      setBookings([]);
    }

    setLoading(false);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (booking: BookingData) => {
    navigate(`/bookings/${booking.id}`);
  };

  const getStatusBadgeColor = (statusLabel: string) => {
    const status = statusLabel.toLowerCase();
    if (status === "pending") {
      return "warning";
    } else if (status === "confirmed") {
      return "success";
    } else if (status === "completed") {
      return "info";
    } else if (status === "cancelled") {
      return "error";
    }
    return "warning";
  };

  // Calculate display range
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + bookings.length, total);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by booking number, customer name/phone, or staff name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              placeholder="All Statuses"
              options={[
                { value: "", label: "All Statuses" },
                { value: "1", label: "Pending" },
                { value: "2", label: "Confirmed" },
                { value: "3", label: "Completed" },
                { value: "4", label: "Cancelled" },
              ]}
              defaultValue=""
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Booking Date
            </label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Time Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Filter
            </label>
            <Select
              placeholder="All Time"
              options={[
                { value: "", label: "All Time" },
                { value: "upcoming", label: "Upcoming" },
                { value: "past", label: "Past" },
                { value: "today", label: "Today" },
              ]}
              defaultValue=""
              onChange={(value) => {
                setTimeFilter(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <Input
              type="date"
              value={startDateFilter}
              onChange={(e) => {
                setStartDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <Input
              type="date"
              value={endDateFilter}
              onChange={(e) => {
                setEndDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full border-collapse">
            {/* Table Header */}
            <TableHeader>
              <TableRow className="bg-brand-50 dark:bg-brand-500/[0.12]">
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-center dark:border-gray-700 dark:text-gray-300"
                >
                  #
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Booking Number
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Customer Name
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Customer Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Booking Date
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Start Time
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Total Price
                </TableCell>
                <TableCell
                  isHeader
                  className="border-b border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                >
                  Staff
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {loading ? (
                <TableRow>
                  <td
                    colSpan={9}
                    className="border-b border-gray-200 px-3 py-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
                  >
                    Loading bookings data...
                  </td>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <td
                    colSpan={9}
                    className="border-b border-gray-200 px-3 py-2 text-center text-xs text-red-500 dark:border-gray-700 dark:text-red-400"
                  >
                    {error}
                  </td>
                </TableRow>
              ) : bookings.length > 0 ? (
                // Display bookings sorted by created_at descending (latest first)
                bookings.map((booking, index) => (
                  <TableRow 
                    key={booking.id}
                    className={`cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${
                      index % 2 === 0 
                        ? "bg-white dark:bg-white/[0.02]" 
                        : "bg-gray-50/50 dark:bg-gray-800/30"
                    }`}
                  >
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-xs text-gray-600 text-center dark:border-gray-700 dark:text-gray-400"
                    >
                      {startIndex + index + 1}
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-start dark:border-gray-700"
                      onClick={() => handleRowClick(booking)}
                    >
                      <Badge 
                        size="sm" 
                        color={getStatusBadgeColor(booking.status_label)}
                      >
                        {booking.status_label}
                      </Badge>
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-start dark:border-gray-700"
                      onClick={() => handleRowClick(booking)}
                    >
                      <span className="block text-xs font-medium text-gray-800 dark:text-white/90">
                        {booking.booking_number}
                      </span>
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-start dark:border-gray-700"
                      onClick={() => handleRowClick(booking)}
                    >
                      <span className="block text-xs font-medium text-gray-800 dark:text-white/90">
                        {booking.customer.name}
                      </span>
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-xs text-gray-600 text-start dark:border-gray-700 dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.customer.phone || "—"}
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-xs text-gray-600 text-start dark:border-gray-700 dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.booking_date}
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-xs text-gray-600 text-start dark:border-gray-700 dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.start_time}
                    </td>
                    <td 
                      className="border-r border-gray-200 px-3 py-1.5 text-xs text-gray-600 text-start dark:border-gray-700 dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.total_price_formatted}
                    </td>
                    <td 
                      className="px-3 py-1.5 text-xs text-gray-600 text-start dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.staff.name}
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={9}
                    className="border-b border-gray-200 px-3 py-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
                  >
                    No bookings found matching your filters.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && !loading && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {startIndex + 1} to {endIndex}
            </span>{" "}
            of <span className="font-medium">{total}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      className="flex h-9 items-center px-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <AngleRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <Toast
        message="Booking deleted successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
