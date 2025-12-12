import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ServiceForm from "../../components/forms/ServiceForm";

export default function CreateService() {
  return (
    <>
      <PageMeta
        title="Create New Service | JustBook - React Admin Dashboard Template"
        description="Create a new service"
      />
      <PageBreadcrumb pageTitle="Create New Service" />
      <div className="space-y-6">
        <ServiceForm />
      </div>
    </>
  );
}

