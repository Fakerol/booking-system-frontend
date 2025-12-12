import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import Badge from "../ui/badge/Badge";
import { Customer } from "../tables/Customers/CustomerTable";

interface CustomerFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  completed_bookings_count: number;
  free_appointment_available: boolean;
  total_free_appointments_used: number;
}

// Mock function to fetch customer by ID
const fetchCustomerById = (id: string): Customer | null => {
  // In a real app, this would fetch from an API
  const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];
  
  // Generate a mock customer based on ID
  const idx = parseInt(id) % firstNames.length;
  const completedBookings = Math.floor(Math.random() * 15);
  const freeAppointmentAvailable = completedBookings >= 10;
  
  return {
    _id: id,
    first_name: firstNames[idx],
    last_name: lastNames[idx],
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: `${firstNames[idx].toLowerCase()}.${lastNames[idx].toLowerCase()}@example.com`,
    completed_bookings_count: completedBookings,
    free_appointment_available: freeAppointmentAvailable,
    total_free_appointments_used: Math.floor(completedBookings / 10),
  };
};

export default function EditCustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    completed_bookings_count: 0,
    free_appointment_available: false,
    total_free_appointments_used: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Load customer data on mount
  useEffect(() => {
    if (id) {
      const customer = fetchCustomerById(id);
      if (customer) {
        setFormData({
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone,
          email: customer.email,
          completed_bookings_count: customer.completed_bookings_count,
          free_appointment_available: customer.free_appointment_available,
          total_free_appointments_used: customer.total_free_appointments_used,
        });
      }
      setIsLoading(false);
    }
  }, [id]);

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
      console.log("Customer updated:", formData);
      
      // Here you would typically make an API call to update the customer
      setIsSubmitting(false);
      setShowToast(true);
      
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/customers");
      }, 3100);
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Edit Customer">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message="Customer updated successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Edit Customer">
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

        {/* Loyalty Information (Read-only) */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Loyalty Program Status
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Completed Bookings</Label>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formData.completed_bookings_count} / 10
                  </span>
                  {formData.free_appointment_available && (
                    <Badge color="success" size="sm">
                      Free Available
                    </Badge>
                  )}
                </div>
                <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                  <div
                    className="h-full bg-brand-500 transition-all"
                    style={{
                      width: `${Math.min((formData.completed_bookings_count / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Free Appointments Used</Label>
              <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                {formData.total_free_appointments_used}
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <div className="mt-2">
                {formData.free_appointment_available ? (
                  <Badge color="success" size="sm">
                    Eligible for Free Appointment
                  </Badge>
                ) : (
                  <Badge color="info" size="sm">
                    {10 - formData.completed_bookings_count} more bookings needed
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Note: Loyalty information is automatically updated when bookings are completed. This information is read-only.
          </p>
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
            {isSubmitting ? "Updating..." : "Update Customer"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

