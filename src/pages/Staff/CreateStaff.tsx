import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import StaffForm from "../../components/forms/StaffForm";

export default function CreateStaff() {
  return (
    <>
      <PageMeta
        title="Create New Staff | JustBook - React Admin Dashboard Template"
        description="Create a new staff member"
      />
      <PageBreadcrumb pageTitle="Create New Staff" />
      <div className="space-y-6">
        <StaffForm />
      </div>
    </>
  );
}

