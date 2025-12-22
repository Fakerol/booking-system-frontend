import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Service } from "../tables/Services/ServiceTable";
import Toast from "../ui/toast/Toast";

import { serviceData } from "../tables/Services/ServiceTable";

// Mock function to fetch service by ID
const fetchServiceById = (id: string): Service | null => {
  return serviceData.find((s: Service) => s._id === id) || null;
};

export default function ServiceDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (id) {
      const foundService = fetchServiceById(id);
      if (foundService) {
        setService(foundService);
      } else {
        setError("Service not found");
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/services/edit/${id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setToastMessage("Service deleted successfully!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/services");
      }, 2000);
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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={service.duration_minutes}
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
                value={`RM ${service.price}`}
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
      </ComponentCard>
    </>
  );
}

