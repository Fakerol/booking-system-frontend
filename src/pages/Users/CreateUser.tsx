import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UserForm from "../../components/forms/UserForm";

export default function CreateUser() {
  return (
    <>
      <PageMeta
        title="Create New User | JustBook - React Admin Dashboard Template"
        description="Create a new user"
      />
      <PageBreadcrumb pageTitle="Create New User" />
      <div className="space-y-6">
        <UserForm />
      </div>
    </>
  );
}

