import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { Staff } from "../tables/Staff/StaffTable";

interface StaffFormData {
  name: string;
  available_days: string[];
  start_time: string;
  end_time: string;
}

// Mock function to fetch staff by ID
const fetchStaffById = (id: string): Staff | null => {
  // In a real app, this would fetch from an API
  const names = ["Ahmad", "Sarah", "Mike", "Emma", "David"];
  const allDays = ["mon", "tue", "wed", "thu", "fri"];
  
  // Generate a mock staff based on ID
  const idx = parseInt(id) % names.length;
  return {
    _id: id,
    name: names[idx],
    available_days: allDays.slice(0, idx + 3).sort(),
    start_time: "09:00",
    end_time: "18:00",
  };
};

const dayOptions = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

export default function EditStaffForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    available_days: [],
    start_time: "09:00",
    end_time: "18:00",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Load staff data on mount
  useEffect(() => {
    if (id) {
      const staff = fetchStaffById(id);
      if (staff) {
        setFormData({
          name: staff.name,
          available_days: staff.available_days,
          start_time: staff.start_time,
          end_time: staff.end_time,
        });
      }
      setIsLoading(false);
    }
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StaffFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Staff name is required";
    }

    if (formData.available_days.length === 0) {
      newErrors.available_days = "Please select at least one available day";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    }

    // Validate that end time is after start time
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      if (end <= start) {
        newErrors.end_time = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Omit<StaffFormData, "available_days">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const isSelected = prev.available_days.includes(day);
      const newDays = isSelected
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day].sort();
      return { ...prev, available_days: newDays };
    });
    // Clear error when day is selected
    if (errors.available_days) {
      setErrors((prev) => ({ ...prev, available_days: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Staff updated:", formData);
      
      // Here you would typically make an API call to update the staff
      setIsSubmitting(false);
      setShowToast(true);
      
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/staff");
      }, 3100);
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/staff");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Edit Staff">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message="Staff updated successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Edit Staff">
        <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Staff Name */}
          <div>
            <Label htmlFor="name">Staff Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              hint={errors.name}
            />
          </div>

          {/* Start Time */}
          <div>
            <Label htmlFor="start_time">Start Time *</Label>
            <Input
              id="start_time"
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => handleInputChange("start_time", e.target.value)}
              error={!!errors.start_time}
              hint={errors.start_time}
            />
          </div>

          {/* End Time */}
          <div>
            <Label htmlFor="end_time">End Time *</Label>
            <Input
              id="end_time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => handleInputChange("end_time", e.target.value)}
              error={!!errors.end_time}
              hint={errors.end_time}
            />
          </div>
        </div>

        {/* Available Days */}
        <div>
          <Label>Available Days *</Label>
          <div className="mt-2 space-y-2">
            {dayOptions.map((day) => (
              <label
                key={day.value}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.available_days.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {day.label}
                </span>
              </label>
            ))}
          </div>
          {errors.available_days && (
            <p className="mt-1.5 text-xs text-error-500">{errors.available_days}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Staff"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

