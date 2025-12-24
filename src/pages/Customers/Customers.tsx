import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CustomerTable from "../../components/tables/Customers/CustomerTable";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";

export default function Customers() {
  return (
    <>
      <PageMeta
        title="Customers Dashboard | JustBook - React Admin Dashboard Template"
        description="This is Customers page for viewing all customers"
      />
      <PageBreadcrumb pageTitle="Customers" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            All Customers
          </h2> 
          <Link to="/customers/new" className="inline-flex">
            <Button 
              variant="primary" 
              size="sm"
              startIcon={<PlusIcon className="h-5 w-5" />}
              className="gap-1.5"
            >
              New Customer
            </Button>
          </Link>
        </div>
        <ComponentCard title="All Customers">
         <CustomerTable />
        </ComponentCard>
      </div>
    </>
  );
}



