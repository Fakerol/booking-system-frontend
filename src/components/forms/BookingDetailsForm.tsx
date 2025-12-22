import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Booking } from "../tables/Bookings/BookingTable";
import Toast from "../ui/toast/Toast";

import { bookingData } from "../tables/Bookings/BookingTable";

// Mock function to fetch booking by ID (using dummy data)
const fetchBookingById = (id: string): Booking | null => {
  return bookingData.find((b: Booking) => b._id === id) || null;
};

export default function BookingDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (id) {
      const foundBooking = fetchBookingById(id);
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        setError("Booking not found");
      }
      setIsLoading(false);
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "primary";
    }
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
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                name="customer_name"
                type="text"
                value={booking.customer_name}
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
                value={booking.customer_email}
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
                value={booking.staff_name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="service_name">Service</Label>
              <Input
                id="service_name"
                name="service_name"
                type="text"
                value={booking.service_name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={booking.date}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={booking.time}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <div className="mt-2">
                <Badge size="sm" color={getStatusColor(booking.status) as any}>
                  {booking.status}
                </Badge>
              </div>
            </div>

            {booking.is_free_appointment && (
              <div>
                <Label htmlFor="appointment_type">Appointment Type</Label>
                <div className="mt-2">
                  <Badge size="sm" color="success">
                    Free Appointment
                  </Badge>
                </div>
              </div>
            )}

            {booking.original_price !== undefined && booking.is_free_appointment && (
              <div>
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="text"
                  value={`RM ${booking.original_price} (Free)`}
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

