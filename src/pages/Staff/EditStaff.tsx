import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditStaffForm from "../../components/forms/EditStaffForm";

export default function EditStaff() {
  return (
    <>
      <PageMeta
        title="Edit Staff | JustBook - React Admin Dashboard Template"
        description="Edit staff information"
      />
      <PageBreadcrumb pageTitle="Edit Staff" />
      <div className="space-y-6">
        <EditStaffForm />
      </div>
    </>
  );
}

