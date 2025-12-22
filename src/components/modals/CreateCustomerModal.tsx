import { useState, FormEvent } from "react";
import { Modal } from "../ui/modal";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { Customer } from "../tables/Customers/CustomerTable";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
}

interface CustomerFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export default function CreateCustomerModal({
  isOpen,
  onClose,
  onCustomerCreated,
}: CreateCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
      // Generate a new customer ID (in real app, this would come from the API)
      const newCustomer: Customer = {
        _id: Date.now().toString(), // Temporary ID
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
        completed_bookings_count: 0,
        free_appointment_available: false,
        total_free_appointments_used: 0,
      };

      console.log("Customer created:", newCustomer);
      
      setIsSubmitting(false);
      setShowToast(true);
      
      // Call the callback with the new customer
      setTimeout(() => {
        onCustomerCreated(newCustomer);
        setShowToast(false);
        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
        });
        setErrors({});
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <>
      <Toast
        message="Customer created successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Create New Customer
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a new customer to the system
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* First Name */}
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  error={!!errors.first_name}
                  hint={errors.first_name}
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  error={!!errors.last_name}
                  hint={errors.last_name}
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={!!errors.phone}
                  hint={errors.phone}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
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
        </div>
      </Modal>
    </>
  );
}



