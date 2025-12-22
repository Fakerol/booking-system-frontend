import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CorporationSetupForm from "../components/forms/CorporationSetupForm";

export default function CorporationSetup() {
  return (
    <>
      <PageMeta
        title="Corporation Setup | JustBook - React Admin Dashboard Template"
        description="Set up your corporation"
      />
      <PageBreadcrumb pageTitle="Corporation Setup" />
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Please complete your corporation setup to continue using the system.
          </p>
        </div>
        <CorporationSetupForm />
      </div>
    </>
  );
}

