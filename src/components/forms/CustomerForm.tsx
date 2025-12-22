import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { createCustomer } from "../../services/customers";

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  status: number;
}

export default function CustomerForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    status: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
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
        status?: number;
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
      if (formData.status !== undefined) {
        payload.status = formData.status;
      }

      const response = await createCustomer(payload);

      if (response.success && response.data) {
        setToastMessage("Customer created successfully!");
        setToastType("success");
        setShowToast(true);
        
        // Navigate after showing toast
        setTimeout(() => {
          navigate("/customers");
        }, 2000);
      } else {
        // Handle API errors - response is ApiError type
        const errorResponse = response as { success: false; message: string; errors?: Record<string, string[]> };
        let errorMessage = errorResponse.message || "Failed to create customer";
        
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
        });

        setToastMessage(errorMessage);
        setToastType("error");
        setShowToast(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastType("error");
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <ComponentCard title="Create New Customer">
        <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              hint={errors.name}
              maxLength={255}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number (optional)"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={!!errors.phone}
              hint={errors.phone}
              maxLength={20}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address (optional)"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              hint={errors.email}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", parseInt(e.target.value, 10))}
              className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors ${
                errors.status
                  ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                  : "border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              } focus:outline-none focus:ring-2`}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1.5 text-xs text-error-500">{errors.status}</p>
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
            {isSubmitting ? "Creating..." : "Create Customer"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

