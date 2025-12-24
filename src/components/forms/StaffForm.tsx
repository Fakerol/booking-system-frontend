import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { createStaff } from "../../services/staff";

interface StaffFormData {
  name: string;
  phone: string;
  email: string;
  position: string;
  is_active: boolean;
}

export default function StaffForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    phone: "",
    email: "",
    position: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

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

    setIsSubmitting(true);

    try {
      // Prepare payload - only include fields that have values
      const payload: {
        name: string;
        phone?: string;
        email?: string;
        position?: string;
        is_active?: boolean;
      } = {
        name: formData.name.trim(),
      };

      // Add optional fields only if they have values
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

      const response = await createStaff(payload);

      if (response.success && response.data) {
        setToastMessage("Staff created successfully!");
        setToastType("success");
        setShowToast(true);
        
        // Navigate after showing toast
        setTimeout(() => {
          navigate("/staff");
        }, 2000);
      } else {
        // Handle API errors - response is ApiError type
        const errorResponse = response as { success: false; message: string; errors?: Record<string, string[]> };
        let errorMessage = errorResponse.message || "Failed to create staff";
        
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
      console.error("Error creating staff:", error);
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastType("error");
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/staff");
  };

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <ComponentCard title="Create New Staff">
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

          {/* Status */}
          <div>
            <Label htmlFor="is_active">Status</Label>
            <select
              id="is_active"
              name="is_active"
              value={formData.is_active ? 1 : 0}
              onChange={(e) => handleInputChange("is_active", parseInt(e.target.value, 10) === 1)}
              className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                errors.is_active
                  ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
                  : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
              }`}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            {errors.is_active && (
              <p className="mt-1.5 text-xs text-error-500">{errors.is_active}</p>
            )}
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
            {isSubmitting ? "Creating..." : "Create Staff"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

