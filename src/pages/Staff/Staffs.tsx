import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StaffTable from "../../components/tables/Staff/StaffTable";
import Button from "../../components/ui/button/Button";
import { CalenderIcon } from "../../icons";

export default function Staffs() {
  return (
    <>
      <PageMeta
        title="Staff Dashboard | JustBook - React Admin Dashboard Template"
        description="This is Staff page for viewing all staff members"
      />
      <PageBreadcrumb pageTitle="Staff" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            All Staff
          </h2>
          <Link to="/staff/new" className="inline-flex">
            <Button 
              variant="primary" 
              size="sm"
              startIcon={<CalenderIcon className="h-5 w-5" />}
              className="gap-1.5"
            >
              New Staff
            </Button>
          </Link>
        </div>
        <ComponentCard title="All Staff">
          <StaffTable />
        </ComponentCard>
      </div>
    </>
  );
}

