import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { getStaffById, updateStaff } from "../../services/staff";

interface StaffFormData {
  name: string;
  phone: string;
  email: string;
  position: string;
  is_active: boolean;
}

export default function EditStaffForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    phone: "",
    email: "",
    position: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Load staff data on mount
  useEffect(() => {
    const fetchStaff = async () => {
      if (id) {
        setIsLoading(true);
        const response = await getStaffById(id);
        
        if (response.success && response.data) {
          const staff = response.data.staff;
          setFormData({
            name: staff.name,
            phone: staff.phone || "",
            email: staff.email || "",
            position: staff.position || "",
            is_active: staff.is_active,
          });
        }
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StaffFormData, string>> = {};

    // Name is required (max 255 characters)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 255) {
      newErrors.name = "Name must be less than 255 characters";
    }

    // Phone is optional, but if provided, validate format
    if (formData.phone.trim() && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    } else if (formData.phone.length > 20) {
      newErrors.phone = "Phone number must be less than 20 characters";
    }

    // Email is optional, but if provided, validate format
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Position is optional, but if provided, validate length
    if (formData.position.trim() && formData.position.length > 255) {
      newErrors.position = "Position must be less than 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof StaffFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!id) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload - only include fields that have values
      const payload: {
        name?: string;
        phone?: string;
        email?: string;
        position?: string;
        is_active?: boolean;
      } = {};

      if (formData.name.trim()) {
        payload.name = formData.name.trim();
      }
      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }
      if (formData.email.trim()) {
        payload.email = formData.email.trim();
      }
      if (formData.position.trim()) {
        payload.position = formData.position.trim();
      }
      if (formData.is_active !== undefined) {
        payload.is_active = formData.is_active;
      }

      const response = await updateStaff(id, payload);

      if (response.success && response.data) {
        setToastMessage("Staff updated successfully!");
        setToastType("success");
        setShowToast(true);
        
        // Navigate after showing toast
        setTimeout(() => {
          navigate("/staff");
        }, 2000);
      } else {
        // Handle API errors - response is ApiError type
        const errorResponse = response as { success: false; message: string; errors?: Record<string, string[]> };
        let errorMessage = errorResponse.message || "Failed to update staff";
        
        // Check if there are field-specific errors
        if (errorResponse.errors) {
          const fieldErrors = Object.entries(errorResponse.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; ");
          errorMessage = fieldErrors || errorMessage;
        }

        setErrors({
          ...errors,
          name: errorResponse.errors?.name?.[0] || undefined,
          email: errorResponse.errors?.email?.[0] || undefined,
          phone: errorResponse.errors?.phone?.[0] || undefined,
          position: errorResponse.errors?.position?.[0] || undefined,
        });

        setToastMessage(errorMessage);
        setToastType("error");
        setShowToast(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastType("error");
      setShowToast(true);
      setIsSubmitting(false);
    }
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
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
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

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={!!errors.phone}
              hint={errors.phone}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              hint={errors.email}
            />
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              type="text"
              placeholder="Enter position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              error={!!errors.position}
              hint={errors.position}
            />
          </div>

          {/* Active Status */}
          <div>
            <Label htmlFor="is_active">Status</Label>
            <div className="mt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Active
                </span>
              </label>
            </div>
          </div>
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

