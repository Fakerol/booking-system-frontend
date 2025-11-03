import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Staff } from "../tables/Staff/StaffTable";

interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onEdit: (staffId: string) => void;
  onDelete: (staffId: string) => void;
}

const dayLabels: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export default function StaffDetailsModal({
  isOpen,
  onClose,
  staff,
  onEdit,
  onDelete,
}: StaffDetailsModalProps) {
  if (!staff) return null;

  const handleEdit = () => {
    onEdit(staff._id);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      onDelete(staff._id);
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
            Staff Details
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage staff information
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Staff Name
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {staff.name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Working Hours
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {staff.start_time} - {staff.end_time}
            </span>
          </div>

          <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Days ({staff.available_days.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {staff.available_days.map((day) => (
                <Badge key={day} size="sm" color="info">
                  {dayLabels[day]}
                </Badge>
              ))}
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

