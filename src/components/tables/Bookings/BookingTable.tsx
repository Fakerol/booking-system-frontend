import { useState, useMemo, useEffect } from "react";
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
import BookingDetailsModal from "../../modals/BookingDetailsModal";
import Toast from "../../ui/toast/Toast";

export interface Booking {
  _id: string;
  customer_name: string;
  customer_email: string;
  staff_name: string;
  service_name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

// Generate 50 dummy bookings
const generateDummyBookings = (): Booking[] => {
  const customerNames = [
    "Fakhrul", "John Doe", "Jane Smith", "Bob Johnson", "Alice Williams",
    "Charlie Brown", "Diana Prince", "Edward Lee", "Fiona Green", "George Wilson",
    "Hannah Kim", "Isaac Newton", "Julia Roberts", "Kevin Hart", "Lisa Anderson",
    "Michael Scott", "Nancy Drew", "Oliver Twist", "Patricia Star", "Quinn Taylor",
    "Rachel Green", "Steve Jobs", "Tina Turner", "Uma Thurman", "Victor Chen",
    "Wendy Davis", "Xavier Wood", "Yara Martinez", "Zoe Johnson", "Adam Smith",
    "Bella Swan", "Chris Evans", "Diana Ross", "Ethan Hunt", "Faith Hill",
    "Grace Kelly", "Harry Potter", "Iris West", "Jack Sparrow", "Kate Winslet",
    "Leo DiCaprio", "Mia Wallace", "Noah Smith", "Olivia Pope", "Paul Walker",
    "Quincy Jones", "Rose Tyler", "Sam Wilson", "Tara Reid", "Ulysses Grant"
  ];

  const customerEmails = customerNames.map(name => 
    `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
  );

  const staffNames = ["Ahmad", "Sarah", "Mike", "Emma", "David"];
  const services = ["Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo"];
  const statuses: ("confirmed" | "pending" | "cancelled" | "completed")[] = [
    "confirmed", "pending", "cancelled", "completed"
  ];
  
  const times = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const bookings: Booking[] = [];
  
  // Generate dates from past 30 days to future 15 days
  const today = new Date();
  const dates: string[] = [];
  for (let i = -30; i <= 15; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  for (let i = 0; i < 50; i++) {
    const randomDateIndex = Math.floor(Math.random() * dates.length);
    const randomTimeIndex = Math.floor(Math.random() * times.length);
    const randomStatusIndex = Math.floor(Math.random() * statuses.length);
    const randomStaffIndex = Math.floor(Math.random() * staffNames.length);
    const randomServiceIndex = Math.floor(Math.random() * services.length);
    
    bookings.push({
      _id: (i + 1).toString(),
      customer_name: customerNames[i % customerNames.length],
      customer_email: customerEmails[i % customerEmails.length],
      staff_name: staffNames[randomStaffIndex],
      service_name: services[randomServiceIndex],
      date: dates[randomDateIndex],
      time: times[randomTimeIndex],
      status: statuses[randomStatusIndex],
    });
  }

  return bookings;
};

const bookingData: Booking[] = generateDummyBookings();

const ITEMS_PER_PAGE = 20;

export default function BookingTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Get unique staff names for filter
  const uniqueStaffNames = useMemo(() => {
    const staffSet = new Set(bookingData.map(b => b.staff_name));
    return Array.from(staffSet).sort();
  }, []);

  // Filter bookings based on search and filters
  const filteredBookings = useMemo(() => {
    return bookingData.filter((booking) => {
      const matchesSearch =
        searchTerm === "" ||
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || booking.status === statusFilter;
      const matchesStaff = staffFilter === "" || booking.staff_name === staffFilter;
      const matchesDate = dateFilter === "" || booking.date === dateFilter;

      return matchesSearch && matchesStatus && matchesStaff && matchesDate;
    });
  }, [searchTerm, statusFilter, staffFilter, dateFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, staffFilter, dateFilter]);

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

  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleEdit = (bookingId: string) => {
    navigate(`/bookings/edit/${bookingId}`);
  };

  const handleDelete = (bookingId: string) => {
    // In a real app, this would call an API to delete the booking
    console.log("Delete booking:", bookingId);
    // For now, we'll just log it since we're using dummy data
    setShowToast(true);
    // In a real app, you would make an API call here
    // After successful deletion, show the toast
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

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
              placeholder="Search by name, email, or service..."
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
                { value: "confirmed", label: "Confirmed" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              defaultValue=""
              onChange={(value) => setStatusFilter(value)}
            />
          </div>

          {/* Staff Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Staff
            </label>
            <Select
              placeholder="All Staff"
              options={[
                { value: "", label: "All Staff" },
                ...uniqueStaffNames.map((staff) => ({
                  value: staff,
                  label: staff,
                })),
              ]}
              defaultValue=""
              onChange={(value) => setStaffFilter(value)}
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
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
                  Customer Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Customer Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Staff
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Service
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Time
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
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <TableRow 
                    key={booking._id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td 
                      className="px-5 py-4 sm:px-6 text-start"
                      onClick={() => handleRowClick(booking)}
                    >
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {booking.customer_name}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.customer_email}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.staff_name}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.service_name}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.date}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      {booking.time}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(booking)}
                    >
                      <Badge
                        size="sm"
                        color={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "pending"
                            ? "warning"
                            : booking.status === "completed"
                            ? "info"
                            : "error"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
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
      {totalPages > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)}
            </span>{" "}
            of <span className="font-medium">{filteredBookings.length}</span>{" "}
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

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        booking={selectedBooking}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Success Toast */}
      <Toast
        message="Booking deleted successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

