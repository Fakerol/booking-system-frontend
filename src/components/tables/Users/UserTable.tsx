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

export interface User {
  _id: string;
  username: string;
  password_hash: string;
  role: "admin" | "customer";
}

// Generate 25 dummy users
const generateDummyUsers = (): User[] => {
  const usernames = [
    "admin", "admin1", "admin2", "customer1", "customer2",
    "customer3", "customer4", "customer5", "john_doe", "jane_smith",
    "mike_wilson", "sarah_jones", "david_brown", "emma_davis", "chris_miller",
    "lisa_anderson", "james_taylor", "amy_thomas", "robert_moore", "olivia_jackson",
    "william_white", "sophia_harris", "noah_martin", "ava_thompson", "lucas_garcia"
  ];

  const roles: ("admin" | "customer")[] = ["admin", "customer"];

  const users: User[] = [];
  
  for (let i = 0; i < 25; i++) {
    const roleIndex = i < 3 ? 0 : Math.floor(Math.random() * roles.length); // First 3 are admin
    
    users.push({
      _id: (i + 1).toString(),
      username: usernames[i % usernames.length] + (i > usernames.length - 1 ? `_${i}` : ""),
      password_hash: "$2a$10$hashedpasswordexample" + i, // Dummy hash
      role: roles[roleIndex],
    });
  }

  return users;
};

export const userData: User[] = generateDummyUsers();

const ITEMS_PER_PAGE = 20;

export default function UserTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return userData.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

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

  const handleRowClick = (user: User) => {
    navigate(`/users/${user._id}`);
  };

  const handleEdit = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleDelete = (userId: string) => {
    // In a real app, this would call an API to delete the user
    console.log("Delete user:", userId);
    // For now, we'll just log it since we're using dummy data
    setShowToast(true);
    // In a real app, you would make an API call here
    // After successful deletion, show the toast
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "error" : "success";
  };

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
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <Select
              placeholder="All Roles"
              options={[
                { value: "", label: "All Roles" },
                { value: "admin", label: "Admin" },
                { value: "customer", label: "Customer" },
              ]}
              defaultValue=""
              onChange={(value) => setRoleFilter(value)}
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
                  Username
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow 
                    key={user._id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td 
                      className="px-5 py-4 sm:px-6 text-start"
                      onClick={() => handleRowClick(user)}
                    >
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.username}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(user)}
                    >
                      <Badge size="sm" color={getRoleColor(user.role) as any}>
                        {user.role}
                      </Badge>
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={2}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found matching your filters.
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
              {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span>{" "}
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
        message="User deleted successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

