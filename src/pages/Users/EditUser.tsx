import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditUserForm from "../../components/forms/EditUserForm";

export default function EditUser() {
  return (
    <>
      <PageMeta
        title="Edit User | JustBook - React Admin Dashboard Template"
        description="Edit user information"
      />
      <PageBreadcrumb pageTitle="Edit User" />
      <div className="space-y-6">
        <EditUserForm />
      </div>
    </>
  );
}

