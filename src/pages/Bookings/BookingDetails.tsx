import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BookingDetailsForm from "../../components/forms/BookingDetailsForm";

export default function BookingDetails() {
  return (
    <>
      <PageMeta
        title="Booking Details | JustBook - React Admin Dashboard Template"
        description="View booking details"
      />
      <PageBreadcrumb pageTitle="Booking Details" />
      <div className="space-y-6">
        <BookingDetailsForm />
      </div>
    </>
  );
}


