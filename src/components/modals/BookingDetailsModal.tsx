import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon } from "../../icons";

interface Booking {
  _id: string;
  customer_name: string;
  customer_email: string;
  staff_name: string;
  service_name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  is_free_appointment?: boolean;
  original_price?: number;
}

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onEdit: (bookingId: string) => void;
  onDelete: (bookingId: string) => void;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  onEdit,
  onDelete,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const handleEdit = () => {
    onEdit(booking._id);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      onDelete(booking._id);
      onClose();
    }
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[900px] p-6 lg:p-10"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Booking Details
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage booking information
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Customer Name
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {booking.customer_name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Customer Email
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {booking.customer_email}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Staff
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {booking.staff_name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Service
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {booking.service_name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {booking.date}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {booking.time}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </span>
            <Badge size="sm" color={getStatusColor(booking.status) as any}>
              {booking.status}
            </Badge>
          </div>

          {booking.is_free_appointment && (
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type
              </span>
              <Badge size="sm" color="success">
                Free Appointment
              </Badge>
            </div>
          )}

          {booking.original_price !== undefined && booking.is_free_appointment && (
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Original Price
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                RM {booking.original_price} (Free)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            variant="primary"
            size="sm"
            startIcon={<TrashBinIcon className="h-4 w-4" />}
            onClick={handleDelete}
            className="bg-error-500 hover:bg-error-600 text-white !px-4 !py-3"
          >
            Delete
          </Button>
          <Button
            variant="primary"
            size="sm"
            startIcon={<PencilIcon className="h-4 w-4" />}
            onClick={handleEdit}
            className="!px-4 !py-3"
          >
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

