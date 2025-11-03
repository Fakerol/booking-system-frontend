import BookingMetrics from "../../components/booking/BookingMetrics";
import BookingChart from "../../components/booking/BookingChart";
import RecentBookings from "../../components/booking/RecentBookings";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function BookingDashboard() {
  return (
    <>
      <PageMeta
        title="JustBook"
        description="This is Booking Dashboard page for viewing booking system overview"
      />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <BookingMetrics />

          <BookingChart />
        </div>

        <div className="col-span-12">
          <RecentBookings />
        </div>
      </div>
    </>
  );
}

