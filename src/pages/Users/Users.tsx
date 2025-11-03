import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTable from "../../components/tables/Users/UserTable";
import Button from "../../components/ui/button/Button";
import { CalenderIcon } from "../../icons";

export default function Users() {
  return (
    <>
      <PageMeta
        title="Users Dashboard | JustBook - React Admin Dashboard Template"
        description="This is Users page for viewing all users"
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            All Users
          </h2>
          <Link to="/users/new" className="inline-flex">
            <Button 
              variant="primary" 
              size="sm"
              startIcon={<CalenderIcon className="h-5 w-5" />}
              className="gap-1.5"
            >
              New User
            </Button>
          </Link>
        </div>
        <ComponentCard title="All Users">
          <UserTable />
        </ComponentCard>
      </div>
    </>
  );
}

