import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Link } from "react-router";

// Define the TypeScript interface for the table rows
interface Booking {
  id: number;
  customer_name: string;
  service_name: string;
  staff_name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

// Define the table data using the interface
const tableData: Booking[] = [
  {
    id: 1,
    customer_name: "John Doe",
    service_name: "Haircut",
    staff_name: "Ahmad",
    date: "2025-01-15",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: 2,
    customer_name: "Jane Smith",
    service_name: "Hair Color",
    staff_name: "Sarah",
    date: "2025-01-15",
    time: "11:30",
    status: "pending",
  },
  {
    id: 3,
    customer_name: "Bob Johnson",
    service_name: "Hair Styling",
    staff_name: "Mike",
    date: "2025-01-16",
    time: "14:00",
    status: "completed",
  },
  {
    id: 4,
    customer_name: "Alice Williams",
    service_name: "Beard Trim",
    staff_name: "David",
    date: "2025-01-16",
    time: "15:30",
    status: "cancelled",
  },
  {
    id: 5,
    customer_name: "Charlie Brown",
    service_name: "Haircut",
    staff_name: "Ahmad",
    date: "2025-01-17",
    time: "09:00",
    status: "confirmed",
  },
];

export default function RecentBookings() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "primary";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Bookings
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            See all
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Service
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Staff
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date & Time
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((booking) => (
              <TableRow key={booking.id} className="">
                <TableCell className="py-3">
                  <div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {booking.customer_name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {booking.service_name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {booking.staff_name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div>
                    <p className="font-medium">{booking.date}</p>
                    <p className="text-xs text-gray-400">{booking.time}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={getStatusColor(booking.status) as any}
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

