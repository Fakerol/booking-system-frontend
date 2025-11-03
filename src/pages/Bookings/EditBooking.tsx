import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditBookingForm from "../../components/forms/EditBookingForm";

export default function EditBooking() {
  return (
    <>
      <PageMeta
        title="Edit Booking | JustBook - React Admin Dashboard Template"
        description="Edit booking details"
      />
      <PageBreadcrumb pageTitle="Edit Booking" />
      <div className="space-y-6">
        <EditBookingForm />
      </div>
    </>
  );
}

