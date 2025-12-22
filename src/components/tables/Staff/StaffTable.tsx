import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import Badge from "../../ui/badge/Badge";
import { ChevronLeftIcon, AngleRightIcon } from "../../../icons";
import Toast from "../../ui/toast/Toast";

export interface Staff {
  _id: string;
  name: string;
  available_days: string[];
  start_time: string;
  end_time: string;
}

// Generate 20 dummy staff members
const generateDummyStaff = (): Staff[] => {
  const names = [
    "Ahmad", "Sarah", "Mike", "Emma", "David", "Lisa", "John", "Maria",
    "Tom", "Anna", "James", "Sophia", "Robert", "Olivia", "William", "Grace",
    "Daniel", "Emily", "Matthew", "Charlotte"
  ];

  const allDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const startTimes = ["09:00", "10:00", "11:00", "08:00"];
  const endTimes = ["17:00", "18:00", "19:00", "20:00"];

  const staff: Staff[] = [];
  
  for (let i = 0; i < 20; i++) {
    const dayCount = Math.floor(Math.random() * 5) + 3; // 3-7 days
    const availableDays = allDays
      .sort(() => Math.random() - 0.5)
      .slice(0, dayCount)
      .sort();
    
    const startTimeIndex = Math.floor(Math.random() * startTimes.length);
    const endTimeIndex = Math.floor(Math.random() * endTimes.length);
    
    staff.push({
      _id: (i + 1).toString(),
      name: names[i % names.length],
      available_days: availableDays,
      start_time: startTimes[startTimeIndex],
      end_time: endTimes[endTimeIndex],
    });
  }

  return staff;
};

export const staffData: Staff[] = generateDummyStaff();

const ITEMS_PER_PAGE = 20;

const dayLabels: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export default function StaffTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Filter staff based on search and filters
  const filteredStaff = useMemo(() => {
    return staffData.filter((staff) => {
      const matchesSearch =
        searchTerm === "" ||
        staff.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDay =
        dayFilter === "" ||
        staff.available_days.includes(dayFilter);

      return matchesSearch && matchesDay;
    });
  }, [searchTerm, dayFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dayFilter]);

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

  const handleRowClick = (staff: Staff) => {
    navigate(`/staff/${staff._id}`);
  };

  const handleEdit = (staffId: string) => {
    navigate(`/staff/edit/${staffId}`);
  };

  const handleDelete = (staffId: string) => {
    // In a real app, this would call an API to delete the staff
    console.log("Delete staff:", staffId);
    // For now, we'll just log it since we're using dummy data
    setShowToast(true);
    // In a real app, you would make an API call here
    // After successful deletion, show the toast
  };

  // Get unique days for filter
  const uniqueDays = useMemo(() => {
    const daySet = new Set<string>();
    staffData.forEach((staff) => {
      staff.available_days.forEach((day) => daySet.add(day));
    });
    return Array.from(daySet).sort();
  }, []);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Search Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by staff name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Day Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Day
            </label>
            <Select
              placeholder="All Days"
              options={[
                { value: "", label: "All Days" },
                ...uniqueDays.map((day) => ({
                  value: day,
                  label: dayLabels[day],
                })),
              ]}
              defaultValue=""
              onChange={(value) => setDayFilter(value)}
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
                  Staff Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Available Days
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Working Hours
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staff) => (
                  <TableRow 
                    key={staff._id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td 
                      className="px-5 py-4 sm:px-6 text-start"
                      onClick={() => handleRowClick(staff)}
                    >
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {staff.name}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(staff)}
                    >
                      <div className="flex flex-wrap gap-1">
                        {staff.available_days.map((day) => (
                          <Badge key={day} size="sm" color="info">
                            {dayLabels[day]}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(staff)}
                    >
                      {staff.start_time} - {staff.end_time}
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No staff found matching your filters.
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
              {startIndex + 1} to {Math.min(endIndex, filteredStaff.length)}
            </span>{" "}
            of <span className="font-medium">{filteredStaff.length}</span>{" "}
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
        message="Staff deleted successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

