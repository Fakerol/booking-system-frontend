import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Service } from "../tables/Services/ServiceTable";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onEdit: (serviceId: string) => void;
  onDelete: (serviceId: string) => void;
}

export default function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  onEdit,
  onDelete,
}: ServiceDetailsModalProps) {
  if (!service) return null;

  const handleEdit = () => {
    onEdit(service._id);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      onDelete(service._id);
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
            Service Details
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage service information
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Service Name
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {service.name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {service.duration_minutes} minutes
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Price
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              ${service.price}
            </span>
          </div>

          <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
            <span className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Images ({service.images.length})
            </span>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {service.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`${service.name} ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                </div>
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

