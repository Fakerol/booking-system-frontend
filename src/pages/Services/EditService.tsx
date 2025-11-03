import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditServiceForm from "../../components/forms/EditServiceForm";

export default function EditService() {
  return (
    <>
      <PageMeta
        title="Edit Service | JustBook - React Admin Dashboard Template"
        description="Edit service information"
      />
      <PageBreadcrumb pageTitle="Edit Service" />
      <div className="space-y-6">
        <EditServiceForm />
      </div>
    </>
  );
}

