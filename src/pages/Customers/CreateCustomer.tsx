import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CustomerForm from "../../components/forms/CustomerForm";

export default function CreateCustomer() {
  return (
    <>
      <PageMeta
        title="Create New Customer | JustBook - React Admin Dashboard Template"
        description="Create a new customer"
      />
      <PageBreadcrumb pageTitle="Create New Customer" />
      <div className="space-y-6">
        <CustomerForm />
      </div>
    </>
  );
}


