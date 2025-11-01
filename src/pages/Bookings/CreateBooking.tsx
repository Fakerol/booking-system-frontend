import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BookingForm from "../../components/forms/BookingForm";

export default function CreateBooking() {
  return (
    <>
      <PageMeta
        title="Create New Booking | TailAdmin - React Admin Dashboard Template"
        description="Create a new booking"
      />
      <PageBreadcrumb pageTitle="Create New Booking" />
      <div className="space-y-6">
        <BookingForm />
      </div>
    </>
  );
}

