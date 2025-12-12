import { useState, FormEvent, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import Badge from "../ui/badge/Badge";
import { Customer } from "../tables/Customers/CustomerTable";
import { Booking } from "../tables/Bookings/BookingTable";
import SearchableSelect from "../form/SearchableSelect";
import CreateCustomerModal from "../modals/CreateCustomerModal";

interface BookingFormData {
  customer_name: string;
  customer_email: string;
  staff_name: string;
  service_name: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  is_free_appointment: boolean;
}

// Mock function to get all customers (in real app, this would be an API call)
const getAllCustomers = (): Customer[] => {
  // Import customer data generation logic
  const firstNames = [
    "John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Edward", "Fiona",
    "George", "Hannah", "Isaac", "Julia", "Kevin", "Lisa", "Michael", "Nancy",
    "Oliver", "Patricia", "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor",
    "Wendy", "Xavier", "Yara", "Zoe", "Adam", "Bella"
  ];

  const lastNames = [
    "Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker"
  ];

  const customers: Customer[] = [];
  
  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    
    // Generate random loyalty data
    const completedBookings = Math.floor(Math.random() * 15);
    const freeAppointmentAvailable = completedBookings >= 10;
    
    customers.push({
      _id: (i + 1).toString(),
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email,
      completed_bookings_count: completedBookings,
      free_appointment_available: freeAppointmentAvailable,
      total_free_appointments_used: Math.floor(completedBookings / 10),
    });
  }

  return customers;
};

// Mock function to get customer by email
const getCustomerByEmail = (email: string): Customer | null => {
  const customers = getAllCustomers();
  return customers.find(c => c.email === email) || null;
};


// Mock function to get service price
const getServicePrice = (serviceName: string): number => {
  const servicePrices: Record<string, number> = {
    "Haircut": 25,
    "Hair Color": 50,
    "Hair Styling": 35,
    "Beard Trim": 15,
    "Shampoo": 20,
  };
  return servicePrices[serviceName] || 0;
};

// Mock function to get service duration
const getServiceDuration = (serviceName: string): number => {
  const serviceDurations: Record<string, number> = {
    "Haircut": 30,
    "Hair Color": 90,
    "Hair Styling": 60,
    "Beard Trim": 15,
    "Shampoo": 20,
  };
  return serviceDurations[serviceName] || 30; // Default to 30 minutes
};

