import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditCustomerForm from "../../components/forms/EditCustomerForm";

export default function EditCustomer() {
  return (
    <>
      <PageMeta
        title="Edit Customer | JustBook - React Admin Dashboard Template"
        description="Edit customer information"
      />
      <PageBreadcrumb pageTitle="Edit Customer" />
      <div className="space-y-6">
        <EditCustomerForm />
      </div>
    </>
  );
}

