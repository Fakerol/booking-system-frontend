import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Staff } from "../tables/Staff/StaffTable";
import Toast from "../ui/toast/Toast";

const dayLabels: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

import { staffData } from "../tables/Staff/StaffTable";

// Mock function to fetch staff by ID
const fetchStaffById = (id: string): Staff | null => {
  return staffData.find((s: Staff) => s._id === id) || null;
};

export default function StaffDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (id) {
      const foundStaff = fetchStaffById(id);
      if (foundStaff) {
        setStaff(foundStaff);
      } else {
        setError("Staff not found");
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/staff/edit/${id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setToastMessage("Staff deleted successfully!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/staff");
      }, 2000);
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
              <Label htmlFor="working_hours">Working Hours</Label>
              <Input
                id="working_hours"
                name="working_hours"
                type="text"
                value={`${staff.start_time} - ${staff.end_time}`}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="available_days">Available Days ({staff.available_days.length})</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {staff.available_days.map((day) => (
                  <Badge key={day} size="sm" color="info">
                    {dayLabels[day]}
                  </Badge>
                ))}
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

