import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UserDetailsForm from "../../components/forms/UserDetailsForm";

export default function UserDetails() {
  return (
    <>
      <PageMeta
        title="User Details | JustBook - React Admin Dashboard Template"
        description="View user details"
      />
      <PageBreadcrumb pageTitle="User Details" />
      <div className="space-y-6">
        <UserDetailsForm />
      </div>
    </>
  );
}

