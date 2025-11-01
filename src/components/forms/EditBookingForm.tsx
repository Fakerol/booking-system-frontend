import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { Booking } from "../tables/Bookings/BookingTable";

interface BookingFormData {
  customer_name: string;
  customer_email: string;
  staff_name: string;
  service_name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

// Mock function to fetch booking by ID
const fetchBookingById = (id: string): Booking | null => {
  // In a real app, this would fetch from an API
  // For now, we'll simulate fetching from the generated data
  const staffNames = ["Ahmad", "Sarah", "Mike", "Emma", "David"];
  const services = ["Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo"];
  
  // Generate a mock booking based on ID
  return {
    _id: id,
    customer_name: "John Doe",
    customer_email: "john@example.com",
    staff_name: staffNames[parseInt(id) % staffNames.length],
    service_name: services[parseInt(id) % services.length],
    date: "2025-01-15",
    time: "10:00",
    status: "confirmed",
  };
};

export default function EditBookingForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: "",
    customer_email: "",
    staff_name: "",
    service_name: "",
    date: "",
    time: "",
    status: "pending",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Load booking data on mount
  useEffect(() => {
    if (id) {
      const booking = fetchBookingById(id);
      if (booking) {
        setFormData({
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          staff_name: booking.staff_name,
          service_name: booking.service_name,
          date: booking.date,
          time: booking.time,
          status: booking.status,
        });
      }
      setIsLoading(false);
    }
  }, [id]);

  // Mock data for staff and services
  const staffOptions = [
    { value: "", label: "Select Staff" },
    { value: "Ahmad", label: "Ahmad" },
    { value: "Sarah", label: "Sarah" },
    { value: "Mike", label: "Mike" },
    { value: "Emma", label: "Emma" },
    { value: "David", label: "David" },
  ];

  const serviceOptions = [
    { value: "", label: "Select Service" },
    { value: "Haircut", label: "Haircut" },
    { value: "Hair Color", label: "Hair Color" },
    { value: "Hair Styling", label: "Hair Styling" },
    { value: "Beard Trim", label: "Beard Trim" },
    { value: "Shampoo", label: "Shampoo" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Available time slots
  const timeOptions = [
    { value: "", label: "Select Time" },
    { value: "09:00", label: "09:00" },
    { value: "09:30", label: "09:30" },
    { value: "10:00", label: "10:00" },
    { value: "10:30", label: "10:30" },
    { value: "11:00", label: "11:00" },
    { value: "11:30", label: "11:30" },
    { value: "12:00", label: "12:00" },
    { value: "12:30", label: "12:30" },
    { value: "13:00", label: "13:00" },
    { value: "13:30", label: "13:30" },
    { value: "14:00", label: "14:00" },
    { value: "14:30", label: "14:30" },
    { value: "15:00", label: "15:00" },
    { value: "15:30", label: "15:30" },
    { value: "16:00", label: "16:00" },
    { value: "16:30", label: "16:30" },
    { value: "17:00", label: "17:00" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "Customer email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Please enter a valid email address";
    }

    if (!formData.staff_name) {
      newErrors.staff_name = "Please select a staff member";
    }

    if (!formData.service_name) {
      newErrors.service_name = "Please select a service";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Please select a date today or in the future";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
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
      console.log("Booking updated:", formData);
      
      // Here you would typically make an API call to update the booking
      setIsSubmitting(false);
      setShowToast(true);
      
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/bookings");
      }, 3100);
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/bookings");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Edit Booking">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message="Booking updated successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Edit Booking">
        <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Customer Name */}
          <div>
            <Label htmlFor="customer_name">Customer Name *</Label>
            <Input
              id="customer_name"
              name="customer_name"
              type="text"
              placeholder="Enter customer name"
              value={formData.customer_name}
              onChange={(e) => handleInputChange("customer_name", e.target.value)}
              error={!!errors.customer_name}
              hint={errors.customer_name}
            />
          </div>

          {/* Customer Email */}
          <div>
            <Label htmlFor="customer_email">Customer Email *</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              placeholder="Enter customer email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange("customer_email", e.target.value)}
              error={!!errors.customer_email}
              hint={errors.customer_email}
            />
          </div>

          {/* Staff Selection */}
          <div>
            <Label htmlFor="staff_name">Staff *</Label>
            <Select
              options={staffOptions}
              placeholder="Select Staff"
              onChange={(value) => handleInputChange("staff_name", value)}
              defaultValue={formData.staff_name}
            />
            {errors.staff_name && (
              <p className="mt-1.5 text-xs text-error-500">{errors.staff_name}</p>
            )}
          </div>

          {/* Service Selection */}
          <div>
            <Label htmlFor="service_name">Service *</Label>
            <Select
              options={serviceOptions}
              placeholder="Select Service"
              onChange={(value) => handleInputChange("service_name", value)}
              defaultValue={formData.service_name}
            />
            {errors.service_name && (
              <p className="mt-1.5 text-xs text-error-500">{errors.service_name}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <DatePicker
              id="edit-booking-date"
              label="Date *"
              placeholder="Select a date"
              defaultDate={formData.date || undefined}
              minDate={new Date().toISOString().split("T")[0]}
              onChange={(_, dateStr) => {
                if (dateStr) {
                  handleInputChange("date", dateStr);
                }
                // Clear error when date is selected
                if (errors.date) {
                  setErrors((prev) => ({ ...prev, date: undefined }));
                }
              }}
            />
            {errors.date && (
              <p className="mt-1.5 text-xs text-error-500">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <Label htmlFor="time">Time *</Label>
            <Select
              options={timeOptions}
              placeholder="Select Time"
              onChange={(value) => handleInputChange("time", value)}
              defaultValue={formData.time}
            />
            {errors.time && (
              <p className="mt-1.5 text-xs text-error-500">{errors.time}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              options={statusOptions}
              placeholder="Select Status"
              onChange={(value) => handleInputChange("status", value as BookingFormData["status"])}
              defaultValue={formData.status}
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
            {isSubmitting ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

