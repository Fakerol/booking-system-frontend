import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BookingTable from "../../components/tables/Bookings/BookingTable";
import Button from "../../components/ui/button/Button";
import { CalenderIcon } from "../../icons";

export default function Bookings() {
  return (
    <>
      <PageMeta
        title="Bookings Dashboard | TailAdmin - React Admin Dashboard Template"
        description="This is Bookings page for viewing all created bookings"
      />
      <PageBreadcrumb pageTitle="Bookings" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            All Bookings
          </h2>
          <Link to="/bookings/new" className="inline-flex">
            <Button 
              variant="primary" 
              size="sm"
              startIcon={<CalenderIcon className="h-5 w-5" />}
              className="gap-1.5"
            >
              New Booking
            </Button>
          </Link>
        </div>
        <ComponentCard title="All Bookings">
          <BookingTable />
        </ComponentCard>
      </div>
    </>
  );
}

