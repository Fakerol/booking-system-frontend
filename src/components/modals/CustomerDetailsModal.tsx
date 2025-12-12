import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Customer } from "../tables/Customers/CustomerTable";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit: (customerId: string) => void;
  onDelete: (customerId: string) => void;
}

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
  onEdit,
  onDelete,
}: CustomerDetailsModalProps) {
  if (!customer) return null;

  const handleEdit = () => {
    onEdit(customer._id);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      onDelete(customer._id);
      onClose();
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
            Customer Details
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage customer information
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {customer.first_name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {customer.last_name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {customer.email}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {customer.phone}
            </span>
          </div>

          {/* Loyalty Program Section */}
          <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Loyalty Status
              </span>
              {customer.free_appointment_available && (
                <Badge color="success" size="sm">
                  Free Appointment Available
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Completed Bookings
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customer.completed_bookings_count} / 10
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div
                  className="h-full bg-brand-500 transition-all"
                  style={{
                    width: `${Math.min((customer.completed_bookings_count / 10) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Free Appointments Used
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customer.total_free_appointments_used}
                </span>
              </div>
            </div>
          </div>
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

