import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CustomerDetailsForm from "../../components/forms/CustomerDetailsForm";

export default function CustomerDetails() {
  return (
    <>
      <PageMeta
        title="Customer Details | JustBook - React Admin Dashboard Template"
        description="View customer details"
      />
      <PageBreadcrumb pageTitle="Customer Details" />
      <div className="space-y-6">
        <CustomerDetailsForm />
      </div>
    </>
  );
}


