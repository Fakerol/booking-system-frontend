import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Toast from "../ui/toast/Toast";
import { getStaffById, deleteStaff, StaffData } from "../../services/staff";

export default function StaffDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [staff, setStaff] = useState<StaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchStaff = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        
        const response = await getStaffById(id);
        
        if (response.success && response.data) {
          setStaff(response.data.staff);
        } else {
          setError(response.message || "Staff not found");
        }
        
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/staff/edit/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const response = await deleteStaff(id);
        
        if (response.success) {
          setToastMessage(response.message || "Staff deleted successfully!");
          setToastType("success");
          setShowToast(true);
          setTimeout(() => {
            navigate("/staff");
          }, 2000);
        } else {
          setToastMessage(response.message || "Failed to delete staff");
          setToastType("error");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        setToastMessage("An unexpected error occurred. Please try again.");
        setToastType("error");
        setShowToast(true);
      }
    }
  };

  const handleBack = () => {
    navigate("/staff");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Staff Details">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading staff details...</p>
        </div>
      </ComponentCard>
    );
  }

  if (error || !staff) {
    return (
      <ComponentCard title="Staff Details">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-500 dark:text-red-400">{error || "Staff not found"}</p>
          <Button variant="outline" onClick={handleBack}>
            Back to Staff
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
      <ComponentCard title="Staff Details">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Staff Information
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View staff details and information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Staff Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={staff.name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={staff.phone}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={staff.email}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                type="text"
                value={staff.position}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <div className="mt-2">
                <Badge 
                  size="sm" 
                  color={staff.status_label.toLowerCase() === "active" ? "success" : "error"}
                >
                  {staff.status_label}
                </Badge>
              </div>
            </div>
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

