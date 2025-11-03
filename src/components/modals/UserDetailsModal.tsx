import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { User } from "../tables/Users/UserTable";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onEdit,
  onDelete,
}: UserDetailsModalProps) {
  if (!user) return null;

  const handleEdit = () => {
    onEdit(user._id);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDelete(user._id);
      onClose();
    }
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "error" : "success";
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
            User Details
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage user information
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {user.username}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </span>
            <Badge size="sm" color={getRoleColor(user.role) as any}>
              {user.role}
            </Badge>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Hash
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono max-w-md truncate">
              {user.password_hash}
            </span>
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

