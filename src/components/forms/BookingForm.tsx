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
import SearchableSelect from "../form/SearchableSelect";
import CreateCustomerModal from "../modals/CreateCustomerModal";
import { TrashBinIcon } from "../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getCustomers, CustomerData } from "../../services/customers";
import { getStaffs, StaffData } from "../../services/staff";
import { getServices, ServiceData } from "../../services/services";
import { createBooking, CreateBookingPayload, getTimeSlots, TimeSlot } from "../../services/bookings";

interface BookingFormData {
  customer_id: string;
  staff_id: string;
  booking_date: string;
  start_time: string;
  services: string[];
  notes: string;
  status: number;
}

export default function BookingForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: "",
    staff_id: "",
    booking_date: "",
    start_time: "",
    services: [],
    notes: "",
    status: 1, // Default to Pending
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"service" | "professional" | "customer" | "summary">("service");

  // Data from APIs
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [staffs, setStaffs] = useState<StaffData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  
  // Time slots from API
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [timeSlotsError, setTimeSlotsError] = useState<string | null>(null);
  const [staffAvailabilityReason, setStaffAvailabilityReason] = useState<string | null>(null);

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await getCustomers({
        per_page: 100,
        status: 1, // Only active customers
      });
      if (response.success && response.data) {
        setCustomers(response.data.customers);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch staffs on mount
  useEffect(() => {
    const fetchStaffs = async () => {
      const response = await getStaffs({
        per_page: 100,
        is_active: true,
      });
      if (response.success && response.data) {
        setStaffs(response.data.staffs);
      }
    };
    fetchStaffs();
  }, []);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      const response = await getServices({
        per_page: 100,
        is_active: true,
      });
      if (response.success && response.data) {
        setServices(response.data.services);
      }
    };
    fetchServices();
  }, []);

  // Fetch time slots when staff, date, or services change
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!formData.staff_id || !formData.booking_date || formData.services.length === 0) {
        setTimeSlots([]);
        setStaffAvailabilityReason(null);
        setTimeSlotsError(null);
        return;
      }

      setLoadingTimeSlots(true);
      setTimeSlotsError(null);
      setStaffAvailabilityReason(null);

      try {
        const response = await getTimeSlots({
          staff_id: formData.staff_id,
          date: formData.booking_date,
          service_ids: formData.services,
        });

        if (response.success && response.data) {
          if (response.data.available) {
            setTimeSlots(response.data.slots);
            setStaffAvailabilityReason(null);
          } else {
            setTimeSlots([]);
            setStaffAvailabilityReason(response.data.reason || "Staff is not available");
          }
        } else {
          setTimeSlots([]);
          setTimeSlotsError(response.message || "Failed to fetch available time slots");
        }
      } catch (error) {
        setTimeSlots([]);
        setTimeSlotsError("An error occurred while fetching time slots");
      } finally {
        setLoadingTimeSlots(false);
      }
    };

    fetchTimeSlots();
  }, [formData.staff_id, formData.booking_date, formData.services]);

  // Clear selected time when time slots change
  useEffect(() => {
    if (formData.start_time && timeSlots.length > 0) {
      const isTimeStillAvailable = timeSlots.some(
        (slot) => slot.start_time === formData.start_time
      );
      if (!isTimeStillAvailable) {
        setFormData((prev) => ({ ...prev, start_time: "" }));
      }
    } else if (formData.start_time && timeSlots.length === 0 && !loadingTimeSlots) {
      // Clear time if no slots available
      setFormData((prev) => ({ ...prev, start_time: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots, loadingTimeSlots]);

  // Customer options for searchable select
  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
      searchText: `${customer.email} • ${customer.phone}`,
    }));
  }, [customers]);

  // Staff options for searchable select
  const staffOptions = useMemo(() => {
    return staffs.map((staff) => ({
      value: staff.id,
      label: staff.name,
      searchText: `${staff.position} • ${staff.phone}`,
    }));
  }, [staffs]);

  // Service options for searchable select (filter out already selected services)
  const serviceOptions = useMemo(() => {
    return services
      .filter((service) => !formData.services.includes(service.id))
      .map((service) => ({
        value: service.id,
        label: service.name,
        searchText: `${service.price_formatted} • ${service.duration_formatted} • ${service.category}`,
      }));
  }, [services, formData.services]);

  // Get selected customer
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === formData.customer_id) || null;
  }, [customers, formData.customer_id]);

  // Get selected services and calculate total price
  const selectedServicesData = useMemo(() => {
    return formData.services
      .map((serviceId) => services.find((s) => s.id === serviceId))
      .filter((s): s is ServiceData => s !== undefined);
  }, [formData.services, services]);

  const totalPrice = useMemo(() => {
    return selectedServicesData.reduce((sum, service) => {
      const price = typeof service.price === "string" ? parseFloat(service.price) : service.price;
      return sum + price;
    }, 0);
  }, [selectedServicesData]);

  const totalDuration = useMemo(() => {
    return selectedServicesData.reduce((sum, service) => sum + service.duration, 0);
  }, [selectedServicesData]);

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    setFormData((prev) => ({ ...prev, customer_id: customerId }));
    if (errors.customer_id) {
      setErrors((prev) => ({ ...prev, customer_id: undefined }));
    }
  };

  // Handle staff selection
  const handleStaffSelect = (staffId: string) => {
    setFormData((prev) => ({ ...prev, staff_id: staffId }));
    if (errors.staff_id) {
      setErrors((prev) => ({ ...prev, staff_id: undefined }));
    }
  };

  // Handle service selection (add to list)
  const handleServiceSelect = (serviceId: string) => {
    if (serviceId && !formData.services.includes(serviceId)) {
      setFormData((prev) => ({ ...prev, services: [...prev.services, serviceId] }));
      if (errors.services) {
        setErrors((prev) => ({ ...prev, services: undefined }));
      }
    }
  };

  // Handle service removal from table
  const handleServiceRemove = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((id) => id !== serviceId),
    }));
  };

  // Handle new customer creation
  const handleCustomerCreated = (newCustomer: CustomerData) => {
    // Add new customer to the list
    setCustomers((prev) => [...prev, newCustomer]);
    // Auto-select the newly created customer
    handleCustomerSelect(newCustomer.id);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.customer_id) {
      newErrors.customer_id = "Please select a customer";
    }

    if (!formData.staff_id) {
      newErrors.staff_id = "Please select a staff member";
    }

    if (!formData.booking_date) {
      newErrors.booking_date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.booking_date = "Please select a date today or in the future";
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = "Please select a start time";
    }

    if (!formData.services || formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | string[] | number) => {
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
      const payload: CreateBookingPayload = {
        customer_id: formData.customer_id,
        staff_id: formData.staff_id,
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        services: formData.services,
        notes: formData.notes || undefined,
        status: formData.status,
      };

      const response = await createBooking(payload);

      if (response.success) {
        setToastMessage("Booking created successfully!");
        setShowToast(true);
        setTimeout(() => {
          navigate("/bookings");
        }, 2000);
      } else {
        setToastMessage(response.message || "Failed to create booking");
        setShowToast(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      setToastMessage("An error occurred while creating the booking");
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/bookings");
  };

  // Format time options from API response
  const timeOptions = useMemo(() => {
    if (timeSlots.length === 0) {
      return [{ value: "", label: "No available time slots" }];
    }
    return timeSlots.map((slot) => ({
      value: slot.start_time,
      label: slot.formatted || slot.start_time,
    }));
  }, [timeSlots]);

  // Tab validation - check if tab can be accessed
  const canAccessTab = (tab: typeof activeTab): boolean => {
    switch (tab) {
      case "service":
        return true; // Always accessible
      case "professional":
        return formData.services.length > 0; // Need at least one service
      case "customer":
        return (
          formData.services.length > 0 &&
          formData.staff_id !== "" &&
          formData.booking_date !== "" &&
          formData.start_time !== ""
        ); // Need services, staff, date, and time
      case "summary":
        return (
          formData.services.length > 0 &&
          formData.staff_id !== "" &&
          formData.booking_date !== "" &&
          formData.start_time !== "" &&
          formData.customer_id !== ""
        ); // Need all required fields
      default:
        return false;
    }
  };

  // Get selected staff
  const selectedStaff = useMemo(() => {
    return staffs.find((s) => s.id === formData.staff_id) || null;
  }, [staffs, formData.staff_id]);

  // Handle tab navigation
  const handleNextTab = () => {
    const tabs: Array<typeof activeTab> = ["service", "professional", "customer", "summary"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      if (canAccessTab(nextTab)) {
        setActiveTab(nextTab);
      }
    }
  };

  const handlePreviousTab = () => {
    const tabs: Array<typeof activeTab> = ["service", "professional", "customer", "summary"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleTabClick = (tab: typeof activeTab) => {
    if (canAccessTab(tab)) {
      setActiveTab(tab);
    }
  };

  // Helper function to get next tab
  const getNextTab = (currentTab: typeof activeTab): typeof activeTab => {
    const tabs: Array<typeof activeTab> = ["service", "professional", "customer", "summary"];
    const currentIndex = tabs.indexOf(currentTab);
    return currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : currentTab;
  };

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Create New Booking">
        <Form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => handleTabClick("service")}
                className={`px-3 py-2 font-medium rounded-md text-sm transition-colors flex-1 ${
                  activeTab === "service"
                    ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                1. Service
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("professional")}
                disabled={!canAccessTab("professional")}
                className={`px-3 py-2 font-medium rounded-md text-sm transition-colors flex-1 ${
                  activeTab === "professional"
                    ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    : !canAccessTab("professional")
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                2. Professional & Date
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("customer")}
                disabled={!canAccessTab("customer")}
                className={`px-3 py-2 font-medium rounded-md text-sm transition-colors flex-1 ${
                  activeTab === "customer"
                    ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    : !canAccessTab("customer")
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                3. Customer & Details
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("summary")}
                disabled={!canAccessTab("summary")}
                className={`px-3 py-2 font-medium rounded-md text-sm transition-colors flex-1 ${
                  activeTab === "summary"
                    ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    : !canAccessTab("summary")
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                4. Summary
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Tab 1: Service */}
            {activeTab === "service" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service_select">Add Service *</Label>
                  <SearchableSelect
                    options={serviceOptions}
                    placeholder="Search and select a service to add..."
                    searchPlaceholder="Search services by name, price, duration, or category..."
                    onChange={handleServiceSelect}
                    defaultValue=""
                    disabled={serviceOptions.length === 0}
                  />
                  {errors.services && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.services}</p>
                  )}
                  {formData.services.length === 0 && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Please add at least one service to continue
                    </p>
                  )}
                </div>

                {/* Services Table */}
                {selectedServicesData.length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                    <div className="max-w-full overflow-x-auto">
                      <Table className="w-full border-collapse">
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                            <TableCell
                              isHeader
                              className="border-b border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                            >
                              Service Name
                            </TableCell>
                            <TableCell
                              isHeader
                              className="border-b border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                            >
                              Category
                            </TableCell>
                            <TableCell
                              isHeader
                              className="border-b border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 text-start dark:border-gray-700 dark:text-gray-300"
                            >
                              Duration
                            </TableCell>
                            <TableCell
                              isHeader
                              className="border-b border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 text-end dark:border-gray-700 dark:text-gray-300"
                            >
                              Price
                            </TableCell>
                            <TableCell
                              isHeader
                              className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 text-center dark:border-gray-700 dark:text-gray-300"
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedServicesData.map((service, index) => (
                            <TableRow
                              key={service.id}
                              className={`border-b border-gray-200 dark:border-gray-700 ${
                                index % 2 === 0
                                  ? "bg-white dark:bg-white/[0.02]"
                                  : "bg-gray-50/50 dark:bg-gray-800/30"
                              }`}
                            >
                              <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800 dark:text-white/90 dark:border-gray-700">
                                {service.name}
                              </TableCell>
                              <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
                                {service.category || "—"}
                              </TableCell>
                              <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
                                {service.duration_formatted}
                              </TableCell>
                              <TableCell className="border-r border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 text-end dark:text-white/90 dark:border-gray-700">
                                {service.price_formatted}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleServiceRemove(service.id)}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                                  title="Remove service"
                                >
                                  <TrashBinIcon className="h-4 w-4" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Total Row */}
                          <TableRow className="bg-gray-50 dark:bg-gray-800/50 font-medium">
                            <td
                              colSpan={3}
                              className="border-t border-gray-200 px-4 py-3 text-sm text-gray-700 text-end dark:border-gray-700 dark:text-gray-300"
                            >
                              Total:
                            </td>
                            <td className="border-t border-gray-200 px-4 py-3 text-sm text-gray-800 text-end dark:text-white/90 dark:border-gray-700">
                              RM {totalPrice.toFixed(2)}
                            </td>
                            <td className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
                              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                            </td>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Professional & Date */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="staff_id">Professional (Staff) *</Label>
                  <SearchableSelect
                    options={staffOptions}
                    placeholder="Search staff by name..."
                    searchPlaceholder="Search staff..."
                    onChange={handleStaffSelect}
                    defaultValue=""
                  />
                  {errors.staff_id && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.staff_id}</p>
                  )}
                  {selectedStaff && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Position: {selectedStaff.position}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Phone: {selectedStaff.phone}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <DatePicker
                    id="booking-date"
                    label="Booking Date *"
                    placeholder="Select a date"
                    defaultDate={formData.booking_date || undefined}
                    minDate={new Date().toISOString().split("T")[0]}
                    onChange={(_, dateStr) => {
                      if (dateStr) {
                        handleInputChange("booking_date", dateStr);
                      }
                    }}
                  />
                  {errors.booking_date && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.booking_date}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Select
                    options={timeOptions}
                    placeholder={
                      loadingTimeSlots
                        ? "Loading available times..."
                        : !formData.staff_id || !formData.booking_date
                        ? "Select staff and date first"
                        : formData.services.length === 0
                        ? "Add at least one service first"
                        : staffAvailabilityReason
                        ? staffAvailabilityReason
                        : "Select start time"
                    }
                    onChange={(value) => handleInputChange("start_time", value)}
                    defaultValue=""
                    disabled={
                      loadingTimeSlots ||
                      !formData.staff_id ||
                      !formData.booking_date ||
                      formData.services.length === 0 ||
                      timeSlots.length === 0
                    }
                  />
                  {loadingTimeSlots && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Loading available time slots...
                    </p>
                  )}
                  {staffAvailabilityReason && !loadingTimeSlots && (
                    <p className="mt-1.5 text-xs text-warning-500 dark:text-warning-400">
                      {staffAvailabilityReason}
                    </p>
                  )}
                  {timeSlotsError && !loadingTimeSlots && (
                    <p className="mt-1.5 text-xs text-error-500">{timeSlotsError}</p>
                  )}
                  {errors.start_time && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.start_time}</p>
                  )}
                  {timeSlots.length > 0 && !loadingTimeSlots && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {timeSlots.length} available time slot(s)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Customer & Details */}
            {activeTab === "customer" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="customer_id">Customer *</Label>
                  <SearchableSelect
                    options={customerOptions}
                    placeholder="Search customer by name, email, or phone..."
                    searchPlaceholder="Search customers..."
                    onChange={handleCustomerSelect}
                    defaultValue=""
                    onAddNew={() => setIsCreateCustomerModalOpen(true)}
                    showAddButton={true}
                  />
                  {errors.customer_id && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.customer_id}</p>
                  )}
                  {selectedCustomer && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Email: {selectedCustomer.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Phone: {selectedCustomer.phone}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      options={[
                        { value: "1", label: "Pending" },
                        { value: "2", label: "Confirmed" },
                      ]}
                      placeholder="Select Status"
                      onChange={(value) => handleInputChange("status", parseInt(value))}
                      defaultValue="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      name="notes"
                      type="text"
                      placeholder="Additional notes (optional)"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Summary */}
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Customer */}
                    <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer
                      </div>
                      <div className="text-sm text-gray-800 dark:text-white mt-1">
                        {selectedCustomer ? selectedCustomer.name : "Not selected"}
                      </div>
                      {selectedCustomer && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {selectedCustomer.email} • {selectedCustomer.phone}
                        </div>
                      )}
                    </div>

                    {/* Professional */}
                    <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Professional
                      </div>
                      <div className="text-sm text-gray-800 dark:text-white mt-1">
                        {selectedStaff ? selectedStaff.name : "Not selected"}
                      </div>
                      {selectedStaff && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {selectedStaff.position}
                        </div>
                      )}
                    </div>

                    {/* Date & Time */}
                    <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date & Time
                      </div>
                      <div className="text-sm text-gray-800 dark:text-white mt-1">
                        {formData.booking_date
                          ? new Date(formData.booking_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not selected"}
                      </div>
                      {formData.start_time && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {timeSlots.find((s) => s.start_time === formData.start_time)?.formatted ||
                            formData.start_time}
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Services ({selectedServicesData.length})
                      </div>
                      <div className="space-y-1">
                        {selectedServicesData.map((service) => (
                          <div
                            key={service.id}
                            className="text-sm text-gray-800 dark:text-white"
                          >
                            • {service.name} - {service.price_formatted} ({service.duration_formatted})
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Total Duration:
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-base font-semibold text-gray-800 dark:text-white">
                          Total Price:
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          RM {totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Status & Notes */}
                    {(formData.status || formData.notes) && (
                      <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                        {formData.status && (
                          <div className="mb-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Status
                            </div>
                            <div className="text-sm text-gray-800 dark:text-white mt-1">
                              {formData.status === 1 ? "Pending" : "Confirmed"}
                            </div>
                          </div>
                        )}
                        {formData.notes && (
                          <div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Notes
                            </div>
                            <div className="text-sm text-gray-800 dark:text-white mt-1">
                              {formData.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center gap-4">
              {activeTab !== "service" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              {activeTab === "service" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              {activeTab !== "summary" && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextTab}
                  disabled={!canAccessTab(getNextTab(activeTab)) || isSubmitting}
                >
                  Next
                </Button>
              )}
              {activeTab === "summary" && (
                <>
                  <Button
                    type="button"
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
                </>
              )}
            </div>
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
