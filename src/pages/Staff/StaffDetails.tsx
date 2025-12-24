import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import StaffDetailsForm from "../../components/forms/StaffDetailsForm";

export default function StaffDetails() {
  return (
    <>
      <PageMeta
        title="Staff Details | JustBook - React Admin Dashboard Template"
        description="View staff details"
      />
      <PageBreadcrumb pageTitle="Staff Details" />
      <div className="space-y-6">
        <StaffDetailsForm />
      </div>
    </>
  );
}



