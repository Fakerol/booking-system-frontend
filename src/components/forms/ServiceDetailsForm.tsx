import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Toast from "../ui/toast/Toast";
import { getServiceById, deleteService, ServiceData } from "../../services/services";

export default function ServiceDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchService = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        
        const response = await getServiceById(id);
        
        if (response.success && response.data) {
          setService(response.data.service);
        } else {
          setError(response.message || "Service not found");
        }
        
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/services/edit/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      setToastMessage("Service ID is missing");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await deleteService(id);

      if (response.success) {
        setToastMessage(response.data?.message || "Service deleted successfully!");
        setToastType("success");
        setShowToast(true);
        
        // Navigate after showing toast
        setTimeout(() => {
          navigate("/services");
        }, 2000);
      } else {
        setToastMessage(response.message || "Failed to delete service");
        setToastType("error");
        setShowToast(true);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastType("error");
      setShowToast(true);
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    navigate("/services");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Service Details">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading service details...</p>
        </div>
      </ComponentCard>
    );
  }

  if (error || !service) {
    return (
      <ComponentCard title="Service Details">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-500 dark:text-red-400">{error || "Service not found"}</p>
          <Button variant="outline" onClick={handleBack}>
            Back to Services
          </Button>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <ComponentCard title="Service Details">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Service Information
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View service details and information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={service.name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="text"
                value={service.duration_formatted}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="text"
                value={service.price_formatted}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                type="text"
                value={service.category}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="text"
                value={service.status_label}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            {service.description && (
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={service.description}
                  readOnly
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 cursor-not-allowed"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              startIcon={<TrashBinIcon className="h-4 w-4" />}
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-error-500 hover:bg-error-600 text-white !px-4 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
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
      </ComponentCard>
    </>
  );
}

