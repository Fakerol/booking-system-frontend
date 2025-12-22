import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Input from "../../form/input/InputField";
import Badge from "../../ui/badge/Badge";
import { ChevronLeftIcon, AngleRightIcon } from "../../../icons";
import Toast from "../../ui/toast/Toast";
import { getCustomers, CustomerData } from "../../../services/customers";

// Use CustomerData from API as the Customer interface
export type Customer = CustomerData;

const ITEMS_PER_PAGE = 15;

export default function CustomerTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: ITEMS_PER_PAGE,
    total: 0,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCustomers({
        per_page: ITEMS_PER_PAGE,
        page: currentPage,
        search: searchTerm || undefined,
      });

      if (response.success && response.data) {
        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Failed to fetch customers");
        setCustomers([]);
      }
    } catch (err) {
      setError("An error occurred while fetching customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pagination.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          {/* Search Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Completed Bookings
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Loyalty Program
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading customers...
                  </td>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-red-500 dark:text-red-400"
                  >
                    {error}
                  </td>
                </TableRow>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td 
                      className="px-5 py-4 sm:px-6 text-start"
                      onClick={() => handleRowClick(customer)}
                    >
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {customer.name}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(customer)}
                    >
                      {customer.email}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(customer)}
                    >
                      {customer.phone}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(customer)}
                    >
                      {customer.total_completed_bookings}
                    </td>
                    <td 
                      className="px-4 py-3 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(customer)}
                    >
                      {customer.loyalty_program ? (
                        <span className="text-gray-600 dark:text-gray-300">
                          {customer.loyalty_program.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td 
                      className="px-4 py-3 text-start"
                      onClick={() => handleRowClick(customer)}
                    >
                      <Badge 
                        size="sm" 
                        color={customer.status === 1 ? "success" : "warning"}
                      >
                        {customer.status_label}
                      </Badge>
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No customers found matching your filters.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {((pagination.current_page - 1) * pagination.per_page) + 1} to{" "}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={pagination.current_page === 1 || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === pagination.last_page ||
                  (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      disabled={loading}
                      className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm font-medium transition-colors ${
                        pagination.current_page === page
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.current_page - 2 ||
                  page === pagination.current_page + 2
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
              disabled={pagination.current_page === pagination.last_page || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <AngleRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <Toast
        message="Customer deleted successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

