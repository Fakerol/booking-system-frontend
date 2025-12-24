import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Toast from "../ui/toast/Toast";
import { getBookingById, BookingData } from "../../services/bookings";

export default function BookingDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        
        const response = await getBookingById(id);
        
        if (response.success && response.data) {
          setBooking(response.data.booking);
        } else {
          setError(response.message || "Booking not found");
        }
        
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const getStatusColor = (statusLabel: string) => {
    const status = statusLabel.toLowerCase();
    if (status === "pending") {
      return "warning";
    } else if (status === "confirmed") {
      return "success";
    } else if (status === "completed") {
      return "info";
    } else if (status === "cancelled") {
      return "error";
    }
    return "warning";
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/bookings/edit/${id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setToastMessage("Booking deleted successfully!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    }
  };

  const handleBack = () => {
    navigate("/bookings");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Booking Details">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading booking details...</p>
        </div>
      </ComponentCard>
    );
  }

  if (error || !booking) {
    return (
      <ComponentCard title="Booking Details">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-500 dark:text-red-400">{error || "Booking not found"}</p>
          <Button variant="outline" onClick={handleBack}>
            Back to Bookings
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
      <ComponentCard title="Booking Details">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Booking Information
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View booking details and information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="booking_number">Booking Number</Label>
              <Input
                id="booking_number"
                name="booking_number"
                type="text"
                value={booking.booking_number}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <div className="mt-2">
                <Badge size="sm" color={getStatusColor(booking.status_label) as any}>
                  {booking.status_label}
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                name="customer_name"
                type="text"
                value={booking.customer.name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="customer_phone">Customer Phone</Label>
              <Input
                id="customer_phone"
                name="customer_phone"
                type="text"
                value={booking.customer.phone || "—"}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="customer_email">Customer Email</Label>
              <Input
                id="customer_email"
                name="customer_email"
                type="email"
                value={booking.customer.email || "—"}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="staff_name">Staff</Label>
              <Input
                id="staff_name"
                name="staff_name"
                type="text"
                value={booking.staff.name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="staff_position">Staff Position</Label>
              <Input
                id="staff_position"
                name="staff_position"
                type="text"
                value={booking.staff.position || "—"}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="booking_date">Booking Date</Label>
              <Input
                id="booking_date"
                name="booking_date"
                type="text"
                value={booking.booking_date_formatted || booking.booking_date}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="time_range">Time Range</Label>
              <Input
                id="time_range"
                name="time_range"
                type="text"
                value={booking.time_range}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="total_price">Total Price</Label>
              <Input
                id="total_price"
                name="total_price"
                type="text"
                value={booking.total_price_formatted}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            {booking.services && booking.services.length > 0 && (
              <div className="md:col-span-2">
                <Label>Services</Label>
                <div className="mt-2 space-y-2">
                  {booking.services.map((service, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {service.service.name}
                          </p>
                          {service.service.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {service.service.description}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Category: {service.service.category} • Duration: {service.duration_formatted}
                          </p>
                        </div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {service.price_formatted}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {booking.notes && (
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  type="text"
                  value={booking.notes}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>
            )}
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

