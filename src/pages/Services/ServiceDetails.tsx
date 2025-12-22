import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ServiceDetailsForm from "../../components/forms/ServiceDetailsForm";

export default function ServiceDetails() {
  return (
    <>
      <PageMeta
        title="Service Details | JustBook - React Admin Dashboard Template"
        description="View service details"
      />
      <PageBreadcrumb pageTitle="Service Details" />
      <div className="space-y-6">
        <ServiceDetailsForm />
      </div>
    </>
  );
}