// Mock function to generate dummy bookings (same as in BookingTable)
const generateDummyBookings = (): Booking[] => {
  const staffNames = ["Ahmad", "Sarah", "Mike", "Emma", "David"];
  const services = ["Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo"];
  const statuses: ("confirmed" | "pending" | "cancelled" | "completed")[] = [
    "confirmed", "pending", "cancelled", "completed"
  ];
  const times = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const bookings: Booking[] = [];
  const today = new Date();
  const dates: string[] = [];
  for (let i = -30; i <= 15; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  for (let i = 0; i < 50; i++) {
    const randomDateIndex = Math.floor(Math.random() * dates.length);
    const randomTimeIndex = Math.floor(Math.random() * times.length);
    const randomStatusIndex = Math.floor(Math.random() * statuses.length);
    const randomStaffIndex = Math.floor(Math.random() * staffNames.length);
    const randomServiceIndex = Math.floor(Math.random() * services.length);
    
    bookings.push({
      _id: (i + 1).toString(),
      customer_name: `Customer ${i + 1}`,
      customer_email: `customer${i + 1}@example.com`,
      staff_name: staffNames[randomStaffIndex],
      service_name: services[randomServiceIndex],
      date: dates[randomDateIndex],
      time: times[randomTimeIndex],
      status: statuses[randomStatusIndex],
      is_free_appointment: false,
    });
  }

  return bookings;
};

// Mock function to get existing bookings (in real app, this would be an API call)
const getExistingBookings = (staffName: string, date: string): Booking[] => {
  // In a real app, this would be: GET /api/bookings?staff={staffName}&date={date}&status=confirmed,pending
  const allBookings = generateDummyBookings();
  
  return allBookings.filter(
    (booking: Booking) =>
      booking.staff_name === staffName &&
      booking.date === date &&
      (booking.status === "confirmed" || booking.status === "pending")
  );
};

// Convert time string (HH:MM) to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Check if a time slot is available
const isTimeSlotAvailable = (
  timeSlot: string,
  serviceDuration: number,
  existingBookings: Booking[]
): boolean => {
  const slotStart = timeToMinutes(timeSlot);
  const slotEnd = slotStart + serviceDuration;

  // Check against all existing bookings
  for (const booking of existingBookings) {
    const bookingStart = timeToMinutes(booking.time);
    // Get service duration for existing booking
    const bookingDuration = getServiceDuration(booking.service_name);
    const bookingEnd = bookingStart + bookingDuration;

    // Check for overlap: new slot overlaps if it starts before existing ends AND ends after existing starts
    if (slotStart < bookingEnd && slotEnd > bookingStart) {
      return false; // Time slot is blocked
    }
  }

  return true; // Time slot is available
};

// Get all available time slots
const getAvailableTimeSlots = (
  staffName: string,
  date: string,
  serviceDuration: number
): string[] => {
  // All possible time slots (9:00 AM to 5:00 PM, every 30 minutes)
  const allTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // Get existing bookings for this staff and date
  const existingBookings = getExistingBookings(staffName, date);

  // Filter time slots that are available
  return allTimeSlots.filter((timeSlot) => {
    // Check if the service would end before closing time (5:30 PM)
    const slotStart = timeToMinutes(timeSlot);
    const slotEnd = slotStart + serviceDuration;
    const closingTime = timeToMinutes("17:30"); // 5:30 PM closing

    // Check if service fits within business hours
    if (slotEnd > closingTime) {
      return false;
    }

    // Check if time slot conflicts with existing bookings
    return isTimeSlotAvailable(timeSlot, serviceDuration, existingBookings);
  });
};

export default function BookingForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: "",
    customer_email: "",
    staff_name: "",
    service_name: "",
    date: "",
    time: "",
    status: "pending",
    is_free_appointment: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);

  // State to track customers (will be updated when new customer is created)
  const [customers, setCustomers] = useState<Customer[]>(() => getAllCustomers());

  // Get all customers for the searchable dropdown
  const allCustomers = useMemo(() => customers, [customers]);

  // Customer options for searchable select
  const customerOptions = useMemo(() => {
    return allCustomers.map((customer) => ({
      value: customer._id,
      label: `${customer.first_name} ${customer.last_name}`,
      searchText: `${customer.email} • ${customer.phone}`,
    }));
  }, [allCustomers]);

  // Handle new customer creation
  const handleCustomerCreated = (newCustomer: Customer) => {
    // Add new customer to the list
    setCustomers((prev) => [...prev, newCustomer]);
    // Auto-select the newly created customer
    handleCustomerSelect(newCustomer._id);
  };

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = allCustomers.find(c => c._id === customerId);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        customer_email: customer.email,
      }));
      // Set customer data immediately when selected from dropdown
      setCustomerData(customer);
    }
  };

  // Check customer loyalty status when email changes (for manual email entry)
  // Only update if customerData doesn't match the email (to avoid overriding dropdown selection)
  useEffect(() => {
    if (formData.customer_email) {
      // Check if current customerData matches the email - if it does, don't override
      if (customerData && customerData.email === formData.customer_email) {
        return; // Customer data already matches, don't override
      }
      
      // Try to find customer from the current customers list first
      const customer = allCustomers.find(c => c.email === formData.customer_email);
      if (customer) {
        setCustomerData(customer);
      } else {
        // Fallback to getCustomerByEmail if not found in current list
        const customerFromEmail = getCustomerByEmail(formData.customer_email);
        if (customerFromEmail) {
          setCustomerData(customerFromEmail);
        } else {
          // If no customer found, clear customerData
          setCustomerData(null);
        }
      }
    } else {
      setCustomerData(null);
    }
  }, [formData.customer_email, allCustomers, customerData]);

  // Calculate booking price
  const bookingPrice = useMemo(() => {
    if (!formData.service_name) return 0;
    const servicePrice = getServicePrice(formData.service_name);
    if (formData.is_free_appointment && customerData?.free_appointment_available) {
      return 0;
    }
    return servicePrice;
  }, [formData.service_name, formData.is_free_appointment, customerData]);

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

  // Get available time slots based on selected staff, date, and service
  const availableTimeSlots = useMemo(() => {
    if (!formData.staff_name || !formData.date || !formData.service_name) {
      return [{ value: "", label: "Select Time" }];
    }

    const serviceDuration = getServiceDuration(formData.service_name);
    const availableSlots = getAvailableTimeSlots(
      formData.staff_name,
      formData.date,
      serviceDuration
    );

    return [
      { value: "", label: "Select Time" },
      ...availableSlots.map((time) => ({
        value: time,
        label: time,
      })),
    ];
  }, [formData.staff_name, formData.date, formData.service_name]);

  // Reset time selection when date, staff, or service changes
  useEffect(() => {
    if (formData.time) {
      // Check if current selected time is still available
      const isStillAvailable = availableTimeSlots.some(
        (slot) => slot.value === formData.time
      );
      if (!isStillAvailable) {
        setFormData((prev) => ({ ...prev, time: "" }));
      }
    }
  }, [formData.staff_name, formData.date, formData.service_name, availableTimeSlots]);

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
      const bookingData = {
        ...formData,
        original_price: formData.is_free_appointment ? getServicePrice(formData.service_name) : bookingPrice,
      };
      console.log("Booking created:", bookingData);
      
      // Here you would typically make an API call to create the booking
      // If free appointment is used, you would also update customer's free_appointment_available flag
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

  return (
    <>
      <Toast
        message="Booking created successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Create New Booking">
        <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Customer Selection - Searchable Dropdown */}
          <div>
            <Label htmlFor="customer_select">Customer *</Label>
            <SearchableSelect
              options={customerOptions}
              placeholder="Search customer by name, email, or phone..."
              searchPlaceholder="Search customers..."
              onChange={handleCustomerSelect}
              defaultValue=""
              onAddNew={() => setIsCreateCustomerModalOpen(true)}
              showAddButton={true}
            />
            {errors.customer_name && (
              <p className="mt-1.5 text-xs text-error-500">{errors.customer_name}</p>
            )}
          </div>

          {/* Customer Name (Read-only, auto-filled) */}
          <div>
            <Label htmlFor="customer_name">Customer Name *</Label>
            <Input
              id="customer_name"
              name="customer_name"
              type="text"
              placeholder="Select customer above"
              value={formData.customer_name}
              onChange={(e) => handleInputChange("customer_name", e.target.value)}
              error={!!errors.customer_name}
              hint={errors.customer_name}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>

          {/* Customer Email (Read-only, auto-filled) */}
          <div>
            <Label htmlFor="customer_email">Customer Email *</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              placeholder="Select customer above"
              value={formData.customer_email}
              onChange={(e) => handleInputChange("customer_email", e.target.value)}
              error={!!errors.customer_email}
              hint={errors.customer_email}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>

          {/* Customer Phone (Read-only, auto-filled) */}
          <div>
            <Label htmlFor="customer_phone">Phone Number</Label>
            <Input
              id="customer_phone"
              name="customer_phone"
              type="tel"
              placeholder="Select customer above"
              value={customerData?.phone || ""}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>

          {/* Staff Selection */}
          <div>
            <Label htmlFor="staff_name">Staff *</Label>
            <Select
              options={staffOptions}
              placeholder="Select Staff"
              onChange={(value) => handleInputChange("staff_name", value)}
              defaultValue=""
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
              defaultValue=""
            />
            {errors.service_name && (
              <p className="mt-1.5 text-xs text-error-500">{errors.service_name}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <DatePicker
              id="booking-date"
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
              options={availableTimeSlots}
              placeholder={
                formData.staff_name && formData.date && formData.service_name
                  ? "Select Time"
                  : "Select Staff, Date, and Service first"
              }
              onChange={(value) => handleInputChange("time", value)}
              defaultValue=""
              disabled={!formData.staff_name || !formData.date || !formData.service_name}
            />
            {errors.time && (
              <p className="mt-1.5 text-xs text-error-500">{errors.time}</p>
            )}
            {formData.staff_name && formData.date && formData.service_name && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {availableTimeSlots.length - 1} time slot(s) available
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              options={statusOptions}
              placeholder="Select Status"
              onChange={(value) => handleInputChange("status", value as BookingFormData["status"])}
              defaultValue="pending"
            />
          </div>
        </div>

        {/* Free Appointment Section */}
        {customerData && customerData.free_appointment_available && formData.service_name && (
          <div className="rounded-xl border-2 border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="success" size="sm">
                    Free Appointment Available!
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  This customer has completed {customerData.completed_bookings_count} bookings and is eligible for a free appointment.
                </p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free_appointment}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        is_free_appointment: e.target.checked,
                      }));
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Use Free Appointment
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Booking Price Display */}
        {formData.service_name && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Booking Price:
              </span>
              <span className={`text-lg font-bold ${formData.is_free_appointment && customerData?.free_appointment_available ? 'text-success-500' : 'text-gray-900 dark:text-white'}`}>
                {formData.is_free_appointment && customerData?.free_appointment_available ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">RM {getServicePrice(formData.service_name)}</span>
                    RM 0.00 <span className="text-sm text-success-600 dark:text-success-400">(Free)</span>
                  </>
                ) : (
                  `RM ${bookingPrice}`
                )}
              </span>
            </div>
          </div>
        )}

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
            {isSubmitting ? "Creating..." : "Create Booking"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    
    {/* Create Customer Modal */}
    <CreateCustomerModal
      isOpen={isCreateCustomerModalOpen}
      onClose={() => setIsCreateCustomerModalOpen(false)}
      onCustomerCreated={handleCustomerCreated}
    />
    </>
  );
}

