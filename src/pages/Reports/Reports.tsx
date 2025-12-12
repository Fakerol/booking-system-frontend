import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReportMetrics from "../../components/reports/ReportMetrics";
import RevenueTrendChart from "../../components/reports/RevenueTrendChart";
import BookingVolumeTrendChart from "../../components/reports/BookingVolumeTrendChart";
import TopServicesRevenueChart from "../../components/reports/TopServicesRevenueChart";
import TopStaffBookingsReportChart from "../../components/reports/TopStaffBookingsReportChart";
import RevenueByMonthChart from "../../components/reports/RevenueByMonthChart";
import BookingStatusPieChart from "../../components/reports/BookingStatusPieChart";

export default function Reports() {
  return (
    <>
      <PageMeta
        title="Reports | JustBook - React Admin Dashboard Template"
        description="Analytics and reports for booking system"
      />
      <PageBreadcrumb pageTitle="Reports" />
      <div className="space-y-6">
        {/* KPI Metrics */}
        <ReportMetrics />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <RevenueTrendChart />

          {/* Booking Volume Trend */}
          <BookingVolumeTrendChart />

          {/* Top 5 Services by Revenue */}
          <TopServicesRevenueChart />

          {/* Top 5 Staff by Bookings */}
          <TopStaffBookingsReportChart />

          {/* Revenue by Month */}
          <RevenueByMonthChart />

          {/* Booking Status Breakdown */}
          <BookingStatusPieChart />
        </div>
      </div>
    </>
  );
}


